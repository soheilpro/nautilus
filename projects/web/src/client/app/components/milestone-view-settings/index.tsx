import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import Button from '../button';
import MilestoneFilterQueryBuilder from '../milestone-filter-query-builder';
import Expression from '../expression';
import { IView } from './iview';
import { View } from './view';
import FilterByProjectCommand from './filter-by-project-command';
import FilterByStateCommand from './filter-by-state-command';
import FilterByCreatedByCommand from './filter-by-created-by-command';
import ResetViewCommand from './reset-view-command';

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
  private commandManager = ServiceManager.Instance.getCommandManager();
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

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillReceiveProps(props: IMilestoneViewSettingsProps) {
    if (this.props.view !== props.view) {
      this.setState({
        filterExpression: props.view ? props.view.filterExpression : undefined,
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
      new FilterByProjectCommand(_.partial(this.handleOpenFilterCommandExecute, 'milestone', 'project')),
      new FilterByStateCommand(_.partial(this.handleOpenFilterCommandExecute, 'milestone', 'state')),
      new FilterByCreatedByCommand(_.partial(this.handleOpenFilterCommandExecute, 'milestone', 'createdBy')),
      new ResetViewCommand(view, this.handleResetViewCommandExecute),
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

  private handleMilestoneFilterQueryBuilderChange(query: NQL.IExpression) {
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

  render() {
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
