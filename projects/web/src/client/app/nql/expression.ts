import { IExpression } from './iexpression';

export abstract class Expression implements IExpression {
  abstract returnType: string;
}
