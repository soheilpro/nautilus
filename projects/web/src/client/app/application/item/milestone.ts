import { IItem } from '../../sdk';
import { IApplication } from '../iapplication';
import { IMilestone } from './imilestone';

export default class Milestone implements IMilestone {
  constructor(private item: IItem, private application: IApplication) {
  }

  get id() {
    return this.item.id;
  }

  get sid() {
    return this.item.sid;
  }

  get title() {
    return this.item.title;
  }

  get fullTitle() {
    const project = this.project;

    if (project)
      return `${project.name}: ${this.title}`;

    return `(Global) ${this.title}`;
  }

  get description() {
    return this.item.description;
  }

  get state() {
    return this.application.itemStates.get(this.item.state);
  }

  get project() {
    return this.application.projects.get(this.item.project);
  }

  get createdBy() {
    return this.application.users.get(this.item.createdBy);
  }

  get modifiedBy() {
    return this.application.users.get(this.item.modifiedBy);
  }

  get meta() {
    return this.item.meta;
  }

  toJSON() {
    return {
      id: this.id,
      sid: this.sid,
      title: this.title,
      fullTitle: this.fullTitle,
      description: this.description,
      state: this.state,
      project: this.project,
      createdBy: this.createdBy,
      modifiedBy: this.modifiedBy,
    };
  }
}
