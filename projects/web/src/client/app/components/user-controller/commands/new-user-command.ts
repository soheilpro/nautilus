import { BaseCommand } from '../../../framework/commands';
import { IUserController } from '../../../modules/users';

export class NewUserCommand extends BaseCommand {
  constructor(private userController: IUserController) {
    super();
  }

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
