import * as React from 'react';
import * as classNames from 'classnames';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ITitleFieldProps {
  title: string;
  status?: string;
}

interface ITitleFieldState {
}

export class TitleField extends React.PureComponent<ITitleFieldProps, ITitleFieldState> {
  render(): JSX.Element {
    return (
      <span className={classNames('title-field-component', this.props.status ? `status-${this.props.status}` : null)}>
        {this.props.title}
      </span>
    );
  }
}
