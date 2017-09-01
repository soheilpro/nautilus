import { IFilter } from '../ifilter';
import { IItem } from '../item';

export class ItemItemRelationshipFilter implements IFilter {
  constructor(public items: IItem[]) {
  }
}
