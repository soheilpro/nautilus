import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { IView } from './iview';

export default class ResetViewCommand extends BaseCommand {
  constructor(private view: IView, private onExecute: () => void) {
    super();
  }

  get id() {
    return 'reset-view';
  }

  get title() {
    return 'View: Reset';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.V },
      { keyCode: KeyCode.R },
    ];
  }

  get enabled() {
    return !this.view.isDefault();
  }

  execute() {
    this.onExecute();
  }
}
