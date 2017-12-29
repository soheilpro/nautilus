import { IFilter } from '../../framework';
import { IProject, IProjectChange, IProjectRepository, DuplicateProjectFilter } from '../../framework/project';
import { IDB, IUpdate } from '../../db';
import { IProjectDocument } from './iproject-document';
import { RepositoryBase } from '../repository-base';

export class ProjectRepository extends RepositoryBase<IProject, IProjectChange, IProjectDocument> implements IProjectRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName(): string {
    return 'projects';
  }

  filterToQuery(filter: IFilter): IObject {
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

  changeToUpdate(change: IProjectChange): IUpdate {
    const update = super.changeToUpdate(change);
    update.setOrUnset('name', change.name);
    update.setOrUnset('description', change.description);
    update.setOrUnset('tags', change.tags);

    return update;
  }

  documentToEntity(document: IProjectDocument): IProject {
    return {
      ...super.documentToEntity(document),
      name: document.name,
      description: document.description,
      tags: document.tags,
    };
  }

  entityToDocument(entity: IProject): IProjectDocument {
    return {
      ...super.entityToDocument(entity),
      name: entity.name,
      description: entity.description,
      tags: entity.tags,
    };
  }
}
