import * as restify from 'restify';

export interface IRouter {
  register(server: restify.Server): void;
}
