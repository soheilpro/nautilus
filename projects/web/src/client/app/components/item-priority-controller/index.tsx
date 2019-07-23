import * as React from 'react';
import { IItemPriority, IApplication, ItemKind } from '../../application';
import { IItemPriorityController } from '../../modules/item-priorities';
import { ServiceManager } from '../../services';
import { IWindowController } from '../../framework/windows';
import { ItemPriorityPaletteWindow } from '../item-priority-palette-window';

interface IItemPriorityControllerProps {
}

interface IItemPriorityControllerPriority {
}

export class ItemPriorityController extends React.PureComponent<IItemPriorityControllerProps, IItemPriorityControllerPriority> implements IItemPriorityController {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');

  constructor() {
    super();

    this.state = {};
  }

  componentWillMount(): void {
    ServiceManager.Instance.registerService('IItemPriorityController', this);
  }

  componentWillUnmount(): void {
    ServiceManager.Instance.unregisterService('IItemPriorityController', this);
  }

  selectItemPriority(itemKind: ItemKind): Promise<IItemPriority> {
    let _resolve: (itemPriority: IItemPriority) => void;

    const handleSelect = (itemPriority: IItemPriority) => {
      this.windowController.closeWindow(handle, () => {
        _resolve(itemPriority);
      });
    };

    const itemPriorities = this.application.itemPriorities.getAll(itemKind);

    const window = <ItemPriorityPaletteWindow itemPriorities={itemPriorities} onSelect={handleSelect} />;
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
      <div className="item-priority-controller-component">
      </div>
    );
  }
}
