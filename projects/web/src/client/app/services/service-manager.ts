export class ServiceManager {
  static Instance: ServiceManager;

  private services: IObject<any> = {};

  registerService(name: string, service: any) {
    this.services[name] = service;
  }

  unregisterService(name: string, service: any) {
    if (this.services[name] === service)
      delete this.services[name];
  }

  getService<T>(name: string) {
    return this.services[name] as T;
  }
}
