import { BotListener } from "../../BotListener";
export declare class Pizza extends BotListener {
    name: string;
    desc: string;
    hidden: boolean;
    channels: string[];
    start(): void;
}
