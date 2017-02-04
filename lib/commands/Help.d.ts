import { BotListener } from "../BotListener";
export declare class Help extends BotListener {
    name: string;
    desc: string;
    hidden: boolean;
    active: boolean;
    channels: string[];
    private commands;
    start(): void;
    setAvailableCommands(commands: BotListener[]): void;
    private padColumn(cmd, length);
}
