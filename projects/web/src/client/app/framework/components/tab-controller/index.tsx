import * as _ from 'underscore';
import * as React from 'react';
import EventEmitter = require('wolfy87-eventemitter');
import { History } from 'history';
import { ServiceManager } from '../../../services';
import { ITabController, ITab } from '../../tabs';

interface ITabControllerProps {
  history: History;
}

interface ITabControllerState {
}

export class TabController extends React.PureComponent<ITabControllerProps, ITabControllerState> implements ITabController {
  private eventEmitter = new EventEmitter();
  private tabs: ITab[] = [];

  componentWillMount(): void {
    ServiceManager.Instance.registerService('ITabController', this);
  }

  componentWillUnmount(): void {
    ServiceManager.Instance.unregisterService('ITabController', this);
  }

  createTab(tab: ITab): void {
    if (this.tabs.some(x => x.key === tab.key))
      return;

    this.tabs = [...this.tabs, tab];

    this.eventEmitter.emit('change');
  }

  removeTab(tab: ITab): void {
    this.tabs = this.tabs.filter(x => x.key !== tab.key);

    this.eventEmitter.emit('change');
  }

  openTab(tab: ITab): void {
    this.createTab(tab);
    this.props.history.push(tab.url);
  }

  closeTab(tab: ITab): void {
    const tabIndex = _.findIndex(this.tabs, x => x.key === tab.key);
    const nextTab = (tabIndex === this.tabs.length - 1) ? this.tabs[tabIndex - 1] : this.tabs[tabIndex + 1];

    this.removeTab(tab);
    this.props.history.push(nextTab ? nextTab.url : '/');
  }

  getTabs(): ITab[] {
    return this.tabs;
  }

  getSelectedTab(): ITab {
    return _.find(this.tabs, tab => tab.url === this.props.history.location.pathname);
  }

  on(event: string, listener: Function): void {
    this.eventEmitter.on(event, listener);
  }

  off(event: string, listener: Function): void {
    this.eventEmitter.off(event, listener);
  }

  render(): JSX.Element {
    return (
      <div className="tab-controller-component">
      </div>
    );
  }
}
