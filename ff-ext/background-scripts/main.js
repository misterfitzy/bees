console.log("main.js - in communications...");

import { ContentInterface } from './modules/ContentInterface.js';

let contentInterface = new ContentInterface();

contentInterface.testFunction();

function notify(message) {
    console.log("background script received message");
    var title = browser.i18n.getMessage("notificationTitle");
    var content = browser.i18n.getMessage("notificationContent", message.url);
    browser.notifications.create({
      "type": "basic",
      "title": title,
      "message": content
    });
  }
  
/*
  Assign `notify()` as a listener to messages from the content script.
*/
browser.runtime.onMessage.addListener(notify);