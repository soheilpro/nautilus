import { BaseCommand } from '../../../framework/commands';
import { ServiceManager } from '../../../services';
import { IUserRoleController } from '../../../modules/user-roles';

export class NewUserRoleCommand extends BaseCommand {
  private userRoleController = ServiceManager.Instance.getService<IUserRoleController>('IUserRoleController');

  get id(): string {
    return 'new-user-role';
  }

  get title(): string {
    return 'New User Role';
  }

  execute(): void {
    this.userRoleController.createNew();
  }
}
