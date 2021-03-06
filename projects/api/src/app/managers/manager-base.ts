import { IEntity, IFilter, IChange, IManager, IValidationError, IRepository, DuplicateEntityError } from '../framework';

export abstract class ManagerBase<TEntity extends IEntity, TChange extends IChange> implements IManager<TEntity, TChange> {
  constructor(protected repository: IRepository<TEntity, TChange>) {
  }

  getAll(filter: IFilter): Promise<TEntity[]> {
    return this.repository.getAll(filter);
  }

  get(filter: IFilter): Promise<TEntity> {
    return this.repository.get(filter);
  }

  async insert(entity: TEntity): Promise<TEntity> {
    const duplicateCheckFilter = this.getEntityDuplicateCheckFilter(entity);

    if (duplicateCheckFilter) {
      const existingEntities = await this.repository.getAll(duplicateCheckFilter);

      if (existingEntities.length !== 0)
        throw new DuplicateEntityError();
    }

    return this.repository.insert(entity);
  }

  async update(id: string, change: TChange): Promise<TEntity> {
    const duplicateCheckFilter = this.getChangeDuplicateCheckFilter(change);

    if (duplicateCheckFilter) {
      const existingEntities = await this.repository.getAll(duplicateCheckFilter);

      if (existingEntities.length > 1)
        throw new DuplicateEntityError();

      if (existingEntities.length === 1 && existingEntities[0].id !== id)
        throw new DuplicateEntityError();
    }

    return this.repository.update(id, change);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  validateEntity(entity: TEntity): IValidationError {
    return null;
  }

  validateChange(change: TChange): IValidationError {
    return null;
  }

  getEntityDuplicateCheckFilter(entity: TEntity): IFilter {
    return null;
  }

  getChangeDuplicateCheckFilter(change: TChange): IFilter {
    return null;
  }
}
