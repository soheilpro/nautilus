import * as NQL from '../../nql';
import { IProject, IProjectChange } from '../../sdk';
import { IModule } from '../imodule';

export interface IProjectModule extends IModule {
  getAll(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): IProject[];
  get(project: IProject): IProject;
  add(project: IProject): Promise<IProject>;
  update(project: IProject, projectChange: IProjectChange): Promise<IProject>;
  delete(project: IProject): Promise<void>;
}
