import { IFilter } from '../../framework';
import { IProject, IProjectChange, IProjectRepository, DuplicateProjectFilter } from '../../framework/project';
import { IDB } from '../../db';
import { IProjectDocument } from './iproject-document';
import RepositoryBase from '../repository-base';

export class ProjectRepository extends RepositoryBase<IProject, IProjectChange, IProjectDocument> implements IProjectRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'projects';
  }

  filterToQuery(filter: IFilter) {
    if (filter instanceof DuplicateProjectFilter) {
      const predicates = [];

      if (filter.name) {
        predicates.push({
          name: filter.name,
        });
      }

      if (predicates.length === 0)
        return null;

      return {
        $or: predicates,
      };
    }

    return super.filterToQuery(filter);
  }

  changeToUpdate(change: IProjectChange) {
    const update = super.changeToUpdate(change);
    update.setOrUnset('name', change.name);
    update.setOrUnset('description', change.description);
    update.setOrUnset('tags', change.tags);

    return update;
  }

  documentToEntity(document: IProjectDocument) {
    return {
      ...super.documentToEntity(document),
      name: document.name,
      description: document.description,
      tags: document.tags,
    };
  }

  entityToDocument(entity: IProject) {
    return {
      ...super.entityToDocument(entity),
      name: entity.name,
      description: entity.description,
      tags: entity.tags,
    };
  }
}
