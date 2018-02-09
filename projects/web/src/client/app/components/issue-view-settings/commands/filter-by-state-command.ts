import { BaseCommand } from '../../../framework/commands';

export class FilterByStateCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'issue-state-filter';
  }

  get title(): string {
    return 'Filter by State';
  }

  execute(): void {
    this.onExecute();
  }
}
