import * as React from 'react';
import { IIssue } from '../../application';
import { Window } from '../../framework/components/window';
import { List, IListItem } from '../../framework/components/list';

require('../../assets/stylesheets/base.less');
require ('./index.less');

interface ISearchWindowProps {
  onIssueSelect(issue: IIssue): void;
}

interface ISearchWindowState {
}

export class SearchWindow extends React.PureComponent<ISearchWindowProps, ISearchWindowState> {
  constructor() {
    super();

    this.handleListGetItems = this.handleListGetItems.bind(this);
    this.handleListRenderItem = this.handleListRenderItem.bind(this);
  }

  private async handleListGetItems(query: string): Promise<IListItem[]> {
    let items: any = [];

    return Promise.resolve(items);
  }

  private handleListRenderItem(issue: IIssue): JSX.Element {
    return (
      <br />
    );
  }

  render(): JSX.Element {
    return (
      <Window className="search-window-component">
        <List className="list" getItems={this.handleListGetItems} keyForItem={(issue: IIssue) => issue.id} renderItem={this.handleListRenderItem} onSelect={this.props.onIssueSelect} />
      </Window>
    );
  }
}
