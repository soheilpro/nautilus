import * as React from 'react';
import * as NQL from '../../nql';
import { IMilestone, entityComparer } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import ArrayHelper from '../../utilities/array-helper';
import CopyMilestoneSidCommand from '../../milestones/copy-milestone-sid-command';
import NewMilestoneCommand from '../../milestones/new-milestone-command';
import EditMilestoneCommand from '../../milestones/edit-milestone-command';
import DeleteMilestoneCommand from '../../milestones/delete-milestone-command';
import MilestoneViewSettings, { IView, View } from '../milestone-view-settings';
import MilestoneDetail from '../milestone-detail';
import MilestoneTable from '../milestone-table';
import MasterPage from '../master-page';
import CommandButton from '../command-button';
import Icon from '../icon';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMilestonesPageProps {
}

interface IMilestonesPageState {
  milestones?: IMilestone[];
  selectedMilestone?: IMilestone;
  view?: IView;
}

export default class MilestonesPage extends React.Component<IMilestonesPageProps, IMilestonesPageState> implements ICommandProvider {
  private localStorage = ServiceManager.Instance.getLocalStorage();
  private application = ServiceManager.Instance.getApplication();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private milestoneDetailContainerElement: HTMLElement;

  constructor() {
    super();

    this.handleApplicationLoad = this.handleApplicationLoad.bind(this);
    this.handleApplicationMilestoneAdd = this.handleApplicationMilestoneAdd.bind(this);
    this.handleApplicationMilestoneUpdate = this.handleApplicationMilestoneUpdate.bind(this);
    this.handleApplicationMilestoneDelete = this.handleApplicationMilestoneDelete.bind(this);
    this.handleMilestoneViewSettingsChange = this.handleMilestoneViewSettingsChange.bind(this);
    this.handleMilestoneTableMilestoneSelect = this.handleMilestoneTableMilestoneSelect.bind(this);

    this.state = {
      milestones: [],
      view: View.create(),
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
    this.application.on('load', this.handleApplicationLoad);
    this.application.items.on('milestone.add', this.handleApplicationMilestoneAdd);
    this.application.items.on('milestone.update', this.handleApplicationMilestoneUpdate);
    this.application.items.on('milestone.delete', this.handleApplicationMilestoneDelete);
  }

  async componentDidMount() {
    ($(this.milestoneDetailContainerElement) as any).sticky({
      topSpacing: 10,
    });

    const view = View.fromJSON(await this.localStorage.get('milestones.view', View.create().toJSON()));

    this.setState({
      view,
    });

    this.loadMilestones(view.filterExpression, view.sortExpressions);
  }

  componentWillUnmount() {
    this.application.items.off('milestone.delete', this.handleApplicationMilestoneDelete);
    this.application.items.off('milestone.update', this.handleApplicationMilestoneUpdate);
    this.application.items.off('milestone.add', this.handleApplicationMilestoneAdd);
    this.application.off('load', this.handleApplicationLoad);
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new NewMilestoneCommand(),
      new CopyMilestoneSidCommand(this.state.selectedMilestone),
      new EditMilestoneCommand(this.state.selectedMilestone),
      new DeleteMilestoneCommand(this.state.selectedMilestone),
    ];
  }

  private loadMilestones(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]) {
    sortExpressions = [new NQL.SortExpression(new NQL.LocalExpression('fullTitle'))];
    const milestones = this.application.items.getAllMilestones(filterExpression, sortExpressions);

    this.setState({
      milestones,
      selectedMilestone: milestones[0],
    });
  }

  private handleApplicationLoad() {
    this.loadMilestones(this.state.view.filterExpression, this.state.view.sortExpressions);
  }

  private handleApplicationMilestoneAdd({ milestone }: { milestone: IMilestone }) {
    this.setState(state => {
      return {
        milestones: [milestone, ...state.milestones],
        selectedMilestone: milestone,
      };
    });
  }

  private handleApplicationMilestoneUpdate({ milestone }: { milestone: IMilestone }) {
    this.setState(state => {
      return {
        milestones: ArrayHelper.replaceElement(state.milestones, milestone, milestone, entityComparer),
        selectedMilestone: milestone,
      };
    });
  }

  private handleApplicationMilestoneDelete({ milestone }: { milestone: IMilestone }) {
    this.setState(state => {
      return {
        milestones: ArrayHelper.removeElement(state.milestones, milestone, entityComparer),
        selectedMilestone: undefined,
      };
    });
  }

  private handleMilestoneViewSettingsChange(view: IView) {
    this.localStorage.set('milestones.view', view.toJSON());

    this.setState({
      view,
    });

    this.loadMilestones(view.filterExpression, view.sortExpressions);
  }

  private handleMilestoneTableMilestoneSelect(milestone: IMilestone) {
    this.setState({
      selectedMilestone: milestone,
    });
  }

  render() {
    return (
      <MasterPage>
        <div className="milestones-page-component">
          <div className="action-bar">
            <CommandButton commandId="new-milestone"><Icon name="plus" position="before" /> New Milestone</CommandButton>
            <CommandButton commandId="refresh" type="secondary"><Icon name="refresh" /></CommandButton>
          </div>
          <div className="view-settings row">
            <MilestoneViewSettings view={this.state.view} onChange={this.handleMilestoneViewSettingsChange} />
          </div>
          <div className="milestones row">
            <div className="milestone-list">
              <MilestoneTable milestones={this.state.milestones} selectedMilestone={this.state.selectedMilestone} onMilestoneSelect={this.handleMilestoneTableMilestoneSelect} />
            </div>
            <div className="divider"></div>
            <div className="milestone-detail">
              <div className="milestone-detail-container" ref={e => this.milestoneDetailContainerElement = e}>
              {
                this.state.selectedMilestone &&
                  <MilestoneDetail milestone={this.state.selectedMilestone} />
              }
              </div>
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
};
