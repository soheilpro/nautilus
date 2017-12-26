interface IParsedPermission {
  target: string[];
  access: string;
}

export class PermissionHelper {
  static hasPermission(permission: string, permissions: string[]): boolean {
    const permissionObject = this.parsePermission(permission);

    return permissions.some(_permission => this.matches(permissionObject, this.parsePermission(_permission)));
  }

  private static matches(permission1: IParsedPermission, permission2: IParsedPermission): boolean {
    if (permission1.access !== permission2.access)
      return false;

    if (permission1.target.length !== permission2.target.length)
      return false;

    for (let i = 0; i < permission1.target.length; i++)
      if (permission2.target[i] !== '*' && permission2.target[i] !== permission1.target[i])
        return false;

    return true;
  }

  private static parsePermission(permission: string): IParsedPermission {
    const parts = permission.split(':');

    return {
      target: parts[0].split('.'),
      access: parts[1],
    };
  }
}
