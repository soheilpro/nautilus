import * as React from 'react';
import * as classNames from 'classnames';
import { Dropdown } from '../dropdown';
import { List, IListItem } from '../list';

require('../../assets/stylesheets/base.less');
require('./index.less');

export interface ISelectItem {
}

const emptySelectItem: ISelectItem = {};

interface ISelectProps {
  items: ISelectItem[];
  selectedItem: ISelectItem;
  keyForItem: (item: ISelectItem) => string;
  titleForItem: (item: ISelectItem) => string;
  placeholder?: string;
  className?: string;
  onChange(item: ISelectItem): void;
}

interface ISelectState {
  selectedItem: ISelectItem;
}

export class Select extends React.PureComponent<ISelectProps, ISelectState> {
  private dropdownRef: Dropdown;

  constructor(props: ISelectProps) {
    super();

    this.handleListGetItems = this.handleListGetItems.bind(this);
    this.handleListKeyForItem = this.handleListKeyForItem.bind(this);
    this.handleListIsItemSelected = this.handleListIsItemSelected.bind(this);
    this.handleListRenderItem = this.handleListRenderItem.bind(this);
    this.handleListSelect = this.handleListSelect.bind(this);

    this.state = {
      selectedItem: this.getSelectedItem(props.selectedItem, props.items),
    };
  }

  componentWillReceiveProps(props: ISelectProps): void {
    if (this.props.items !== props.items || this.props.selectedItem !== props.selectedItem) {
      const selectedItem = this.getSelectedItem(props.selectedItem, props.items);

      if (selectedItem !== props.selectedItem)
        this.props.onChange(null);

      this.setState({
        selectedItem: selectedItem,
      });
    }
  }

  private getSelectedItem(selectedItem: ISelectItem, items: ISelectItem[]): ISelectItem {
    // Ensure selectedItem exists in items
    return items.indexOf(selectedItem) !== -1 ? selectedItem : null;
  }

  private handleListSelect(item: ISelectItem): void {
    this.dropdownRef.close();
    this.dropdownRef.focus();

    if (item === emptySelectItem)
      item = null;

    this.props.onChange(item);
  }

  private async handleListGetItems(query: string, filterItems: (items: IListItem[], query: string) => Promise<IListItem[]>): Promise<IListItem[]> {
    const items = [emptySelectItem, ...await filterItems(this.props.items, query)];

    return Promise.resolve(items);
  }

  private handleListKeyForItem(selectItem: ISelectItem): string {
    if (selectItem === emptySelectItem)
      return '';

    return this.props.keyForItem(selectItem);
  }

  private handleListIsItemSelected(selectItem: ISelectItem): boolean {
    return selectItem === this.state.selectedItem;
  }

  private handleListRenderItem(selectItem: ISelectItem): JSX.Element {
    return (
      <span className={classNames({ 'empty': selectItem === emptySelectItem })}>
        {
          selectItem !== emptySelectItem ?
            this.props.titleForItem(selectItem) :
            '(None)'
        }
      </span>
    );
  }

  render(): JSX.Element {
    let dropdownTitle =
      <span className={classNames('title', { 'placeholder': !this.props.selectedItem })}>
        {
          this.props.selectedItem ?
            this.props.titleForItem(this.props.selectedItem) :
            this.props.placeholder
        }
      </span>;

    return (
      <div className={classNames('select-component', this.props.className)}>
        <Dropdown className="dropdown" title={dropdownTitle} ref={e => this.dropdownRef = e}>
          <List className="list" getItems={this.handleListGetItems} keyForItem={this.handleListKeyForItem} titleForItem={this.props.titleForItem} isItemSelected={this.handleListIsItemSelected} renderItem={this.handleListRenderItem} showSelectionMarks={true} defaultSelectedItemIndex={1} onSelect={this.handleListSelect} />
        </Dropdown>
      </div>
    );
  }
}
