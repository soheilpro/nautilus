import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../keyboard';
import { IItem } from './iitem';
import TableHeader from './table-header';
import TableRow from './table-row';
import TableFooter from './table-footer';

require('../../assets/stylesheets/base.less');
require('./index.less');

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
  chunks?: IChunk[];
  selectedItem?: IItem;
}

export default class Table extends React.PureComponent<ITableProps, ITableState> {
  private componentElement: HTMLElement;
  private selectedChunkComponent: Chunk;

  constructor(props: ITableProps) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleItemSelect = this.handleItemSelect.bind(this);
    this.handleItemAction = this.handleItemAction.bind(this);

    const chunks = this.getChunks(props.items);

    this.state = {
      chunks: chunks,
    };
  }

  componentDidUpdate() {
    if (this.componentElement.contains(document.activeElement) && this.selectedChunkComponent)
      this.selectedChunkComponent.focus();
  }

  componentWillReceiveProps(props: ITableProps) {
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
          chunks: this.getChunks(props.items),
        });
      }

      this.setState({
        selectedItem,
      });
    }
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLTableElement>) {
    if (event.which === KeyCode.DownArrow) {
      const selectedItemIndex = this.props.items.indexOf(this.state.selectedItem);

      if (selectedItemIndex < this.props.items.length - 1) {
        event.preventDefault();

        const selectedItem = this.props.items[selectedItemIndex + 1];

        this.setState({
          selectedItem: selectedItem,
        });

        this.props.onItemSelect(selectedItem);
      }
    }
    else if (event.which === KeyCode.UpArrow) {
      const selectedItemIndex = this.props.items.indexOf(this.state.selectedItem);

      if (selectedItemIndex > 0) {
        event.preventDefault();

        const selectedItem = this.props.items[selectedItemIndex - 1];

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

  private handleItemSelect(item: IItem) {
    if (this.props.onItemSelect)
      this.props.onItemSelect(item);

    this.setState({
      selectedItem: item,
    });
  }

  private handleItemAction(item: IItem) {
    if (this.props.onItemAction)
      this.props.onItemAction(item);
  }

  private getChunks(items: IItem[]) {
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

  private getSelectedChunk(chunks: IChunk[], selectedItem: IItem) {
    for (const chunk of chunks)
      if (chunk.items.indexOf(selectedItem) !== -1)
        return chunk;

    return null;
  }

  render() {
    const selectedChunk = this.getSelectedChunk(this.state.chunks, this.state.selectedItem);

    return (
      <table className={classNames('table-component', this.props.className)} onKeyDown={this.handleKeyDown} ref={e => this.componentElement = e}>
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
              <Chunk index={index} items={chunk.items} selectedItem={isSelected ? this.state.selectedItem : null} Row={this.props.Row} onItemSelect={this.handleItemSelect} onItemAction={this.handleItemAction} ref={e => this.selectedChunkComponent = isSelected ? e : this.selectedChunkComponent} key={index} />
            );
          })
        }
        <tfoot className="table-footer">
          {
            this.props.Footer &&
              <this.props.Footer items={this.props.items} />
          }
        </tfoot>
      </table>
    );
  }
};

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

  focus() {
    this.selectedRow.focus();
  }

  render() {
    return (
      <tbody className="table-body">
        {
          this.props.items.map((item, index) => {
            const isSelected = (this.props.selectedItem === item);

            return (
              <this.props.Row item={item} index={index} isSelected={isSelected} onSelect={this.props.onItemSelect} onAction={this.props.onItemAction} ref={e => this.selectedRow = isSelected ? e : this.selectedRow} key={item.id} />
            );
          })
        }
      </tbody>
    );
  }
};

export { ITableRow } from './table-row';
