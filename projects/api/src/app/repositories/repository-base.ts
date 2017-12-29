import { IEntity, IFilter, IChange, IRepository, EntityFilter } from '../framework';
import { IDB, IDocument, IUpdate, Update, ObjectId } from '../db';

export abstract class RepositoryBase<TEntity extends IEntity, TChange extends IChange, TDocument extends IDocument> implements IRepository<TEntity, TChange> {
  constructor(private db: IDB) {
    this.collectionName = this.collectionName.bind(this);
    this.filterToQuery = this.filterToQuery.bind(this);
    this.changeToUpdate = this.changeToUpdate.bind(this);
    this.documentToEntity = this.documentToEntity.bind(this);
    this.entityToDocument = this.entityToDocument.bind(this);
    this.toRef = this.toRef.bind(this);
    this.toRefArray = this.toRefArray.bind(this);
    this.fromRef = this.fromRef.bind(this);
    this.fromRefArray = this.fromRefArray.bind(this);
    this.toObjectId = this.toObjectId.bind(this);
  }

  abstract collectionName(): string;

  async getAll(filter: IFilter): Promise<TEntity[]> {
    const query = this.filterToQuery(filter);

    if (!query)
      return [];

    const documents = await this.db.select<TDocument>(this.collectionName(), query);

    return documents.map(this.documentToEntity);
  }

  async get(filter: IFilter): Promise<TEntity> {
    const query = this.filterToQuery(filter);

    if (!query)
      return null;

    const documents = await this.db.select<TDocument>(this.collectionName(), query);

    if (documents.length > 1)
      throw new Error('The filter returned more than one result.');

    if (documents.length === 0)
      return null;

    return this.documentToEntity(documents[0]);
  }

  async insert(entity: TEntity): Promise<TEntity> {
    const document = this.entityToDocument(entity);

    const insertedDocument = await this.db.insert<TDocument>(this.collectionName(), document);

    return this.documentToEntity(insertedDocument);
  }

  async update(id: string, change: TChange): Promise<TEntity> {
    const filter = new EntityFilter(id);
    const query = this.filterToQuery(filter);
    const update = this.changeToUpdate(change);

    const document = await this.db.update<TDocument>(this.collectionName(), query, update);

    return this.documentToEntity(document);
  }

  async delete(id: string): Promise<void> {
    const filter = new EntityFilter(id);
    const query = this.filterToQuery(filter);

    await this.db.delete(this.collectionName(), query);
  }

  async counter(name: string): Promise<number> {
    return await this.db.counter(name);
  }

  protected filterToQuery(filter: IFilter): IObject {
    if (filter === null)
      return {};

    if (filter instanceof EntityFilter) {
      return {
        _id: this.toObjectId(filter.id),
      };
    }

    throw new Error('Not supported.');
  }

  protected changeToUpdate(change: IChange): IUpdate {
    return new Update();
  }

  protected documentToEntity(document: TDocument): TEntity {
    return {
      id: document._id.toString(),
      meta: {
        version: document.meta.version,
        state: document.meta.state,
        insertDateTime: document.meta.insertDateTime,
        updateDateTime: document.meta.updateDateTime,
        deleteDateTime: document.meta.deleteDateTime,
      },
    } as TEntity;
  }

  protected entityToDocument(entity: TEntity): IDocument {
    return {
      _id: this.toObjectId(entity.id),
    };
  }

  protected toRef(entity: IEntity): IDocument {
    if (!entity)
      return undefined;

    return {
      _id: this.toObjectId(entity.id),
    };
  }

  protected toRefArray(entities: IEntity[]): IDocument[] {
    if (!entities)
      return undefined;

    const result = entities.map<IDocument>(this.toRef);

    if (result.length === 0)
      return undefined;

    return result;
  }

  protected fromRef(document: IDocument): IEntity {
    if (!document)
      return undefined;

    return {
      id: document._id.toString(),
    };
  }

  protected fromRefArray(documents: IDocument[]): IEntity[] {
    if (!documents)
      return undefined;

    const result = documents.map(this.fromRef);

    if (result.length === 0)
      return undefined;

    return result;
  }

  protected toObjectId(id: string): ObjectId {
    if (!id)
      return undefined;

    if (!ObjectId.isValid(id))
      return new ObjectId(0);

    return new ObjectId(id);
  }
}
