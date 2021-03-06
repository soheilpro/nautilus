import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../../framework/keyboard';
import { IItem } from './iitem';
import { TableHeader } from './table-header';
import { TableRow } from './table-row';
import { TableFooter } from './table-footer';
import { Button } from '../button';

require('../../assets/stylesheets/base.less');
require('./index.less');

const PAGE_SIZE = 200;
const CHUNK_SIZE = 70;

interface IChunk {
  items: IItem[];
}

interface ITableProps {
  items: IItem[];
  selectedItem?: IItem;
  Header?: typeof TableHeader;
  Row: typeof TableRow;
  Footer?: typeof TableFooter;
  className?: string;
  onItemSelect?(item: IItem): void;
  onItemAction?(item: IItem): void;
  onItemDelete?(item: IItem): void;
}

interface ITableState {
  maxVisibleItems: number;
  chunks?: IChunk[];
  selectedItem?: IItem;
}

export class Table extends React.PureComponent<ITableProps, ITableState> {
  private componentRef: HTMLElement;
  private selectedChunk: Chunk;

  constructor(props: ITableProps) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleItemSelect = this.handleItemSelect.bind(this);
    this.handleItemAction = this.handleItemAction.bind(this);
    this.handleShowAllItems = this.handleShowAllItems.bind(this);

    const chunks = this.getChunks(_.first(props.items, PAGE_SIZE));

    this.state = {
      maxVisibleItems: PAGE_SIZE,
      chunks: chunks,
    };
  }

  componentDidUpdate(): void {
    if (this.componentRef.contains(document.activeElement) && this.selectedChunk)
      this.selectedChunk.focus();
  }

  componentWillReceiveProps(props: ITableProps): void {
    if (this.props.items !== props.items || this.props.selectedItem !== props.selectedItem) {
      let selectedItem = props.selectedItem;

      if (!selectedItem) {
        // Handle deleted item
        if (props.items.indexOf(this.state.selectedItem) === -1) {
          let selectedItemIndex = this.props.items.indexOf(this.state.selectedItem);

          if (selectedItemIndex > props.items.length - 1)
            selectedItemIndex = props.items.length - 1;
          else if (selectedItemIndex < 0)
            selectedItemIndex = 0;

          selectedItem = props.items[selectedItemIndex];

          if (selectedItem)
            if (props.onItemSelect)
              props.onItemSelect(selectedItem);
        }
      }

      if (this.props.items !== props.items) {
        this.setState({
          maxVisibleItems: PAGE_SIZE,
          chunks: this.getChunks(_.first(props.items, PAGE_SIZE)),
        });
      }

      this.setState({
        selectedItem: selectedItem,
      });
    }
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLTableElement>): void {
    const items = _.first(this.props.items, this.state.maxVisibleItems);

    if (event.which === KeyCode.DownArrow) {
      const selectedItemIndex = items.indexOf(this.state.selectedItem);

      if (selectedItemIndex < items.length - 1) {
        event.preventDefault();

        const selectedItem = !event.metaKey ? items[selectedItemIndex + 1] : items[items.length - 1];

        this.setState({
          selectedItem: selectedItem,
        });

        this.props.onItemSelect(selectedItem);
      }
    }
    else if (event.which === KeyCode.UpArrow) {
      const selectedItemIndex = items.indexOf(this.state.selectedItem);

      if (selectedItemIndex > 0) {
        event.preventDefault();

        const selectedItem = !event.metaKey ? items[selectedItemIndex - 1] : items[0];

        this.setState({
          selectedItem: selectedItem,
        });

        this.props.onItemSelect(selectedItem);
      }
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (this.props.onItemAction)
        this.props.onItemAction(this.state.selectedItem);
    }
    else if (event.which === KeyCode.Delete) {
      event.preventDefault();

      if (this.props.onItemDelete)
        this.props.onItemDelete(this.state.selectedItem);
    }
  }

  private handleItemSelect(item: IItem): void {
    if (this.props.onItemSelect)
      this.props.onItemSelect(item);

    this.setState({
      selectedItem: item,
    });
  }

  private handleItemAction(item: IItem): void {
    if (this.props.onItemAction)
      this.props.onItemAction(item);
  }

  private handleShowAllItems(): void {
    const maxVisibleItems = Number.MAX_VALUE;

    this.setState({
      maxVisibleItems: maxVisibleItems,
      chunks: this.getChunks(_.first(this.props.items, maxVisibleItems)),
    });
  }

  private getChunks(items: IItem[]): IChunk[] {
    const totalChunks = Math.ceil(items.length / CHUNK_SIZE);
    const chunks: IChunk[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const chunk = {
        items: items.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
      };

      chunks.push(chunk);
    }

    return chunks;
  }

  private getSelectedChunk(chunks: IChunk[], selectedItem: IItem): IChunk {
    for (const chunk of chunks)
      if (chunk.items.indexOf(selectedItem) !== -1)
        return chunk;

    return null;
  }

  render(): JSX.Element {
    const items = _.first(this.props.items, this.state.maxVisibleItems);
    const selectedChunk = this.getSelectedChunk(this.state.chunks, this.state.selectedItem);

    return (
      <div className={classNames('table-component', this.props.className)}>
        <table onKeyDown={this.handleKeyDown} ref={e => this.componentRef = e}>
          <thead className="table-header">
            {
              this.props.Header &&
                <this.props.Header />
            }
          </thead>
          {
            this.state.chunks.map((chunk, index) => {
              const isSelected = (selectedChunk === chunk);

              return (
                <Chunk index={index} items={chunk.items} selectedItem={isSelected ? this.state.selectedItem : null} Row={this.props.Row} onItemSelect={this.handleItemSelect} onItemAction={this.handleItemAction} ref={e => this.selectedChunk = isSelected ? e : this.selectedChunk} key={index} />
              );
            })
          }
          <tfoot className="table-footer">
            {
              this.props.Footer &&
                <this.props.Footer items={items} />
            }
          </tfoot>
        </table>
        {
          items.length < this.props.items.length &&
            <Button className="show-all-items-button" type="link" onClick={this.handleShowAllItems}>Show all {this.props.items.length} items</Button>
        }
        </div>
    );
  }
}

interface IChunkProps {
  index: number;
  items: IItem[];
  selectedItem: IItem;
  Row: typeof TableRow;
  onItemSelect(item: IItem): void;
  onItemAction(item: IItem): void;
}

interface IChunkState {
}

class Chunk extends React.PureComponent<IChunkProps, IChunkState> {
  private selectedRow: TableRow;

  focus(): void {
    this.selectedRow.focus();
  }

  render(): JSX.Element {
    return (
      <tbody className="table-body">
        {
          this.props.items.map((item, index) => {
            const isSelected = (this.props.selectedItem === item);

            return (
              <this.props.Row item={item} index={this.props.index * CHUNK_SIZE + index} isSelected={isSelected} onSelect={this.props.onItemSelect} onAction={this.props.onItemAction} ref={e => this.selectedRow = isSelected ? e : this.selectedRow} key={item.id} />
            );
          })
        }
      </tbody>
    );
  }
}

export { ITableRow } from './table-row';
