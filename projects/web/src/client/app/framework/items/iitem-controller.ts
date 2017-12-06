export interface IItemController {
  editItem(item: any): void;
  deleteItem(item: any): void;
  getItemId(item: any): string;
}
