import * as React from 'react';
import { IProject, IProjectChange } from '../../application';
import { Window, WindowHeader, WindowContent, WindowActionBar } from '../../framework/components/window';
import { IFormError } from '../../framework/forms';
import { Icon } from '../../framework/components/icon';
import { Input } from '../../framework/components/input';
import { Button } from '../../framework/components/button';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IAddEditProjectWindowProps {
  mode: 'add' | 'edit';
  project?: IProject;
  onAdd?(project: IProject, window: AddEditProjectWindow): void;
  onUpdate?(projectChange: IProjectChange, window: AddEditProjectWindow): void;
  onClose(): void;
}

interface IAddEditProjectWindowState {
  name?: string;
  description?: string;
  errors?: IFormError[];
}

export class AddEditProjectWindow extends React.PureComponent<IAddEditProjectWindowProps, IAddEditProjectWindowState> {
  constructor(props: IAddEditProjectWindowProps) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleNameInputChange = this.handleNameInputChange.bind(this);
    this.handleDescriptionInputChange = this.handleDescriptionInputChange.bind(this);

    const state: IAddEditProjectWindowState = {
      errors: [],
    };

    if (props.project) {
      state.name = props.project.name;
      state.description = props.project.description;
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
        const project: IProject = {
          name: this.state.name || undefined,
          description: this.state.description || undefined,
        };

        this.props.onAdd(project, this);
        break;

      case 'edit':
        const projectChange: IProjectChange = {
          name: (this.state.name !== this.props.project.name ? this.state.name || '' : undefined),
          description: (this.state.description !== this.props.project.description ? this.state.description || '' : undefined),
        };

        this.props.onUpdate(projectChange, this);
        break;
    }
  }

  private handleNameInputChange(value: string): void {
    this.setState({
      name: value,
    });
  }

  private handleDescriptionInputChange(value: string): void {
    this.setState({
      description: value,
    });
  }

  render(): JSX.Element {
    return (
      <Window className="add-edit-project-window-component">
        <WindowHeader>
          { this.props.mode === 'add' && 'New Project' }
          { this.props.mode === 'edit' && 'Edit Project' }
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
          <form className="form" id="addEditProjectForm" onSubmit={this.handleFormSubmit}>
            <div className="field">
              <div className="label">
                Name:
              </div>
              <div className="value">
                <Input className="name" value={this.state.name} autoFocus={true} selectOnFocus={true} onChange={this.handleNameInputChange} />
              </div>
              <div className="hint">
              </div>
            </div>
            <div className="field">
              <div className="label">
                Description:
              </div>
              <div className="value">
                <Input className="description" value={this.state.description} selectOnFocus={true} onChange={this.handleDescriptionInputChange} />
              </div>
              <div className="hint">
              </div>
            </div>
          </form>
        </WindowContent>
        <WindowActionBar>
          {
            this.props.mode === 'add' &&
              <Button type="submit" form="addEditProjectForm">Add Project</Button>
          }
          {
            this.props.mode === 'edit' &&
              <Button type="submit" form="addEditProjectForm">Update Project</Button>
          }
          <Button type="secondary" onClick={this.props.onClose}>Cancel</Button>
        </WindowActionBar>
      </Window>
    );
  }
}
