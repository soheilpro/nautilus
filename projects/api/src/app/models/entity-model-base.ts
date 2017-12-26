import { IEntity } from '../framework';

export class EntityModelBase {
  id: string;
  meta: {
    version: number,
    state: number,
    insertDateTime: number,
    updateDateTime: number,
    deleteDateTime: number,
  };

  constructor(entity: IEntity) {
    this.id = entity.id;
    this.meta = {
      version: entity.meta.version,
      state: entity.meta.state,
      insertDateTime: this.renderDateTime(entity.meta.insertDateTime),
      updateDateTime: this.renderDateTime(entity.meta.updateDateTime),
      deleteDateTime: this.renderDateTime(entity.meta.deleteDateTime),
    };
}

  protected renderEntity(entity: IEntity): any {
    if (!entity)
      return undefined;

    return {
      id: entity.id,
    };
  }

  protected renderDateTime(date: Date): any {
    if (!date)
      return undefined;

    return date.getTime();
  }
}
