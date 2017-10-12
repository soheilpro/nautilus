import { IEntity } from './ientity';

export class Entity implements IEntity {
  id?: string;
  meta?: {
    version: number;
    state: number;
    insertDateTime: Date;
    updateDateTime?: Date;
    deleteDateTime?: Date;
  };

  constructor(data: any) {
    this.id = data.id;

    if (data.meta) {
      this.meta = {
        version: data.meta.version,
        state: data.meta.state,
        insertDateTime: new Date(data.meta.insertDateTime),
      };

      if (data.meta.updateDateTime)
        this.meta.updateDateTime = new Date(data.meta.updateDateTime);

      if (data.meta.deleteDateTime)
        this.meta.deleteDateTime = new Date(data.meta.deleteDateTime);
    }
  }
}
