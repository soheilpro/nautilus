import { BaseCommand } from '../../../framework/commands';

export class FilterByPriorityCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'issue-priority-filter';
  }

  get title(): string {
    return 'Filter by Priority';
  }

  execute(): void {
    this.onExecute();
  }
}
