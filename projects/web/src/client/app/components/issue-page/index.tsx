import * as React from 'react';
import * as NQL from '../../nql';
import { MasterPage } from '../master-page';
import { ServiceManager } from '../../services';
import { ITabController, ITab } from '../../framework/tabs';
import { IApplication, IIssue } from '../../application';
import { IssueType } from '../../modules/issues';
import { IContextManager, IContext } from '../../framework/context';
import { LoadingPage } from '../loading-page';
import { NotFoundPage } from '../not-found-page';
import { SidField } from '../sid-field';
import { TitleField } from '../title-field';
import { DescriptionField } from '../description-field';
import { ProjectField } from '../project-field';
import { ItemTypeField } from '../item-type-field';
import { ItemStateField } from '../item-state-field';
import { UserField } from '../user-field';
import { MilestoneField } from '../milestone-field';
import { DateTimeField } from '../date-time-field';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssuePageProps {
  match: {
    params: {
      issueId: string;
    };
  };
}

interface IIssuePageState {
  issue?: IIssue;
}

export class IssuePage extends React.Component<IIssuePageProps, IIssuePageState> {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private tabController = ServiceManager.Instance.getService<ITabController>('ITabController');
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');

  private static stateToStatus: { [key: string]: string } = {
    'todo': 'pending',
    'doing': 'inprogress',
    'done': 'finished',
    'closed': 'closed',
  };

  constructor() {
    super();

    this.handleApplicationLoad = this.handleApplicationLoad.bind(this);
    this.handleApplicationIssueUpdate = this.handleApplicationIssueUpdate.bind(this);
    this.handleApplicationIssueDelete = this.handleApplicationIssueDelete.bind(this);

    this.state = {};
  }

  componentWillMount(): void {
    this.contextManager.registerContextProvider(this);
    this.application.on('load', this.handleApplicationLoad);
    this.application.items.on('issue.update', this.handleApplicationIssueUpdate);
    this.application.items.on('issue.delete', this.handleApplicationIssueDelete);
    this.createTab(this.props.match.params.issueId);
  }

  componentDidMount(): void {
    this.loadIssue(this.props.match.params.issueId);
  }

  componentWillReceiveProps(props: IIssuePageProps): void {
    this.createTab(props.match.params.issueId);
    this.loadIssue(props.match.params.issueId);
  }

  componentWillUnmount(): void {
    this.application.items.off('issue.delete', this.handleApplicationIssueDelete);
    this.application.items.off('issue.update', this.handleApplicationIssueUpdate);
    this.application.off('load', this.handleApplicationLoad);
    this.contextManager.unregisterContextProvider(this);
  }

  private createTab(issueId: string): void {
    const tab: ITab = {
      key: `issue-${issueId}`,
      title: `#${issueId}`,
      url: `/${issueId}`,
    };

    this.tabController.createTab(tab);
  }

  private async loadIssue(issueId: string): Promise<void> {
    const filter = new NQL.ComparisonExpression(
      new NQL.LocalExpression('sid'),
      new NQL.ConstantExpression(Number(issueId), 'Number'),
      'eq'
    );

    const issues = await this.application.items.getAllIssues(filter, null);
    const issue = issues.length > 0 ? issues[0] : null;

    this.setState({
      issue: issue,
    });
  }

  getContext(): IContext {
    return {
      'core.activeItemType': IssueType,
      'core.activeItem': this.state.issue,
    };
  }

  private handleApplicationLoad(): void {
    this.loadIssue(this.props.match.params.issueId);
  }

  private handleApplicationIssueUpdate({ issue }: { issue: IIssue }): void {
    this.loadIssue(this.props.match.params.issueId);
  }

  private handleApplicationIssueDelete({ issue }: { issue: IIssue }): void {
    const tab: ITab = {
      key: `issue-${issue.sid}`,
      title: `#${issue.sid}`,
      url: `/${issue.sid}`,
    };

    this.tabController.closeTab(tab);
  }

  render(): JSX.Element {
    if (this.state.issue === undefined) {
      return (
        <LoadingPage />
      );
    }

    if (this.state.issue === null) {
      return (
        <NotFoundPage />
      );
    }

    return (
      <MasterPage>
        <div className="issue-page-component">
          <div className="container">
            <div className="main">
              <div className="sid">
                <SidField sid={this.state.issue.sid} bold={true} />
              </div>
              <div className="title">
                <TitleField title={this.state.issue.title} status={IssuePage.stateToStatus[this.state.issue.state ? this.state.issue.state.key : null]} />
              </div>
              <div className="description">
                <DescriptionField description={this.state.issue.description} />
              </div>
            </div>
            <div className="side">
              <div className="group">
                <div className="label">Project:</div>
                <div className="value"><ProjectField project={this.state.issue.project} /></div>
              </div>
              <div className="group">
                <div className="label">Type:</div>
                <div className="value"><ItemTypeField itemType={this.state.issue.type} /></div>
              </div>
              <div className="group">
                <div className="label">State:</div>
                <div className="value"><ItemStateField itemState={this.state.issue.state} /></div>
              </div>
              <div className="group">
                <div className="label">Assigned to:</div>
                <div className="value"><UserField user={this.state.issue.assignedTo} /></div>
              </div>
              <div className="group">
                <div className="label">Milestone:</div>
                <div className="value"><MilestoneField milestone={this.state.issue.milestone} /></div>
              </div>
              <div className="divider"></div>
              <div className="group">
                <div className="label">Created by:</div>
                <div className="value"><UserField user={this.state.issue.createdBy} /></div>
                <div className="value"><DateTimeField dateTime={this.state.issue.meta.insertDateTime} /></div>
              </div>
              {
                this.state.issue.modifiedBy &&
                  <div className="group">
                    <div className="label">Modified by:</div>
                    <div className="value"><UserField user={this.state.issue.modifiedBy} /></div>
                    <div className="value"><DateTimeField dateTime={this.state.issue.meta.updateDateTime} /></div>
                  </div>
              }
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
}
