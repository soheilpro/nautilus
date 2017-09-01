import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { IView } from './iview';

export default class SaveViewCommand extends BaseCommand {
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

  get enabled() {
    return !this.view.isDefault();
  }

  execute() {
    this.onExecute();
  }
}
