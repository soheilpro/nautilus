import * as debugModule from 'debug';
import * as morgan from 'morgan';
import { settings } from './configuration';
import { DateTimeService } from './services';
import { ServerFactory } from './server';
import { DBConnection } from './db';

const debug = debugModule('nautilus-api');

async function run(): Promise<void> {
  const dateTimeService = new DateTimeService();

  const dbConnection = new DBConnection(settings.db.address);

  const serverFactory = new ServerFactory();
  const server = serverFactory.createServer(dbConnection, dateTimeService);
  server.use(morgan('dev') as any);

  server.on('close', async () => {
    await dbConnection.close();
  });

  server.listen(settings.server.port, () => {
    debug(`Nautilus API listening on port ${server.address().port}`);
  });
}

run();
