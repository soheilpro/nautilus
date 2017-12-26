import * as React from 'react';
import * as classNames from 'classnames';
import Dropdown from '../dropdown';
import ItemList from './item-list';
import { ISelectItem } from './iselect-item';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ISelectProps {
  items: ISelectItem[];
  selectedItem: ISelectItem;
  displayProperty: string;
  placeholder?: string;
  className?: string;
  onChange(item: ISelectItem): void;
}

interface ISelectState {
  selectedItem: ISelectItem;
}

export default class Select extends React.PureComponent<ISelectProps, ISelectState> {
  private dropdownComponent: Dropdown;

  constructor(props: ISelectProps) {
    super();

    this.handleItemListSelect = this.handleItemListSelect.bind(this);

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
        selectedItem,
      });
    }
  }

  private handleItemListSelect(item: ISelectItem): void {
    this.dropdownComponent.close();
    this.dropdownComponent.focus();
    this.props.onChange(item);
  }

  private getSelectedItem(selectedItem: ISelectItem, items: ISelectItem[]): ISelectItem {
    // Ensure selectedItem exists in items
    return items.indexOf(selectedItem) !== -1 ? selectedItem : null;
  }

  private getDropdownTitle(): JSX.Element {
    return (
      <span className={classNames('title', { 'placeholder': !this.props.selectedItem })}>
        {
          this.props.selectedItem ?
            this.props.selectedItem[this.props.displayProperty] :
            this.props.placeholder
        }
      </span>
    );
  }

  render(): JSX.Element {
    return (
      <div className={classNames('select-component', this.props.className)}>
        <Dropdown className="dropdown" title={this.getDropdownTitle()} ref={e => this.dropdownComponent = e}>
          <ItemList items={this.props.items} selectedItem={this.state.selectedItem} displayProperty={this.props.displayProperty} onSelect={this.handleItemListSelect} />
        </Dropdown>
      </div>
    );
  }
};
