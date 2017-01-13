'use strict';
var dotenv = require("dotenv");
var Botkit = require("botkit");
dotenv.config();
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
    throw new Error("no slack token");
}
var spawnBot = controller.spawn({
    token: process.env.SLACK_TOKEN,
    stats_optout: true
});
function start_rtm(spawnBot) {
    spawnBot.startRTM(function (err, bot, payload) {
        console.log("Starting slack bot...");
        if (err) {
            console.log("Error while starting bot", err);
            setTimeout(function () {
                spawnBot = controller.spawn({
                    token: process.env.SLACK_TOKEN,
                    stats_optout: true
                });
                analysis.incrementRestarts();
                analysis.setRestartToNow();
                start_rtm(spawnBot);
            }, 30000);
            return;
        }
    });
}
controller.on('rtm_close', function (bot, err) {
    if (err) {
        console.log("Error while restarting bot", err);
        spawnBot = controller.spawn({
            token: process.env.SLACK_TOKEN,
            stats_optout: true
        });
        analysis.incrementRestarts();
        analysis.setRestartToNow();
        start_rtm(spawnBot);
        return;
    }
    analysis.incrementRestarts();
    analysis.setRestartToNow();
    console.log("Attempting to restart rtm");
    start_rtm(bot);
});
start_rtm(spawnBot);
var commands = [];
fs.readdir(__dirname + '/commands/custom/', function (err, files) {
    files
        .filter(function (file) { return file.endsWith(".js"); })
        .map(function (file) { return file.split(".")[0]; })
        .forEach(function (file) {
        console.log("Setting custom command...", file);
        var custom = require('./commands/custom/' + file);
        try {
            var customCommand = new custom[file]();
            commands.push(customCommand);
        }
        catch (e) {
            console.log("Problem importing custom command...", file, e);
        }
    });
    var help = new Help_1.Help();
    help.setAvailableCommands(commands);
    commands.push(analysis);
    commands.push(help);
    commands.forEach(function (command) {
        command.start();
    });
});
