import { IItem } from './iitem';
import { IEntity } from '../ientity';
import { Entity } from '../entity';

export class Item extends Entity implements IItem {
  sid?: number;
  kind?: string;
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  tags?: string[];
  project?: IEntity;
  assignedTo?: IEntity;
  createdBy?: IEntity;
  modifiedBy?: IEntity;

  constructor(data: any) {
    super(data);

    this.sid = Number(data.sid);
    this.kind = data.kind;

    if (data.type)
      this.type = new Entity(data.type);

    this.title = data.title;
    this.description = data.description;

    if (data.state)
      this.state = new Entity(data.state);

    this.tags = data.tags;

    if (data.project)
      this.project = new Entity(data.project);

    if (data.assignedTo)
      this.assignedTo = new Entity(data.assignedTo);

    if (data.createdBy)
      this.createdBy = new Entity(data.createdBy);

    if (data.modifiedBy)
      this.modifiedBy = new Entity(data.modifiedBy);
  }
}
