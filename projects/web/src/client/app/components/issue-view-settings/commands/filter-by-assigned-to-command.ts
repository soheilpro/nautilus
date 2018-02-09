import { BaseCommand } from '../../../framework/commands';

export class FilterByAssignedToCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'issue-assigned-to-filter';
  }

  get title(): string {
    return 'Filter by Assigned To';
  }

  execute(): void {
    this.onExecute();
  }
}
