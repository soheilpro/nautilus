import * as request from 'supertest';
import { ItemModel } from '../models';
import { Context } from './context';

class TestContext extends Context {
  item1: ItemModel;
  item2: ItemModel;

  async reset() {
    await super.reset();

    this.item1 = await this.createEntity(this.adminSession, 'items', {
      'kind': 'issue',
    });

    this.item2 = await this.createEntity(this.adminSession, 'items', {
      'kind': 'issue',
    });
  }
}

const context = new TestContext();

beforeAll(context.init);
beforeEach(context.reset);
afterAll(context.destroy);

test('Create: Missing item1_id', async () => {
  await request(context.server)
    .post('/item-relationships')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item1_id': undefined,
      'item2_id': context.item2.id,
      'type': 'parent',
    })
    .expect(422);
});

test('Create: Empty item1_id', async () => {
  await request(context.server)
    .post('/item-relationships')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item1_id': '',
      'item2_id': context.item2.id,
      'type': 'parent',
    })
    .expect(422);
});

test('Create: Invalid item1_id', async () => {
  await request(context.server)
    .post('/item-relationships')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item1_id': 'foo',
      'item2_id': context.item2.id,
      'type': 'parent',
    })
    .expect(422);
});

test('Create: Missing item2_id', async () => {
  await request(context.server)
    .post('/item-relationships')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item1_id': context.item1.id,
      'item2_id': undefined,
      'type': 'parent',
    })
    .expect(422);
});

test('Create: Empty item2_id', async () => {
  await request(context.server)
    .post('/item-relationships')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item1_id': context.item1.id,
      'item2_id': '',
      'type': 'parent',
    })
    .expect(422);
});

test('Create: Invalid item2_id', async () => {
  await request(context.server)
    .post('/item-relationships')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item1_id': context.item1.id,
      'item2_id': 'foo',
      'type': 'parent',
    })
    .expect(422);
});

test('Create: Missing type', async () => {
  await request(context.server)
    .post('/item-relationships')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item1_id': context.item1.id,
      'item2_id': context.item2.id,
      'type': undefined,
    })
    .expect(422);
});

test('Create: Empty type', async () => {
  await request(context.server)
    .post('/item-relationships')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item1_id': context.item1.id,
      'item2_id': context.item2.id,
      'type': '',
    })
    .expect(422);
});

test('Create', async () => {
  await request(context.server)
    .post('/item-relationships')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item1_id': context.item1.id,
      'item2_id': context.item2.id,
      'type': 'parent',
    })
    .expect(201)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'item1': {
            'id': context.item1.id,
          },
          'item2': {
            'id': context.item2.id,
          },
          'type': 'parent',
        },
      });
    });
});

test('Update: Nothing', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-relationships', {
    'item1_id': context.item1.id,
    'item2_id': context.item2.id,
    'type': 'parent',
  });

  await request(context.server)
    .patch(`/item-relationships/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'item1': {
            'id': context.item1.id,
          },
          'item2': {
            'id': context.item2.id,
          },
          'type': 'parent',
        },
      });
    });
});

test('Update: Set item1_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-relationships', {
    'item1_id': context.item1.id,
    'item2_id': context.item2.id,
    'type': 'parent',
  });

  const item = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
  });

  await request(context.server)
    .patch(`/item-relationships/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item1_id': item.id,
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'item1': {
            'id': item.id,
          },
          'item2': {
            'id': context.item2.id,
          },
          'type': 'parent',
        },
      });
    });
});

test('Update: Unset item1_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-relationships', {
    'item1_id': context.item1.id,
    'item2_id': context.item2.id,
    'type': 'parent',
  });

  await request(context.server)
    .patch(`/item-relationships/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item1_id': '',
    })
    .expect(422);
});

test('Update: Invalid item1_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-relationships', {
    'item1_id': context.item1.id,
    'item2_id': context.item2.id,
    'type': 'parent',
  });

  await request(context.server)
    .patch(`/item-relationships/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item1_id': 'foo',
    })
    .expect(422);
});

test('Update: Set item2_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-relationships', {
    'item1_id': context.item1.id,
    'item2_id': context.item2.id,
    'type': 'parent',
  });

  const item = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
  });

  await request(context.server)
    .patch(`/item-relationships/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item2_id': item.id,
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'item1': {
            'id': context.item1.id,
          },
          'item2': {
            'id': item.id,
          },
          'type': 'parent',
        },
      });
    });
});

test('Update: Unset item2_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-relationships', {
    'item1_id': context.item1.id,
    'item2_id': context.item2.id,
    'type': 'parent',
  });

  await request(context.server)
    .patch(`/item-relationships/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item2_id': '',
    })
    .expect(422);
});

test('Update: Invalid item2_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-relationships', {
    'item1_id': context.item1.id,
    'item2_id': context.item2.id,
    'type': 'parent',
  });

  await request(context.server)
    .patch(`/item-relationships/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'item2_id': 'foo',
    })
    .expect(422);
});









test('Update: Set kind', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-relationships', {
    'item1_id': context.item1.id,
    'item2_id': context.item2.id,
    'type': 'parent',
  });

  await request(context.server)
    .patch(`/item-relationships/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'type': 'subissue',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'item1': {
            'id': context.item1.id,
          },
          'item2': {
            'id': context.item2.id,
          },
          'type': 'subissue',
        },
      });
    });
});

test('Update: Unset kind', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-relationships', {
    'item1_id': context.item1.id,
    'item2_id': context.item2.id,
    'type': 'parent',
  });

  await request(context.server)
    .patch(`/item-relationships/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'type': '',
    })
    .expect(422);
});

test('Delete', async () => {
  const entity = await context.createEntity(context.adminSession, 'item-relationships', {
    'item1_id': context.item1.id,
    'item2_id': context.item2.id,
    'type': 'parent',
  });

  await request(context.server)
    .delete(`/item-relationships/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(200);

  await request(context.server)
    .get(`/item-relationships/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(404);
});
