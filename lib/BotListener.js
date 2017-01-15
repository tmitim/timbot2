"use strict";
var ControllerManager_1 = require("./commands/ControllerManager");
var BotListener = (function () {
    function BotListener() {
        this.controller = ControllerManager_1.ControllerManager.getInstance().getController();
        this.type = "BotListener";
    }
    BotListener.prototype.setController = function (controller) {
        this.controller = controller;
    };
    return BotListener;
}());
exports.BotListener = BotListener;
