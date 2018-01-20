import * as React from 'react';
import * as classNames from 'classnames';
import * as NQL from '../../nql';
import { List } from '../../framework/components/list';
import { Icon } from '../../framework/components/icon';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IListItem {
}

interface IListQueryBuilderProps {
  items: IListItem[];
  keyForItem: (item: IListItem) => string;
  titleForItem: (item: IListItem) => string;
  query?: NQL.IExpression;
  queryItem: string;
  queryItemType: string;
  itemToQueryItem: (item: IListItem) => Object;
  itemComparer: (item1: IListItem, item2: IListItem) => boolean;
  onChange(query: NQL.IExpression, reset: boolean, done: boolean): void;
}

interface IListQueryBuilderState {
  includedItems?: IListItem[];
  excludedItems?: IListItem[];
}

export class ListQueryBuilder extends React.PureComponent<IListQueryBuilderProps, IListQueryBuilderState> {
  constructor(props: IListQueryBuilderProps) {
    super(props);

    this.handleListRenderItem = this.handleListRenderItem.bind(this);
    this.handleListRenderItemButton = this.handleListRenderItemButton.bind(this);
    this.handleListSelect = this.handleListSelect.bind(this);
    this.handleListButtonSelect = this.handleListButtonSelect.bind(this);

    const { includedItems, excludedItems } = this.parseQuery(props.query, props);

    this.state = {
      includedItems: includedItems,
      excludedItems: excludedItems,
    };
  }

  componentWillReceiveProps(props: IListQueryBuilderProps): void {
    if (this.props.query !== props.query || this.props.items !== props.items) {
      const { includedItems, excludedItems } = this.parseQuery(props.query, props);

      this.setState(state => {
        return {
          includedItems: includedItems,
          excludedItems: excludedItems,
        };
      });
    }
  }

  private getQuery(includedItems: IListItem[], excludedItems: IListItem[], props: IListQueryBuilderProps): NQL.IExpression {
    if (includedItems.length === 1) {
      return new NQL.ComparisonExpression(
        new NQL.LocalExpression(props.queryItem),
        new NQL.ConstantExpression(props.itemToQueryItem(includedItems[0]), props.queryItemType),
        'eq');
    }

    if (includedItems.length > 1) {
      return new NQL.ComparisonExpression(
        new NQL.LocalExpression(props.queryItem),
        new NQL.ListExpression(includedItems.map(item => new NQL.ConstantExpression(props.itemToQueryItem(item), props.queryItemType))),
        'in');
    }

    if (excludedItems.length === 1) {
      return new NQL.ComparisonExpression(
        new NQL.LocalExpression(props.queryItem),
        new NQL.ConstantExpression(props.itemToQueryItem(excludedItems[0]), props.queryItemType),
        'neq');
    }

    if (excludedItems.length > 1) {
      return new NQL.ComparisonExpression(
        new NQL.LocalExpression(props.queryItem),
        new NQL.ListExpression(excludedItems.map(item => new NQL.ConstantExpression(props.itemToQueryItem(item), props.queryItemType))),
        'nin');
    }

    return null;
  }

  private parseQuery(query: NQL.IExpression, props: IListQueryBuilderProps): { includedItems: IListItem[], excludedItems: IListItem[]} {
    if (!query)
      return {
        includedItems: [],
        excludedItems: [],
      };

    const comparisonQuery = query as NQL.ComparisonExpression;

    if (comparisonQuery.operator === 'eq') {
      const item = (comparisonQuery.right as NQL.ConstantExpression).value;

      return {
        includedItems: props.items.filter(x => props.itemComparer(x, item)),
        excludedItems: [],
      };
    }

    if (comparisonQuery.operator === 'in') {
      const items = ((comparisonQuery.right as NQL.ListExpression).children).map(child => (child as NQL.ConstantExpression).value);

      return {
        includedItems: props.items.filter(x => items.some(item => props.itemComparer(item, x))),
        excludedItems: [],
      };
    }

    if (comparisonQuery.operator === 'neq') {
      const item = (comparisonQuery.right as NQL.ConstantExpression).value;

      return {
        includedItems: [],
        excludedItems: props.items.filter(x => props.itemComparer(x, item)),
      };
    }

    if (comparisonQuery.operator === 'nin') {
      const items = ((comparisonQuery.right as NQL.ListExpression).children).map(child => (child as NQL.ConstantExpression).value);

      return {
        includedItems: [],
        excludedItems: props.items.filter(x => items.some(item => props.itemComparer(item, x))),
      };
    }

    throw new Error('Not supported.');
  }

