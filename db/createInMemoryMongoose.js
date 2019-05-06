import mongoose from "mongoose";
import MongodbMemoryServer from "mongodb-memory-server/lib/index";

export default async () => {
  const mongoServer = new MongodbMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  const db = await mongoose.connect(
    mongoUri,
    { useNewUrlParser: true },
    err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    }
  );
  return {
    mongoServer,
    db
  };
};
