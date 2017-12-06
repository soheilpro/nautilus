import { BaseCommand } from '../../../framework/commands';
import { KeyCode } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { ISearchController } from '../../../modules/search';

export default class SearchCommand extends BaseCommand {
  private searchController = ServiceManager.Instance.getService<ISearchController>('ISearchController');

  get id() {
    return 'search';
  }

  get title() {
    return 'Search';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.S }];
  }

  execute() {
    this.searchController.showSearchWindow();
  }
}
