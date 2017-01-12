import {ControllerManager} from "./ControllerManager";

export abstract class BotListener {
  name: String;
  desc: String;
  hidden: boolean;
  channels: String[];
  abstract start(): void;
  controller = ControllerManager.getInstance().getController();
}
