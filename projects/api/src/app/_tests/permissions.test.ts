import * as request from 'supertest';
import { UserModel, SessionModel, ItemStateModel, ItemTypeModel, ProjectModel, UserRoleModel, ItemModel, ItemRelationshipModel } from '../models';
import { Context } from './context';

class TestContext extends Context {
  user0: UserModel;
  user1: UserModel;
  user2: UserModel;
  project1: ProjectModel;
  project2: ProjectModel;
  userRole1: UserRoleModel;
  userRole2: UserRoleModel;
  itemState: ItemStateModel;
  itemType: ItemTypeModel;
  item1: ItemModel;
  item2: ItemModel;
  itemRelationship: ItemRelationshipModel;
  session0: SessionModel;
  session1: SessionModel;
  session2: SessionModel;

  async reset(): Promise<void> {
    await super.reset();

    this.user0 = await this.createEntity(this.adminSession, 'users', {
      'username': 'user0',
      'password': '12345678',
      'name': 'User 0',
      'email': 'user0@example.com',
    });

    this.user1 = await this.createEntity(this.adminSession, 'users', {
      'username': 'user1',
      'password': '12345678',
      'name': 'User 1',
      'email': 'user1@example.com',
    });

    this.user2 = await this.createEntity(this.adminSession, 'users', {
      'username': 'user2',
      'password': '12345678',
      'name': 'User 2',
      'email': 'user2@example.com',
    });

    this.project1 = await this.createEntity(this.adminSession, 'projects', {
      'name': 'Project 1',
    });

    this.project2 = await this.createEntity(this.adminSession, 'projects', {
      'name': 'Project 2',
    });

    this.userRole1 = await this.createEntity(this.adminSession, 'user-roles', {
      'user_id': this.user1.id,
      'project_id': this.project1.id,
      'name': 'project.member',
    });

    this.userRole2 = await this.createEntity(this.adminSession, 'user-roles', {
      'user_id': this.user2.id,
      'project_id': this.project2.id,
      'name': 'project.member',
    });

    this.itemState = await this.createEntity(this.adminSession, 'item-states', {
      'item_kind': 'issue',
      'title': 'My State',
      'key': 'mystate',
      'order': '0',
    });

    this.itemType = await this.createEntity(this.adminSession, 'item-types', {
      'item_kind': 'issue',
      'title': 'My Type',
      'key': 'mytype',
      'order': '0',
    });

    this.item1 = await this.createEntity(this.adminSession, 'items', {
      'kind': 'issue',
      'project_id': this.project1.id,
    });

    this.item2 = await this.createEntity(this.adminSession, 'items', {
      'kind': 'issue',
      'project_id': this.project2.id,
    });

    this.itemRelationship = await this.createEntity(this.adminSession, 'item-relationships', {
      'item1_id': this.item1.id,
      'item2_id': this.item2.id,
      'type': 'parent',
    });

    this.session0 = await this.createEntity(null, 'sessions', {
      'username': this.user0.username,
      'password': '12345678',
    });

    this.session1 = await this.createEntity(null, 'sessions', {
      'username': this.user1.username,
      'password': '12345678',
    });

    this.session2 = await this.createEntity(null, 'sessions', {
      'username': this.user2.username,
      'password': '12345678',
    });
  }
}

const context = new TestContext();

beforeAll(context.init);
beforeEach(context.reset);
afterAll(context.destroy);

