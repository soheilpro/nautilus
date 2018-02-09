import * as React from 'react';
import * as classNames from 'classnames';
import { IMilestone } from '../../application';
import Select from '../select';

interface IMilestoneSelectProps {
  milestones: IMilestone[];
  milestone: IMilestone;
  className?: string;
  onChange(milestone: IMilestone): void;
}

interface IMilestoneSelectState {
}

export default class MilestoneSelect extends React.PureComponent<IMilestoneSelectProps, IMilestoneSelectState> {
  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  private handleSelectChange(milestone: IMilestone) {
    this.props.onChange(milestone);
  }

  render() {
    return (
      <Select className={classNames('milestone-select-component', this.props.className)} selectedItem={this.props.milestone} items={this.props.milestones} displayProperty="fullTitle" onChange={this.handleSelectChange} />
    );
  }
};
