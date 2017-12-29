import * as React from 'react';
import * as NQL from '../../nql';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { ServiceManager } from '../../services';
import { Button } from '../../framework/components/button';
import { ProjectFilterQueryBuilder } from '../project-filter-query-builder';
import { Expression } from '../expression';
import { IView } from './iview';
import { View } from './view';
import { ResetViewCommand } from './commands';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IProjectViewSettingsProps {
  view?: IView;
  onChange(view: IView): void;
}

interface IProjectViewSettingsState {
  filterExpression?: NQL.IExpression;
}

export class ProjectViewSettings extends React.PureComponent<IProjectViewSettingsProps, IProjectViewSettingsState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private queryBuilderRef: ProjectFilterQueryBuilder;

  constructor(props: IProjectViewSettingsProps) {
    super(props);

    this.handleProjectFilterQueryBuilderChange = this.handleProjectFilterQueryBuilderChange.bind(this);
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

  componentWillReceiveProps(props: IProjectViewSettingsProps): void {
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
      new ResetViewCommand(view, this.handleResetViewCommandExecute),
    ];
  }

  private handleOpenFilterCommandExecute(key: string): void {
    this.queryBuilderRef.open(key);
  }

  private handleResetViewCommandExecute(): void {
    this.props.onChange(View.create());

    this.setState({
      filterExpression: undefined,
    });
  }

  private handleProjectFilterQueryBuilderChange(query: NQL.IExpression): void {
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
      <div className="project-view-settings-component">
        <div className="query">
          <div className="query-builder">
            <ProjectFilterQueryBuilder query={this.state.filterExpression} onChange={this.handleProjectFilterQueryBuilderChange} ref={e => this.queryBuilderRef = e} />
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
}

export * from './iview';
export * from './view';
