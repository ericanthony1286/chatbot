const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const configViewEngine = require("./config/viewEngine");
const initWebRoutes = require("./routes/web");
require("dotenv").config();

const app = express();

// config view engine
configViewEngine(app);

// parse request to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// init web routes
initWebRoutes(app);

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("server is running ");
});
