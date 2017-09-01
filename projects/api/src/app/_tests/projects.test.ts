import * as request from 'supertest';
import { Context } from './context';

const context = new Context();

beforeAll(context.init);
beforeEach(context.reset);
afterAll(context.destroy);

test('Create: Missing name', async () => {
  await request(context.server)
    .post('/projects')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'name': undefined,
      'description': 'Awesome Project',
      'tags': 'tag1,tag2',
    })
    .expect(422);
});

test('Create: Empty name', async () => {
  await request(context.server)
    .post('/projects')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'name': '',
      'description': 'Awesome Project',
      'tags': 'tag1,tag2',
    })
    .expect(422);
});

test('Create: Duplicate name', async () => {
  await request(context.server)
    .post('/projects')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'name': 'My Project',
      'description': 'Awesome Project',
      'tags': 'tag1,tag2',
    });

  await request(context.server)
    .post('/projects')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'name': 'My Project',
      'description': 'Awesome Project',
      'tags': 'tag1,tag2',
    })
    .expect(422);
});

test('Create', async () => {
  await request(context.server)
    .post('/projects')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'name': 'My Project',
      'description': 'Awesome Project',
      'tags': 'tag1,tag2',
    })
    .expect(201)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'name': 'My Project',
          'description': 'Awesome Project',
          'tags': [ 'tag1', 'tag2' ],
        },
      });
    });
});

test('Update: Nothing', async () => {
  const entity = await context.createEntity(context.adminSession, 'projects', {
    'name': 'My Project',
    'description': 'Awesome Project',
    'tags': 'tag1,tag2',
  });

  await request(context.server)
    .patch(`/projects/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'name': 'My Project',
          'description': 'Awesome Project',
          'tags': [ 'tag1', 'tag2' ],
        },
      });
    });
});

test('Update: Set name', async () => {
  const entity = await context.createEntity(context.adminSession, 'projects', {
    'name': 'My Project',
    'description': 'Awesome Project',
    'tags': 'tag1,tag2',
  });

  await request(context.server)
    .patch(`/projects/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'name': 'My Project 2',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'name': 'My Project 2',
          'description': 'Awesome Project',
          'tags': [ 'tag1', 'tag2' ],
        },
      });
    });
});

test('Update: Unset name', async () => {
  const entity = await context.createEntity(context.adminSession, 'projects', {
    'name': 'My Project',
    'description': 'Awesome Project',
    'tags': 'tag1,tag2',
  });

  await request(context.server)
    .patch(`/projects/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'name': '',
    })
    .expect(422);
});

test('Update: Duplicate name', async () => {
  await context.createEntity(context.adminSession, 'projects', {
    'name': 'My Project 1',
    'description': 'Awesome Project',
    'tags': 'tag1,tag2',
  });

  const entity = await context.createEntity(context.adminSession, 'projects', {
    'name': 'My Project 2',
    'description': 'Awesome Project',
    'tags': 'tag1,tag2',
  });

  await request(context.server)
    .patch(`/projects/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'name': 'My Project 1',
    })
    .expect(422);
});

test('Update: Set description', async () => {
  const entity = await context.createEntity(context.adminSession, 'projects', {
    'name': 'My Project',
    'description': 'Awesome Project',
    'tags': 'tag1,tag2',
  });

  await request(context.server)
    .patch(`/projects/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'description': 'Most Awesome Project',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'name': 'My Project',
          'description': 'Most Awesome Project',
          'tags': [ 'tag1', 'tag2' ],
        },
      });
    });
});

test('Update: Unset description', async () => {
  const entity = await context.createEntity(context.adminSession, 'projects', {
    'name': 'My Project',
    'description': 'Awesome Project',
    'tags': 'tag1,tag2',
  });

  await request(context.server)
    .patch(`/projects/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'description': '',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'name': 'My Project',
          'tags': [ 'tag1', 'tag2' ],
        },
      });

      expect(response.body).not.toHaveProperty('data.description');
    });
});

test('Update: Set tags', async () => {
  const entity = await context.createEntity(context.adminSession, 'projects', {
    'name': 'My Project',
    'description': 'Awesome Project',
    'tags': 'tag1,tag2',
  });

  await request(context.server)
    .patch(`/projects/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'tags': 'tag2,tag3',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'name': 'My Project',
          'description': 'Awesome Project',
          'tags': [ 'tag2', 'tag3' ],
        },
      });
    });
});

test('Update: Unset tags', async () => {
  const entity = await context.createEntity(context.adminSession, 'projects', {
    'name': 'My Project',
    'description': 'Awesome Project',
    'tags': 'tag1,tag2',
  });

  await request(context.server)
    .patch(`/projects/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'tags': '',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'name': 'My Project',
          'description': 'Awesome Project',
        },
      });

      expect(response.body).not.toHaveProperty('data.tags');
    });
});

test('Delete', async () => {
  const entity = await context.createEntity(context.adminSession, 'projects', {
    'name': 'My Project',
    'description': 'Awesome Project',
    'tags': 'tag1,tag2',
  });

  await request(context.server)
    .delete(`/projects/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(200);

  await request(context.server)
    .get(`/projects/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(404);
});
