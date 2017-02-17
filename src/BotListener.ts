import {ControllerManager} from "./commands/ControllerManager";

export abstract class BotListener {
  name: String;
  desc: String;
  hidden : boolean = false;
  abstract start(): void;
  controller = ControllerManager.getInstance().getController();
  type = "BotListener";
  active : boolean = true;

  setController(controller) {
    this.controller = controller;
  }

  isValid() : boolean {
    var valid = true;
    if (!this.name) {
      console.log("BotListener needs a name");
      valid = false;
    }
    if (!this.desc) {
      console.log("BotListener needs a description");
      valid = false;
    }

    return valid;
  }

  reply(bot, message, slackMessage) {
    bot.reply(message, slackMessage);

    console.log(new Date().toUTCString() + ": " + slackMessage);
  }

  replyCode(bot, message, slackMessage : String) {
    if (slackMessage.length > 0) {
      bot.reply(message, "```" + slackMessage + "```");
    }
    console.log(new Date().toUTCString() + ": " + slackMessage);
  }
}
