import * as React from 'react';
import { IMilestone } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMilestoneFieldProps {
  milestone: IMilestone;
}

interface IMilestoneFieldState {
}

export default class MilestoneField extends React.PureComponent<IMilestoneFieldProps, IMilestoneFieldState> {
  render() {
    if (!this.props.milestone)
      return null;

    return (
      <span className="milestone-field-component">
        {this.props.milestone.title}
      </span>
    );
  }
};
