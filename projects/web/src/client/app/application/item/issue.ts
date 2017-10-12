import { IItem } from '../../sdk';
import { IApplication } from '../iapplication';
import { IIssue } from './iissue';

export default class Issue implements IIssue {
  constructor(private item: IItem, private application: IApplication) {
  }

  get id() {
    return this.item.id;
  }

  get sid() {
    return this.item.sid;
  }

  get type() {
    return this.application.itemTypes.get(this.item.type);
  }

  get title() {
    return this.item.title;
  }

  get description() {
    return this.item.description;
  }

  get state() {
    return this.application.itemStates.get(this.item.state);
  }

  get tags() {
    return this.item.tags;
  }

  get project() {
    return this.application.projects.get(this.item.project);
  }

  get assignedTo() {
    return this.application.users.get(this.item.assignedTo);
  }

  get createdBy() {
    return this.application.users.get(this.item.createdBy);
  }

  get modifiedBy() {
    return this.application.users.get(this.item.modifiedBy);
  }

  get parent() {
    return this.application.items.getIssueParent(this.item);
  }

  get milestone() {
    return this.application.items.getIssueMilestone(this.item);
  }

  get meta() {
    return this.item.meta;
  }

  toJSON() {
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
