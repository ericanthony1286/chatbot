require("dotenv").config();
const { response } = require("express");
const request = require("request");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const IMAGE_GET_STARTED = "http://bit.ly/quang-bot1";

let callSendAPI = (sender_psid, response) => {
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
      console.log("clgt-----------2");
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

let getUsername = (sender_psid) => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,

        method: "GET",
      },
      (err, res, body) => {
        if (!err) {
          let userData = JSON.parse(body);
          let username = `${userData.first_name} ${userData.last_name}`;
          resolve(username);
        } else {
          console.error("Unable to send message:" + err);
          reject(err);
        }
      }
    );
  });
};

let handleGetStarted = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let username = await getUsername(sender_psid);
      let response1 = { text: `Ok, Welcome ${username} to our page.` };

      let response2 = sendGetStartedTemplate();

      // send text message
      await callSendAPI(sender_psid, response1);
      // send generic template message
      resolve("done");
    } catch (err) {
      reject(err);
    }
  });
};

let sendGetStartedTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Xin chao ban den  voi nha hang cua chung toi",
            subtitle: "Duoi day la cac lua chon cua nha hang.",
            image_url: IMAGE_GET_STARTED,
            buttons: [
              {
                type: "postback",
                title: "MENU CHINH",
                payload: "MAIN_MENU",
              },
              {
                type: "postback",
                title: "DAT BAN",
                payload: "RESERVED_TABLE",
              },
              {
                type: "postback",
                title: "HUONG DAN SU DUNG BOT",
                payload: "GUI_TO_USE",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
module.exports = {
  handleGetStarted: handleGetStarted,
};
