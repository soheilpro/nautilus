import * as _ from 'underscore';
import * as React from 'react';
import { ServiceManager } from '../../services';
import { IWindow, IWindowController } from '../../windows';
import { WindowContainer } from '../window';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IExtendedWindow extends IWindow {
  key?: number;
  focusedElementOnOpen?: HTMLElement;
}

interface IWindowControllerProps {
}

interface IWindowControllerState {
  windows?: IExtendedWindow[];
}

export default class WindowController extends React.PureComponent<IWindowControllerProps, IWindowControllerState> implements IWindowController {
  private windowKeyCounter = 0;
  private elementToFocus?: HTMLElement;

  private get commandController() {
    return ServiceManager.Instance.getCommandController();
  }

  constructor() {
    super();

    this.handleWindowContainerClose = this.handleWindowContainerClose.bind(this);

    this.state = {
      windows: [],
    };
  }

  componentWillMount() {
    ServiceManager.Instance.setWindowController(this);
  }

  componentDidUpdate() {
    if (this.elementToFocus)
      this.elementToFocus.focus();

    document.body.style.overflowY = this.state.windows.some(window => window.modal) ? 'hidden' : null;
  }

  componentWillUnmount() {
    ServiceManager.Instance.setWindowController(undefined);
  }

  showWindow(window: IWindow, callback?: () => any) {
    const extendedWindow: IExtendedWindow = window;
    extendedWindow.key = this.windowKeyCounter++;
    extendedWindow.focusedElementOnOpen = document.activeElement as HTMLElement;

    this.elementToFocus = null;

    this.setState(state => ({
      windows: [...state.windows, extendedWindow],
    }), callback);

    if (window.modal)
      this.commandController.disableCommandShortcuts();
  }

  closeWindow(window: IExtendedWindow, callback?: () => any) {
    this.elementToFocus = window.focusedElementOnOpen;

    this.setState(state => ({
      windows: state.windows.filter(x => x !== window),
    }), callback);

    if (window.modal)
      this.commandController.enableCommandShortcuts();
  }

  private handleWindowContainerClose(window: IExtendedWindow) {
    this.closeWindow(window);
  }

  render() {
    return (
      <div className="window-controller-component">
      {
        this.state.windows.map((window, index) => {
          return (
            <div key={window.key}>
              {
                window.modal &&
                  <div className="overlay"></div>
              }
              <WindowContainer position="fixed" top={window.top} width={window.width} closeOnBlur={!window.modal} onClose={_.partial(this.handleWindowContainerClose, window)} >
                {window.content}
              </WindowContainer>
            </div>
          );
        })
      }
      </div>
    );
  }
};
