import { BotListener } from "../BotListener";
export declare class Analysis extends BotListener {
    name: string;
    desc: string;
    hidden: boolean;
    channels: string[];
    private timeRestarted;
    private startedOn;
    private restarts;
    start(): void;
    incrementRestarts(): void;
    setRestartToNow(): void;
    private getRestarts();
    private getStarted();
    private getLastRestart();
}
