import { IUpdate } from './iupdate';

export class Update implements IUpdate {
  private $set: IObject = {};
  private $unset: IObject = { __noop__: '' };
  private $addToSet: IObject = {};
  private $pull: IObject = {};

  constructor(update?: IUpdate) {
    if (update)
      Object.assign(this, update);
  }

  setOrUnset(key: string, value: any, map?: (value: any) => any) {
    if (value === undefined)
      return;

    if (value !== undefined && value !== null)
      this.$set[key] = map ? map(value) : value;
    else
      this.$unset[key] = '';
  }

  addToSet(key: string, value: any, map?: (value: any) => any) {
    if (value === undefined)
      return;

    this.$addToSet[key] = { $each: map ? map(value) : value };
  }

  removeFromSet(key: string, value: any, map?: (value: any) => any) {
    if (value === undefined)
      return;

    this.$pull[key] = { $in: map ? map(value) : value };
  }
}
