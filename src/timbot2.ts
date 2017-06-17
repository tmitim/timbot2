import dotenv = require('dotenv');
import Botkit = require('botkit');
dotenv.config({silent: true});
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
  console.log("no SLACK TOKEN found");
  throw new Error("no slack token");
}

var spawnBot = controller.spawn({
  token: process.env.SLACK_TOKEN,
  stats_optout: true
});

function start_rtm() {
  spawnBot.startRTM((err,bot,payload) => {
    if (err) {
      console.log("Error while starting bot", err);
      setTimeout(function() {

        analysis.incrementRestarts();
        analysis.setRestartToNow();

        start_rtm();
      }, 30000);
      return;
    }

    console.log("Slackbot started");
    // // for debugging
    // setTimeout(function() {
    //   console.log("closing bot...");
    //   bot.closeRTM();
    // }, 10000);
  });
}

// restart slackbot if broken
controller.on('rtm_close', (bot, message) => {

  analysis.incrementRestarts();
  analysis.setRestartToNow();
  console.log("Attempting to restart rtm");
});

controller.on('rtm_reconnect_failed',function(bot) {
  console.log("rtm reconnect failed. Retrying manually");

  start_rtm();
});

start_rtm();

let commands : BotListener[] = [];

let directory = process.env.SLACK_CUSTOM_DIR ?
  process.env.SLACK_CUSTOM_DIR :
  (process.cwd() + "/");

console.log("getting custom commands from", directory);
fs.readdir(directory , (err, files) => {
  if (err) {
    console.log(err);
    return;
  }

  files
  .filter(file => file.endsWith(".js"))
  .map(file => file.split(".")[0])
  .forEach(file => {
    console.log("Setting custom command...", file);
    var custom = require(directory + file);
    try {
      var customCommand = new custom[file]();
      customCommand.setController(ControllerManager.getInstance().getController());

      if (customCommand.type === "BotListener" && customCommand.isValid()) {
        if (customCommand.active) {
          commands.push(customCommand);
        } else {
          console.log("(not Active)");
        }
      } else {
        console.log(file, "(not BotListener)");
      }
    } catch (e) {
      // skip if not a BotListener
      console.log("Problem importing custom command...", file, e);
    }
  });

  var help = new Help();
  help.setAvailableCommands(commands);
  commands.push(help);
  commands.push(analysis);

  commands.filter(function(command) {
    if (command.active) {
      return command;
    } else {
      console.log(command.name + " (not active)");
    }
  }).forEach(function(command) {
    command.start();
  })
});
