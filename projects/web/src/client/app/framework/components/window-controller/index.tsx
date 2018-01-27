import * as _ from 'underscore';
import * as React from 'react';
import { ServiceManager } from '../../../services';
import { IWindowController, IWindowOptions } from '../../windows';
import { WindowContainer } from '../window';
import { ICommandController } from '../../commands';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IWindowHandle {
  window: JSX.Element;
  options: IWindowOptions;
  key?: number;
  focusedElementOnOpen?: HTMLElement;
}

interface IWindowControllerProps {
}

interface IWindowControllerState {
  handles?: IWindowHandle[];
}

export class WindowController extends React.PureComponent<IWindowControllerProps, IWindowControllerState> implements IWindowController {
  private windowKeyCounter = 0;
  private elementToFocus?: HTMLElement;

  private get commandController(): ICommandController {
    return ServiceManager.Instance.getService<ICommandController>('ICommandController');
  }

  constructor() {
    super();

    this.handleWindowContainerClose = this.handleWindowContainerClose.bind(this);

    this.state = {
      handles: [],
    };
  }

  componentWillMount(): void {
    ServiceManager.Instance.registerService('IWindowController', this);
  }

  componentDidUpdate(): void {
    if (this.elementToFocus)
      this.elementToFocus.focus();
  }

  componentWillUnmount(): void {
    ServiceManager.Instance.unregisterService('IWindowController', this);
  }

  showWindow(window: JSX.Element, options: IWindowOptions, callback?: () => any): IWindowHandle {
    const handle: IWindowHandle = {
      window: window,
      options: options,
      key: this.windowKeyCounter++,
      focusedElementOnOpen: document.activeElement as HTMLElement,
    };

    this.elementToFocus = null;

    this.setState(state => ({
      handles: [...state.handles, handle],
    }), callback);

    if (options.modal)
      this.commandController.disableCommandShortcuts();

    return handle;
  }

  closeWindow(handle: IWindowHandle, callback?: () => any): void {
    this.elementToFocus = handle.focusedElementOnOpen;

    this.setState(state => ({
      handles: state.handles.filter(x => x !== handle),
    }), callback);

    if (handle.options.modal)
      this.commandController.enableCommandShortcuts();
  }

  private handleWindowContainerClose(handle: IWindowHandle): void {
    this.closeWindow(handle);
  }

  render(): JSX.Element {
    return (
      <div className="window-controller-component">
      {
        this.state.handles.map(handle => {
          return (
            <div key={handle.key}>
              {
                handle.options.modal &&
                  <div className="overlay"></div>
              }
              <WindowContainer position="absolute" top={handle.options.top} width={handle.options.width} closeOnBlur={!handle.options.modal} onClose={_.partial(this.handleWindowContainerClose, handle)} >
                {handle.window}
              </WindowContainer>
            </div>
          );
        })
      }
      </div>
    );
  }
}
