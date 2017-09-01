import * as React from 'react';
import { IIssue } from '../../application';
import DescriptionField from '../description-field';
import UserField from '../user-field';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueDetailProps {
  issue: IIssue;
}

interface IIssueDetailState {
}

export default class IssueDetail extends React.PureComponent<IIssueDetailProps, IIssueDetailState> {
  render() {
    return (
      <div className="issue-detail-component">
        <div className="header">Issue #{this.props.issue.sid}</div>
        <div className="description">
          <DescriptionField description={this.props.issue.description} />
        </div>
        <div className="created">
          <div className="label">Created by:</div>
          <div className="user">
            <UserField user={this.props.issue.createdBy} />
          </div>
        </div>
      </div>
    );
  }
};
