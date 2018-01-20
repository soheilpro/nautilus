import * as React from 'react';
import * as classNames from 'classnames';
import { IMilestone } from '../../application';
import { Select } from '../../framework/components/select';

interface IMilestoneSelectProps {
  milestones: IMilestone[];
  milestone: IMilestone;
  className?: string;
  onChange(milestone: IMilestone): void;
}

interface IMilestoneSelectState {
}

export class MilestoneSelect extends React.PureComponent<IMilestoneSelectProps, IMilestoneSelectState> {
  render(): JSX.Element {
    return (
      <Select className={classNames('milestone-select-component', this.props.className)} selectedItem={this.props.milestone} items={this.props.milestones} keyForItem={(item: IMilestone) => item.id} titleForItem={(item: IMilestone) => item.fullTitle} onChange={this.props.onChange} />
    );
  }
}
