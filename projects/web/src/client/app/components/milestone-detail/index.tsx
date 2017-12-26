import * as React from 'react';
import { IMilestone } from '../../application';
import DescriptionField from '../description-field';
import UserField from '../user-field';
import DateTimeField from '../date-time-field';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMilestoneDetailProps {
  milestone: IMilestone;
}

interface IMilestoneDetailState {
}

export default class MilestoneDetail extends React.PureComponent<IMilestoneDetailProps, IMilestoneDetailState> {
  render(): JSX.Element {
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
          <div className="date-time">
            <DateTimeField dateTime={this.props.milestone.meta.insertDateTime} />
          </div>
        </div>
        {
          this.props.milestone.modifiedBy &&
            <div className="modified">
              <div className="label">Modified by:</div>
              <div className="user">
                <UserField user={this.props.milestone.modifiedBy} />
              </div>
              <div className="date-time">
                <DateTimeField dateTime={this.props.milestone.meta.updateDateTime} />
              </div>
            </div>
        }
      </div>
    );
  }
};
