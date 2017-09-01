import * as request from 'supertest';
import { Context } from './context';

const context = new Context();

beforeAll(context.init);
beforeEach(context.reset);
afterAll(context.destroy);

test('Create: Missing item_kind', async () => {
  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': undefined,
      'title': 'My State',
      'key': 'mystate',
      'order': '0',
    })
    .expect(422);
});

test('Create: Empty item_kind', async () => {
  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': '',
      'title': 'My State',
      'key': 'mystate',
      'order': '0',
    })
    .expect(422);
});

test('Create: Missing title', async () => {
  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': undefined,
      'key': 'mystate',
      'order': '0',
    })
    .expect(422);
});

test('Create: Empty title', async () => {
  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': '',
      'key': 'mystate',
      'order': '0',
    })
    .expect(422);
});

test('Create: Missing key', async () => {
  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': 'My State',
      'key': undefined,
      'order': '0',
    })
    .expect(422);
});

test('Create: Empty key', async () => {
  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': 'My State',
      'key': '',
      'order': '0',
    })
    .expect(422);
});

test('Create: Duplicate key', async () => {
  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': 'My State',
      'key': 'mystate',
      'order': '0',
    });

  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': 'My State',
      'key': 'mystate',
      'order': '0',
    })
    .expect(422);
});

test('Create: Missing order', async () => {
  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': 'My State',
      'key': 'mystate',
      'order': undefined,
    })
    .expect(422);
});

test('Create: Empty order', async () => {
  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': 'My State',
      'key': 'mystate',
      'order': '',
    })
    .expect(422);
});

test('Create: Non-integer order', async () => {
  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': 'My State',
      'key': 'mystate',
      'order': '1.1',
    })
    .expect(422);

  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': 'My State',
      'key': 'mystate',
      'order': 'zero',
    })
    .expect(422);

  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': 'My State',
      'key': 'mystate',
      'order': '0ero',
    })
    .expect(422);
});

test('Create: Negative order', async () => {
  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': 'My State',
      'key': 'mystate',
      'order': '-1',
    })
    .expect(422);
});

test('Create', async () => {
  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': 'My State',
      'key': 'mystate',
      'order': '0',
    })
    .expect(201)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'itemKind': 'issue',
          'title': 'My State',
          'key': 'mystate',
          'order': 0,
        },
      });
    });
});

test('Update: Nothing', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate',
    'order': '0',
  });

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'itemKind': 'issue',
          'title': 'My State',
          'key': 'mystate',
          'order': 0,
        },
      });
    });
});

test('Update: Set item_kind', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate',
    'order': '0',
  });

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'milestone',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'itemKind': 'milestone',
          'title': 'My State',
          'key': 'mystate',
          'order': 0,
        },
      });
    });
});

test('Update: Unset item_kind', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate',
    'order': '0',
  });

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': '',
    })
    .expect(422);
});

test('Update: Set title', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate',
    'order': '0',
  });

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'title': 'My New State',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'itemKind': 'issue',
          'title': 'My New State',
          'key': 'mystate',
          'order': 0,
        },
      });
    });
});

test('Update: Unset title', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate',
    'order': '0',
  });

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'title': '',
    })
    .expect(422);
});

test('Update: Set key', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate',
    'order': '0',
  });

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'key': 'mynewstate',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'itemKind': 'issue',
          'title': 'My State',
          'key': 'mynewstate',
          'order': 0,
        },
      });
    });
});

test('Update: Unset key', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate',
    'order': '0',
  });

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'key': '',
    })
    .expect(422);
});

test('Update: Duplicate key', async () => {
  await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate1',
    'order': '0',
  });

  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate2',
    'order': '0',
  });

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'key': 'mystate1',
    })
    .expect(422);
});

test('Update: Set order', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate',
    'order': '0',
  });

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'order': '10',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'itemKind': 'issue',
          'title': 'My State',
          'key': 'mystate',
          'order': 10,
        },
      });
    });
});

test('Update: Unset order', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate',
    'order': '0',
  });

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'order': '',
    })
    .expect(422);
});

test('Update: Non-integer order', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate',
    'order': '0',
  });

  await request(context.server)
    .post('/item-states')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item_kind': 'issue',
      'title': 'My State',
      'key': 'mystate',
      'order': '1.1',
    })
    .expect(422);

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'order': 'zero',
    })
    .expect(422);

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'order': '0ero',
    })
    .expect(422);
});

test('Update: Negative order', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate',
    'order': '0',
  });

  await request(context.server)
    .patch(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'order': '-1',
    })
    .expect(422);
});

test('Delete', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate',
    'order': '0',
  });

  await request(context.server)
    .delete(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(200);

  await request(context.server)
    .get(`/item-states/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(404);
});
