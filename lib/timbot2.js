"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var Botkit = require("botkit");
dotenv.config({ silent: true });
var Analysis_1 = require("./commands/Analysis");
var Help_1 = require("./commands/Help");
var fs = require('fs');
var ControllerManager_1 = require("./commands/ControllerManager");
var controller = Botkit.slackbot({
    debug: false,
    log: false
});
ControllerManager_1.ControllerManager.getInstance().setController(controller);
var analysis = new Analysis_1.Analysis();
if (!process.env.SLACK_TOKEN) {
    console.log("no SLACK TOKEN found");
    throw new Error("no slack token");
}
var spawnBot = controller.spawn({
    token: process.env.SLACK_TOKEN,
    stats_optout: true
});
function start_rtm() {
    spawnBot.startRTM(function (err, bot, payload) {
        if (err) {
            console.log("Error while starting bot", err);
            setTimeout(function () {
                analysis.incrementRestarts();
                analysis.setRestartToNow();
                start_rtm();
            }, 30000);
            return;
        }
        console.log("Slackbot started");
    });
}
controller.on('rtm_close', function (bot, message) {
    analysis.incrementRestarts();
    analysis.setRestartToNow();
    console.log("Attempting to restart rtm");
    start_rtm();
});
start_rtm();
var commands = [];
var directory = process.env.SLACK_CUSTOM_DIR ?
    process.env.SLACK_CUSTOM_DIR :
    (process.cwd() + "/");
console.log("getting custom commands from", directory);
fs.readdir(directory, function (err, files) {
    if (err) {
        console.log(err);
        return;
    }
    files
        .filter(function (file) { return file.endsWith(".js"); })
        .map(function (file) { return file.split(".")[0]; })
        .forEach(function (file) {
        console.log("Setting custom command...", file);
        var custom = require(directory + file);
        try {
            var customCommand = new custom[file]();
            customCommand.setController(ControllerManager_1.ControllerManager.getInstance().getController());
            if (customCommand.type === "BotListener" && customCommand.isValid()) {
                if (customCommand.active) {
                    commands.push(customCommand);
                }
                else {
                    console.log("(not Active)");
                }
            }
            else {
                console.log(file, "(not BotListener)");
            }
        }
        catch (e) {
            console.log("Problem importing custom command...", file, e);
        }
    });
    var help = new Help_1.Help();
    help.setAvailableCommands(commands);
    commands.push(help);
    commands.push(analysis);
    commands.filter(function (command) {
        if (command.active) {
            return command;
        }
        else {
            console.log(command.name + " (not active)");
        }
    }).forEach(function (command) {
        command.start();
    });
});
