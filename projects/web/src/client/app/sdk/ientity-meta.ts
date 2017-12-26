export interface IEntityMeta {
  version: number;
  state: number;
  insertDateTime: Date;
  updateDateTime?: Date;
  deleteDateTime?: Date;
}
