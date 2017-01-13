"use strict";
var ControllerManager_1 = require("./commands/ControllerManager");
var BotListener = (function () {
    function BotListener() {
        this.controller = ControllerManager_1.ControllerManager.getInstance().getController();
    }
    return BotListener;
}());
exports.BotListener = BotListener;
