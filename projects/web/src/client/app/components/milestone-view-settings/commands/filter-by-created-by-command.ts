import { BaseCommand } from '../../../framework/commands';

export class FilterByCreatedByCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'milestone-created-by-filter';
  }

  get title(): string {
    return 'Filter by Created By';
  }

  execute(): void {
    this.onExecute();
  }
}
