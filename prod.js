import app from "./server/index";
import mongoose from "mongoose";
import logger from './logger';

// collect criteria from env
let connectionString = process.env.MONGO_DB;
const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASSWORD;

if (!(connectionString && user && pass)) {
  logger.error(`MONGO_DB, MONGO_USER, MONGO_PASSWORD must be provided as environment variables; got [${connectionString}], [${user}], [${pass}]`);
  process.exit(1);
}

const config = {
  useNewUrlParser: true,
  user,
  pass
};

logger.debug(`Connection string received: ${connnectionString}`);
logger.debug(`Config being used: ` + JSON.stringify(config));

// connect to the mongoose db
mongoose
  .connect(
    connectionString,
    config
  )
  .then(() => {
    logger.info(`Successfully connected to MongoDB at [${connectionString}]`);
  })
  .catch(err => {
    logger.error(`Failed to connect to MongoDB at [${connectionString}]`, err);
    process.exit(1);
  });

// start the app
const port = process.env.PORT || 3000;
app.listen(port, error => {
  if (error) {
    return logger.error("Failed to start express server", error);
  }

  logger.info("Express server started, listening on " + port + "...");
});