  static canParseQuery(query: NQL.IExpression, queryItem: string, queryItemType: string): boolean {
    if (!(query instanceof NQL.ComparisonExpression))
      return false;

    if (!(query.left instanceof NQL.LocalExpression))
      return false;

    if (query.left.name !== queryItem)
      return false;

    if (query.operator === 'eq' || query.operator === 'neq') {
      if (!(query.right instanceof NQL.ConstantExpression))
        return false;

      if (query.right.returnType !== queryItemType)
        return false;

      return true;
    }

    if (query.operator === 'in' || query.operator === 'nin') {
      if (!(query.right instanceof NQL.ListExpression))
        return false;

      if (!query.right.children.every(child => child instanceof NQL.ConstantExpression && child.returnType === queryItemType))
        return false;

      return true;
    }

    return false;
  }

  private toggleItemExclude(item: IListItem): void {
    const includedItems: IListItem[] = [];
    const excludedItems = (this.state.excludedItems.indexOf(item) === -1) ? [...this.state.excludedItems, item] : this.state.excludedItems.filter(x => x !== item);

    this.props.onChange(this.getQuery(includedItems, excludedItems, this.props), false, false);

    this.setState({
      includedItems: includedItems,
      excludedItems: excludedItems,
    });
  }

  private toggleItemInclude(item: IListItem): void {
    const includedItems = (this.state.includedItems.indexOf(item) === -1) ? [...this.state.includedItems, item] : this.state.includedItems.filter(x => x !== item);
    const excludedItems: IListItem[] = [];

    this.props.onChange(this.getQuery(includedItems, excludedItems, this.props), false, false);

    this.setState({
      includedItems: includedItems,
      excludedItems: excludedItems,
    });
  }

  private handleListSelect(item: IListItem): void {
    const includedItems = [item];
    const excludedItems: IListItem[] = [];

    this.props.onChange(this.getQuery(includedItems, excludedItems, this.props), true, true);

    this.setState({
      includedItems: includedItems,
      excludedItems: excludedItems,
    });
  }

  private handleListRenderItem(item: IListItem): JSX.Element {
    return (
      <span>
        { this.props.titleForItem(item) }
      </span>
    );
  }

  private handleListRenderItemButton(item: IListItem, button: string): JSX.Element {
    switch (button) {
      case 'exclude':
        return (
          <Icon className={classNames({ 'selected': this.state.excludedItems.indexOf(item) !== -1 })} name="minus-square" />
        );

      case 'include':
        return (
          <Icon className={classNames({ 'selected': this.state.includedItems.indexOf(item) !== -1 })} name="plus-square" />
        );

      default:
        throw new Error('Not implemented.');
    }
  }

  private handleListButtonSelect(item: IListItem, button: string): void {
    switch (button) {
      case 'exclude':
        this.toggleItemExclude(item);
        break;

      case 'include':
        this.toggleItemInclude(item);
        break;
    }
  }

  render(): JSX.Element {
    return (
      <div className="list-query-builder-component">
        <List className="list" items={this.props.items} buttons={['exclude', 'include']} keyForItem={this.props.keyForItem} titleForItem={this.props.titleForItem} renderItem={this.handleListRenderItem} renderItemButton={this.handleListRenderItemButton} onSelect={this.handleListSelect} onButtonSelect={this.handleListButtonSelect} />
      </div>
    );
  }
}
