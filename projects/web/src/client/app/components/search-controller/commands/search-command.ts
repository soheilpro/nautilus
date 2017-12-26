import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { ISearchController } from '../../../modules/search';

export default class SearchCommand extends BaseCommand {
  private searchController = ServiceManager.Instance.getService<ISearchController>('ISearchController');

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
