import {BotListener} from "timbot2/lib/BotListener";

export class Pizza extends BotListener {
  name = "pizza";
  desc = "Yum, pizza";
  hidden = true;
  channels = ['direct_message','direct_mention','mention','ambient'];

  start() {
    this.controller.hears('pizza', this.channels, function(bot,message) {
      bot.reply(message, "pizza? I want pizza.");
    });
  }
}
