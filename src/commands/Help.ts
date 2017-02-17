import { BotListener } from "../BotListener";
import async = require('async');

export class Help extends BotListener {
  name = "help";
  desc = "Shows this help menu";
  hidden = true;
  active = process.env.HELP_COMMAND != 'off';
  channels = ['direct_message','direct_mention','mention'];

  private commands : BotListener[];

  start() {
    var help = this;
    help.controller.hears('help', help.channels, function(bot,message) {
      var commandString = "";
      help.commands
      .filter(function(cmd) {
        return (!cmd.hidden || message.text.indexOf("-h") != -1);
      })
      .filter(function(cmd) {
        return cmd.active;
      })
      .sort(function (a, b) {
        var commandA = a.name.toUpperCase();
        var commandB = b.name.toUpperCase();
        if (commandA < commandB) {
          return -1;
        }
        if (commandA > commandB) {
          return 1;
        }
        return 0;
      })
      .forEach(function(cmd) {
        commandString += help.padColumn(cmd.name, 18) + cmd.desc + "\n";
      })

      help.replyCode(bot, message, commandString);
    });
  }

  setAvailableCommands(commands : BotListener[]) {
    this.commands = commands;
  }

  private padColumn(cmd, length) {
    cmd += "                ";
    return cmd.substring(0, length);
  }
}
