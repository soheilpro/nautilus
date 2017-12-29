import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IDescriptionFieldProps {
  description: string;
}

interface IDescriptionFieldState {
}

export class DescriptionField extends React.PureComponent<IDescriptionFieldProps, IDescriptionFieldState> {
  render(): JSX.Element {
    return (
      <span className="description-field-component">
        {this.props.description}
      </span>
    );
  }
}
