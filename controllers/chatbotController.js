require("dotenv").config();
const request = require("request");
const chatbotService = require("../services/chatbotService");
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
let getHomePage = (req, res) => {
  return res.render("homepage");
};

let getWebhook = (req, res) => {
  // Your verify token should be a random string

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};
let postWebhook = (req, res) => {
  let body = req.body;

  // Check this is an event from a page subscription
  if (body.object === "page") {
    // Iterates over each entry - there may be mutiple if batched
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      console.log(entry, "------------1111111111111111111---------");
      let webhook_event = entry.messaging[0];
      console.log("-------222222222222222-----------", webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        console.log("clgt----------");
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }

      //// listen comments
      const pageID = entry.id;
      const timeOfEvent = entry.time;

      // Iterate over each messaging event
      const changes = entry.changes;
      if (changes) {
        changes.forEach((change) => {
          if (change.field === "feed") {
            console.log("---------Page feed has been updated!");
            // Handle the page feed update event here
          } else if (change.field === "comments") {
            console.log("--------New comment has been posted!");
            // Handle the new comment event here
          }
        });
      }
    });
    // Return a '200 OK' response to all requests

    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 NOT FOUND' if event is not from a page subscription
    res.sendStatus(404);
  }
};

function handleMessage(sender_psid, received_message) {
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an attachment!`,
    };
    console.log("clgt 1-------------");
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Is this the right picture?",
              subtitle: "Tap a button to answer.",
              image_url: attachment_url,
              buttons: [
                {
                  type: "postback",
                  title: "Yes!",
                  payload: "yes",
                },
                {
                  type: "postback",
                  title: "No!",
                  payload: "no",
                },
              ],
            },
          ],
        },
      },
    };
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

async function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  switch (payload) {
    case "yes":
      response = { text: "Thanks!" };
      break;
    case "no":
      response = { text: "Oops, try sending another image." };
      break;
    case "RESTART_BOT":
    case "GET_STARTED":
      await chatbotService.handleGetStarted(sender_psid);

      break;
    default:
      response = { text: "nhu shit" };
  }

  // Send the message to acknowledge the postback
  //  callSendAPI(sender_psid, response);
}

/////
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v16.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

let setupProfile = async (req, res) => {
  // call Facebook profile

  let request_body = {
    get_started: { payload: "GET_STARTED" },
    whitelisted_domains: ["https://chatbotcake.onrender.com"],
  };

  // Send the HTTP request to the Messenger Platform
  await request(
    {
      uri: `https://graph.facebook.com/v16.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("Setup user profile succeeds!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
  return res.send("Setup user profile succeeds!");
};

///////////////
let setupPersistentMenu = async (req, res) => {
  let request_body = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "web_url",
            title: "Website chinh thuc",
            url: "http://www.sunbuy.vn/",
            webview_height_ratio: "full",
          },
          {
            type: "web_url",
            title: "Facebook Page Online Shop",
            url: "http://www.sunbuy.vn/",
            webview_height_ratio: "full",
          },
          {
            type: "postback",
            title: "Khoi dong lai bot",
            payload: "RESTART_BOT",
          },
        ],
      },
    ],
  };

  // Send the HTTP request to the Messenger Platform
  await request(
    {
      uri: `https://graph.facebook.com/v16.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("Setup user persistent menu succeeds!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
  return res.send("Setup user persistent menu succeeds!");
};
module.exports = {
  getHomePage: getHomePage,
  getWebhook: getWebhook,
  postWebhook: postWebhook,
  setupProfile: setupProfile,
  setupPersistentMenu: setupPersistentMenu,
};
