import {BotListener} from "timbot2/lib/BotListener";

export class Pizza extends BotListener {
  name = "Pizza";
  desc = "Mmmm, pizza"
  hidden = true;
  active = true;

  channels = ['direct_message','direct_mention','mention','ambient'];

  start() {
    this.controller.hears('pizza', this.channels, function(bot,message) {
      // use from BotListener
      this.reply(bot, message, "pizza? I want pizza");

    // to use reply
    }.bind(this));
  }
}
