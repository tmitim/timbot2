# timbot2

Timbot2 makes it easy to create a bot with custom actions for your slack channel. Timbot2 uses [botkit](https://github.com/howdyai/botkit). It should restart on it's own if it disconnects. Look at [botkit's slack readme](https://github.com/howdyai/botkit/blob/master/readme-slack.md) to find information about what channels timbot2 custom actions should be set to and understand controller actions.

## Installation

- Install timbot2 globally.

```sh
npm install timbot2 --global

```

- Create a [custom integration bot]( https://slack.com/apps/build/custom-integration) at slack.
- Fill out the settings and save the api token.
- Save the token in an .env file saved in the directory timbot2 will run.
- Invite your bot to your slack channel.

### .env file
```
SLACK_TOKEN=token
```


## Create a custom command

Creating custom actions for your bot is very easy. Although it's possible to do this without using typescript, it's much easier with it.

- Create a new npm project (npm init)
- Save timbot2 (npm install --save timbot2)
- Save to dev typescript (npm install --save-dev typescript)
- Create your custom command using typescript
- **Custom command class name must be the same as its filename.**
- Compile (tsc)
- run (timbot2)

### Example - Pizza (Pizza.ts)
```
import {BotListener} from "timbot2/lib/BotListener";

export class Pizza extends BotListener {
  name = "pizza"; //required
  desc = "Yum, pizza"; // required

  // not required; defaults to false
  // if set true, doesn't show up in help
  hidden = true;

  // not required, defaults to true
  // if set to false, does run
  // in the custom listener, possibly use it in combo with env variable.
  active = true;

  // not extended from BotListener variable
  channels = ['direct_message','direct_mention','mention','ambient'];

  // required function
  start() {
    this.controller.hears('pizza', this.channels, function(bot,message) {
      bot.reply(message, "pizza? I want pizza.");
    });
  }
}
```

### Example - package.json
```
{
  "name": "timbot2-custom-examples",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "compile": "tsc"
  },
  "author": "tmitim",
  "license": "MIT",
  "dependencies": {
    "timbot2": "^0.1.0
  },
  "devDependencies": {
    "typescript": "^2.1.5"
  }
}

```

### Example tsconfig.json
```
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": false,
        "sourceMap": false
    }
}
```

### Note
- Due to the botkit, timbot2 will only take action to the first message it "hears". So if two custom actions overlap, only the first action can be heard.

## Dependencies

- [async](https://github.com/caolan/async): Higher-order functions and common patterns for asynchronous code
- [botkit](https://github.com/howdyai/botkit): Building blocks for Building Bots
- [dotenv](https://github.com/motdotla/dotenv): Loads environment variables from .env file

## Dev Dependencies

- [@types/node](https://www.github.com/DefinitelyTyped/DefinitelyTyped.git): TypeScript definitions for Node.js
- [typescript](https://github.com/Microsoft/TypeScript): TypeScript is a language for application scale JavaScript development


## License

MIT
