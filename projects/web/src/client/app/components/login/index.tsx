import * as React from 'react';
import { ServiceManager } from '../../services';
import Input from '../input';
import Button from '../button';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ILoginProps {
}

interface ILoginState {
  username?: string;
  password?: string;
  error?: string;
}

export default class Login extends React.PureComponent<ILoginProps, ILoginState> {
  private application = ServiceManager.Instance.getApplication();

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

  private handleUsernameChange(value: string) {
    this.setState({
      username: value,
    });
  }

  private handlePasswordChange(value: string) {
    this.setState({
      password: value,
    });
  }

  private async handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (this.state.username.trim().length === 0) {
      return this.setState({
        error: 'Plese enter your username.'
      });
    }

    if (this.state.password.trim().length === 0) {
      return this.setState({
        error: 'Plese enter your password.'
      });
    }

    const session = await this.application.logIn(this.state.username, this.state.password);

    if (!session) {
      this.setState({
        error: 'Wrong username and/or password.'
      });
    }
  }

  render() {
    return (
      <div className="login-component">
        <div className="container">
            <div className="title">nautilus</div>
            <form onSubmit={this.handleFormSubmit}>
                {
                  this.state.error &&
                    <div className="error">{this.state.error}</div>
                }
                <Input className="username" placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange} />
                <Input className="password" placeholder="Password" secret={true} value={this.state.password} onChange={this.handlePasswordChange} />
                <Button className="submit" type="submit">Log In</Button>
            </form>
          </div>
      </div>
    );
  }
};
