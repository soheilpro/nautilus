import * as React from 'react';
import { IMilestone } from '../../application';
import DescriptionField from '../description-field';
import UserField from '../user-field';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMilestoneDetailProps {
  milestone: IMilestone;
}

interface IMilestoneDetailState {
}

export default class MilestoneDetail extends React.PureComponent<IMilestoneDetailProps, IMilestoneDetailState> {
  render() {
    return (
      <div className="milestone-detail-component">
        <div className="header">Milestone #{this.props.milestone.sid}</div>
        <div className="description">
          <DescriptionField description={this.props.milestone.description} />
        </div>
        <div className="created">
          <div className="label">Created by:</div>
          <div className="user">
            <UserField user={this.props.milestone.createdBy} />
          </div>
        </div>
      </div>
    );
  }
};
