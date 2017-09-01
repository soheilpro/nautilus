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
import { IServiceManager } from './iservice-manager';
import { IStorage } from '../storage';
import { IWindowController } from '../windows';

export class ServiceManager implements IServiceManager {
  static Instance: IServiceManager;

  private actionController: IActionController;
  private actionManager: IActionManager;
  private application: IApplication;
  private commandController: ICommandController;
  private commandManager: ICommandManager;
  private contextManager: IContextManager;
  private dialogController: IDialogController;
  private issueController: IIssueController;
  private localStorage: IStorage;
  private milestoneController: IMilestoneController;
  private notificationController: INotificationController;
  private roamingStorage: IStorage;
  private searchController: ISearchController;
  private sessionStorage: IStorage;
  private windowController: IWindowController;

  setActionController(actionController: IActionController) {
    this.actionController = actionController;
  }

  getActionController() {
    return this.actionController;
  }

  setActionManager(actionManager: IActionManager) {
    this.actionManager = actionManager;
  }

  getActionManager() {
    return this.actionManager;
  }

  setApplication(application: IApplication) {
    this.application = application;
  }

  getApplication() {
    return this.application;
  }

  setCommandController(commandController: ICommandController) {
    this.commandController = commandController;
  }

  getCommandController() {
    return this.commandController;
  }

  setCommandManager(commandManager: ICommandManager) {
    this.commandManager = commandManager;
  }

  getCommandManager() {
    return this.commandManager;
  }

  setContextManager(contextManager: IContextManager) {
    this.contextManager = contextManager;
  }

  getContextManager() {
    return this.contextManager;
  }

  setDialogController(dialogController: IDialogController) {
    this.dialogController = dialogController;
  }

  getDialogController() {
    return this.dialogController;
  }

  setIssueController(issueController: IIssueController) {
    this.issueController = issueController;
  }

  getIssueController() {
    return this.issueController;
  }

  setMilestoneController(milestoneController: IMilestoneController) {
    this.milestoneController = milestoneController;
  }

  getMilestoneController() {
    return this.milestoneController;
  }

  setNotificationController(notificationController: INotificationController) {
    this.notificationController = notificationController;
  }

  getNotificationController() {
    return this.notificationController;
  }

  setSearchController(searchController: ISearchController) {
    this.searchController = searchController;
  }

  getSearchController() {
    return this.searchController;
  }

  setSessionStorage(storage: IStorage) {
    this.sessionStorage = storage;
  }

  getSessionStorage(): IStorage {
    return this.sessionStorage;
  }

  setLocalStorage(storage: IStorage) {
    this.localStorage = storage;
  }

  getLocalStorage(): IStorage {
    return this.localStorage;
  }

  setRoamingStorage(storage: IStorage) {
    this.roamingStorage = storage;
  }

  getRoamingStorage(): IStorage {
    return this.roamingStorage;
  }

  setWindowController(windowController: IWindowController) {
    this.windowController = windowController;
  }

  getWindowController() {
    return this.windowController;
  }
}
