import * as React from 'react';
import * as NQL from '../../nql';
import { ServiceManager } from '../../services';
import { IIssue, IApplication } from '../../application';
import { Window } from '../../framework/components/window';
import { Heading } from '../../framework/components/heading';
import { List, IListItem } from '../../framework/components/list';
import { SidField } from '../sid-field';
import { TitleField } from '../title-field';

require('../../assets/stylesheets/base.less');
require ('./index.less');

interface IIssueSearchWindowProps {
  onIssueSelect(issue: IIssue): void;
}

interface IIssueSearchWindowState {
}

export class IssueSearchWindow extends React.PureComponent<IIssueSearchWindowProps, IIssueSearchWindowState> {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');

  constructor() {
    super();

    this.handleListGetItems = this.handleListGetItems.bind(this);
    this.handleListRenderItem = this.handleListRenderItem.bind(this);
    this.handleListRenderInstruction = this.handleListRenderInstruction.bind(this);
  }

  private async handleListGetItems(query: string): Promise<IListItem[]> {
    const filter = new NQL.ComparisonExpression(
      new NQL.LocalExpression('sid'),
      new NQL.ConstantExpression(query, 'String'),
      'eq'
    );

    const items = (await this.application.items.getAllIssues(filter, null));

    return Promise.resolve(items);
  }

  private handleListRenderItem(issue: IIssue): JSX.Element {
    return (
      <span>
        <SidField sid={issue.sid} />
        <TitleField title={issue.title} />
      </span>
    );
  }

  private handleListRenderInstruction(): JSX.Element {
    return (
      <span>Enter issue's id to search.</span>
    );
  }

  render(): JSX.Element {
    return (
      <Window className="issue-search-window-component">
        <Heading className="heading" level={1}>Find issue</Heading>
        <List className="list" getItems={this.handleListGetItems} keyForItem={(issue: IIssue) => issue.id} renderItem={this.handleListRenderItem} renderInstruction={this.handleListRenderInstruction} onSelect={this.props.onIssueSelect} />
      </Window>
    );
  }
}
