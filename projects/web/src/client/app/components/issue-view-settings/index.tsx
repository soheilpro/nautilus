import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { ServiceManager } from '../../services';
import { IWindowController } from '../../framework/windows';
import { Button } from '../../framework/components/button';
import { Dropdown } from '../../framework/components/dropdown';
import { PromptWindow } from '../../framework/components/prompt-window';
import { List } from '../../framework/components/list';
import { IssueFilterQueryBuilder } from '../issue-filter-query-builder';
import { Expression } from '../expression';
import { IView } from './iview';
import { View } from './view';
import { FilterByMilestoneCommand, FilterByProjectCommand, FilterByTypeCommand, FilterByStateCommand, FilterByAssignedToCommand, FilterByCreatedByCommand, ResetViewCommand, SaveViewCommand, LoadViewCommand } from './commands';
import { Icon } from '../../framework/components/icon';

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

export class IssueViewSettings extends React.PureComponent<IIssueViewSettingsProps, IIssueViewSettingsState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');
  private queryBuilderRef: IssueFilterQueryBuilder;
  private savedViewListDropdownRef: Dropdown;

  constructor(props: IIssueViewSettingsProps) {
    super(props);

    this.handleIssueFilterQueryBuilderChange = this.handleIssueFilterQueryBuilderChange.bind(this);
    this.handleResetButtonClick = this.handleResetButtonClick.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    this.handleListKeyForItem = this.handleListKeyForItem.bind(this);
    this.handleListTitleForItem = this.handleListTitleForItem.bind(this);
    this.handleListRenderItem = this.handleListRenderItem.bind(this);
    this.handleListRenderItemButton = this.handleListRenderItemButton.bind(this);
    this.handleListButtonSelect = this.handleListButtonSelect.bind(this);
    this.handleListSelect = this.handleListSelect.bind(this);
    this.handleOpenFilterCommandExecute = this.handleOpenFilterCommandExecute.bind(this);
    this.handleResetViewCommandExecute = this.handleResetViewCommandExecute.bind(this);
    this.handleSaveViewCommandExecute = this.handleSaveViewCommandExecute.bind(this);
    this.handleLoadViewCommandExecute = this.handleLoadViewCommandExecute.bind(this);

    this.state = {
      filterExpression: props.view ? props.view.filterExpression : undefined,
      savedViews: _.sortBy(props.savedViews, savedView => savedView.name),
    };
  }

  componentWillMount(): void {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillReceiveProps(props: IIssueViewSettingsProps): void {
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

  componentWillUnmount(): void {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands(): ICommand[] {
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

  private saveView(): void {
    const handleConfirm = (name: string) => {
      this.windowController.closeWindow(handle);

      const view = View.create({
        name: name,
        filterExpression: this.state.filterExpression,
      });

      const savedViews = [...this.state.savedViews, view];

      this.props.onSavedViewsChange(savedViews);

      this.setState({
        savedViews: savedViews,
      });
    };

    const handleClose = () => {
      this.windowController.closeWindow(handle);
    };

    const window = <PromptWindow title="Save" placeholder="Name" confirmButtonText="Save" onConfirm={handleConfirm} onClose={handleClose} />;
    const options = {
      top: 120,
      width: 500,
      modal: true,
    };

    const handle = this.windowController.showWindow(window, options);
  }

  private handleOpenFilterCommandExecute(itemKind: string, key: string): void {
    this.queryBuilderRef.open(key);
  }

  private handleResetViewCommandExecute(): void {
    this.props.onChange(View.create());

    this.setState({
      filterExpression: undefined,
    });
  }

  private handleSaveViewCommandExecute(): void {
    this.saveView();
  }

  private handleLoadViewCommandExecute(): void {
    this.savedViewListDropdownRef.open();
  }

  private handleIssueFilterQueryBuilderChange(query: NQL.IExpression): void {
    const view = View.create({
      filterExpression: query,
    });

    this.props.onChange(view);

    this.setState({
      filterExpression: query,
    });
  }

  private handleResetButtonClick(): void {
    this.props.onChange(View.create());

    this.setState({
      filterExpression: undefined,
    });
  }

  private handleSaveButtonClick(): void {
    this.saveView();
  }

  private handleListSelect(view: IView): void {
    this.savedViewListDropdownRef.close();
    this.props.onChange(view);
  }

  private handleListKeyForItem(view: IView): string {
    return view.id;
  }

  private handleListTitleForItem(view: IView): string {
    return view.name;
  }

  private handleListRenderItem(view: IView): JSX.Element {
    return (
      <span>
        { view.name }
      </span>
    );
  }

  private handleListRenderItemButton(view: IView, button: string): JSX.Element {
    switch (button) {
      case 'remove':
        return (
          <Icon name="remove" />
        );

      default:
        throw new Error('Not implemented.');
    }
  }

  private handleListButtonSelect(view: IView, button: string): void {
    switch (button) {
      case 'remove':
        const savedViews = this.state.savedViews.filter(x => x !== view);

        this.props.onSavedViewsChange(savedViews);

        this.setState({
          savedViews: savedViews,
        });

        break;

      default:
        throw new Error('Not implemented');
    }
  }

  render(): JSX.Element {
    return (
      <div className="issue-view-settings-component">
        <div className="query">
          <div className="query-builder">
            <IssueFilterQueryBuilder query={this.state.filterExpression} onChange={this.handleIssueFilterQueryBuilderChange} ref={e => this.queryBuilderRef = e} />
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
            <Dropdown className="load-button" title="Load" ref={e => this.savedViewListDropdownRef = e}>
              <List className="list" items={this.state.savedViews} buttons={['remove']} keyForItem={this.handleListKeyForItem} titleForItem={this.handleListTitleForItem} renderItem={this.handleListRenderItem} renderItemButton={this.handleListRenderItemButton} onSelect={this.handleListSelect} onButtonSelect={this.handleListButtonSelect} />
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
}

export * from './iview';
export * from './view';
