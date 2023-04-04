const express = require("express");
const chatbotController = require("../controllers/chatbotController");

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", chatbotController.getHomePage);

  // set up getstarted button, whitelisted domain
  router.post("/setup-profile", chatbotController.setupProfile);

  // setup persistent menu
  router.post("/setup-persistent-menu", chatbotController.setupPersistentMenu);

  router.get("/webhook", chatbotController.getWebhook);
  router.post("/webhook", chatbotController.postWebhook);
  return app.use("/", router);
};

module.exports = initWebRoutes;
