export class InvalidEntityParamError extends Error {
  constructor(public name: string) {
    super();
  }
}
