const express = require("express");
const path = require("path");
let configViewEngine = (app) => {
  app.use(express.static(path.join(__dirname, "./src/public")));
  app.set("view engine", "ejs");
  app.set("views", "./views");
};

module.exports = configViewEngine;
