require("dotenv").config();
const request = require("request");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const IMAGE_GET_STARTED = "http://bit.ly/quang-bot1";
const IMAGE_MAIN_MENU_2 = "http://bit.ly/eric-bot-2";
const IMAGE_MAIN_MENU_3 = "http://bit.ly/eric-bot-3";
const IMAGE_MAIN_MENU_4 = "http://bit.ly/eric-bot-4";
const IMAGE_VIEW_APPETIZERS = "http://bit.ly/eric-bot-5";
const IMAGE_VIEW_FISH = "http://bit.ly/eric-bot-6";
const IMAGE_VIEW_MEAT = "http://bit.ly/eric-bot-7";
const IMAGE_BACK_MAIN_MENU = "http://bit.ly/eric-bot-8";

///////////
const IMAGE_DETAIl_APPETIZER_1 = "http://bit.ly/eric-bot-9";
const IMAGE_DETAIl_APPETIZER_2 = "http://bit.ly/eric-bot-10";
const IMAGE_DETAIl_APPETIZER_3 = "http://bit.ly/eric-bot-11";
///////////
const IMAGE_DETAIl_FISH_1 = "http://bit.ly/eric-bot-12";
const IMAGE_DETAIl_FISH_2 = "http://bit.ly/eric-bot-13-1";
const IMAGE_DETAIl_FISH_3 = "http://bit.ly/eric-bot-14";
///////////
const IMAGE_DETAIl_MEAT_1 = "http://bit.ly/eric-bot-15";
const IMAGE_DETAIl_MEAT_2 = "http://bit.ly/eric-bot-16";
const IMAGE_DETAIl_MEAT_3 = "http://bit.ly/eric-bot-17";

let callSendAPI = async (sender_psid, response) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  await sendMarkReadMessage(sender_psid);
  await sendTypingOn(sender_psid);
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

let sendTypingOn = (sender_psid) => {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: "typing_on",
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
        console.log("sendTypingOn sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

let sendMarkReadMessage = (sender_psid) => {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: "mark_seen",
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
        console.log("sendTypingOn sent!");
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

      let response2 = getStartedTemplate();

      // send text message
      await callSendAPI(sender_psid, response1);
      // send generic template message
      await callSendAPI(sender_psid, response2);
      resolve("done");
    } catch (err) {
      reject(err);
    }
  });
};

let getStartedTemplate = () => {
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

let handleSendMainMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getMainMenuTemplate();

      // send text message
      await callSendAPI(sender_psid, response1);
      // send generic template message
      resolve("done");
    } catch (err) {
      reject(err);
    }
  });
};
let getMainMenuTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Menu cua nha hang",
            subtitle:
              "Chung toi han hanh mang den cho ban thuc don phong phu cho bua trua va bua toi.",
            image_url: IMAGE_MAIN_MENU_2,
            buttons: [
              {
                type: "postback",
                title: "BUA TRUA",
                payload: "LUNCH_MENU",
              },
              {
                type: "postback",
                title: "BUA TOI",
                payload: "DINNER_MENU",
              },
            ],
          },
          {
            title: "Gio mo cua",
            subtitle: "T2-T6 10AM - 11PM | T7-CN 5PM - 10PM",
            image_url: IMAGE_MAIN_MENU_3,
            buttons: [
              {
                type: "postback",
                title: "DAT BAN",
                payload: "RESERVED_TABLE",
              },
            ],
          },
          {
            title: "Khong gian nha hang",
            subtitle: "Nha hang co suc chua len den 300 cho ngoi.",
            image_url: IMAGE_MAIN_MENU_4,
            buttons: [
              {
                type: "postback",
                title: "Chi tiet",
                payload: "SHOW_ROOMS",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleSendLuchMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getLunchMenuTemplate();

      // send text message
      await callSendAPI(sender_psid, response1);
      // send generic template message
      resolve("done");
    } catch (err) {
      reject(err);
    }
  });
};

let getLunchMenuTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Mon trang mieng",
            subtitle: "Nha hang co nhieu mon trang mieng hap dan.",
            image_url: IMAGE_VIEW_APPETIZERS,
            buttons: [
              {
                type: "postback",
                title: "Xem chi tiet",
                payload: "VIEW_APPETIZERS",
              },
            ],
          },
          {
            title: "Hai san",
            subtitle: "Ca, tom, cua , muc...",
            image_url: IMAGE_VIEW_FISH,
            buttons: [
              {
                type: "postback",
                title: "Xem chi tiet",
                payload: "VIEW_FISH",
              },
            ],
          },
          {
            title: "Thit hun khoi",
            subtitle: "Dam bao chat luong hang dau.",
            image_url: IMAGE_VIEW_MEAT,
            buttons: [
              {
                type: "postback",
                title: " Xem chi tiet",
                payload: "VIEW_MEAT",
              },
            ],
          },
          {
            title: "Quay tro lai",
            subtitle: "Quay tro lai menu chinh.",
            image_url: IMAGE_BACK_MAIN_MENU,
            buttons: [
              {
                type: "postback",
                title: " Quay tro lai",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
let handleSendDinnerMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getDinnerMenuTemplate();

      // send text message
      await callSendAPI(sender_psid, response1);
      // send generic template message
      resolve("done");
    } catch (err) {
      reject(err);
    }
  });
};
let getDinnerMenuTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Mon trang mieng",
            subtitle: "Nha hang co nhieu mon trang mieng hap dan.",
            image_url: IMAGE_VIEW_APPETIZERS,
            buttons: [
              {
                type: "postback",
                title: "Xem chi tiet",
                payload: "VIEW_APPETIZERS",
              },
            ],
          },
          {
            title: "Hai san",
            subtitle: "Ca, tom, cua , muc...",
            image_url: IMAGE_VIEW_FISH,
            buttons: [
              {
                type: "postback",
                title: "Xem chi tiet",
                payload: "VIEW_FISH",
              },
            ],
          },
          {
            title: "Thit hun khoi",
            subtitle: "Dam bao chat luong hang dau.",
            image_url: IMAGE_VIEW_MEAT,
            buttons: [
              {
                type: "postback",
                title: " Xem chi tiet",
                payload: "VIEW_MEAT",
              },
            ],
          },
          {
            title: "Quay tro lai",
            subtitle: "Quay tro lai menu chinh.",
            image_url: IMAGE_BACK_MAIN_MENU,
            buttons: [
              {
                type: "postback",
                title: " Quay tro lai",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleBackToMainMenu = async (sender_psid) => {
  await handleSendMainMenu(sender_psid);
};
let handleDetailViewAppetizer = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getDetailViewAppetizerTemplate();

      // send text message
      await callSendAPI(sender_psid, response1);
      // send generic template message
      resolve("done");
    } catch (err) {
      reject(err);
    }
  });
};
let getDetailViewAppetizerTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Dua hau",
            subtitle: "50.000d/1kg",
            image_url: IMAGE_DETAIl_APPETIZER_1,
          },
          {
            title: "Xoai",
            subtitle: "20.000d/1kg",
            image_url: IMAGE_DETAIl_APPETIZER_2,
          },
          {
            title: "Oi",
            subtitle: "30.000d/1kg",
            image_url: IMAGE_DETAIl_APPETIZER_3,
          },
          {
            title: "Quay tro lai",
            subtitle: "Quay tro lai menu chinh.",
            image_url: IMAGE_BACK_MAIN_MENU,
            buttons: [
              {
                type: "postback",
                title: " Quay tro lai",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
let handleDetailViewFish = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getDetailViewFishTemplate();

      // send text message
      await callSendAPI(sender_psid, response1);
      // send generic template message
      resolve("done");
    } catch (err) {
      reject(err);
    }
  });
};
let getDetailViewFishTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Ca hoi",
            subtitle: "450.000d/1kg",
            image_url: IMAGE_DETAIl_FISH_1,
          },
          {
            title: "Ca tam",
            subtitle: "200.000d/1kg",
            image_url: IMAGE_DETAIl_FISH_2,
          },
          {
            title: "Ca ngu",
            subtitle: "500.000d/1kg",
            image_url: IMAGE_DETAIl_FISH_3,
          },
          {
            title: "Quay tro lai",
            subtitle: "Quay tro lai menu chinh.",
            image_url: IMAGE_BACK_MAIN_MENU,
            buttons: [
              {
                type: "postback",
                title: " Quay tro lai",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
let handleDetailViewMeat = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getDetailViewMeatTemplate();

      // send text message
      await callSendAPI(sender_psid, response1);
      // send generic template message
      resolve("done");
    } catch (err) {
      reject(err);
    }
  });
};
let getDetailViewMeatTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Thit lon hun khoi",
            subtitle: "500.000d/1kg",
            image_url: IMAGE_DETAIl_MEAT_1,
          },
          {
            title: "Thit bo My",
            subtitle: "200.000d/1kg",
            image_url: IMAGE_DETAIl_MEAT_2,
          },
          {
            title: "Thit ga",
            subtitle: "300.000d/1kg",
            image_url: IMAGE_DETAIl_MEAT_3,
          },
          {
            title: "Quay tro lai",
            subtitle: "Quay tro lai menu chinh.",
            image_url: IMAGE_BACK_MAIN_MENU,
            buttons: [
              {
                type: "postback",
                title: " Quay tro lai",
                payload: "BACK_TO_MAIN_MENU",
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
  handleSendMainMenu: handleSendMainMenu,
  handleSendLuchMenu: handleSendLuchMenu,
  handleSendDinnerMenu: handleSendDinnerMenu,
  handleBackToMainMenu: handleBackToMainMenu,
  handleDetailViewAppetizer: handleDetailViewAppetizer,
  handleDetailViewFish: handleDetailViewFish,
  handleDetailViewMeat: handleDetailViewMeat,
};
