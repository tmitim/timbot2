import dotenv = require('dotenv');
import Botkit = require('botkit');
dotenv.config();
import async = require('async');
import { BotListener } from "./commands/BotListener";
import { Analysis } from "./commands/Analysis";
import { Help } from "./commands/Help";
const fs = require('fs');

var controller = Botkit.slackbot({
  debug: false,
  log: false
});

var analysis = new Analysis(controller);

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
  // var filename : String[] = [];
  files
  .filter(file => file.endsWith(".js"))
  .map(file => file.split(".")[0])
  .forEach(file => {
    console.log("Setting custom command...", file);
    var custom = require('./commands/custom/' + file);
    try {
      var customCommand = new custom[file](controller);
      commands.push(customCommand);
    } catch (e) {
      // skip if not a BotListener
      console.log("Problem importing custom command...", file, e);
    }
  });

  var help = new Help(controller);
  help.setAvailableCommands(commands);
  commands.push(analysis);
  commands.push(help);

  commands.forEach(function(command) {
    command.start();
  })
});
