import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { ServiceManager } from '../../services';
import Button from '../../framework/components/button';
import MilestoneFilterQueryBuilder from '../milestone-filter-query-builder';
import Expression from '../expression';
import { IView } from './iview';
import { View } from './view';
import { FilterMilestonesByProjectCommand, FilterMilestonesByStateCommand, FilterMilestonesByCreatedByCommand, ResetViewCommand } from './commands';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMilestoneViewSettingsProps {
  view?: IView;
  onChange(view: IView): void;
}

interface IMilestoneViewSettingsState {
  filterExpression?: NQL.IExpression;
}

export default class MilestoneViewSettings extends React.PureComponent<IMilestoneViewSettingsProps, IMilestoneViewSettingsState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private queryBuilderComponent: MilestoneFilterQueryBuilder;

  constructor(props: IMilestoneViewSettingsProps) {
    super(props);

    this.handleMilestoneFilterQueryBuilderChange = this.handleMilestoneFilterQueryBuilderChange.bind(this);
    this.handleResetButtonClick = this.handleResetButtonClick.bind(this);
    this.handleOpenFilterCommandExecute = this.handleOpenFilterCommandExecute.bind(this);
    this.handleResetViewCommandExecute = this.handleResetViewCommandExecute.bind(this);

    this.state = {
      filterExpression: props.view ? props.view.filterExpression : undefined,
    };
  }

  componentWillMount(): void {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillReceiveProps(props: IMilestoneViewSettingsProps): void {
    if (this.props.view !== props.view) {
      this.setState({
        filterExpression: props.view ? props.view.filterExpression : undefined,
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
      new FilterMilestonesByProjectCommand(_.partial(this.handleOpenFilterCommandExecute, 'milestone', 'project')),
      new FilterMilestonesByStateCommand(_.partial(this.handleOpenFilterCommandExecute, 'milestone', 'state')),
      new FilterMilestonesByCreatedByCommand(_.partial(this.handleOpenFilterCommandExecute, 'milestone', 'createdBy')),
      new ResetViewCommand(view, this.handleResetViewCommandExecute),
    ];
  }

  private handleOpenFilterCommandExecute(itemKind: string, key: string): void {
    this.queryBuilderComponent.open(key);
  }

  private handleResetViewCommandExecute(): void {
    this.props.onChange(View.create());

    this.setState({
      filterExpression: undefined,
    });
  }

  private handleMilestoneFilterQueryBuilderChange(query: NQL.IExpression): void {
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

  render(): JSX.Element {
    return (
      <div className="milestone-view-settings-component">
        <div className="query">
          <div className="query-builder">
            <MilestoneFilterQueryBuilder query={this.state.filterExpression} onChange={this.handleMilestoneFilterQueryBuilderChange} ref={e => this.queryBuilderComponent = e} />
          </div>
          <div className="reset">
            {
              !this.props.view.isDefault() &&
                <Button className="reset-button" type="link" onClick={this.handleResetButtonClick}>Reset</Button>
            }
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
