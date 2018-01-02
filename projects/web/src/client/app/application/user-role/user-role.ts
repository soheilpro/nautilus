import { IUserRole, IProject, IUser, IEntityMeta } from '../../sdk';
import { IApplication } from '../iapplication';

export class UserRole implements IUserRole {
  constructor(private userRole: IUserRole, private application: IApplication) {
  }

  get id(): string {
    return this.userRole.id;
  }

  get user(): IUser {
    return this.application.users.get(this.userRole.user);
  }

  get role(): string {
    return this.userRole.role;
  }

  get project(): IProject {
    return this.application.projects.get(this.userRole.project);
  }

  get meta(): IEntityMeta {
    return this.userRole.meta;
  }

  toJSON(): any {
    return {
      id: this.id,
      user: this.user,
      role: this.role,
      project: this.project,
    };
  }
}
