import * as React from 'react';
import { MasterPage } from '../master-page';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ILoadingPageProps {
}

interface ILoadingPageState {
}

export class LoadingPage extends React.Component<ILoadingPageProps, ILoadingPageState> {
  render(): JSX.Element {
    return (
      <MasterPage>
        <div className="not-found-page-component">
          <div className="container">
            Loading...
          </div>
        </div>
      </MasterPage>
    );
  }
}
