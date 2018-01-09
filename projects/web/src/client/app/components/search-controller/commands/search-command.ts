import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { ISearchController } from '../../../modules/search';

export class SearchCommand extends BaseCommand {
  constructor(private searchController: ISearchController) {
    super();
  }

  get id(): string {
    return 'search';
  }

  get title(): string {
    return 'Search';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.S }];
  }

  execute(): void {
    this.searchController.showSearchWindow();
  }
}
