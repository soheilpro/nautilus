import * as restify from 'restify';
import * as corsMiddleware from 'restify-cors-middleware';
import { IDateTimeService } from './services';
import { IDBConnection, ManagedDB } from './db';
import { UserManager, UserLogManager, SessionManager, ProjectManager, UserRoleManager, ItemStateManager, ItemTypeManager, ItemManager, ItemRelationshipManager } from './managers';
import { UserRepository, UserLogRepository, SessionRepository, ProjectRepository, UserRoleRepository, ItemStateRepository, ItemTypeRepository, ItemRepository, ItemRelationshipRepository } from './repositories';
import { UserRouter, SessionRouter, ProjectRouter, UserRoleRouter, ItemStateRouter, ItemTypeRouter, ItemRouter, ItemRelationshipRouter } from './routers';
import { PermissionProvider } from './security';
import { authenticator } from './plugins';

export class ServerFactory {
  createServer(dbConnection: IDBConnection, dateTimeService: IDateTimeService): restify.Server {
    const managedDB = new ManagedDB(dbConnection, dateTimeService);

    const userRepository = new UserRepository(managedDB);
    const userLogRepository = new UserLogRepository(managedDB);
    const sessionRepository = new SessionRepository(managedDB);
    const projectRepository = new ProjectRepository(managedDB);
    const userRoleRepository = new UserRoleRepository(managedDB);
    const itemStateRepository = new ItemStateRepository(managedDB);
    const itemTypeRepository = new ItemTypeRepository(managedDB);
    const itemRepository = new ItemRepository(managedDB);
    const itemRelationshipRepository = new ItemRelationshipRepository(managedDB);

    const userManager = new UserManager(userRepository);
    const userLogManager = new UserLogManager(userLogRepository);
    const sessionManager = new SessionManager(sessionRepository);
    const projectManager = new ProjectManager(projectRepository);
    const userRoleManager = new UserRoleManager(userRoleRepository);
    const itemStateManager = new ItemStateManager(itemStateRepository);
    const itemTypeManager = new ItemTypeManager(itemTypeRepository);
    const itemManager = new ItemManager(itemRepository);
    const itemRelationshipManager = new ItemRelationshipManager(itemRelationshipRepository);

    const routers = [
      new UserRouter(userManager, userLogManager, dateTimeService),
      new SessionRouter(sessionManager, userManager, userLogManager, dateTimeService),
      new UserRoleRouter(userRoleManager, userManager, projectManager, userLogManager, dateTimeService),
      new ProjectRouter(projectManager, userLogManager, dateTimeService),
      new ItemStateRouter(itemStateManager, userLogManager, dateTimeService),
      new ItemTypeRouter(itemTypeManager, userLogManager, dateTimeService),
      new ItemRouter(itemManager, userManager, projectManager, itemTypeManager, itemStateManager, itemRelationshipManager, userLogManager, dateTimeService),
      new ItemRelationshipRouter(itemRelationshipManager, itemManager, userLogManager, dateTimeService),
    ];

    const permissionProvider = new PermissionProvider(userRoleManager);

    const cors = corsMiddleware({
      origins: ['*'],
      allowHeaders: ['Authorization'],
      exposeHeaders: [],
      preflightMaxAge: 24 * 60 * 60,
    });

    const server = restify.createServer();
    server.pre(cors.preflight);
    server.use(restify.plugins.authorizationParser());
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());
    server.use(restify.plugins.gzipResponse());
    server.use(cors.actual);
    server.use(authenticator(sessionManager, permissionProvider));

    server.get('/', (request, response) => {
      const pkg = require('../package.json');

      response.json({
        name: pkg.name,
        version: pkg.version,
      });
    });

    for (const router of routers)
      router.register(server);

    return server;
  }
}
