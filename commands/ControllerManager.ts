export class ControllerManager {
  private static instance: ControllerManager;
  private static controller;

  private constructor() {
  }

  static getInstance() {
    if (!ControllerManager.instance) {
      ControllerManager.instance = new ControllerManager();
    }
    return ControllerManager.instance;
  }

  setController(controller) {
    ControllerManager.controller = controller;
  }

  getController() {
    return ControllerManager.controller;
  }
}
