import {
  rules,
  fromDefined,
  toDefined,
  getDate,
  validLimit,
  validOrder
} from "./queryValidation";
import Generic from "../../db/models";
import { local } from "datetime-iso";
import { toPairs, omit, forEach } from "ramda";
import cors from "cors";
import express from "express";
import logger from '../../logger';

const router = express.Router();

const validateQueryParameters = queryParameters => {
  return rules.reduce(
    (accumulator, rule) => {
      if (accumulator && accumulator.failed) {
        return accumulator;
      }
      if (!rule.test(queryParameters)) {
        return {
          failed: true,
          error: rule.error
        };
      }
    },
    { failed: false }
  );
};

const extractParameters = queryParameters => {
  let params = {
    fromDate: false,
    toDate: false,
    limit: 100,
    order: "descending",
    where: []
  };

  if (fromDefined(queryParameters)) {
    params.fromDate = getDate(queryParameters.from);
  }
  if (toDefined(queryParameters)) {
    params.toDate = getDate(queryParameters.to);
  }
  if (validLimit(queryParameters)) {
    params.limit = parseInt(queryParameters.limit);
  }
  if (validOrder(queryParameters)) {
    params.order = queryParameters.order;
  }

  // add additional document query options
  const fieldValues = omit(["order", "limit", "to", "from"], queryParameters);

  forEach(fieldValue => {
    const field = `data.${fieldValue[0]}`;
    params.where.push({ field, value: fieldValue[1] });
  }, toPairs(fieldValues));

  return params;
};

router.get("/:resource", cors(), (req, res) => {
  logger.info(`Received GET call to resource: ${req.params.resource}`);

  // do validation checks on query parameters
  logger.debug(`Received query: ` + JSON.stringify(req.query));
  const validation = validateQueryParameters(req.query);
  logger.debug(`Query validation result: ` + JSON.stringify(validation));
  if (validation && validation.failed) {
    res.send(validation.error);
    logger.info(`Failed validation for query parameters, stopping.`);
    return;
  }

  const { fromDate, toDate, limit, order, where } = extractParameters(
    req.query
  );
  logger.debug(`Parameters derived from query: [fromDate: ${fromDate}], [toDate: ${toDate}], [limit: ${limit}], [order: ${order}], [where: ${where}]`);

  // start building query for mongoose
  let resourceQuery = {
    name: req.params.resource
  };

  if (fromDate || toDate) {
    resourceQuery = {
      ...resourceQuery,
      created_at: {
        $gte: fromDate.getTime(),
        $lte: toDate.getTime()
      }
    };
  }

  logger.debug(`Constructing query: ` + JSON.stringify(resourceQuery));
  let query = Generic.find(resourceQuery)
    .limit(limit)
    .sort([["created_at", order]]);

  where.forEach(condition => {
    let { field, value } = condition;
    if (!isNaN(value)) {
      value = parseInt(value);
    } else if (value === "true" || value === "false") {
      value = value === "true";
    }
    logger.debug(`Applying where condition: [field: ${field}], [value: ${value}]`);
    query = query.where(field).equals(value);
  });

  logger.debug(`About to execute query`);
  // run the query
  query.exec((err, generic) => {
    if (err) res.send(err);
    let response = generic.map(doc => {
      const json = doc.toObject();
      return {
        ...json,
        created_date: local(new Date(json.created_at))
      };
    });
    logger.debug(`Responding with: ` + JSON.stringify(response));
    res.json(response);
  });
});

export default router;
