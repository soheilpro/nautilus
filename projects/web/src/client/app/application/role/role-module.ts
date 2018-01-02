import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { IRoleModule } from './irole-module';
import { IRole } from './irole';

export class RoleModule extends BaseModule implements IRoleModule {
  private roles: IRole[];

  constructor(application: IApplication) {
    super();
  }

  async load(): Promise<void> {
    this.roles = [
      'system.admin',
      'project.member',
    ];

    return Promise.resolve();
  }

  getAll(): IRole[] {
    return [...this.roles];
  }
}
