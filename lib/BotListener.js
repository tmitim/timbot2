"use strict";
var ControllerManager_1 = require("./commands/ControllerManager");
var BotListener = (function () {
    function BotListener() {
        this.hidden = false;
        this.controller = ControllerManager_1.ControllerManager.getInstance().getController();
        this.type = "BotListener";
        this.active = true;
    }
    BotListener.prototype.setController = function (controller) {
        this.controller = controller;
    };
    BotListener.prototype.isValid = function () {
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
    };
    BotListener.prototype.reply = function (bot, message, slackMessage) {
        bot.reply(message, slackMessage);
        console.log(new Date().toUTCString() + ": " + slackMessage);
    };
    BotListener.prototype.replyCode = function (bot, message, slackMessage) {
        bot.reply(message, "```" + slackMessage + "```");
        console.log(new Date().toUTCString() + ": " + slackMessage);
    };
    return BotListener;
}());
exports.BotListener = BotListener;
