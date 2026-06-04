const request = require('supertest');
const app = require('../../app');
const { connect, disconnect, clear } = require('../helpers/db');

const agent = request.agent(app);

const testUser = {
  name: 'Task User',
  email: 'tasks@example.com',
  password: 'taskpass123',
};

beforeAll(async () => {
  process.env.SESSION_SECRET = 'test-secret';
  await connect();
  await agent.post('/api/v1/users/register').send(testUser);
  await agent
    .post('/api/v1/users/login')
    .send({ email: testUser.email, password: testUser.password });
});

afterEach(async () => {
  const Task = require('../../models/Task');
  await Task.deleteMany({});
});

afterAll(async () => {
  await disconnect();
});

describe('GET /api/v1/tasks', () => {
  test('returns empty task list for new user', async () => {
    const res = await agent.get('/api/v1/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('task');
    expect(Array.isArray(res.body.task)).toBe(true);
  });

  test('returns 401 without a session', async () => {
    const res = await request(app).get('/api/v1/tasks');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/tasks', () => {
  test('creates a task and returns it', async () => {
    const res = await agent
      .post('/api/v1/tasks')
      .send({ name: 'Buy groceries', priority: 'low' });
    expect(res.status).toBe(200);
    expect(res.body.task).toHaveProperty('name', 'Buy groceries');
    expect(res.body.task).toHaveProperty('completed', false);
  });

  test('returns 500 when name is missing', async () => {
    const res = await agent.post('/api/v1/tasks').send({ priority: 'high' });
    expect(res.status).toBe(500);
  });
});

describe('PATCH /api/v1/tasks/:id', () => {
  test('updates a task field', async () => {
    const create = await agent.post('/api/v1/tasks').send({ name: 'Initial name' });
    const taskId = create.body.task._id;

    const res = await agent
      .patch(`/api/v1/tasks/${taskId}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.task.completed).toBe(true);
  });

  test('returns 404 for unknown task id', async () => {
    const res = await agent
      .patch('/api/v1/tasks/6483c1e2f1a2b3c4d5e6f7b9')
      .send({ name: 'Ghost' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/v1/tasks/:id', () => {
  test('deletes a task', async () => {
    const create = await agent.post('/api/v1/tasks').send({ name: 'To delete' });
    const taskId = create.body.task._id;

    const res = await agent.delete(`/api/v1/tasks/${taskId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('msg', 'task deleted');
  });

  test('returns 404 when task does not exist', async () => {
    const res = await agent.delete('/api/v1/tasks/6483c1e2f1a2b3c4d5e6f7b9');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/v1/tasks/:id', () => {
  test('returns a single task by id', async () => {
    const create = await agent.post('/api/v1/tasks').send({ name: 'Single fetch' });
    const taskId = create.body.task._id;

    const res = await agent.get(`/api/v1/tasks/${taskId}`);
    expect(res.status).toBe(200);
    expect(res.body.task).toHaveProperty('name', 'Single fetch');
  });
});
