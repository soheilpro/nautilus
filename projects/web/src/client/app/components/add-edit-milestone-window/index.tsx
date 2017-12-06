import * as React from 'react';
import { IProject, IItemState, IMilestone, IMilestoneChange, IApplication } from '../../application';
import { ServiceManager } from '../../services';
import Window, { WindowHeader, WindowContent, WindowActionBar } from '../../framework/components/window';
import Input from '../../framework/components/input';
import ProjectSelect from '../project-select';
import ItemStateSelect from '../item-state-select';
import Button from '../../framework/components/button';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IAddEditMilestoneWindowProps {
  mode: 'add' | 'edit';
  milestone?: IMilestone;
  onAdd?(milestone: IMilestone): void;
  onUpdate?(milestoneChange: IMilestoneChange): void;
  onClose(): void;
}

interface IAddEditMilestoneWindowState {
  projects?: IProject[];
  itemStates?: IItemState[];
  title?: string;
  description?: string;
  project?: IProject;
  state?: IItemState;
}

export default class AddEditMilestoneWindow extends React.PureComponent<IAddEditMilestoneWindowProps, IAddEditMilestoneWindowState> {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');

  constructor(props: IAddEditMilestoneWindowProps) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
    this.handleDescriptionInputChange = this.handleDescriptionInputChange.bind(this);
    this.handleProjectSelectChange = this.handleProjectSelectChange.bind(this);
    this.handleStateInputChange = this.handleStateInputChange.bind(this);

    const state: IAddEditMilestoneWindowState = {
      projects: [],
      itemStates: [],
    };

    if (props.milestone) {
      state.title = props.milestone.title;
      state.description = props.milestone.description;
      state.project = props.milestone.project;
      state.state = props.milestone.state;
    }

    this.state = state;
  }

  componentDidMount() {
    this.setState(state => {
      return {
        projects: this.application.projects.getAll(),
        itemStates: this.application.itemStates.getAll('milestone'),
      };
    });
  }

  private handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    switch (this.props.mode) {
      case 'add':
        const milestone: IMilestone = {
          title: this.state.title || undefined,
          description: this.state.description || undefined,
          project: this.state.project || undefined,
          state: this.state.state || undefined,
        };

        this.props.onAdd(milestone);
        break;

      case 'edit':
        const milestoneChange: IMilestoneChange = {
          title: (this.state.title !== this.props.milestone.title ? this.state.title || '' : undefined),
          description: (this.state.description !== this.props.milestone.description ? this.state.description || '' : undefined),
          project: (this.state.project !== this.props.milestone.project ? this.state.project || null : undefined),
          state: (this.state.state !== this.props.milestone.state ? this.state.state || null : undefined),
        };

        this.props.onUpdate(milestoneChange);
        break;
    }
  }

  private handleTitleInputChange(value: string) {
    this.setState({
      title: value,
    });
  }

  private handleDescriptionInputChange(value: string) {
    this.setState({
      description: value,
    });
  }

  private handleProjectSelectChange(value: IProject) {
    this.setState({
      project: value,
    });
  }

  private handleStateInputChange(value: IItemState) {
    this.setState({
      state: value,
    });
  }

  render() {
    return (
      <Window className="add-edit-milestone-window-component">
        <WindowHeader>
          { this.props.mode === 'add' && 'New Milestone' }
          { this.props.mode === 'edit' && `Edit Milestone #${this.props.milestone.sid}` }
        </WindowHeader>
        <WindowContent>
          <form className="form" id="addEditMilestoneForm" onSubmit={this.handleFormSubmit}>
            <div className="field">
              <div className="label">
                Title:
              </div>
              <div className="value">
                <Input className="title" value={this.state.title} autoFocus={true} selectOnFocus={true} onChange={this.handleTitleInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Description:
              </div>
              <div className="value">
                <Input className="description" value={this.state.description} multiline={true} selectOnFocus={true} onChange={this.handleDescriptionInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Project:
              </div>
              <div className="value">
                <ProjectSelect className="project" projects={this.state.projects} project={this.state.project} onChange={this.handleProjectSelectChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                State:
              </div>
              <div className="value">
                <ItemStateSelect className="state" itemStates={this.state.itemStates} itemState={this.state.state} onChange={this.handleStateInputChange} />
              </div>
            </div>
          </form>
        </WindowContent>
        <WindowActionBar>
          {
            this.props.mode === 'add' &&
              <Button type="submit" form="addEditMilestoneForm">Add Milestone</Button>
          }
          {
            this.props.mode === 'edit' &&
              <Button type="submit" form="addEditMilestoneForm">Update Milestone</Button>
          }
          <Button type="secondary" onClick={this.props.onClose}>Cancel</Button>
        </WindowActionBar>
      </Window>
    );
  }
};
