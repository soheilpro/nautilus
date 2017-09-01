import { configuration } from './configuration';
import { ISettings } from './isettings';

export const settings: ISettings = {
  server: {
    port: Number(configuration.get('server.port')),
  },
  db: {
    address: configuration.get('db.address'),
  },
};
