"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BotListener_1 = require("../BotListener");
var async = require("async");
var Help = (function (_super) {
    __extends(Help, _super);
    function Help() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "help";
        _this.desc = "Shows this help menu";
        _this.hidden = true;
        _this.channels = ['direct_message', 'direct_mention', 'mention'];
        return _this;
    }
    Help.prototype.start = function () {
        var help = this;
        help.controller.hears('help', help.channels, function (bot, message) {
            var commandString = "```\n";
            help.commands
                .filter(function (cmd) {
                return (!cmd.hidden || message.text.indexOf("-h") != -1);
            })
                .sort(function (a, b) {
                var commandA = a.name.toUpperCase();
                var commandB = b.name.toUpperCase();
                if (commandA < commandB) {
                    return -1;
                }
                if (commandA > commandB) {
                    return 1;
                }
                return 0;
            })
                .forEach(function (cmd) {
                commandString += help.padColumn(cmd.name, 18) + cmd.desc + "\n";
            });
            commandString += "```";
            async.series([
                function (callback) {
                    bot.reply(message, "Here are my available commands - ");
                    callback(null, 1);
                },
                function (callback) {
                    setTimeout(function () {
                        bot.reply(message, commandString);
                        callback(null, 2);
                    }, 100);
                }
            ], function (err, results) {
                if (err)
                    console.log(err);
            });
        });
    };
    Help.prototype.setAvailableCommands = function (commands) {
        this.commands = commands;
    };
    Help.prototype.padColumn = function (cmd, length) {
        cmd += "                ";
        return cmd.substring(0, length);
    };
    return Help;
}(BotListener_1.BotListener));
exports.Help = Help;
