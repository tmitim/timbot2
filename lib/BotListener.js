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
        this.consoleLog(bot, message, slackMessage);
    };
    BotListener.prototype.replyCode = function (bot, message, slackMessage) {
        if (slackMessage.length > 0) {
            bot.reply(message, "```" + slackMessage + "```");
            this.consoleLog(bot, message, slackMessage);
        }
    };
    BotListener.prototype.consoleLog = function (bot, message, slackMessage) {
        bot.api.users.info({ user: message.user }, function (error, response) {
            if (response) {
                var _a = response.user, name_1 = _a.name, real_name = _a.real_name;
                console.log(new Date().toUTCString() + ":", name_1 + ":", message.text);
            }
            else {
                console.log(new Date().toUTCString() + ":", message.user, message.text);
            }
            console.log(slackMessage);
        });
    };
    return BotListener;
}());
exports.BotListener = BotListener;
