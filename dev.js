import app from "./server/index";
import createInMemoryMongoose from "./db/createInMemoryMongoose";
import devData from "./db/dev-data";
import Generic from "./db/models";
import logger from './logger';

createInMemoryMongoose();
devData.forEach(datum => {
  const new_generic = new Generic({
    name: datum.name,
    created_at: new Date().getTime(),
    data: datum.data
  });
  new_generic.save();
});
logger.info('In memory database setup and populated');

// start the app
const port = process.env.PORT || 3000;
app.listen(port, error => {
  if (error) {
    return logger.error("Failed to create express server", error);
  }

  logger.info(`Express server listening on port ${port}`);
});
