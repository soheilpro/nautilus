import * as React from 'react';
import * as _ from 'underscore';
import { IIssue, entityComparer, IApplication } from '../../application';
import * as NQL from '../../nql';
import { ServiceManager } from '../../services';
import ArrayHelper from '../../utilities/array-helper';
import CommandButton from '../../framework/components/command-button';
import Icon from '../../framework/components/icon';
import IssueDetail from '../issue-detail';
import IssueTable from '../issue-table';
import IssueViewSettings, { IView, View } from '../issue-view-settings';
import MasterPage from '../master-page';
import { ILocalStorage } from '../../framework/storage';
import { IRoamingStorage } from '../../modules/storage';
import { IContextProvider, IContextManager, IContext } from '../../framework/context';
import { IssueType } from '../../modules/issues';

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

export default class IssuesPage extends React.Component<IIssuesPageProps, IIssuesPageState> implements IContextProvider {
  private localStorage = ServiceManager.Instance.getService<ILocalStorage>('ILocalStorage');
  private roamingStorage = ServiceManager.Instance.getService<IRoamingStorage>('IRoamingStorage');
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
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

  componentWillMount(): void {
    this.contextManager.registerContextProvider(this);
    this.application.on('load', this.handleApplicationLoad);
    this.application.items.on('issue.add', this.handleApplicationIssueAdd);
    this.application.items.on('issue.update', this.handleApplicationIssueUpdate);
    this.application.items.on('issue.delete', this.handleApplicationIssueDelete);
  }

  async componentDidMount(): Promise<void> {
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

  componentWillUnmount(): void {
    this.application.items.off('issue.delete', this.handleApplicationIssueDelete);
    this.application.items.off('issue.update', this.handleApplicationIssueUpdate);
    this.application.items.off('issue.add', this.handleApplicationIssueAdd);
    this.application.off('load', this.handleApplicationLoad);
    this.contextManager.unregisterContextProvider(this);
  }

  private async loadIssues(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): Promise<void> {
    sortExpressions = [new NQL.SortExpression(new NQL.LocalExpression('sid'), -1)];
    const issues = await this.application.items.getAllIssues(filterExpression, sortExpressions);

    this.setState({
      issues,
      selectedIssue: _.find(issues, issue => !issue.parent),
    });
  }

  getContext(): IContext {
    if (!this.state.selectedIssue)
      return null;

    return {
      'core.activeItemType': IssueType,
      'core.activeItem': this.state.selectedIssue,
    };
  }

  private handleApplicationLoad(): void {
    this.loadIssues(this.state.view.filterExpression, this.state.view.sortExpressions);
  }

  private handleApplicationIssueAdd({ issue }: { issue: IIssue }): void {
    this.setState(state => {
      return {
        issues: [issue, ...state.issues],
        selectedIssue: issue,
      };
    });
  }

  private handleApplicationIssueUpdate({ issue }: { issue: IIssue }): void {
    this.setState(state => {
      return {
        issues: ArrayHelper.replaceElement(state.issues, issue, issue, entityComparer),
        selectedIssue: issue,
      };
    });
  }

  private handleApplicationIssueDelete({ issue }: { issue: IIssue }): void {
    this.setState(state => {
      return {
        issues: ArrayHelper.removeElement(state.issues, issue, entityComparer),
        selectedIssue: undefined,
      };
    });
  }

  private handleIssueViewSettingsChange(view: IView): void {
    this.localStorage.set('issues.view', view.toJSON());

    this.setState({
      view,
    });

    this.loadIssues(view.filterExpression, view.sortExpressions);
  }

  private handleIssueViewSettingsSavedViewsChange(savedViews: IView[]): void {
    this.roamingStorage.set('issues.savedViews', savedViews.map(view => view.toJSON()));

    this.setState({
      savedViews,
    });
  }

  private handleIssueTableIssueSelect(issue: IIssue): void {
    this.setState({
      selectedIssue: issue,
    });
  }

  render(): JSX.Element {
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
