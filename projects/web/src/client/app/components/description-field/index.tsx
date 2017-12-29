import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueDescriptionFieldProps {
  description: string;
}

interface IIssueDescriptionFieldState {
}

export default class IssueDescriptionField extends React.PureComponent<IIssueDescriptionFieldProps, IIssueDescriptionFieldState> {
  render(): JSX.Element {
    return (
      <span className="description-field-component">
        {this.props.description}
      </span>
    );
  }
}
