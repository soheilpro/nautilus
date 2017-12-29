import * as React from 'react';
import * as NQL from '../../nql';
import { IProject, IItemState, IItemType, IIssue, IIssueChange, IMilestone, IUser, entityComparer, IApplication } from '../../application';
import { ServiceManager } from '../../services';
import { Window, WindowHeader, WindowContent, WindowActionBar } from '../../framework/components/window';
import { Input } from '../../framework/components/input';
import { ProjectSelect } from '../project-select';
import { ItemTypeSelect } from '../item-type-select';
import { ItemStateSelect } from '../item-state-select';
import { MilestoneSelect } from '../milestone-select';
import { UserSelect } from '../user-select';
import { Button } from '../../framework/components/button';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IAddEditIssueWindowProps {
  mode: 'add' | 'edit';
  issue?: IIssue;
  parentIssue?: IIssue;
  onAdd?(issue: IIssue, window: AddEditIssueWindow): void;
  onUpdate?(issueChange: IIssueChange, window: AddEditIssueWindow): void;
  onClose(): void;
}

interface IAddEditIssueWindowState {
  projects?: IProject[];
  itemTypes?: IItemType[];
  itemStates?: IItemState[];
  users?: IUser[];
  milestones?: IMilestone[];
  title?: string;
  description?: string;
  project?: IProject;
  type?: IItemType;
  state?: IItemState;
  assignedTo?: IUser;
  milestone?: IMilestone;
}

export class AddEditIssueWindow extends React.PureComponent<IAddEditIssueWindowProps, IAddEditIssueWindowState> {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');

  constructor(props: IAddEditIssueWindowProps) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
    this.handleDescriptionInputChange = this.handleDescriptionInputChange.bind(this);
    this.handleProjectSelectChange = this.handleProjectSelectChange.bind(this);
    this.handleTypeInputChange = this.handleTypeInputChange.bind(this);
    this.handleStateInputChange = this.handleStateInputChange.bind(this);
    this.handleAssignedToInputChange = this.handleAssignedToInputChange.bind(this);
    this.handleMilestoneInputChange = this.handleMilestoneInputChange.bind(this);

    const state: IAddEditIssueWindowState = {
      projects: [],
      itemTypes: [],
      itemStates: [],
      users: [],
      milestones: [],
    };

    if (props.issue) {
      state.title = props.issue.title;
      state.description = props.issue.description;
      state.project = props.issue.project;
      state.type = props.issue.type;
      state.state = props.issue.state;
      state.assignedTo = props.issue.assignedTo;
      state.milestone = props.issue.milestone;
    }

    this.state = state;
  }

  componentDidMount(): void {
    this.setState(state => {
      return {
        projects: this.application.projects.getAll(),
        itemTypes: this.application.itemTypes.getAll('issue'),
        itemStates: this.application.itemStates.getAll('issue'),
        users: this.application.users.getAll(null, [new NQL.SortExpression(new NQL.LocalExpression('username'))]),
        milestones: this.getMilestones(state.project),
      };
    });
  }

  private handleFormSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    switch (this.props.mode) {
      case 'add':
        const issue: IIssue = {
          title: this.state.title || undefined,
          description: this.state.description || undefined,
          project: this.state.project || undefined,
          type: this.state.type || undefined,
          state: this.state.state || undefined,
          assignedTo: this.state.assignedTo || undefined,
          milestone: this.state.milestone || undefined,
        };

        this.props.onAdd(issue, this);
        break;

      case 'edit':
        const issueChange: IIssueChange = {
          title: (this.state.title !== this.props.issue.title ? this.state.title || '' : undefined),
          description: (this.state.description !== this.props.issue.description ? this.state.description || '' : undefined),
          project: (this.state.project !== this.props.issue.project ? this.state.project || null : undefined),
          type: (this.state.type !== this.props.issue.type ? this.state.type || null : undefined),
          state: (this.state.state !== this.props.issue.state ? this.state.state || null : undefined),
          assignedTo: (this.state.assignedTo !== this.props.issue.assignedTo ? this.state.assignedTo || null : undefined),
          milestone: (this.state.milestone !== this.props.issue.milestone ? this.state.milestone || null : undefined),
        };

        this.props.onUpdate(issueChange, this);
        break;
    }
  }

  private handleTitleInputChange(value: string): void {
    this.setState({
      title: value,
    });
  }

  private handleDescriptionInputChange(value: string): void {
    this.setState({
      description: value,
    });
  }

  private handleProjectSelectChange(value: IProject): void {
    this.setState({
      project: value,
      milestones: this.getMilestones(value),
    });
  }

  private handleTypeInputChange(value: IItemType): void {
    this.setState({
      type: value,
    });
  }

  private handleStateInputChange(value: IItemState): void {
    this.setState({
      state: value,
    });
  }

  private handleAssignedToInputChange(value: IItemState): void {
    this.setState({
      assignedTo: value,
    });
  }

  private handleMilestoneInputChange(value: IMilestone): void {
    this.setState({
      milestone: value,
    });
  }

  private getMilestones(project: IProject): IMilestone[] {
    const milestones = this.application.items.getAllMilestones(null, [new NQL.SortExpression(new NQL.LocalExpression('fullTitle'))]);

    if (!project)
      return milestones;

    return milestones.filter(milestone => !milestone.project || entityComparer(milestone.project, project));
  }

  render(): JSX.Element {
    return (
      <Window className="add-edit-issue-window-component">
        <WindowHeader>
          {
            this.props.mode === 'add' &&
              (!this.props.parentIssue ? 'New Issue' : 'New Sub-Issue')
          }
          {
            this.props.mode === 'edit' &&
              `Edit Issue #${this.props.issue.sid}`
          }
        </WindowHeader>
        <WindowContent>
          <form className="form" id="addEditIssueForm" onSubmit={this.handleFormSubmit}>
            {
              this.props.parentIssue &&
                <div className="field">
                  <div className="label">
                    Parent:
                  </div>
                  <div className="value">
                    <div className="parent">
                      <span className="sid">#{this.props.parentIssue.sid}</span> {this.props.parentIssue.title}
                    </div>
                  </div>
                </div>
            }
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
                Type:
              </div>
              <div className="value">
                <ItemTypeSelect className="type" itemTypes={this.state.itemTypes} itemType={this.state.type} onChange={this.handleTypeInputChange} />
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
            <div className="field">
              <div className="label">
                Assigned To:
              </div>
              <div className="value">
                <UserSelect className="assigned-to-state" users={this.state.users} user={this.state.assignedTo} onChange={this.handleAssignedToInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Milestone:
              </div>
              <div className="value">
                <MilestoneSelect className="state" milestones={this.state.milestones} milestone={this.state.milestone} onChange={this.handleMilestoneInputChange} />
              </div>
            </div>
          </form>
        </WindowContent>
        <WindowActionBar>
          {
            this.props.mode === 'add' &&
              <Button type="submit" form="addEditIssueForm">Add Issue</Button>
          }
          {
            this.props.mode === 'edit' &&
              <Button type="submit" form="addEditIssueForm">Update Issue</Button>
          }
          <Button type="secondary" onClick={this.props.onClose}>Cancel</Button>
        </WindowActionBar>
      </Window>
    );
  }
}
