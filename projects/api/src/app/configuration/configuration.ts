import * as path from 'path';
import * as nconf from 'nconf';

export const configuration = nconf
  .file({ file: path.join(__dirname, '../../../config/api.json') })
  .defaults({
    'server.port': '3000',
    'db.address': 'mongodb://localhost:27017/nautilus',
  });
