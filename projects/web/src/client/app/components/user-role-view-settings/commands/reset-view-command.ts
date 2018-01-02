import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { IView } from '../iview';

export class ResetViewCommand extends BaseCommand {
  constructor(private view: IView, private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'reset-view';
  }

  get title(): string {
    return 'View: Reset';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.V },
      { keyCode: KeyCode.R },
    ];
  }

  get isEnabled(): boolean {
    return !this.view.isDefault();
  }

  execute(): void {
    this.onExecute();
  }
}
