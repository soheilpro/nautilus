export class ArgumentError {
  constructor(public message: string) {
  }

  toString(): string {
    return this.message;
  }
}
