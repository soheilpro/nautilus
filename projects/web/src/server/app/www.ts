import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as debugModule from 'debug';
import { settings } from './configuration';

const debug = debugModule('nautilus-web');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../client/out'));

app.use(morgan('dev'));
app.use(compression());

app.use('/assets', express.static(path.join(__dirname, '../../client/out/assets'), { maxAge: 365 * 24 * 60 * 60 * 1000 }));

app.use('/assets', (request, response) => {
  response.status(404).send('Not found.');
});

app.get('*', (request, response) => {
  const locals = {
    config: {
      api: {
        address: settings.api.address,
      },
    },
  };

  response.render('index', locals);
});

const server = app.listen(settings.server.port, () => {
  debug(`Nautilus web listening on port ${server.address().port}`);
});
