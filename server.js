const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");
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

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PAGE_ID = "116542631351987";

const subscribeAppToPage = () => {
  const options = {
    method: "POST",
    uri: `https://graph.facebook.com/${PAGE_ID}/subscribed_apps`,
    qs: {
      subscribed_fields: "feed",
      access_token: PAGE_ACCESS_TOKEN,
    },
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log("Webhook subscription successful!");
    } else {
      console.error("Failed to subscribe webhook:", error);
    }
  });
};

subscribeAppToPage();

console.log("clgt");
let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("server is running ");
});
