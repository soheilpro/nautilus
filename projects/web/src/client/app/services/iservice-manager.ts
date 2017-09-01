import { IActionController } from '../actions';
import { IActionManager } from '../actions';
import { IApplication } from '../application';
import { ICommandController, ICommandManager } from '../commands';
import { IContextManager } from '../context';
import { IDialogController } from '../dialog';
import { IIssueController } from '../issues';
import { IMilestoneController } from '../milestones';
import { INotificationController } from '../notifications';
import { ISearchController } from '../search';
import { IStorage } from '../storage';
import { IWindowController } from '../windows';

export interface IServiceManager {
  setActionController(actionController: IActionController): void;
  getActionController(): IActionController;

  setActionManager(actionManager: IActionManager): void;
  getActionManager(): IActionManager;

  setApplication(application: IApplication): void;
  getApplication(): IApplication;

  setCommandController(commandController: ICommandController): void;
  getCommandController(): ICommandController;

  setCommandManager(commandManager: ICommandManager): void;
  getCommandManager(): ICommandManager;

  setContextManager(contextManager: IContextManager): void;
  getContextManager(): IContextManager;

  setDialogController(dialogController: IDialogController): void;
  getDialogController(): IDialogController;

  setIssueController(issueController: IIssueController): void;
  getIssueController(): IIssueController;

  setMilestoneController(milestoneController: IMilestoneController): void;
  getMilestoneController(): IMilestoneController;

  setNotificationController(notificationController: INotificationController): void;
  getNotificationController(): INotificationController;

  setSearchController(searchController: ISearchController): void;
  getSearchController(): ISearchController;

  setSessionStorage(storage: IStorage): void;
  getSessionStorage(): IStorage;

  setLocalStorage(storage: IStorage): void;
  getLocalStorage(): IStorage;

  setRoamingStorage(storage: IStorage): void;
  getRoamingStorage(): IStorage;

  setWindowController(windowController: IWindowController): void;
  getWindowController(): IWindowController;
}
