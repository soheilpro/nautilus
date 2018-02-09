import { BaseCommand } from '../../../framework/commands';

export class FilterByTypeCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'issue-type-filter';
  }

  get title(): string {
    return 'Filter by Type';
  }

  execute(): void {
    this.onExecute();
  }
}
