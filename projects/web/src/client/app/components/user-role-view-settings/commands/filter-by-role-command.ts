import { BaseCommand } from '../../../framework/commands';

export class FilterByRoleCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'user-role-role-filter';
  }

  get title(): string {
    return 'Filter by Role';
  }

  execute(): void {
    this.onExecute();
  }
}
