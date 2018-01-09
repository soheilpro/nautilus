export interface IActiveItemController {
  editItem(item: string, itemType: string): void;
  deleteItem(item: string, itemType: string): void;
  copyItemId(item: string, itemType: string): void;
}
