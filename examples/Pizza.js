"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BotListener_1 = require("timbot2/lib/BotListener");
var Pizza = (function (_super) {
    __extends(Pizza, _super);
    function Pizza() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "Pizza";
        _this.desc = "Mmmm, pizza";
        _this.hidden = true;
        _this.active = true;
        _this.channels = ['direct_message', 'direct_mention', 'mention', 'ambient'];
        return _this;
    }
    Pizza.prototype.start = function () {
        this.controller.hears('pizza', this.channels, function (bot, message) {
            // use from BotListener
            this.reply(bot, message, "pizza? I want pizza");
            // to use reply
        }.bind(this));
    };
    return Pizza;
}(BotListener_1.BotListener));
exports.Pizza = Pizza;
