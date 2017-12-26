import { configuration } from './configuration';

async function run(): Promise<void> {
  const command = process.argv[2];

  switch (command) {
    case 'list': {
      const config = configuration.get(null);

      for (const key in config)
        if (key !== 'type')
          console.log(`${key} = ${config[key]}`);

      break;
    }

    case 'get': {
      const key = process.argv[3];

      if (!key) {
        console.error('Missing key.');
        process.exit(1);
      }

      const value = configuration.get(key);

      if (value)
        console.log(value);

      break;
    }

    case 'set': {
      const key = process.argv[3];
      const value = process.argv[4];

      if (!key) {
        console.error('Missing key.');
        process.exit(1);
      }

      if (!value) {
        console.error('Missing value.');
        process.exit(1);
      }

      configuration.set(key, value);
      await configuration.save(null);

      break;
    }

    case 'unset': {
      const key = process.argv[3];

      if (!key) {
        console.error('Missing key.');
        process.exit(1);
      }

      configuration.clear(key);
      await configuration.save(null);

      break;
    }

    default:
      console.log('Commands:');
      console.log('  list');
      console.log('  get <key>');
      console.log('  set <key> <value>');
      console.log('  unset <key>');

      break;
    }
}

run();
