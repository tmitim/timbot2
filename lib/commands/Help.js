"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BotListener_1 = require("../BotListener");
var Help = (function (_super) {
    __extends(Help, _super);
    function Help() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "help";
        _this.desc = "Shows this help menu";
        _this.hidden = true;
        _this.active = process.env.HELP_COMMAND != 'off';
        _this.channels = ['direct_message', 'direct_mention', 'mention'];
        return _this;
    }
    Help.prototype.start = function () {
        var help = this;
        help.controller.hears('help', help.channels, function (bot, message) {
            var commandString = "";
            help.commands
                .filter(function (cmd) {
                return (!cmd.hidden || message.text.indexOf("-h") != -1);
            })
                .filter(function (cmd) {
                return cmd.active;
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
            help.replyCode(bot, message, commandString);
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
