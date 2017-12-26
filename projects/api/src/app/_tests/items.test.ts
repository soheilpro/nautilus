import * as request from 'supertest';
import { ItemStateModel, ItemTypeModel, ProjectModel } from '../models';
import { Context } from './context';

class TestContext extends Context {
  itemState: ItemStateModel;
  itemType: ItemTypeModel;
  project: ProjectModel;

  async reset(): Promise<void> {
    await super.reset();

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

    this.project = await this.createEntity(this.adminSession, 'projects', {
      'name': 'My Project',
    });
  }
}

const context = new TestContext();

beforeAll(context.init);
beforeEach(context.reset);
afterAll(context.destroy);

test('Create: Missing kind', async () => {
  await request(context.server)
    .post('/items')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': undefined,
      'type_id': context.itemType.id,
      'title': 'Title',
      'description': 'Awesome Project',
      'state_id': context.itemState.id,
      'tags': 'tag1,tag2',
      'project_id': context.project.id,
      'assigned_to_id': context.adminSession.user.id,
    })
    .expect(422);
});

test('Create: Empty kind', async () => {
  await request(context.server)
    .post('/items')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': '',
      'type_id': context.itemType.id,
      'title': 'Title',
      'description': 'Awesome Project',
      'state_id': context.itemState.id,
      'tags': 'tag1,tag2',
      'project_id': context.project.id,
      'assigned_to_id': context.adminSession.user.id,
    })
    .expect(422);
});

test('Create: Empty type_id', async () => {
  await request(context.server)
    .post('/items')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': 'issue',
      'type_id': '',
      'title': 'Title',
      'description': 'Awesome Project',
      'state_id': context.itemState.id,
      'tags': 'tag1,tag2',
      'project_id': context.project.id,
      'assigned_to_id': context.adminSession.user.id,
    })
    .expect(422);
});

test('Create: Invalid type_id', async () => {
  await request(context.server)
    .post('/items')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': 'issue',
      'type_id': 'foo',
      'title': 'Title',
      'description': 'Awesome Project',
      'state_id': context.itemState.id,
      'tags': 'tag1,tag2',
      'project_id': context.project.id,
      'assigned_to_id': context.adminSession.user.id,
    })
    .expect(422);
});

test('Create: Empty state_id', async () => {
  await request(context.server)
    .post('/items')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': 'issue',
      'type_id': context.itemType.id,
      'title': 'Title',
      'description': 'Awesome Project',
      'state_id': '',
      'tags': 'tag1,tag2',
      'project_id': context.project.id,
      'assigned_to_id': context.adminSession.user.id,
    })
    .expect(422);
});

test('Create: Invalid state_id', async () => {
  await request(context.server)
    .post('/items')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': 'issue',
      'type_id': context.itemType.id,
      'title': 'Title',
      'description': 'Awesome Project',
      'state_id': 'foo',
      'tags': 'tag1,tag2',
      'project_id': context.project.id,
      'assigned_to_id': context.adminSession.user.id,
    })
    .expect(422);
});

test('Create: Empty project_id', async () => {
  await request(context.server)
    .post('/items')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': 'issue',
      'type_id': context.itemType.id,
      'title': 'Title',
      'description': 'Awesome Project',
      'state_id': context.itemState.id,
      'tags': 'tag1,tag2',
      'project_id': '',
      'assigned_to_id': context.adminSession.user.id,
    })
    .expect(422);
});

test('Create: Invalid project_id', async () => {
  await request(context.server)
    .post('/items')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': 'issue',
      'type_id': context.itemType.id,
      'title': 'Title',
      'description': 'Awesome Project',
      'state_id': context.itemState.id,
      'tags': 'tag1,tag2',
      'project_id': 'foo',
      'assigned_to_id': context.adminSession.user.id,
    })
    .expect(422);
});

test('Create: Empty assigned_to_id', async () => {
  await request(context.server)
    .post('/items')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': 'issue',
      'type_id': context.itemType.id,
      'title': 'Title',
      'description': 'Awesome Project',
      'state_id': context.itemState.id,
      'tags': 'tag1,tag2',
      'project_id': context.project.id,
      'assigned_to_id': '',
    })
    .expect(422);
});

test('Create: Invalid assigned_to_id', async () => {
  await request(context.server)
    .post('/items')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': 'issue',
      'type_id': context.itemType.id,
      'title': 'Title',
      'description': 'Awesome Project',
      'state_id': context.itemState.id,
      'tags': 'tag1,tag2',
      'project_id': context.project.id,
      'assigned_to_id': 'foo',
    })
    .expect(422);
});

test('Create: Minimum fields', async () => {
  await request(context.server)
    .post('/items')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': 'issue',
    })
    .expect(201)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'createdBy': {
            'id': context.adminSession.user.id,
          },
        },
      });

      expect(response.body).not.toHaveProperty('data.type');
      expect(response.body).not.toHaveProperty('data.title');
      expect(response.body).not.toHaveProperty('data.description');
      expect(response.body).not.toHaveProperty('data.state');
      expect(response.body).not.toHaveProperty('data.tags');
      expect(response.body).not.toHaveProperty('data.project');
      expect(response.body).not.toHaveProperty('data.assignedTo');
    });
});

