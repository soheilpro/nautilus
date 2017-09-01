import { IRepository } from '../irepository';
import { IProject } from './iproject';
import { IProjectChange } from './iproject-change';

export interface IProjectRepository extends IRepository<IProject, IProjectChange> {
}
