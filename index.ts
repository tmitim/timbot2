// import {Service, Message} from "./services";
import dotenv = require('dotenv');
import Botkit = require('botkit');
dotenv.config();
import async = require('async');
import { BotListener } from "./commands/BotListener";

var restarts = 0;
var startedOn = Date.now();
var timeRestarted;

var controller = Botkit.slackbot({
  debug: false,
  log: false
});

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

        ++restarts;
        timeRestarted = Date.now();
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
    console.log("Error while restart bot", err);
    spawnBot = controller.spawn({
      token: process.env.SLACK_TOKEN,
      stats_optout: true
    });

    ++restarts;
    timeRestarted = Date.now();
    start_rtm(this.spawnBot);
    return;
  }
  console.log("Attempting to restart rtm", ++restarts);
  timeRestarted = Date.now();

  start_rtm(bot);
});

start_rtm(spawnBot);

class Analysis implements BotListener {
  name = "analysis";
  desc = "Shows my analysis";
  hidden = false;
  channels;
  controller;
  constructor( controller ){
    this.channels = ['direct_message','direct_mention','mention'];
    this.controller = controller;
  }

  start() {
    this.controller.hears('analysis', this.channels, function(bot,message) {

      var messages =[];
      messages.push(function(empty) {
        bot.reply(message, getStarted())
        empty(null);
      });
      messages.push( function(empty) {
        bot.reply(message, getRestarts())
        empty(null)
      });
      if (timeRestarted) {
        messages.push(function (empty) {
          bot.reply(message, getLastRestart())
          empty(null)
        });
      }

      async.series(messages, function(err, results) {
        if(err) {
          console.log(err);
        }
      });
    });
  }
}

controller.hears('help', ['direct_message','direct_mention','mention'], function(bot,message) {

  var commandString = "```\n";
  commands.forEach(function(command) {
    if (!command.hidden || message.text.indexOf("-h") != -1) {
      commandString += padColumn(command.name, 18) + command.desc + "\n"
    }
  })

  commandString += "```";

  async.series([
    function(empty) {
      sendMessage(bot, message, "Here are my available commands - ");
      empty(null);
    },
    function(empty) {
      sendMessage(bot, message, commandString)
      empty(null)
    }
  ], function(err, results) {
    if (err) console.log(err);
  });
});


function sendMessage(bot, message, quote) {
  bot.reply(message, quote);
}

function padColumn(cmd, length) {
  cmd += "                ";
  return cmd.substring(0, length);
}

function getRestarts() {
  return restarts > 0 ? "I've restarted myself " + restarts + " times." :
  "I've never restarted. Hopefully I'll never have to.";
}

function getStarted() {
  return "I booted up at " + startedOn + "... or you may know it better as " + new Date(startedOn).toLocaleString() + ".";
}

function getLastRestart() {
  return  "The last time I restarted was on " + new Date(timeRestarted).toLocaleString() + ".";
}

var commands = [];
commands.push(new Analysis(controller));

commands.forEach(function(command) {
  command.start();
})
