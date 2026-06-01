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

const mockUser = { _id: 'user123' };

describe('getAllTasks', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns tasks for the authenticated user', async () => {
    const tasks = [{ _id: 't1', name: 'Task 1' }];
    Task.find.mockResolvedValue(tasks);

    const req = { user: mockUser };
    const res = mockRes();

    await getAllTasks(req, res);

    expect(Task.find).toHaveBeenCalledWith({ userId: mockUser._id });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ task: tasks });
  });

  it('returns 500 on db error', async () => {
    Task.find.mockRejectedValue(new Error('DB error'));
    const req = { user: mockUser };
    const res = mockRes();

    await getAllTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('getTask', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns a single task by id', async () => {
    const task = { _id: 'tid', name: 'My task' };
    Task.findOne.mockResolvedValue(task);

    const req = { params: { id: 'tid' }, user: mockUser };
    const res = mockRes();

    await getTask(req, res);

    expect(Task.findOne).toHaveBeenCalledWith({ _id: 'tid', userId: mockUser._id });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ task });
  });

  it('returns 404 when task not found', async () => {
    Task.findOne.mockResolvedValue(null);

    const req = { params: { id: 'missing' }, user: mockUser };
    const res = mockRes();

    await getTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 500 on db error', async () => {
    Task.findOne.mockRejectedValue(new Error('fail'));
    const req = { params: { id: 'x' }, user: mockUser };
    const res = mockRes();

    await getTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('createTask', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates and returns a task', async () => {
    const newTask = { _id: 'new1', name: 'New task', userId: mockUser._id };
    Task.create.mockResolvedValue(newTask);

    const req = { user: mockUser, body: { name: 'New task' } };
    const res = mockRes();

    await createTask(req, res);

    expect(Task.create).toHaveBeenCalledWith({ name: 'New task', userId: mockUser._id });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ task: newTask });
  });

  it('returns 401 when req.user is missing', async () => {
    const req = { user: null, body: { name: 'Task' } };
    const res = mockRes();

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 500 on db error', async () => {
    Task.create.mockRejectedValue(new Error('fail'));
    const req = { user: mockUser, body: { name: 'X' } };
    const res = mockRes();

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('updateTask', () => {
  beforeEach(() => jest.clearAllMocks());

  it('updates and returns the task', async () => {
    const updated = { _id: 'tid', name: 'Updated' };
    Task.findOneAndUpdate.mockResolvedValue(updated);

    const req = { params: { id: 'tid' }, user: mockUser, body: { name: 'Updated' } };
    const res = mockRes();

    await updateTask(req, res);

    expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'tid', userId: mockUser._id },
      { name: 'Updated' },
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 404 when task not found', async () => {
    Task.findOneAndUpdate.mockResolvedValue(null);
    const req = { params: { id: 'missing' }, user: mockUser, body: {} };
    const res = mockRes();

    await updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 500 on db error', async () => {
    Task.findOneAndUpdate.mockRejectedValue(new Error('fail'));
    const req = { params: { id: 'x' }, user: mockUser, body: {} };
    const res = mockRes();

    await updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('deleteTask', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deletes a task and returns success message', async () => {
    Task.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const req = { params: { id: 'tid' }, user: mockUser };
    const res = mockRes();

    await deleteTask(req, res);

    expect(Task.deleteOne).toHaveBeenCalledWith({ _id: 'tid', userId: mockUser._id });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: 'task deleted' });
  });

  it('returns 404 when task not found', async () => {
    Task.deleteOne.mockResolvedValue({ deletedCount: 0 });
    const req = { params: { id: 'missing' }, user: mockUser };
    const res = mockRes();

    await deleteTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 500 on db error', async () => {
    Task.deleteOne.mockRejectedValue(new Error('fail'));
    const req = { params: { id: 'x' }, user: mockUser };
    const res = mockRes();

    await deleteTask(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
