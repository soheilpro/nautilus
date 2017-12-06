import { BaseCommand } from '../../../framework/commands';
import { KeyCode } from '../../../framework/keyboard';
import { IView } from '../iview';

export class SaveViewCommand extends BaseCommand {
  constructor(private view: IView, private onExecute: () => void) {
    super();
  }

  get id() {
    return 'save-view';
  }

  get title() {
    return 'View: Save';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.V },
      { keyCode: KeyCode.S },
    ];
  }

  get isEnabled() {
    return !this.view.isDefault();
  }

  execute() {
    this.onExecute();
  }
}
