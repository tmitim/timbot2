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
var BotListener_1 = require("../BotListener");
var Analysis = (function (_super) {
    __extends(Analysis, _super);
    function Analysis() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "analysis";
        _this.desc = "Shows my analysis";
        _this.hidden = true;
        _this.active = process.env.ANALYSIS_COMMAND != "off";
        _this.channels = ['direct_message', 'direct_mention', 'mention'];
        _this.startedOn = Date.now();
        _this.restarts = 0;
        return _this;
    }
    Analysis.prototype.start = function () {
        var analysis = this;
        analysis.controller.hears('analysis', analysis.channels, function (bot, message) {
            var messages = [];
            messages.push(analysis.getStarted());
            messages.push(analysis.getRestarts());
            if (analysis.timeRestarted) {
                messages.push(analysis.getLastRestart());
            }
            analysis.replyCode(bot, message, messages.join("\n"));
        });
    };
    Analysis.prototype.incrementRestarts = function () {
        this.restarts++;
    };
    Analysis.prototype.setRestartToNow = function () {
        this.timeRestarted = Date.now();
    };
    Analysis.prototype.getRestarts = function () {
        return this.restarts > 0 ? "I've restarted myself " + this.restarts + " times." :
            "I've never restarted. Hopefully I'll never have to.";
    };
    Analysis.prototype.getStarted = function () {
        return "I booted up at " + this.startedOn + "... or you may know it better as " + new Date(this.startedOn).toLocaleString() + ".";
    };
    Analysis.prototype.getLastRestart = function () {
        return "The last time I restarted was on " + new Date(this.timeRestarted).toLocaleString() + ".";
    };
    return Analysis;
}(BotListener_1.BotListener));
exports.Analysis = Analysis;
