import { IItem, IItemType, IItemState, IProject, IUser, IEntityMeta } from '../../sdk';
import { IApplication } from '../iapplication';
import { IIssue } from './iissue';
import { IMilestone } from './imilestone';

export class Issue implements IIssue {
  constructor(private item: IItem, private application: IApplication) {
  }

  get id(): string {
    return this.item.id;
  }

  get sid(): number {
    return this.item.sid;
  }

  get type(): IItemType {
    return this.application.itemTypes.get(this.item.type);
  }

  get title(): string {
    return this.item.title;
  }

  get description(): string {
    return this.item.description;
  }

  get state(): IItemState {
    return this.application.itemStates.get(this.item.state);
  }

  get tags(): string[] {
    return this.item.tags;
  }

  get project(): IProject {
    return this.application.projects.get(this.item.project);
  }

  get assignedTo(): IUser {
    return this.application.users.get(this.item.assignedTo);
  }

  get createdBy(): IUser {
    return this.application.users.get(this.item.createdBy);
  }

  get modifiedBy(): IUser {
    return this.application.users.get(this.item.modifiedBy);
  }

  get parent(): IIssue {
    return this.application.items.getIssueParent(this.item);
  }

  get milestone(): IMilestone {
    return this.application.items.getIssueMilestone(this.item);
  }

  get meta(): IEntityMeta {
    return this.item.meta;
  }

  toJSON(): any {
    return {
      id: this.id,
      sid: this.sid,
      type: this.type,
      title: this.title,
      description: this.description,
      state: this.state,
      tags: this.tags,
      project: this.project,
      assignedTo: this.assignedTo,
      createdBy: this.createdBy,
      modifiedBy: this.modifiedBy,
      parent: this.parent,
      milestone: this.milestone,
    };
  }
}
