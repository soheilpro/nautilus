import { settings } from './configuration';
import { DateTimeService } from './services';
import { DBConnection } from './db';
import { UpdaterFactory } from './updater';

async function run() {
  const dateTimeService = new DateTimeService();

  const dbConnection = new DBConnection(settings.db.address);

  const updaterFactory = new UpdaterFactory();
  const updater = updaterFactory.createUpdater(dbConnection, dateTimeService);

  updater.on('updating', (version: string) => {
    process.stdout.write(`Updating database to version ${version}...`);
  });

  updater.on('updated', (version: string) => {
    console.log(' Done.');
  });

  updater.on('end', async () => {
    await dbConnection.close();
  });

  await updater.run();
}

run();
