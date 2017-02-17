export declare abstract class BotListener {
    name: String;
    desc: String;
    hidden: boolean;
    abstract start(): void;
    controller: any;
    type: string;
    active: boolean;
    setController(controller: any): void;
    isValid(): boolean;
    reply(bot: any, message: any, slackMessage: any): void;
    replyCode(bot: any, message: any, slackMessage: String): void;
}
