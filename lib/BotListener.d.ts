export declare abstract class BotListener {
    name: String;
    desc: String;
    hidden: boolean;
    channels: String[];
    abstract start(): void;
    controller: any;
}
