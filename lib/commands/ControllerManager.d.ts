export declare class ControllerManager {
    private static instance;
    private static controller;
    private constructor();
    static getInstance(): ControllerManager;
    setController(controller: any): void;
    getController(): any;
}
