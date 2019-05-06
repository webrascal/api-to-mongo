import express from "express";
import bodyParser from "body-parser";
import postResource from "./api/postResource";
import getResource from "./api/getResource";
import healthCheck from "./api/healthCheck";
import indexPage from "./api/index";
import path from "path";

// initialize the application and create the routes
const app = express();

// handle json body
app.use(bodyParser.json());

// api should be deferred to our API handlers
app.use("/api", getResource);
app.use("/api", postResource);

// setup a health check resource
app.use("/healthcheck", healthCheck);

// provide index page
app.use("/", indexPage);

// other static resources should just be served as they are
app.use(
  express.static(path.resolve(__dirname, "..", "public"), { maxAge: "30d" })
);

module.exports = app;
