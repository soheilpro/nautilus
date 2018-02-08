// Using code from http://tobiasahlin.com/spinkit/

import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ISpinnerProps {
}

interface ISpinnerState {
}

export class Spinner extends React.PureComponent<ISpinnerProps, ISpinnerState> {
  render(): JSX.Element {
    return (
      <span className="spinner-field-component">
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </span>
    );
  }
}
