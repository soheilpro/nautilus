import * as React from 'react';
import Header from '../header';
import Navigation from '../navigation';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMasterPageProps {
}

interface IMasterPageState {
}

export default class MasterPage extends React.PureComponent<IMasterPageProps, IMasterPageState> {
  render(): JSX.Element {
    return (
      <div className="master-page-component">
        <div className="header">
          <Header />
        </div>
        <div className="navigation">
          <Navigation />
        </div>
        <div className="body">
          { this.props.children }
        </div>
      </div>
    );
  }
}
