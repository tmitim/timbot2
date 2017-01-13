'use strict'
import dotenv = require('dotenv');
import Botkit = require('botkit');
dotenv.config();
import async = require('async');
import { Analysis } from "./commands/Analysis";
import { Help } from "./commands/Help";
import { BotListener } from "./BotListener";
const fs = require('fs');
import { ControllerManager } from "./commands/ControllerManager";

let controller = Botkit.slackbot({
  debug: false,
  log: false
});

ControllerManager.getInstance().setController(controller);

var analysis = new Analysis();

if (!process.env.SLACK_TOKEN) {
  throw new Error("no slack token");
}
var spawnBot = controller.spawn({
  token: process.env.SLACK_TOKEN,
  stats_optout: true
});

function start_rtm(spawnBot) {
  spawnBot.startRTM(function(err,bot,payload) {
    console.log("Starting slack bot...");
    if (err) {
      console.log("Error while starting bot", err);
      setTimeout(function() {
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
    //
    // // for debugging
    // setTimeout(function() {
    //   console.log("closing bot...");
    //   bot.closeRTM();
    // }, 10000);
  });
}

// restart slackbot if broken
controller.on('rtm_close', function(bot, err) {
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

let commands : BotListener[] = [];

fs.readdir(__dirname + '/commands/custom/', (err, files) => {
  files
  .filter(file => file.endsWith(".js"))
  .map(file => file.split(".")[0])
  .forEach(file => {
    console.log("Setting custom command...", file);
    var custom = require('./commands/custom/' + file);
    try {
      var customCommand = new custom[file]();
      commands.push(customCommand);
    } catch (e) {
      // skip if not a BotListener
      console.log("Problem importing custom command...", file, e);
    }
  });

  var help = new Help();
  help.setAvailableCommands(commands);
  commands.push(analysis);
  commands.push(help);

  commands.forEach(function(command) {
    command.start();
  })
});
