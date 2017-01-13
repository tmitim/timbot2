"use strict";
var ControllerManager = (function () {
    function ControllerManager() {
    }
    ControllerManager.getInstance = function () {
        if (!ControllerManager.instance) {
            ControllerManager.instance = new ControllerManager();
        }
        return ControllerManager.instance;
    };
    ControllerManager.prototype.setController = function (controller) {
        ControllerManager.controller = controller;
    };
    ControllerManager.prototype.getController = function () {
        return ControllerManager.controller;
    };
    return ControllerManager;
}());
exports.ControllerManager = ControllerManager;