test('() -> items', async () => {
  await request(context.server)
    .get('/items')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [],
      });
    });

  await request(context.server)
    .get(`/items/${context.item1.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  const item = await context.createEntity(context.session0, 'items', {
    'kind': 'issue',
  });

  await request(context.server)
    .post('/items')
    .auth(context.session0.user.id, context.session0.accessToken)
    .send({
      'kind': 'issue',
      'project_id': context.project1.id,
    })
    .expect(403);

  await request(context.server)
    .patch(`/items/${context.item1.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/items/${item.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(200);

  await request(context.server)
    .delete(`/items/${context.item1.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/items/${item.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(200);
});

test('() -> item-relationships', async () => {
  await request(context.server)
    .get('/item-relationships')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [],
      });
    });

  await request(context.server)
    .get(`/item-relationships/${context.itemRelationship.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .post('/item-relationships')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/item-relationships/${context.itemRelationship.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/item-relationships/${context.itemRelationship.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);
});

test('() -> item-states', async () => {
  await request(context.server)
    .get('/item-states')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [],
      });
    });

  await request(context.server)
    .get(`/item-states/${context.itemState.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .post('/item-states')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/item-states/${context.itemState.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/item-states/${context.itemState.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);
});

test('() -> item-types', async () => {
  await request(context.server)
    .get('/item-types')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [],
      });
    });

  await request(context.server)
    .get(`/item-types/${context.itemType.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .post('/item-types')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/item-types/${context.itemType.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/item-types/${context.itemType.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);
});

test('() -> projects', async () => {
  await request(context.server)
    .get('/projects')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [],
      });
    });

  await request(context.server)
    .get(`/projects/${context.project1.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .post('/projects')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/projects/${context.project1.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/projects/${context.project1.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);
});

test('() -> users', async () => {
  await request(context.server)
    .get('/users')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [
          {
            'id': context.user0.id,
          },
        ],
      });
    });

  await request(context.server)
    .get(`/users/${context.user0.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(200);

  await request(context.server)
    .get(`/users/${context.user1.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .post('/users')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/users/${context.user0.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/users/${context.user1.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/users/${context.user0.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/users/${context.user1.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);
});

test('() -> user-roles', async () => {
  await request(context.server)
    .get('/user-roles')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [],
      });
    });

  await request(context.server)
    .get(`/user-roles/${context.userRole1.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .post('/user-roles')
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/user-roles/${context.userRole1.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/user-roles/${context.userRole1.id}`)
    .auth(context.session0.user.id, context.session0.accessToken)
    .expect(403);
});

test('project.member -> items', async () => {
  await request(context.server)
    .get('/items')
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [
          {
            'id': context.item1.id,
          },
        ],
      });
    });

  await request(context.server)
    .get(`/items/${context.item1.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200);

  await request(context.server)
    .get(`/items/${context.item2.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .post('/items')
    .auth(context.session1.user.id, context.session1.accessToken)
    .send({
      'kind': 'issue',
      'project_id': context.project1.id,
    })
    .expect(201);

  await request(context.server)
    .post('/items')
    .auth(context.session1.user.id, context.session1.accessToken)
    .send({
      'kind': 'issue',
      'project_id': context.project2.id,
    })
    .expect(403);

  await request(context.server)
    .patch(`/items/${context.item1.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200);

  await request(context.server)
    .patch(`/items/${context.item2.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/items/${context.item1.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200);

  await request(context.server)
    .delete(`/items/${context.item2.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);
});

test('project.member -> item-relationships', async () => {
  await request(context.server)
    .get('/item-relationships')
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [],
      });
    });

  await request(context.server)
    .get(`/item-relationships/${context.itemRelationship.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .post('/item-relationships')
    .auth(context.session1.user.id, context.session1.accessToken)
    .send({
      'item1_id': context.item1.id,
      'item2_id': context.item1.id,
      'type': 'self',
    })
    .expect(201);

  await request(context.server)
    .post('/item-relationships')
    .auth(context.session1.user.id, context.session1.accessToken)
    .send({
      'item1_id': context.item1.id,
      'item2_id': context.item2.id,
      'type': 'parent',
    })
    .expect(403);

  await request(context.server)
    .patch(`/item-relationships/${context.itemRelationship.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/item-relationships/${context.itemRelationship.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);
});

test('project.member -> item-states', async () => {
  await request(context.server)
    .get('/item-states')
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [
          {
            'id': context.itemState.id,
          },
        ],
      });
    });

  await request(context.server)
    .get(`/item-states/${context.itemState.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200);

  await request(context.server)
    .post('/item-states')
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/item-states/${context.itemState.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/item-states/${context.itemState.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);
});

test('project.member -> item-types', async () => {
  await request(context.server)
    .get('/item-types')
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [
          {
            'id': context.itemType.id,
          },
        ],
      });
    });

  await request(context.server)
    .get(`/item-types/${context.itemType.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200);

  await request(context.server)
    .post('/item-types')
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/item-types/${context.itemType.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/item-types/${context.itemType.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);
});

test('project.member -> projects', async () => {
  await request(context.server)
    .get('/projects')
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [
          {
            'id': context.project1.id,
          },
        ],
      });
    });

  await request(context.server)
    .get(`/projects/${context.project1.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200);

  await request(context.server)
    .get(`/projects/${context.project2.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .post('/projects')
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/projects/${context.project1.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/projects/${context.project1.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);
});

test('project.member -> users', async () => {
  await request(context.server)
    .get('/users')
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body.data.some((user: UserModel) => user.id === context.adminUser.id)).toBeTruthy();
      expect(response.body.data.some((user: UserModel) => user.id === context.user0.id)).toBeTruthy();
      expect(response.body.data.some((user: UserModel) => user.id === context.user1.id)).toBeTruthy();
      expect(response.body.data.some((user: UserModel) => user.id === context.user2.id)).toBeTruthy();
    });

  await request(context.server)
    .get(`/users/${context.user0.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200);

  await request(context.server)
    .get(`/users/${context.user1.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200);

  await request(context.server)
    .get(`/users/${context.user2.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200);

  await request(context.server)
    .post('/users')
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/users/${context.user0.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/users/${context.user1.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/users/${context.user0.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/users/${context.user1.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);
});

test('project.member -> user-roles', async () => {
  await request(context.server)
    .get('/user-roles')
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': [
          {
            'id': context.userRole1.id,
          },
        ],
      });
    });

  await request(context.server)
    .get(`/user-roles/${context.userRole1.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(200);

  await request(context.server)
    .post('/user-roles')
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .patch(`/user-roles/${context.userRole1.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);

  await request(context.server)
    .delete(`/user-roles/${context.userRole1.id}`)
    .auth(context.session1.user.id, context.session1.accessToken)
    .expect(403);
});
