import * as React from 'react';
import { IItemState, IApplication, ItemKind } from '../../application';
import { IItemStateController } from '../../modules/item-states';
import { ServiceManager } from '../../services';
import { IWindowController } from '../../framework/windows';
import { ItemStatePaletteWindow } from '../item-state-palette-window';

interface IItemStateControllerProps {
}

interface IItemStateControllerState {
}

export class ItemStateController extends React.PureComponent<IItemStateControllerProps, IItemStateControllerState> implements IItemStateController {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');

  constructor() {
    super();

    this.state = {};
  }

  componentWillMount(): void {
    ServiceManager.Instance.registerService('IItemStateController', this);
  }

  componentWillUnmount(): void {
    ServiceManager.Instance.unregisterService('IItemStateController', this);
  }

  selectItemState(itemKind: ItemKind): Promise<IItemState> {
    let _resolve: (itemState: IItemState) => void;

    const handleSelect = (itemState: IItemState) => {
      this.windowController.closeWindow(handle, () => {
        _resolve(itemState);
      });
    };

    const itemStates = this.application.itemStates.getAll(itemKind);

    const window = <ItemStatePaletteWindow itemStates={itemStates} onSelect={handleSelect} />;
    const options = {
      top: 20,
      width: 600,
    };

    const handle = this.windowController.showWindow(window, options);

    return new Promise(resolve => {
      _resolve = resolve;
    });
  }

  render(): JSX.Element {
    return (
      <div className="item-state-controller-component">
      </div>
    );
  }
}
