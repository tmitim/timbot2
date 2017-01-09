import weather = require('weather-js');
import { BotListener } from "../BotListener";

export class Weather implements BotListener {
  name = "weather";
  desc = "Shows weather information";
  hidden = false;
  channels = ['direct_message','direct_mention','mention'];
  controller;

  constructor( controller ){
    this.controller = controller;
  }

  start(){
    var weatherCommand = this;
    weather.find({search: 'Los Angeles, CA', degreeType: 'F'}, function(err, result) {
      weatherCommand.controller.hears('weather', weatherCommand.channels, function(bot,message) {
        if(err) {
          console.log(err);
        } else {
          bot.reply(message, "Feels like " + result[0].current.feelslike + result[0].location.degreetype + " here in " +
            result[0].location.name + ". (" + result[0].forecast[0].high + "/" + result[0].forecast[0].low + ")");

          for (var day = 1; day < result[0].forecast.length; day++) {
            if (result[0].forecast[day].precip >= 50) {
              (day === 1) ?
                bot.reply(message, "Looks like it might rain today") :
                bot.reply(message, "Looks like it might rain on " + result[0].forecast[day].day);

              break;
            }
          }
        }
      });
    })
  }
}
