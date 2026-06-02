jest.mock('../../models/Task');

const Task = require('../../models/Task');
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../../controllers/taskController');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const fakeUserId = '6483c1e2f1a2b3c4d5e6f7a8';
const fakeTaskId = '6483c1e2f1a2b3c4d5e6f7b1';

describe('getAllTasks', () => {
  test('returns tasks for the authenticated user', async () => {
    const tasks = [{ _id: fakeTaskId, name: 'Write tests', userId: fakeUserId }];
    Task.find.mockResolvedValue(tasks);

    const req = { user: { _id: fakeUserId } };
    const res = mockRes();

    await getAllTasks(req, res);

    expect(Task.find).toHaveBeenCalledWith({ userId: fakeUserId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ task: tasks });
  });

  test('returns 500 on database error', async () => {
    Task.find.mockRejectedValue(new Error('DB error'));

    const req = { user: { _id: fakeUserId } };
    const res = mockRes();

    await getAllTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ msg: 'DB error' });
  });
});

describe('getTask', () => {
  test('returns a single task by id', async () => {
    const task = { _id: fakeTaskId, name: 'Deploy app', userId: fakeUserId };
    Task.findOne.mockResolvedValue(task);

    const req = { params: { id: fakeTaskId }, user: { _id: fakeUserId } };
    const res = mockRes();

    await getTask(req, res);

    expect(Task.findOne).toHaveBeenCalledWith({ _id: fakeTaskId, userId: fakeUserId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ task });
  });

  test('returns 404 when task not found', async () => {
    Task.findOne.mockResolvedValue(null);

    const req = { params: { id: fakeTaskId }, user: { _id: fakeUserId } };
    const res = mockRes();

    await getTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('returns 500 on database error', async () => {
    Task.findOne.mockRejectedValue(new Error('fail'));

    const req = { params: { id: fakeTaskId }, user: { _id: fakeUserId } };
    const res = mockRes();

    await getTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('createTask', () => {
  test('creates and returns a task', async () => {
    const body = { name: 'New task' };
    const task = { _id: fakeTaskId, ...body, userId: fakeUserId };
    Task.create.mockResolvedValue(task);

    const req = { body, user: { _id: fakeUserId } };
    const res = mockRes();

    await createTask(req, res);

    expect(Task.create).toHaveBeenCalledWith({ ...body, userId: fakeUserId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ task });
  });

  test('returns 401 when user is not set', async () => {
    const req = { body: { name: 'New task' }, user: null };
    const res = mockRes();

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Not authenticated' });
  });

  test('returns 500 on database error', async () => {
    Task.create.mockRejectedValue(new Error('fail'));

    const req = { body: { name: 'New task' }, user: { _id: fakeUserId } };
    const res = mockRes();

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('updateTask', () => {
  test('updates and returns the task', async () => {
    const task = { _id: fakeTaskId, name: 'Updated', userId: fakeUserId };
    Task.findOneAndUpdate.mockResolvedValue(task);

    const req = {
      params: { id: fakeTaskId },
      body: { name: 'Updated' },
      user: { _id: fakeUserId },
    };
    const res = mockRes();

    await updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ task });
  });

  test('returns 404 when task not found', async () => {
    Task.findOneAndUpdate.mockResolvedValue(null);

    const req = {
      params: { id: fakeTaskId },
      body: {},
      user: { _id: fakeUserId },
    };
    const res = mockRes();

    await updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('returns 500 on database error', async () => {
    Task.findOneAndUpdate.mockRejectedValue(new Error('fail'));

    const req = {
      params: { id: fakeTaskId },
      body: {},
      user: { _id: fakeUserId },
    };
    const res = mockRes();

    await updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('deleteTask', () => {
  test('deletes a task and returns confirmation', async () => {
    Task.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const req = { params: { id: fakeTaskId }, user: { _id: fakeUserId } };
    const res = mockRes();

    await deleteTask(req, res);

    expect(Task.deleteOne).toHaveBeenCalledWith({ _id: fakeTaskId, userId: fakeUserId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: 'task deleted' });
  });

  test('returns 404 when no task was deleted', async () => {
    Task.deleteOne.mockResolvedValue({ deletedCount: 0 });

    const req = { params: { id: fakeTaskId }, user: { _id: fakeUserId } };
    const res = mockRes();

    await deleteTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('returns 500 on database error', async () => {
    Task.deleteOne.mockRejectedValue(new Error('fail'));

    const req = { params: { id: fakeTaskId }, user: { _id: fakeUserId } };
    const res = mockRes();

    await deleteTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
