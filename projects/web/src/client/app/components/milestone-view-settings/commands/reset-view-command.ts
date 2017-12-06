import { BaseCommand } from '../../../framework/commands';
import { KeyCode } from '../../../framework/keyboard';
import { IView } from '../iview';

export class ResetViewCommand extends BaseCommand {
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

  get isEnabled() {
    return !this.view.isDefault();
  }

  execute() {
    this.onExecute();
  }
}
