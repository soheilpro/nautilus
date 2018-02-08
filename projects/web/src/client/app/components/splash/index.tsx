import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ISplashProps {
}

interface ISplashState {
}

export class Splash extends React.Component<ISplashProps, ISplashState> {
  render(): JSX.Element {
    return (
      <div className="splash-component">
        <div className="container">
          Nautilus
        </div>
      </div>
    );
  }
}