test('Create', async () => {
  await request(context.server)
    .post('/items')
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': 'issue',
      'type_id': context.itemType.id,
      'title': 'Title',
      'description': 'Awesome Project',
      'state_id': context.itemState.id,
      'tags': 'tag1,tag2',
      'project_id': context.project.id,
      'assigned_to_id': context.adminSession.user.id,
    })
    .expect(201)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
        },
      });
    });
});

test('Update: Nothing', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });
    });
});

test('Update: Set kind', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': 'milestone',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'milestone',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });
    });
});

test('Update: Unset kind', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'kind': '',
    })
    .expect(422);
});

test('Update: Set type_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  const itemType = await context.createEntity(context.adminSession, 'item-types', {
    'item_kind': 'issue',
    'title': 'My Type',
    'key': 'mytype2',
    'order': '0',
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'type_id': itemType.id,
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': itemType.id,
          },
          'title': 'Title',
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });
    });
});

test('Update: Unset type_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'type_id': '',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'title': 'Title',
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });

      expect(response.body).not.toHaveProperty('data.type');
    });
});

test('Update: Invalid type_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'type_id': 'foo',
    })
    .expect(422);
});

test('Update: Set title', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'title': 'New Title',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'New Title',
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });
    });
});

test('Update: Unset title', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'title': '',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });

      expect(response.body).not.toHaveProperty('data.title');
    });
});

test('Update: Set description', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'description': 'Amazing Project',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'description': 'Amazing Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });
    });
});

test('Update: Unset description', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'description': '',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });

      expect(response.body).not.toHaveProperty('data.description');
    });
});

test('Update: Set state_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  const itemState = await context.createEntity(context.adminSession, 'item-states', {
    'item_kind': 'issue',
    'title': 'My State',
    'key': 'mystate2',
    'order': '0',
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'state_id': itemState.id,
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'description': 'Awesome Project',
          'state': {
            'id': itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });
    });
});

test('Update: Unset state_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'state_id': '',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'description': 'Awesome Project',
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });

      expect(response.body).not.toHaveProperty('data.state');
    });
});

test('Update: Invalid state_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'state_id': 'foo',
    })
    .expect(422);
});

test('Update: Set tags', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'tags': 'tag2,tag3',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag2', 'tag3' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
        },
      });
    });
});

test('Update: Unset tags', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'tags': '',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
        },
      });

      expect(response.body).not.toHaveProperty('data.tags');
    });
});

test('Update: Set project_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  const project = await context.createEntity(context.adminSession, 'projects', {
    'name': 'My Project 2',
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'project_id': project.id,
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': project.id,
          },
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });
    });
});

test('Update: Unset project_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'project_id': '',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'assignedTo': {
            'id': context.adminSession.user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });

      expect(response.body).not.toHaveProperty('data.project');
    });
});

test('Update: Invalid project_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'project_id': 'foo',
    })
    .expect(422);
});

test('Update: Set assigned_to_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  const user = await context.createEntity(context.adminSession, 'users', {
    'username': 'hans',
    'password': '12345678',
    'name': 'Hans',
    'email': 'hans@example.com',
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'assigned_to_id': user.id,
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'assignedTo': {
            'id': user.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });
    });
});

test('Update: Unset assigned_to_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'assigned_to_id': '',
    })
    .expect(200)
    .expect((response: request.Response) => {
      expect(response.body).toMatchObject({
        'data': {
          'kind': 'issue',
          'type': {
            'id': context.itemType.id,
          },
          'title': 'Title',
          'description': 'Awesome Project',
          'state': {
            'id': context.itemState.id,
          },
          'tags': [ 'tag1', 'tag2' ],
          'project': {
            'id': context.project.id,
          },
          'createdBy': {
            'id': context.adminSession.user.id,
          },
          'modifiedBy': {
            'id': context.adminSession.user.id,
          },
        },
      });

      expect(response.body).not.toHaveProperty('data.assignedTo');
    });
});

test('Update: Invalid assigned_to_id', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .patch(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .send({
      'assigned_to_id': 'foo',
    })
    .expect(422);
});

test('Delete', async () => {
  const entity = await context.createEntity(context.adminSession, 'items', {
    'kind': 'issue',
    'type_id': context.itemType.id,
    'title': 'Title',
    'description': 'Awesome Project',
    'state_id': context.itemState.id,
    'tags': 'tag1,tag2',
    'project_id': context.project.id,
    'assigned_to_id': context.adminSession.user.id,
  });

  await request(context.server)
    .delete(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(200);

  await request(context.server)
    .get(`/items/${entity.id}`)
    .auth(context.adminSession.user.id, context.adminSession.accessToken)
    .expect(404);
});
