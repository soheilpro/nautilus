import * as React from 'react';
import { KeyCode } from '../../../framework/keyboard';

interface IWindowContainerProps {
  position: 'absolute' | 'fixed';
  top?: number;
  width?: number;
  closeOnBlur?: boolean;
  closeOnEsc?: boolean;
  blurCheckElement?: HTMLElement;
  onClose?(): void;
}

interface IWindowContainerState {
  zIndex?: number;
}

export class WindowContainer extends React.PureComponent<IWindowContainerProps, IWindowContainerState> {
  static defaultProps = {
    closeOnBlur: true,
    closeOnEsc: true,
  };

  private static zIndexCounter = 1000;

  private componentElement?: HTMLElement;

  constructor() {
    super();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {};
  }

  componentWillMount(): void {
    this.state = {
      zIndex: WindowContainer.zIndexCounter++,
    };
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.which === KeyCode.Escape) {
      event.preventDefault();

      if (this.props.closeOnEsc)
        this.props.onClose();
    }
  }

  private handleBlur(event: React.FocusEvent<HTMLDivElement>): void {
    if (!this.props.closeOnBlur)
      return;

    setTimeout(() => {
      if ((this.props.blurCheckElement || this.componentElement).contains(document.activeElement))
        return;

      if (this.props.closeOnEsc)
        this.props.onClose();
    }, 0);
  }

  render(): JSX.Element {
    return (
      <div className="window-container-component" style={{ position: this.props.position, top: this.props.top, left: `calc(100% / 2 - ${this.props.width}px / 2)`, width: this.props.width, zIndex: this.state.zIndex }} tabIndex={0} onKeyDown={this.handleKeyDown} onBlur={this.handleBlur} ref={e => this.componentElement = e}>
        {this.props.children}
      </div>
    );
  }
};
