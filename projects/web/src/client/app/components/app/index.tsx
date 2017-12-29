import * as React from 'react';
import { ServiceManager } from '../../services';
import Login from '../login';
import Main from '../main';
import Splash from '../splash';
import { IApplication, ISession } from '../../application';
import { ILocalStorage } from '../../framework/storage';

interface IAppProps {
}

interface IAppState {
}

export default class App extends React.PureComponent<IAppProps, IAppState> {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private localStorage = ServiceManager.Instance.getService<ILocalStorage>('ILocalStorage');

  constructor() {
    super();

    this.handleApplicationInitialize = this.handleApplicationInitialize.bind(this);
    this.handleApplicationLogIn = this.handleApplicationLogIn.bind(this);
    this.handleApplicationLoad = this.handleApplicationLoad.bind(this);

    this.state = {};
  }

  componentWillMount(): void {
    this.application.on('initialize', this.handleApplicationInitialize);
    this.application.on('login', this.handleApplicationLogIn);
    this.application.on('load', this.handleApplicationLoad);
  }

  componentWillUnmount(): void {
    this.application.off('initialize', this.handleApplicationInitialize);
    this.application.off('login', this.handleApplicationLogIn);
    this.application.off('load', this.handleApplicationLoad);
  }

  private handleApplicationInitialize(): void {
    this.forceUpdate();
  }

  private handleApplicationLogIn(session: ISession): void {
    this.localStorage.set('session', session);

    this.forceUpdate();
  }

  private handleApplicationLoad(): void {
    this.forceUpdate();
  }

  render(): JSX.Element {
    if (!this.application.isInitialized())
      return <span />;

    if (!this.application.isLoggedIn())
      return <Login />;

    if (!this.application.isLoaded())
      return <Splash />;

    return <Main />;
  }
}
