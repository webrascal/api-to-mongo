import isodate from "isodate";
import logger from '../../logger';

export const getDate = (dateAsString) => {
    return new Date(isodate(dateAsString))
};

export const fromAndToMutuallyInclusive = (params) => {
    logger.debug(`Are 'from' and 'to' mutually exclusive for params: ` + JSON.stringify(params));
    const result = (fromDefined(params) && toDefined(params)) || (!fromDefined(params) && !toDefined(params));
    logger.debug(`Are 'from' and 'to' mutually exclusive? ${result}`);
    return result;
};

export const fromDefined = (params) => {
    logger.debug(`Is 'from' defined for params: ` + JSON.stringify(params));
    const result = typeof params.from !== 'undefined';
    logger.debug(`Is 'from' defined? ${result}`);
    return result;
};

export const toDefined = (params) => {
    logger.debug(`Is 'to' defined for params: ` + JSON.stringify(params));
    const result = typeof params.to !== 'undefined';
    logger.debug(`Is 'to' defined? ${result}`);
    return result;
};

export const toIsAfterFrom = (params) => {
    logger.debug(`Is 'to' after 'from' for params: ` + JSON.stringify(params));
    let fromDate, toDate;
    if (!fromDefined(params) && !toDefined(params)) {
        logger.debug(`Is 'to' after 'from'? true`);
        return true;
    }
    if (fromDefined(params)) {
        fromDate = getDate(params.from)
    }
    if (toDefined(params)) {
        toDate = getDate(params.to)
    }
    const result = fromDate < toDate;
    logger.debug(`Is 'to' after 'from'? ${result}`);
    return result;
};

export const validFromDate = (params) => {
    logger.debug(`Is 'fromDate' valid for params: ` + JSON.stringify(params));
    if (!fromDefined(params)) {
        logger.debug(`'fromDate' not defined, returning true`);
        return true;
    }
    try {
        logger.debug(`attempting to translate 'fromDate' into date object`);
        getDate(params.from)
    } catch (err) {
        logger.debug(`'fromDate' could not be translated to a date, returning false`);
        return false;
    }
    logger.debug(`Is 'fromDate' valid? true`);
    return true;
};

export const validToDate = (params) => {
    logger.debug(`Is 'toDate' valid for params: ` + JSON.stringify(params));
    if (!toDefined(params)) {
        logger.debug(`'toDate' not defined, returning true`);
        return true;
    }
    try {
        logger.debug(`attempting to translate 'toDate' into date object`);
        getDate(params.to)
    } catch (err) {
        logger.debug(`'toDate' could not be translated to a date, returning false`);
        return false;
    }
    logger.debug(`Is 'toDate' valid? true`);
    return true;
};

export const validLimit = (params) => {
    logger.debug(`Is 'limit' valid for params: ` + JSON.stringify(params));
    const limit = typeof params.limit !== 'undefined' ? parseInt(params.limit) : 100;
    const result = !(isNaN(limit) || limit < 1);
    logger.debug(`Is 'limit' valid? ${result}`);
    return result;
};

export const validOrder = (params) => {
    logger.debug(`Is 'order' valid for params: ` + JSON.stringify(params));
    const order = typeof params.order !== 'undefined' ? params.order : 'descending';
    const result = !(order !== 'ascending' && order !== 'descending');
    logger.debug(`Is 'order' valid? ${result}`);
    return result;
};

export const rules = [
    {
        test: fromAndToMutuallyInclusive,
        error: "You must provide both `from` and `to` parameters, or neither."
    },
    {
        test: validFromDate,
        error: "Unable to parse `from` parameter as a date."
    },
    {
        test: validToDate,
        error: "Unable to parse `to` parameter as a date."
    },
    {
        test: toIsAfterFrom,
        error: "`from` parameter is after `to`. `from` must be a point in time earlier than `to`."
    },
    {
        test: validLimit,
        error: "`limit` must be an integer greater than zero. This will default to 100."
    },
    {
        test: validOrder,
        error: "`order` must be either `ascending` or `descending`. This will default to `descending`."
    }
];
