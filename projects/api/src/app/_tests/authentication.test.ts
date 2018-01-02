import * as request from 'supertest';
import { UserModel, SessionModel, ItemStateModel, ItemTypeModel, ProjectModel, UserRoleModel, ItemModel, ItemRelationshipModel } from '../models';
import { Context } from './context';

class TestContext extends Context {
  user: UserModel;
  project: ProjectModel;
  userRole: UserRoleModel;
  itemState: ItemStateModel;
  itemType: ItemTypeModel;
  item: ItemModel;
  itemRelationship: ItemRelationshipModel;
  session: SessionModel;

  async init(): Promise<void> {
    await super.init();

    this.user = await this.createEntity(this.adminSession, 'users', {
      'username': 'user',
      'password': '12345678',
      'name': 'User 0',
      'email': 'user@example.com',
    });

    this.project = await this.createEntity(this.adminSession, 'projects', {
      'name': 'Project 1',
    });

    this.userRole = await this.createEntity(this.adminSession, 'user-roles', {
      'user_id': this.user.id,
      'role': 'project.member',
      'project_id': this.project.id,
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

    this.item = await this.createEntity(this.adminSession, 'items', {
      'kind': 'issue',
    });

    this.itemRelationship = await this.createEntity(this.adminSession, 'item-relationships', {
      'item1_id': this.item.id,
      'item2_id': this.item.id,
      'type': 'self',
    });

    this.session = await this.createEntity(null, 'sessions', {
      'username': this.user.username,
      'password': '12345678',
    });
  }
}

const context = new TestContext();

beforeAll(context.init);
beforeEach(context.reset);
afterAll(context.destroy);

test('items', async () => {
  await request(context.server)
    .get('/items')
    .expect(401);

  await request(context.server)
    .get(`/items/${context.item.id}`)
    .expect(401);

  await request(context.server)
    .post('/items')
    .expect(401);

  await request(context.server)
    .patch(`/items/${context.item.id}`)
    .expect(401);

  await request(context.server)
    .delete(`/items/${context.item.id}`)
    .expect(401);
});

test('item-relationships', async () => {
  await request(context.server)
    .get('/item-relationships')
    .expect(401);

  await request(context.server)
    .get(`/item-relationships/${context.itemRelationship.id}`)
    .expect(401);

  await request(context.server)
    .post('/item-relationships')
    .expect(401);

  await request(context.server)
    .patch(`/item-relationships/${context.itemRelationship.id}`)
    .expect(401);

  await request(context.server)
    .delete(`/item-relationships/${context.itemRelationship.id}`)
    .expect(401);
});

test('item-states', async () => {
  await request(context.server)
    .get('/item-states')
    .expect(401);

  await request(context.server)
    .get(`/item-states/${context.itemState.id}`)
    .expect(401);

  await request(context.server)
    .post('/item-states')
    .expect(401);

  await request(context.server)
    .patch(`/item-states/${context.itemState.id}`)
    .expect(401);

  await request(context.server)
    .delete(`/item-states/${context.itemState.id}`)
    .expect(401);
});

test('item-types', async () => {
  await request(context.server)
    .get('/item-types')
    .expect(401);

  await request(context.server)
    .get(`/item-types/${context.itemType.id}`)
    .expect(401);

  await request(context.server)
    .post('/item-types')
    .expect(401);

  await request(context.server)
    .patch(`/item-types/${context.itemType.id}`)
    .expect(401);

  await request(context.server)
    .delete(`/item-types/${context.itemType.id}`)
    .expect(401);
});

test('projects', async () => {
  await request(context.server)
    .get('/projects')
    .expect(401);

  await request(context.server)
    .get(`/projects/${context.project.id}`)
    .expect(401);

  await request(context.server)
    .post('/projects')
    .expect(401);

  await request(context.server)
    .patch(`/projects/${context.project.id}`)
    .expect(401);

  await request(context.server)
    .delete(`/projects/${context.project.id}`)
    .expect(401);
});

test('sessions', async () => {
});

test('users', async () => {
  await request(context.server)
    .get('/users')
    .expect(401);

  await request(context.server)
    .get(`/users/${context.user.id}`)
    .expect(401);

  await request(context.server)
    .post('/users')
    .expect(401);

  await request(context.server)
    .patch(`/users/${context.user.id}`)
    .expect(401);

  await request(context.server)
    .delete(`/users/${context.user.id}`)
    .expect(401);
});

test('user-logs', async () => {
});

test('user-roles', async () => {
  await request(context.server)
    .get('/user-roles')
    .expect(401);

  await request(context.server)
    .get(`/user-roles/${context.userRole.id}`)
    .expect(401);

  await request(context.server)
    .post('/user-roles')
    .expect(401);

  await request(context.server)
    .patch(`/user-roles/${context.userRole.id}`)
    .expect(401);

  await request(context.server)
    .delete(`/user-roles/${context.userRole.id}`)
    .expect(401);
});
