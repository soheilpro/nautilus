import { BaseCommand } from '../../../framework/commands';

export class FilterByUserCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'user-role-user-filter';
  }

  get title(): string {
    return 'Filter by User';
  }

  execute(): void {
    this.onExecute();
  }
}
