import express, { Express, Request, Response } from "express";
const cors = require("cors");
const routes = require("./routes");
require("dotenv").config();
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
