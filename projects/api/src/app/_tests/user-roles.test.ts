import * as request from 'supertest';
import { UserModel, ProjectModel } from '../models';
import { Context } from './context';

class TestContext extends Context {
  user: UserModel;
  project: ProjectModel;

  async reset(): Promise<void> {
    await super.reset();

    this.user = await this.createEntity(this.adminSession, 'users', {
      'username': 'soheil',
      'password': '12345678',
      'name': 'Soheil',
      'email': 'soheil@example.com',
    });

    this.project = await this.createEntity(this.adminSession, 'projects', {
      'name': 'My Project',
    });
  }
}

const context = new TestContext();

beforeAll(context.init);
beforeEach(context.reset);
afterAll(context.destroy);

test('Create: Missing user_id', async () => {
  await request(context.server)
    .post('/user-roles')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': undefined,
      'role': 'project.member',
      'project_id': context.project.id,
    })
    .expect(422);
});

test('Create: Empty user_id', async () => {
  await request(context.server)
    .post('/user-roles')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': '',
      'role': 'project.member',
      'project_id': context.project.id,
    })
    .expect(422);
});

test('Create: Invalid user_id', async () => {
  await request(context.server)
    .post('/user-roles')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': 'foo',
      'role': 'project.member',
      'project_id': context.project.id,
    })
    .expect(422);
});

test('Create: Empty project_id', async () => {
  await request(context.server)
    .post('/user-roles')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': context.user.id,
      'role': 'project.member',
      'project_id': '',
    })
    .expect(422);
});

test('Create: Invalid project_id', async () => {
  await request(context.server)
    .post('/user-roles')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': context.user.id,
      'role': 'project.member',
      'project_id': 'foo',
    })
    .expect(422);
});

test('Create: Missing role', async () => {
  await request(context.server)
    .post('/user-roles')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': context.user.id,
      'role': undefined,
      'project_id': context.project.id,
    })
    .expect(422);
});

test('Create: Empty role', async () => {
  await request(context.server)
    .post('/user-roles')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': context.user.id,
      'role': '',
      'project_id': context.project.id,
    })
    .expect(422);
});

test('Create: No project_id for project.member role', async () => {
  await request(context.server)
    .post('/user-roles')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': context.user.id,
      'role': 'project.member',
    })
    .expect(422);
});

test('Create: project_id for system.admin role', async () => {
  await request(context.server)
    .post('/user-roles')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': context.user.id,
      'role': 'system.admin',
      'project_id': context.project.id,
    })
    .expect(422);
});

test('Create', async () => {
  await request(context.server)
    .post('/user-roles')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': context.user.id,
      'role': 'project.member',
      'project_id': context.project.id,
    })
    .expect(201)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'user': {
            'id': context.user.id,
          },
          'role': 'project.member',
          'project': {
            'id': context.project.id,
          },
        },
      });
    });
});

test('Update: Nothing', async () => {
  const entity = await context.createEntity(context.adminSession, 'user-roles', {
    'user_id': context.user.id,
    'role': 'project.member',
    'project_id': context.project.id,
  });

  await request(context.server)
    .patch(`/user-roles/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'user': {
            'id': context.user.id,
          },
          'role': 'project.member',
          'project': {
            'id': context.project.id,
          },
        },
      });
    });
});

test('Update: Set user_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'user-roles', {
    'user_id': context.user.id,
    'role': 'project.member',
    'project_id': context.project.id,
  });

  const user = await context.createEntity(context.adminSession, 'users', {
    'username': 'hans',
    'password': '12345678',
    'name': 'Hans',
    'email': 'hans@example.com',
  });

  await request(context.server)
    .patch(`/user-roles/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': user.id,
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'user': {
            'id': user.id,
          },
          'role': 'project.member',
          'project': {
            'id': context.project.id,
          },
        },
      });
    });
});

test('Update: Unset user_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'user-roles', {
    'user_id': context.user.id,
    'role': 'project.member',
    'project_id': context.project.id,
  });

  await request(context.server)
    .patch(`/user-roles/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': '',
    })
    .expect(422);
});

test('Update: Invalid user_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'user-roles', {
    'user_id': context.user.id,
    'role': 'project.member',
    'project_id': context.project.id,
  });

  await request(context.server)
    .patch(`/user-roles/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'user_id': 'foo',
    })
    .expect(422);
});

test('Update: Set project_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'user-roles', {
    'user_id': context.user.id,
    'role': 'project.member',
    'project_id': context.project.id,
  });

  const project = await context.createEntity(context.adminSession, 'projects', {
    'name': 'My New Project',
  });

  await request(context.server)
    .patch(`/user-roles/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'project_id': project.id,
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'user': {
            'id': context.user.id,
          },
          'role': 'project.member',
          'project': {
            'id': project.id,
          },
        },
      });
    });
});

test('Update: Unset project_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'user-roles', {
    'user_id': context.user.id,
    'role': 'project.member',
    'project_id': context.project.id,
  });

  await request(context.server)
    .patch(`/user-roles/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'project_id': '',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'user': {
            'id': context.user.id,
          },
          'role': 'project.member',
        },
      });

      expect(response.body).not.toHaveProperty('data.project');
    });
});

test('Update: Invalid project_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'user-roles', {
    'user_id': context.user.id,
    'role': 'project.member',
    'project_id': context.project.id,
  });

  await request(context.server)
    .patch(`/user-roles/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'project_id': 'foo',
    })
    .expect(422);
});

test('Update: Set role', async () => {
  const entity = await context.createEntity(context.adminSession, 'user-roles', {
    'user_id': context.user.id,
    'role': 'project.member',
    'project_id': context.project.id,
  });

  await request(context.server)
    .patch(`/user-roles/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'role': 'newrole',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'user': {
            'id': context.user.id,
          },
          'role': 'newrole',
          'project': {
            'id': context.project.id,
          },
        },
      });
    });
});

test('Update: Unset role', async () => {
  const entity = await context.createEntity(context.adminSession, 'user-roles', {
    'user_id': context.user.id,
    'role': 'project.member',
    'project_id': context.project.id,
  });

  await request(context.server)
    .patch(`/user-roles/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'role': '',
    })
    .expect(422);
});

test('Delete', async () => {
  const entity = await context.createEntity(context.adminSession, 'user-roles', {
    'user_id': context.user.id,
    'role': 'project.member',
    'project_id': context.project.id,
  });

  await request(context.server)
    .delete(`/user-roles/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(200);

  await request(context.server)
    .get(`/user-roles/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(404);
});
