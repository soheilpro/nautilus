import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../../framework/keyboard';
import { Input } from '../input';
import { Icon } from '../icon';

require('../../assets/stylesheets/base.less');
require('./index.less');

export interface IListItem {
}

interface IListProps {
  items?: IListItem[];
  getItems?: (query: string, filterItems: (items: IListItem[], query: string) => Promise<IListItem[]>) => Promise<IListItem[]>;
  buttons?: string[];
  showSelectionMarks?: boolean;
  defaultSelectedItemIndex?: number;
  keyForItem(item: IListItem): string;
  titleForItem?(item: IListItem): string;
  isItemEnabled?(item: IListItem): boolean;
  isItemSelected?(item: IListItem): boolean;
  renderItem(item: IListItem): JSX.Element;
  renderItemButton?(item: IListItem, button: string): JSX.Element;
  renderInstruction?(): JSX.Element;
  className?: string;
  onSelect(item: IListItem): void;
  onButtonSelect?(item: IListItem, button: string): void;
}

interface IListState {
  items?: IListItem[];
  activeItemIndex?: number;
  searchText?: string;
}

export class List extends React.PureComponent<IListProps, IListState> {
  static defaultProps = {
    items: new Array(),
    buttons: new Array(),
  };

  private searchCounter = 0;

  constructor(props: IListProps) {
    super(props);

    this.getItems = this.getItems.bind(this);
    this.filterItems = this.filterItems.bind(this);
    this.isItemEnabled = this.isItemEnabled.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleListMouseLeave = this.handleListMouseLeave.bind(this);
    this.handleItemMouseEnter = this.handleItemMouseEnter.bind(this);
    this.handleItemContentClick = this.handleItemContentClick.bind(this);
    this.handleItemButtonClick = this.handleItemButtonClick.bind(this);

    this.state = {
      items: [],
      searchText: '',
    };
  }

  async componentWillMount(): Promise<void> {
    const items = await this.getItems(this.props.items, this.state.searchText);

    this.setState({
      items: items,
    });
  }

  async componentWillReceiveProps(props: IListProps): Promise<void> {
    if (this.props.items !== props.items) {
      const items = await this.getItems(props.items, this.state.searchText);

      this.setState({
        items: items,
      });
    }
  }

  private async getItems(items: IListItem[], query: string): Promise<IListItem[]> {
    if (this.props.getItems)
      return this.props.getItems(query, this.filterItems);

    return this.filterItems(items, query);
  }

  private async filterItems(items: IListItem[], query: string): Promise<IListItem[]> {
    if (query) {
      query = query.toLowerCase();
      items = items.filter(item => (this.props.titleForItem(item) || '').toLowerCase().indexOf(query) !== -1);
    }

    return Promise.resolve(items);
  }

  private isItemEnabled(item: IListItem): boolean {
    return this.props.isItemEnabled ? this.props.isItemEnabled(item) : true;
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
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

        if (this.isItemEnabled(selectedItem))
          this.props.onSelect(selectedItem);
      }
    }
    else if (event.which === KeyCode.Escape) {
      event.preventDefault();
    }
  }

  private async handleSearchTextChange(value: string): Promise<void> {
    this.searchCounter++;

    this.setState({
      searchText: value,
    });

    value = value.trim();

    const searchCounter = this.searchCounter;
    const items = await this.getItems(this.props.items, value);

    // Display results only if no other search has been performed in the meantime
    if (searchCounter !== this.searchCounter)
      return;

    this.setState({
      items: items,
      activeItemIndex: value && items.length > 0 ? (this.props.defaultSelectedItemIndex || 0) : -1,
    });
  }

  private handleListMouseLeave(): void {
    this.setState({
      activeItemIndex: -1,
    });
  }

  private handleItemMouseEnter(item: IListItem): void {
    this.setState(state => {
      return {
        activeItemIndex: state.items.indexOf(item),
      };
    });
  }

  private handleItemContentClick(item: IListItem, event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();

    if (this.isItemEnabled(item))
      this.props.onSelect(item);
  }

  private handleItemButtonClick(item: IListItem, button: string, event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();

    if (this.isItemEnabled(item))
      this.props.onButtonSelect(item, button);
  }

  render(): JSX.Element {
    return (
      <div className={classNames('list-component', this.props.className)} onKeyDown={this.handleKeyDown}>
        <Input className="search-input" value={this.state.searchText} autoFocus={true} selectOnFocus={true} style="simple" onChange={this.handleSearchTextChange} />
          {
            this.state.items.length > 0 ?
              <div className="list-items" onMouseLeave={this.handleListMouseLeave}>
                {
                  this.state.items.map((item, index) => {
                    return (
                      <div className={classNames('list-item', { 'disabled': !this.isItemEnabled(item), 'active': index === this.state.activeItemIndex })} onMouseEnter={_.partial(this.handleItemMouseEnter, item)} key={this.props.keyForItem(item)}>
                        {
                          this.props.buttons.map(button => {
                            return (
                              <a className={classNames('list-item-button', `button-${button}`)} onClick={_.partial(this.handleItemButtonClick, item, button)} href="#" key={button}>
                                { this.props.renderItemButton(item, button) }
                              </a>
                            );
                          })
                        }
                        {
                          this.props.buttons.length > 0 &&
                            <span className="spacer"></span>
                        }
                        <a className="content" onClick={_.partial(this.handleItemContentClick, item)} href="#">
                          {
                            this.props.showSelectionMarks &&
                              <Icon className={classNames('icon', { 'selected': this.props.isItemSelected(item) })} name="check" />
                          }
                          { this.props.renderItem(item) }
                        </a>
                      </div>
                    );
                  })
                }
              </div>
              :
              !this.state.searchText ?
                <div className="instruction">
                  { this.props.renderInstruction && this.props.renderInstruction() }
                </div>
                :
                <div className="no-result">
                  No results found.
                </div>
          }
      </div>
    );
  }
}
