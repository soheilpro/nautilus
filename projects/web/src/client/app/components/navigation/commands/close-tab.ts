import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { ITab } from '../../../framework/tabs';

export class CloseTabCommand extends BaseCommand {
  constructor(private activeTab: ITab, private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'close-tab';
  }

  get title(): string {
    return 'Close tab';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.W }];
  }

  get isEnabled(): boolean {
    return !!this.activeTab;
  }

  async execute(): Promise<void> {
    this.onExecute();
  }
}
