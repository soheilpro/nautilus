import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IIssue, entityComparer } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import ArrayHelper from '../../utilities/array-helper';
import CopyIssueSidCommand from '../../issues/copy-issue-sid-command';
import DeleteIssueCommand from '../../issues/delete-issue-command';
import DuplicateIssueCommand from '../../issues/duplicate-issue-command';
import EditIssueCommand from '../../issues/edit-issue-command';
import NewIssueCommand from '../../issues/new-issue-command';
import NewSubIssueCommand from '../../issues/new-sub-issue-command';
import UpdateIssueCommand from '../../issues/update-issue-command';
import IssueViewSettings, { IView, View } from '../issue-view-settings';
import IssueDetail from '../issue-detail';
import IssueTable from '../issue-table';
import MasterPage from '../master-page';
import CommandButton from '../command-button';
import Icon from '../icon';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssuesPageProps {
}

interface IIssuesPageState {
  issues?: IIssue[];
  selectedIssue?: IIssue;
  view?: IView;
  savedViews?: IView[];
}

export default class IssuesPage extends React.Component<IIssuesPageProps, IIssuesPageState> implements ICommandProvider {
  private localStorage = ServiceManager.Instance.getLocalStorage();
  private roamingStorage = ServiceManager.Instance.getRoamingStorage();
  private application = ServiceManager.Instance.getApplication();
  private issueController = ServiceManager.Instance.getIssueController();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private issueDetailContainerElement: HTMLElement;

  constructor() {
    super();

    this.handleApplicationLoad = this.handleApplicationLoad.bind(this);
    this.handleApplicationIssueAdd = this.handleApplicationIssueAdd.bind(this);
    this.handleApplicationIssueUpdate = this.handleApplicationIssueUpdate.bind(this);
    this.handleApplicationIssueDelete = this.handleApplicationIssueDelete.bind(this);
    this.handleIssueViewSettingsChange = this.handleIssueViewSettingsChange.bind(this);
    this.handleIssueViewSettingsSavedViewsChange = this.handleIssueViewSettingsSavedViewsChange.bind(this);
    this.handleIssueTableIssueSelect = this.handleIssueTableIssueSelect.bind(this);

    this.state = {
      issues: [],
      view: View.create(),
      savedViews: [],
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
    this.application.on('load', this.handleApplicationLoad);
    this.application.items.on('issue.add', this.handleApplicationIssueAdd);
    this.application.items.on('issue.update', this.handleApplicationIssueUpdate);
    this.application.items.on('issue.delete', this.handleApplicationIssueDelete);
  }

  async componentDidMount() {
    ($(this.issueDetailContainerElement) as any).sticky({
      topSpacing: 10,
    });

    const view = View.fromJSON(await this.localStorage.get('issues.view', View.create().toJSON()));

    this.setState({
      view,
    });

    this.loadIssues(view.filterExpression, view.sortExpressions);

    const savedViews = (await this.roamingStorage.get('issues.savedViews', [])).map(x => View.fromJSON(x));

    this.setState({
      savedViews: savedViews,
    });
  }

  componentWillUnmount() {
    this.application.items.off('issue.delete', this.handleApplicationIssueDelete);
    this.application.items.off('issue.update', this.handleApplicationIssueUpdate);
    this.application.items.off('issue.add', this.handleApplicationIssueAdd);
    this.application.off('load', this.handleApplicationLoad);
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new NewIssueCommand(),
      new CopyIssueSidCommand(this.state.selectedIssue),
      new NewSubIssueCommand(this.state.selectedIssue),
      new DuplicateIssueCommand(this.state.selectedIssue),
      new EditIssueCommand(this.state.selectedIssue),
      new DeleteIssueCommand(this.state.selectedIssue),
      new UpdateIssueCommand(this.state.selectedIssue, this.issueController.getLastIssueChange()),
    ];
  }

  private async loadIssues(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]) {
    sortExpressions = [new NQL.SortExpression(new NQL.LocalExpression('sid'), -1)];
    const issues = await this.application.items.getAllIssues(filterExpression, sortExpressions);

    this.setState({
      issues,
      selectedIssue: _.find(issues, issue => !issue.parent),
    });
  }

  private handleApplicationLoad() {
    this.loadIssues(this.state.view.filterExpression, this.state.view.sortExpressions);
  }

  private handleApplicationIssueAdd({ issue }: { issue: IIssue }) {
    this.setState(state => {
      return {
        issues: [issue, ...state.issues],
        selectedIssue: issue,
      };
    });
  }

  private handleApplicationIssueUpdate({ issue }: { issue: IIssue }) {
    this.setState(state => {
      return {
        issues: ArrayHelper.replaceElement(state.issues, issue, issue, entityComparer),
        selectedIssue: issue,
      };
    });
  }

  private handleApplicationIssueDelete({ issue }: { issue: IIssue }) {
    this.setState(state => {
      return {
        issues: ArrayHelper.removeElement(state.issues, issue, entityComparer),
        selectedIssue: undefined,
      };
    });
  }

  private handleIssueViewSettingsChange(view: IView) {
    this.localStorage.set('issues.view', view.toJSON());

    this.setState({
      view,
    });

    this.loadIssues(view.filterExpression, view.sortExpressions);
  }

  private handleIssueViewSettingsSavedViewsChange(savedViews: IView[]) {
    this.roamingStorage.set('issues.savedViews', savedViews.map(view => view.toJSON()));

    this.setState({
      savedViews,
    });
  }

  private handleIssueTableIssueSelect(issue: IIssue) {
    this.setState({
      selectedIssue: issue,
    });
  }

  render() {
    return (
      <MasterPage>
        <div className="issues-page-component">
          <div className="action-bar">
            <CommandButton commandId="new-issue"><Icon name="plus" position="before" /> New Issue</CommandButton>
            <CommandButton commandId="new-sub-issue" type="secondary"><Icon name="plus" position="before" /> New Sub-Issue</CommandButton>
            <CommandButton commandId="refresh" type="secondary"><Icon name="refresh" /></CommandButton>
          </div>
          <div className="view-settings row">
            <IssueViewSettings view={this.state.view} savedViews={this.state.savedViews} onChange={this.handleIssueViewSettingsChange} onSavedViewsChange={this.handleIssueViewSettingsSavedViewsChange} />
          </div>
          <div className="issues row">
            <div className="issue-list">
              <IssueTable issues={this.state.issues} selectedIssue={this.state.selectedIssue} onIssueSelect={this.handleIssueTableIssueSelect} />
            </div>
            <div className="divider"></div>
            <div className="issue-detail">
              <div className="issue-detail-container" ref={e => this.issueDetailContainerElement = e}>
              {
                this.state.selectedIssue &&
                  <IssueDetail issue={this.state.selectedIssue} />
              }
              </div>
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
};
