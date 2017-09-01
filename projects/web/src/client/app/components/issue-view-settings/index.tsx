import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import Button from '../button';
import Dropdown from '../dropdown';
import PromptWindow from '../prompt-window';
import IssueFilterQueryBuilder from '../issue-filter-query-builder';
import Expression from '../expression';
import ViewList from './view-list';
import { IView } from './iview';
import { View } from './view';
import FilterByMilestoneCommand from './filter-by-milestone-command';
import FilterByProjectCommand from './filter-by-project-command';
import FilterByTypeCommand from './filter-by-type-command';
import FilterByStateCommand from './filter-by-state-command';
import FilterByAssignedToCommand from './filter-by-assigned-to-command';
import FilterByCreatedByCommand from './filter-by-created-by-command';
import ResetViewCommand from './reset-view-command';
import SaveViewCommand from './save-view-command';
import LoadViewCommand from './load-view-command';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueViewSettingsProps {
  view?: IView;
  savedViews?: IView[];
  onChange(view: IView): void;
  onSavedViewsChange(savedViews: IView[]): void;
}

interface IIssueViewSettingsState {
  filterExpression?: NQL.IExpression;
  savedViews?: IView[];
}

export default class IssueViewSettings extends React.PureComponent<IIssueViewSettingsProps, IIssueViewSettingsState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowController = ServiceManager.Instance.getWindowController();
  private queryBuilderComponent: IssueFilterQueryBuilder;
  private savedViewListDropdownComponent: Dropdown;
  private promptWindow: IWindow;

  constructor(props: IIssueViewSettingsProps) {
    super(props);

    this.handleIssueFilterQueryBuilderChange = this.handleIssueFilterQueryBuilderChange.bind(this);
    this.handleResetButtonClick = this.handleResetButtonClick.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    this.handleSavePromptWindowConfirm = this.handleSavePromptWindowConfirm.bind(this);
    this.handleSavePromptWindowClose = this.handleSavePromptWindowClose.bind(this);
    this.handleViewListDelete = this.handleViewListDelete.bind(this);
    this.handleViewListSelect = this.handleViewListSelect.bind(this);
    this.handleOpenFilterCommandExecute = this.handleOpenFilterCommandExecute.bind(this);
    this.handleResetViewCommandExecute = this.handleResetViewCommandExecute.bind(this);
    this.handleSaveViewCommandExecute = this.handleSaveViewCommandExecute.bind(this);
    this.handleLoadViewCommandExecute = this.handleLoadViewCommandExecute.bind(this);

    this.state = {
      filterExpression: props.view ? props.view.filterExpression : undefined,
      savedViews: _.sortBy(props.savedViews, savedView => savedView.name),
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillReceiveProps(props: IIssueViewSettingsProps) {
    if (this.props.view !== props.view) {
      this.setState({
        filterExpression: props.view ? props.view.filterExpression : undefined,
      });
    }

    if (this.props.savedViews !== props.savedViews) {
      this.setState({
        savedViews: _.sortBy(props.savedViews, savedView => savedView.name),
      });
    }
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    const view = View.create({
      filterExpression: this.state.filterExpression,
    });

    return [
      new FilterByMilestoneCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'milestone')),
      new FilterByProjectCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'project')),
      new FilterByTypeCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'type')),
      new FilterByStateCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'state')),
      new FilterByAssignedToCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'assignedTo')),
      new FilterByCreatedByCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'createdBy')),
      new ResetViewCommand(view, this.handleResetViewCommandExecute),
      new SaveViewCommand(view, this.handleSaveViewCommandExecute),
      new LoadViewCommand(this.handleLoadViewCommandExecute),
    ];
  }

  private handleOpenFilterCommandExecute(itemKind: string, key: string) {
    this.queryBuilderComponent.open(key);
  }

  private handleResetViewCommandExecute() {
    this.props.onChange(View.create());

    this.setState({
      filterExpression: undefined,
    });
  }

  private handleSaveViewCommandExecute() {
    this.promptWindow = {
      content: <PromptWindow title="Save" placeholder="Name" confirmButtonText="Save" onConfirm={this.handleSavePromptWindowConfirm} onClose={this.handleSavePromptWindowClose} />,
      top: 120,
      width: 500,
      modal: true,
    };

    this.windowController.showWindow(this.promptWindow);
  }

  private handleLoadViewCommandExecute() {
    this.savedViewListDropdownComponent.open();
  }

  private handleIssueFilterQueryBuilderChange(query: NQL.IExpression) {
    const view = View.create({
      filterExpression: query,
    });

    this.props.onChange(view);

    this.setState({
      filterExpression: query,
    });
  }

  private handleResetButtonClick() {
    this.props.onChange(View.create());

    this.setState({
      filterExpression: undefined,
    });
  }

  private handleSaveButtonClick() {
    this.promptWindow = {
      content: <PromptWindow title="Save" placeholder="Name" confirmButtonText="Save" onConfirm={this.handleSavePromptWindowConfirm} onClose={this.handleSavePromptWindowClose} />,
      top: 120,
      width: 500,
      modal: true,
    };

    this.windowController.showWindow(this.promptWindow);
  }

  private handleSavePromptWindowConfirm(name: string) {
    this.windowController.closeWindow(this.promptWindow);

    const view = View.create({
      name,
      filterExpression: this.state.filterExpression,
    });

    const savedViews = [...this.state.savedViews, view];

    this.props.onSavedViewsChange(savedViews);

    this.setState({
      savedViews,
    });
  }

  private handleSavePromptWindowClose() {
    this.windowController.closeWindow(this.promptWindow);
  }

  private handleViewListDelete(view: IView) {
    const savedViews = this.state.savedViews.filter(x => x !== view);

    this.props.onSavedViewsChange(savedViews);

    this.setState({
      savedViews,
    });
  }

  private handleViewListSelect(view: IView) {
    this.savedViewListDropdownComponent.close();
    this.props.onChange(view);
  }

  render() {
    return (
      <div className="issue-view-settings-component">
        <div className="query">
          <div className="query-builder">
            <IssueFilterQueryBuilder query={this.state.filterExpression} onChange={this.handleIssueFilterQueryBuilderChange} ref={e => this.queryBuilderComponent = e} />
          </div>
          <div className="reset">
            {
              !this.props.view.isDefault() &&
                <Button className="reset-button" type="link" onClick={this.handleResetButtonClick}>Reset</Button>
            }
          </div>
          <div className="load-save">
            {
              !this.props.view.isDefault() &&
                <Button className="save-button" type="secondary" onClick={this.handleSaveButtonClick}>Save</Button>
            }
            <Dropdown className="load-button" title="Load" ref={e => this.savedViewListDropdownComponent = e}>
              <ViewList views={this.state.savedViews} onDelete={this.handleViewListDelete} onSelect={this.handleViewListSelect} />
            </Dropdown>
          </div>
        </div>
        <div className="query-text">
          {
            this.state.filterExpression ?
              <Expression expression={this.state.filterExpression} /> :
              <span className="no-filter">No filters selected.</span>
          }
        </div>
      </div>
    );
  }
};

export * from './iview';
export * from './view';
