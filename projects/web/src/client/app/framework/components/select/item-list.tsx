import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../../framework/keyboard';
import Icon from '../icon';
import Input from '../input';
import { ISelectItem } from './iselect-item';

require('../../assets/stylesheets/base.less');
require('./item-list.less');

const emptySelectItem: ISelectItem = {
  id: ''
};

interface ISelectItemListProps {
  items: ISelectItem[];
  selectedItem: ISelectItem;
  displayProperty: string;
  onSelect(item: ISelectItem): void;
}

interface ISelectItemListState {
  items?: ISelectItem[];
  activeItemIndex?: number;
  searchText?: string;
}

export default class ItemList extends React.PureComponent<ISelectItemListProps, ISelectItemListState> {
  constructor(props: ISelectItemListProps) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleItemListMouseLeave = this.handleItemListMouseLeave.bind(this);
    this.handleItemMouseEnter = this.handleItemMouseEnter.bind(this);
    this.handleItemTitleClick = this.handleItemTitleClick.bind(this);

    this.state = {
      items: [emptySelectItem, ...props.items],
    };
  }

  componentWillReceiveProps(props: ISelectItemListProps) {
    if (this.props.items !== props.items) {
      this.setState({
        items: [emptySelectItem, ...props.items],
      });
    }
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      this.setState(state => {
        return {
          activeItemIndex: state.activeItemIndex < state.items.length - 1 ? state.activeItemIndex + 1 : 0,
        };
      });
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      this.setState(state => {
        return {
          activeItemIndex: state.activeItemIndex > 0 ? state.activeItemIndex - 1 : state.items.length - 1,
        };
      });
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (this.state.activeItemIndex !== -1) {
        const selectedItem = this.state.items[this.state.activeItemIndex];
        this.props.onSelect(selectedItem);
      }
    }
    else if (event.which === KeyCode.Escape) {
      event.preventDefault();
    }
  }

  private handleSearchTextChange(value: string) {
    this.setState({
      searchText: value,
    });

    value = value.trim();

    this.setState({
      items: [emptySelectItem, ...this.filterItems(this.props.items, value)],
      activeItemIndex: value ? 1 : -1,
    });
  }

  private handleItemListMouseLeave() {
    this.setState({
      activeItemIndex: -1,
    });
  }

  private handleItemMouseEnter(item: ISelectItem) {
    this.setState(state => {
      return {
        activeItemIndex: state.items.indexOf(item),
      };
    });
  }

  private handleItemTitleClick(item: ISelectItem, event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (item === emptySelectItem)
      item = null;

    this.props.onSelect(item);
  }

  private filterItems(items: ISelectItem[], text: string) {
    if (!text)
      return items;

    text = text.toLowerCase();

    return items.filter(item => item === emptySelectItem || (item[this.props.displayProperty] || '').toLowerCase().indexOf(text) !== -1);
  }

  render() {
    return (
      <div className="item-list-component" onKeyDown={this.handleKeyDown}>
        <Input className="search-input" value={this.state.searchText} autoFocus={true} selectOnFocus={true} style="simple" onChange={this.handleSearchTextChange} />
        <div className="item-list" onMouseLeave={this.handleItemListMouseLeave}>
          {
            this.state.items.map((item, index) => {
              return (
                <div className={classNames('item', 'row', { 'active': index === this.state.activeItemIndex })} onMouseEnter={_.partial(this.handleItemMouseEnter, item)} key={item.id}>
                  <a className={classNames('title', { empty: item === emptySelectItem }) } href="#" onClick={_.partial(this.handleItemTitleClick, item)}>
                    <Icon className={classNames('icon', { 'selected': item === this.props.selectedItem })} name="check" />
                    {
                      item !== emptySelectItem ?
                        item[this.props.displayProperty] :
                        '(None)'
                    }
                  </a>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
};
