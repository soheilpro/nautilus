import { IItem, IItemState, IProject, IUser, IEntityMeta } from '../../sdk';
import { IApplication } from '../iapplication';
import { IMilestone } from './imilestone';

export class Milestone implements IMilestone {
  constructor(private item: IItem, private application: IApplication) {
  }

  get id(): string {
    return this.item.id;
  }

  get sid(): string {
    return this.item.sid;
  }

  get title(): string {
    return this.item.title;
  }

  get fullTitle(): string {
    const project = this.project;

    if (!project)
      return `(Global) ${this.title}`;

    return `${project.name}: ${this.title}`;
  }

  get smartTitle(): string {
    const project = this.project;

    if (!project)
      return `(Global) ${this.title}`;

    return this.title;
  }

  get description(): string {
    return this.item.description;
  }

  get state(): IItemState {
    return this.application.itemStates.get(this.item.state);
  }

  get project(): IProject {
    return this.application.projects.get(this.item.project);
  }

  get createdBy(): IUser {
    return this.application.users.get(this.item.createdBy);
  }

  get modifiedBy(): IUser {
    return this.application.users.get(this.item.modifiedBy);
  }

  get meta(): IEntityMeta {
    return this.item.meta;
  }

  toJSON(): any {
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
