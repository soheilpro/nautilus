import * as request from 'supertest';
import { Context } from './context';

const context = new Context();

beforeAll(context.init);
beforeEach(context.reset);
afterAll(context.destroy);

test('Create: Missing username', async () => {
  await request(context.server)
    .post('/sessions')
    .send({
      'password': 'changeme',
    })
    .expect(422);
});

test('Create: Missing password', async () => {
  await request(context.server)
    .post('/sessions')
    .send({
      'username': 'admin',
    })
    .expect(422);
});

test('Create: Bad username', async () => {
  await request(context.server)
    .post('/sessions')
    .send({
      'username': 'not_admin',
      'password': 'changeme',
    })
    .expect(401);
});

test('Create: Bad password', async () => {
  await request(context.server)
    .post('/sessions')
    .send({
      'username': 'admin',
      'password': 'not_123',
    })
    .expect(401);
});

test('Create', async () => {
  await request(context.server)
    .post('/sessions')
    .send({
      'username': 'admin',
      'password': 'changeme',
    })
    .expect(201)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'user': {
            'id': expect.any(String),
          },
          'accessToken': expect.any(String),
        },
      });
    });
});
