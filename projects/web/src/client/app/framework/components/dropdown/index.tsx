import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { KeyCode } from '../../../framework/keyboard';
import Icon from '../icon';
import Window, { WindowContainer } from '../window';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IDropdownProps {
  title: string | JSX.Element;
  className?: string;
  onOpen?(): void;
  onClose?(): void;
}

interface IDropdownState {
  isOpen?: boolean;
}

export default class Dropdown extends React.PureComponent<IDropdownProps, IDropdownState> {
  private componentElement: HTMLElement;
  private buttonElement: HTMLElement;
  private windowContainerComponent: WindowContainer;

  constructor() {
    super();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleButtonKeyDown = this.handleButtonKeyDown.bind(this);
    this.handleWindowContainerClose = this.handleWindowContainerClose.bind(this);

    this.state = {};
  }

  componentDidUpdate(): void {
    if (this.windowContainerComponent) {
      const windowContainerElement = ReactDOM.findDOMNode(this.windowContainerComponent) as HTMLElement;
      const windowContainerElementRect = windowContainerElement.getBoundingClientRect();

      if (windowContainerElementRect.right > window.innerWidth)
        windowContainerElement.style.left = (this.buttonElement.offsetLeft + this.buttonElement.offsetWidth - windowContainerElementRect.width) + 'px';
    }
  }

  open(): void {
    this.setState({
      isOpen: true,
    });

    if (this.props.onOpen)
      this.props.onOpen();
  }

  close(): void {
    this.setState({
      isOpen: false,
    });

    if (this.props.onClose)
      this.props.onClose();
  }

  focus(): void {
    this.buttonElement.focus();
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.which === KeyCode.Escape) {
      if (this.state.isOpen) {
        event.preventDefault();
        event.stopPropagation();

        this.close();
        this.focus();
      }
    }
  }

  private handleButtonClick(): void {
    if (!this.state.isOpen)
      this.open();
    else
      this.close();
  }

  private handleButtonKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.which === KeyCode.Enter) {
      const form = $(this.componentElement).closest('form')[0];

      if (form) {
        // Because calling form.submit() will not trigger events
        let button = form.ownerDocument.createElement('input');
        button.style.display = 'none';
        button.type = 'submit';
        form.appendChild(button).click();
        form.removeChild(button);
      }
    }
    else if (event.which === KeyCode.UpArrow || event.which === KeyCode.DownArrow || event.which === KeyCode.Space) {
      event.preventDefault();

      if (!this.state.isOpen)
        this.open();
    }
  }

  private handleWindowContainerClose(): void {
    this.close();
  }

  render(): JSX.Element {
    return (
      <div className={classNames('dropdown-component', this.props.className, { 'open': this.state.isOpen })} onKeyDown={this.handleKeyDown} ref={e => this.componentElement = e}>
        <div className="button" tabIndex={0} onClick={this.handleButtonClick} onKeyDown={this.handleButtonKeyDown} ref={e => this.buttonElement = e}>
          {this.props.title}
          <Icon className="caret" name={this.state.isOpen ? 'caret-up' : 'caret-down'} />
        </div>
        {
          this.state.isOpen &&
            <WindowContainer position="absolute" blurCheckElement={this.componentElement} onClose={this.handleWindowContainerClose} ref={e => this.windowContainerComponent = e}>
              <Window className="window">
                {this.props.children}
              </Window>
            </WindowContainer>
        }
      </div>
    );
  }
}
