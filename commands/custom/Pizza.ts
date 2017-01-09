import { BotListener } from "../BotListener"

export class Pizza implements BotListener {
  name = "pizza";
  desc = "Yum, pizza";
  hidden = true;
  channels = ['direct_message','direct_mention','mention','ambient'];
  controller;

  constructor( controller ){
    this.controller = controller;
  }

  start() {
    this.controller.hears('pizza', this.channels, function(bot,message) {
      bot.reply(message, "pizza? I want pizza.");
    });
  }
}
