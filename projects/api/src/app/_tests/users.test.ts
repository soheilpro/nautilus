import * as request from 'supertest';
import { Context } from './context';

const context = new Context();

beforeAll(context.init);
beforeEach(context.reset);
afterAll(context.destroy);

test('Create: Missing username', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': undefined,
      'password': '12345678',
      'name': 'Soheil',
      'email': 'soheil@example.com',
    })
    .expect(422);
});

test('Create: Empty username', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': '',
      'password': '1234567',
      'name': 'Soheil',
      'email': 'soheil@example.com',
    })
    .expect(422);
});

test('Create: Duplicate username', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil',
      'password': '12345678',
      'name': 'Soheil',
      'email': 'soheil@example.com',
    });

    await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil',
      'password': '12345678',
      'name': 'Soheil',
      'email': 'soheil2@example.com',
    })
    .expect(422);
});

test('Create: Missing password', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil',
      'password': undefined,
      'name': 'Soheil',
      'email': 'soheil@example.com',
    })
    .expect(422);
});

test('Create: Empty password', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil',
      'password': '',
      'name': 'Soheil',
      'email': 'soheil@example.com',
    })
    .expect(422);
});

test('Create: Short password', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil',
      'password': '1234567',
      'name': 'Soheil',
      'email': 'soheil@example.com',
    })
    .expect(422);
});

test('Create: Missing name', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil',
      'password': '12345678',
      'name': undefined,
      'email': 'soheil@example.com',
    })
    .expect(422);
});

test('Create: Empty name', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil',
      'password': '1234567',
      'name': '',
      'email': 'soheil@example.com',
    })
    .expect(422);
});

test('Create: Missing email', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil',
      'password': '12345678',
      'name': 'Soheil',
      'email': undefined,
    })
    .expect(422);
});

test('Create: Empty email', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil',
      'password': '1234567',
      'name': 'Soheil',
      'email': '',
    })
    .expect(422);
});

test('Create: Invalid email', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil',
      'password': '12345678',
      'name': 'Soheil',
      'email': 'soheil_example.com',
    })
    .expect(422);
});

test('Create: Duplicate email', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil',
      'password': '12345678',
      'name': 'Soheil',
      'email': 'soheil@example.com',
    });

  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil2',
      'password': '12345678',
      'name': 'Soheil',
      'email': 'soheil@example.com',
    })
    .expect(422);
});

test('Create', async () => {
  await request(context.server)
    .post('/users')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil',
      'password': '12345678',
      'name': 'Soheil',
      'email': 'soheil@example.com',
    })
    .expect(201)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'username': 'soheil',
          'name': 'Soheil',
          'email': 'soheil@example.com',
        },
      });
    });

  await request(context.server)
    .post('/sessions')
    .send({
      'username': 'soheil',
      'password': '12345678',
    })
    .expect(201);
});

test('Update: Nothing', async () => {
  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'username': 'soheil',
          'name': 'Soheil',
          'email': 'soheil@example.com',
        },
      });
    });
});

test('Update: Set Username', async () => {
  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil2',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'username': 'soheil2',
          'name': 'Soheil',
          'email': 'soheil@example.com',
        },
      });
    });

  await request(context.server)
    .post('/sessions')
    .send({
      'username': 'soheil',
      'password': '12345678',
    })
    .expect(401);

  await request(context.server)
    .post('/sessions')
    .send({
      'username': 'soheil2',
      'password': '12345678',
    })
    .expect(201);
});

test('Update: Unset Username', async () => {
  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': '',
    })
    .expect(422);
});

test('Update: Duplicate username', async () => {
  await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil1',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil1@example.com',
  });

  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil2',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil2@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'username': 'soheil1',
    })
    .expect(422);
});

test('Update: Set password', async () => {
  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'password': '87654321',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'username': 'soheil',
          'name': 'Soheil',
          'email': 'soheil@example.com',
        },
      });
    });

  await request(context.server)
    .post('/sessions')
    .send({
      'username': 'soheil',
      'password': '12345678',
    })
    .expect(401);

  await request(context.server)
    .post('/sessions')
    .send({
      'username': 'soheil',
      'password': '87654321',
    })
    .expect(201);
});

test('Update: Unset password', async () => {
  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'password': '',
    })
    .expect(422);
});

test('Update: Short password', async () => {
  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'password': '1234567',
    })
    .expect(422);
});

test('Update: Set name', async () => {
  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'name': 'Soheil2',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'username': 'soheil',
          'name': 'Soheil2',
          'email': 'soheil@example.com',
        },
      });
    });
});

test('Update: Unset name', async () => {
  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'name': '',
    })
    .expect(422);
});

test('Update: Set email', async () => {
  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'email': 'soheil2@example.com',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'username': 'soheil',
          'name': 'Soheil',
          'email': 'soheil2@example.com',
        },
      });
    });
});

test('Update: Unset email', async () => {
  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'email': '',
    })
    .expect(422);
});

test('Update: Invalid email', async () => {
  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'email': 'soheil_example.com',
    })
    .expect(422);
});

test('Update: Duplicate email', async () => {
  await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil1',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil1@example.com',
  });

  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil2',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil2@example.com',
  });

  await request(context.server)
    .patch(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'email': 'soheil1@example.com',
    })
    .expect(422);
});

test('Delete', async () => {
  const entity = await context.createEntity(context.adminSession, 'users', {
    'username': 'soheil',
    'password': '12345678',
    'name': 'Soheil',
    'email': 'soheil@example.com',
  });

  await request(context.server)
    .delete(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(200);

  await request(context.server)
    .get(`/users/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(404);
});
