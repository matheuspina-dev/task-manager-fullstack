jest.mock('../../models/User');
jest.mock('bcrypt');

const bcrypt = require('bcrypt');
const User = require('../../models/User');
const { createUser } = require('../../controllers/userController');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('createUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates a user and returns 201', async () => {
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashed-password');

    const createdUser = {
      _id: 'abc123',
      name: 'Alice',
      email: 'alice@example.com',
      password: 'hashed-password',
    };
    User.create.mockResolvedValue(createdUser);

    const req = {
      body: { name: 'Alice', email: 'alice@example.com', password: 'secret' },
    };
    const res = mockRes();

    await createUser(req, res);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith('secret', 'salt');
    expect(User.create).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'hashed-password',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: createdUser,
    });
  });

  test('returns 500 on database error', async () => {
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashed-password');
    User.create.mockRejectedValue(new Error('duplicate key'));

    const req = {
      body: { name: 'Bob', email: 'bob@example.com', password: 'pass' },
    };
    const res = mockRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error',
      error: 'duplicate key',
    });
  });
});
