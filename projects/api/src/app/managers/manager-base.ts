import { IEntity, IFilter, IChange, IManager, IValidationError, IRepository, DuplicateEntityError } from '../framework';

export default abstract class ManagerBase<TEntity extends IEntity, TChange extends IChange> implements IManager<TEntity, TChange> {
  constructor(protected repository: IRepository<TEntity, TChange>) {
  }

  getAll(filter: IFilter) {
    return this.repository.getAll(filter);
  }

  get(filter: IFilter) {
    return this.repository.get(filter);
  }

  async insert(entity: TEntity) {
    const duplicateCheckFilter = this.getEntityDuplicateCheckFilter(entity);

    if (duplicateCheckFilter) {
      const existingEntities = await this.repository.getAll(duplicateCheckFilter);

      if (existingEntities.length !== 0)
        throw new DuplicateEntityError();
    }

    return this.repository.insert(entity);
  }

  async update(id: string, change: TChange) {
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

  delete(id: string) {
    return this.repository.delete(id);
  }

  validateEntity(entity: TEntity) {
    return null as IValidationError;
  }

  validateChange(change: TChange) {
    return null as IValidationError;
  }

  getEntityDuplicateCheckFilter(entity: TEntity) {
    return null as IFilter;
  }

  getChangeDuplicateCheckFilter(change: TChange) {
    return null as IFilter;
  }
}
