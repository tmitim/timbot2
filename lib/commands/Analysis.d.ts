import { BotListener } from "../BotListener";
export declare class Analysis extends BotListener {
    name: string;
    desc: string;
    hidden: boolean;
    active: boolean;
    channels: string[];
    private timeRestarted;
    private startedOn;
    private restarts;
    private botName;
    start(): void;
    incrementRestarts(): void;
    setRestartToNow(): void;
    private getName();
    private getRestarts();
    private getStarted();
    private getLastRestart();
}
