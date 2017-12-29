import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../framework/keyboard';
import Input from '../../framework/components/input';
import Icon from '../../framework/components/icon';
import { IView } from './iview';

require('../../assets/stylesheets/base.less');
require('./view-list.less');

interface IViewListProps {
  views: IView[];
  onDelete(view: IView): void;
  onSelect(view: IView): void;
}

interface IViewListState {
  views?: IView[];
  activeViewIndex?: number;
  searchText?: string;
}

export default class ViewList extends React.PureComponent<IViewListProps, IViewListState> {
  constructor(props: IViewListProps) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleViewListMouseLeave = this.handleViewListMouseLeave.bind(this);
    this.handleViewMouseEnter = this.handleViewMouseEnter.bind(this);
    this.handleViewDeleteClick = this.handleViewDeleteClick.bind(this);
    this.handleViewTitleClick = this.handleViewTitleClick.bind(this);

    this.state = {
      views: props.views,
      activeViewIndex: -1,
    };
  }

  componentWillReceiveProps(props: IViewListProps): void {
    if (this.props.views !== props.views) {
      this.setState({
        views: props.views,
      });
    }
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      this.setState(state => {
        return {
          activeViewIndex: state.activeViewIndex < state.views.length - 1 ? state.activeViewIndex + 1 : 0,
        };
      });
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      this.setState(state => {
        return {
          activeViewIndex: state.activeViewIndex > 0 ? state.activeViewIndex - 1 : state.views.length - 1,
        };
      });
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (this.state.activeViewIndex !== -1) {
        const activeView = this.state.views[this.state.activeViewIndex];
        this.props.onSelect(activeView);
      }
    }
  }

  private handleSearchTextChange(value: string): void {
    value = value.trim();

    this.setState({
      searchText: value,
      views: this.filterItems(this.props.views, value),
      activeViewIndex: value ? 0 : -1,
    });
  }

  private handleViewListMouseLeave(): void {
    this.setState({
      activeViewIndex: -1,
    });
  }

  private handleViewMouseEnter(view: IView): void {
    this.setState(state => {
      return {
        activeViewIndex: state.views.indexOf(view),
      };
    });
  }

  private handleViewDeleteClick(view: IView, event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();

    this.props.onDelete(view);
  }

  private handleViewTitleClick(view: IView, event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();

    this.props.onSelect(view);
  }

  private filterItems(views: IView[], text: string): IView[] {
    if (!text)
      return views;

    text = text.toLowerCase();

    return views.filter(view => view.name.toLowerCase().indexOf(text) !== -1);
  }

  render(): JSX.Element {
    return (
      <div className="view-list-component" onKeyDown={this.handleKeyDown}>
        <Input className="search-input" value={this.state.searchText} autoFocus={true} selectOnFocus={true} style="simple" onChange={this.handleSearchTextChange} />
        <div className="view-list" onMouseLeave={this.handleViewListMouseLeave}>
          {
            this.state.views.length > 0 ?
              this.state.views.map((view, index) => {
                return (
                  <div className={classNames('view', 'row', { 'active': index === this.state.activeViewIndex })} onMouseEnter={_.partial(this.handleViewMouseEnter, view)} key={view.id}>
                    <a className="remove" href="#" title="Remove" onClick={_.partial(this.handleViewDeleteClick, view)}>
                      <Icon name="remove" />
                    </a>
                    <a className="name" href="#" onClick={_.partial(this.handleViewTitleClick, view)}>
                      {view.name}
                    </a>
                  </div>
                );
              })
              :
              <div className="no-views-found">
                  No saved views found.
              </div>
          }
        </div>
      </div>
    );
  }
}
