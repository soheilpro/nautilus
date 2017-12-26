import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { IView } from '../iview';

export class SaveViewCommand extends BaseCommand {
  constructor(private view: IView, private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'save-view';
  }

  get title(): string {
    return 'View: Save';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.V },
      { keyCode: KeyCode.S },
    ];
  }

  get isEnabled(): boolean {
    return !this.view.isDefault();
  }

  execute(): void {
    this.onExecute();
  }
}
