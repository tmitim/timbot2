export abstract class BotListener {
  name: String;
  desc: String;
  hidden: boolean;
  channels: String[];
  abstract start(): void;
  controller;

  setController(controller) {
    this.controller = controller;
  }
}
