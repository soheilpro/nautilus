import { BaseCommand } from '../../../framework/commands';

export class FilterByProjectCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'milestone-project-filter';
  }

  get title(): string {
    return 'Filter by Project';
  }

  execute(): void {
    this.onExecute();
  }
}
