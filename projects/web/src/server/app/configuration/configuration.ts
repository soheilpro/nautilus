import * as path from 'path';
import * as nconf from 'nconf';

export const configuration = nconf
  .file({ file: path.join(__dirname, '../../../../config/web.json') })
  .defaults({
    'server.port': '3100',
    'api.address': 'http://localhost:3000',
  });
