import { BaseCommand } from '../../../framework/commands';
import { ServiceManager } from '../../../services';
import { IUserController } from '../../../modules/users';

export class NewUserCommand extends BaseCommand {
  private userController = ServiceManager.Instance.getService<IUserController>('IUserController');

  get id(): string {
    return 'new-user';
  }

  get title(): string {
    return 'New User';
  }

  execute(): void {
    this.userController.createNew();
  }
}
