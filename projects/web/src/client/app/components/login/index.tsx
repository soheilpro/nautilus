import * as React from 'react';
import { ServiceManager } from '../../services';
import { Input } from '../../framework/components/input';
import { Button } from '../../framework/components/button';
import { IApplication } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ILoginProps {
}

interface ILoginState {
  username?: string;
  password?: string;
  error?: string;
}

export class Login extends React.PureComponent<ILoginProps, ILoginState> {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');

  constructor() {
    super();

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    this.state = {
      username: '',
      password: '',
    };
  }

  private handleUsernameChange(value: string): void {
    this.setState({
      username: value,
    });
  }

  private handlePasswordChange(value: string): void {
    this.setState({
      password: value,
    });
  }

  private async handleFormSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (this.state.username.trim().length === 0) {
      return this.setState({
        error: 'Plese enter your username.',
      });
    }

    if (this.state.password.trim().length === 0) {
      return this.setState({
        error: 'Plese enter your password.',
      });
    }

    const session = await this.application.logIn(this.state.username, this.state.password);

    if (!session) {
      this.setState({
        error: 'Wrong username and/or password.',
      });
    }
  }

  render(): JSX.Element {
    return (
      <div className="login-component">
        <div className="container">
            <div className="title">nautilus</div>
            <form onSubmit={this.handleFormSubmit}>
              <div className="errors">
                {
                  this.state.error &&
                    <div className="error">{this.state.error}</div>
                }
              </div>
              <Input className="username" placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange} />
              <Input className="password" placeholder="Password" secret={true} value={this.state.password} onChange={this.handlePasswordChange} />
              <Button className="submit" type="submit">Log In</Button>
            </form>
          </div>
      </div>
    );
  }
}
