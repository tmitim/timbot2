import { BotListener } from "./BotListener"

class Pizza implements BotListener {
  name = "pizza";
  desc = "Yum, pizza";
  hidden = true;
  channels;
  controller;

  constructor( controller ){
    this.channels = ['direct_message','direct_mention','mention','ambient'];
    this.controller = controller;
  }

  start() {
    this.controller.hears('pizza', this.channels, function(bot,message) {
      bot.reply(message, "pizza? I want pizza.");
    });
  }
}
