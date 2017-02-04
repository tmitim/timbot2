import { BotListener } from "../BotListener";
import async = require('async');

export class Analysis extends BotListener {
  name = "analysis";
  desc = "Shows my analysis";
  hidden = false;
  active = process.env.ANALYSIS_COMMAND != "off";
  channels = ['direct_message','direct_mention','mention'];

  private timeRestarted;
  private startedOn = Date.now();
  private restarts = 0;

  start() {
    var analysis = this;
    analysis.controller.hears('analysis', analysis.channels, function(bot,message) {

      var messages =[];
      messages.push(function(callback) {
        bot.reply(message, analysis.getStarted())
        callback(null, 1);
      });
      messages.push( function(callback) {
        setTimeout(function() {
          bot.reply(message, analysis.getRestarts())
          callback(null, 2)
        }, 100);
      });
      if (analysis.timeRestarted) {
        messages.push(function (callback) {
          setTimeout(function() {
            bot.reply(message, analysis.getLastRestart())
            callback(null, 3)
          }, 100);
        });
      }

      async.series(messages, function(err, results) {
        if(err) {
          console.log(err);
        }
      });
    });
  }

  incrementRestarts() {
    this.restarts++;
  }

  setRestartToNow() {
    this.timeRestarted = Date.now();
  }

  private getRestarts() {
    return this.restarts > 0 ? "I've restarted myself " + this.restarts + " times." :
    "I've never restarted. Hopefully I'll never have to.";
  }

  private getStarted() {
    return "I booted up at " + this.startedOn + "... or you may know it better as " + new Date(this.startedOn).toLocaleString() + ".";
  }

  private getLastRestart() {
    return  "The last time I restarted was on " + new Date(this.timeRestarted).toLocaleString() + ".";
  }
}
