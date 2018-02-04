import { ITab } from './itab';

export interface ITabController extends IEventEmitter {
  createTab(tab: ITab): void;
  removeTab(tab: ITab): void;
  openTab(tab: ITab): void;
  closeTab(tab: ITab): void;
  getTabs(): ITab[];
  getSelectedTab(): ITab;
}
