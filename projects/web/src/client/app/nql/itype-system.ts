import { IType } from './itype';

export interface ITypeSystem {
  registerType(type: IType): void;
  registerTypes(types: IType[]): void;
  getType(name: string): IType;
  getTypeHierarchy(type: IType): IType[];
  isOfType(type: IType, baseType: IType): boolean;
  getCommonType(type1: IType, type2: IType): IType;
}
