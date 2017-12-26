export class ServiceManager {
  static Instance: ServiceManager;

  private services: IObject<any> = {};

  registerService(name: string, service: any): void {
    this.services[name] = service;
  }

  unregisterService(name: string, service: any): void {
    if (this.services[name] === service)
      delete this.services[name];
  }

  getService<T>(name: string): T {
    return this.services[name];
  }
}
