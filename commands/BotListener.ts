export interface BotListener {
  name: String;
  desc: String;
  hidden: boolean;
  channels: String[];
  start(): void;
}
