import * as React from 'react';
import { MasterPage } from '../master-page';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface INotFoundPageProps {
}

interface INotFoundPageState {
}

export class NotFoundPage extends React.Component<INotFoundPageProps, INotFoundPageState> {
  render(): JSX.Element {
    return (
      <MasterPage>
        <div className="not-found-page-component">
          <div className="container">
            Not found :(
          </div>
        </div>
      </MasterPage>
    );
  }
}
