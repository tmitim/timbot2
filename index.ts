// import {Service, Message} from "./services";
import dotenv = require('dotenv');
import Botkit = require('botkit');
dotenv.config();
import async = require('async');
import { BotListener } from "./commands/BotListener";
import { Analysis } from "./commands/Analysis";

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

controller.hears('help', ['direct_message','direct_mention','mention'], function(bot,message) {

  var commandString = "```\n";
  commands.forEach(function(command) {
    if (!command.hidden || message.text.indexOf("-h") != -1) {
      commandString += padColumn(command.name, 18) + command.desc + "\n"
    }
  })

  commandString += "```";

  async.series([
    function(callback) {
      bot.reply(message, "Here are my available commands - ");
      callback(null, 1);
    },
    function(callback) {
      setTimeout(function() {
        bot.reply(message, commandString);
        callback(null, 2);
      }, 100);
    }
  ], function(err, results) {
    if (err) console.log(err);
  });
});

function padColumn(cmd, length) {
  cmd += "                ";
  return cmd.substring(0, length);
}

var commands = [];
commands.push(analysis);

commands.forEach(function(command) {
  command.start();
})
