import * as React from 'react';
import { IUser, IUserChange } from '../../application';
import { Window, WindowHeader, WindowContent, WindowActionBar } from '../../framework/components/window';
import { IFormError } from '../../framework/forms';
import { Icon } from '../../framework/components/icon';
import { Input } from '../../framework/components/input';
import { Button } from '../../framework/components/button';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IAddEditUserWindowProps {
  mode: 'add' | 'edit';
  user?: IUser;
  onAdd?(user: IUser, window: AddEditUserWindow): void;
  onUpdate?(userChange: IUserChange, window: AddEditUserWindow): void;
  onClose(): void;
}

interface IAddEditUserWindowState {
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  errors?: IFormError[];
}

export class AddEditUserWindow extends React.PureComponent<IAddEditUserWindowProps, IAddEditUserWindowState> {
  constructor(props: IAddEditUserWindowProps) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handleNameInputChange = this.handleNameInputChange.bind(this);
    this.handleEMailSelectChange = this.handleEMailSelectChange.bind(this);

    const state: IAddEditUserWindowState = {
      errors: [],
    };

    if (props.user) {
      state.username = props.user.username;
      state.name = props.user.name;
      state.email = props.user.email;
    }

    this.state = state;
  }

  public showError(error: IFormError): void {
    this.setState({
      errors: [error],
    });
  }

  private handleFormSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    switch (this.props.mode) {
      case 'add':
        const user: IUser = {
          username: this.state.username || undefined,
          password: this.state.password || undefined,
          name: this.state.name || undefined,
          email: this.state.email || undefined,
        };

        this.props.onAdd(user, this);
        break;

      case 'edit':
        const userChange: IUserChange = {
          username: (this.state.username !== this.props.user.username ? this.state.username || '' : undefined),
          password: (this.state.password !== this.props.user.password ? this.state.password || '' : undefined),
          name: (this.state.name !== this.props.user.name ? this.state.name || '' : undefined),
          email: (this.state.email !== this.props.user.email ? this.state.email || null : undefined),
        };

        this.props.onUpdate(userChange, this);
        break;
    }
  }

  private handleUsernameInputChange(value: string): void {
    this.setState({
      username: value,
    });
  }

  private handlePasswordInputChange(value: string): void {
    this.setState({
      password: value,
    });
  }

  private handleNameInputChange(value: string): void {
    this.setState({
      name: value,
    });
  }

  private handleEMailSelectChange(value: string): void {
    this.setState({
      email: value,
    });
  }

  render(): JSX.Element {
    return (
      <Window className="add-edit-user-window-component">
        <WindowHeader>
          { this.props.mode === 'add' && 'New User' }
          { this.props.mode === 'edit' && 'Edit User' }
        </WindowHeader>
        <WindowContent>
          <div className="errors">
            {
              this.state.errors.map((error, index) => {
                return (
                  <div className="error-container" key={index}>
                    <div className="error">
                      <Icon name="exclamation" className="icon" />
                      {error.message}
                    </div>
                  </div>
                );
              })
            }
          </div>
          <form className="form" id="addEditUserForm" onSubmit={this.handleFormSubmit}>
            <div className="field">
              <div className="label">
                Username:
              </div>
              <div className="value">
                <Input className="username" value={this.state.username} autoFocus={true} selectOnFocus={true} onChange={this.handleUsernameInputChange} />
              </div>
              <div className="description">
                2 characters min. Starting with a letter.
              </div>
            </div>
            <div className="field">
              <div className="label">
                Password:
              </div>
              <div className="value">
                <Input className="password" value={this.state.password} secret={true} selectOnFocus={true} onChange={this.handlePasswordInputChange} />
              </div>
              <div className="description">
                8 characters min.
              </div>
            </div>
            <div className="field">
              <div className="label">
                Name:
              </div>
              <div className="value">
                <Input className="name" value={this.state.name} selectOnFocus={true} onChange={this.handleNameInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                EMail:
              </div>
              <div className="value">
                <Input className="email" value={this.state.email} selectOnFocus={true} onChange={this.handleEMailSelectChange} />
              </div>
            </div>
          </form>
        </WindowContent>
        <WindowActionBar>
          {
            this.props.mode === 'add' &&
              <Button type="submit" form="addEditUserForm">Add User</Button>
          }
          {
            this.props.mode === 'edit' &&
              <Button type="submit" form="addEditUserForm">Update User</Button>
          }
          <Button type="secondary" onClick={this.props.onClose}>Cancel</Button>
        </WindowActionBar>
      </Window>
    );
  }
}
