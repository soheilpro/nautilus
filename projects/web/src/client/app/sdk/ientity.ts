export interface IEntity {
  id?: string;
  meta?: {
    version: number,
    state: number,
    insertDateTime: Date,
    updateDateTime?: Date,
    deleteDateTime?: Date,
  };
}
