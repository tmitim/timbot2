import { BotListener } from "../BotListener";

export class Analysis extends BotListener {
  name = "analysis";
  desc = "Shows my analysis";
  hidden = true;
  active = process.env.ANALYSIS_COMMAND != "off";
  channels = ['direct_message','direct_mention','mention'];

  private timeRestarted;
  private startedOn = Date.now();
  private restarts = 0;
  private botName = process.env.BOT_NAME || Math.random().toString(36).slice(2);

  start() {
    var analysis = this;
    analysis.controller.hears('analysis', analysis.channels, function(bot,message) {

      var messages =[];
      messages.push(analysis.getName());
      messages.push(analysis.getStarted());
      messages.push(analysis.getRestarts());
      if (analysis.timeRestarted) {
        messages.push(analysis.getLastRestart());
      }

      analysis.replyCode(bot, message, messages.join("\n"));
    });
  }

  incrementRestarts() {
    this.restarts++;
  }

  setRestartToNow() {
    this.timeRestarted = Date.now();
  }

  private getName() {
    return "Hi, I'm " + this.botName + ".";
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
