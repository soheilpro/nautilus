import { IManager } from '../imanager';
import { IProject } from './iproject';
import { IProjectChange } from './iproject-change';

export interface IProjectManager extends IManager<IProject, IProjectChange> {
}
