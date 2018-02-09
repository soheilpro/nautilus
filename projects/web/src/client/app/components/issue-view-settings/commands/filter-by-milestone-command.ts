import { BaseCommand } from '../../../framework/commands';

export class FilterByMilestoneCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'issue-milestone-filter';
  }

  get title(): string {
    return 'Filter by Milestone';
  }

  execute(): void {
    this.onExecute();
  }
}
