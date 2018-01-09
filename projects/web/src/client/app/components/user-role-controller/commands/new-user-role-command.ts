import { BaseCommand } from '../../../framework/commands';
import { IUserRoleController } from '../../../modules/user-roles';

export class NewUserRoleCommand extends BaseCommand {
  constructor(private userRoleController: IUserRoleController) {
    super();
  }

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
