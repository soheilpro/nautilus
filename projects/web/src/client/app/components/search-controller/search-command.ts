import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';

export default class SearchCommand extends BaseCommand {
  private searchController = ServiceManager.Instance.getSearchController();

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
