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

  it('creates a user and returns 201', async () => {
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedpw');
    const fakeUser = { _id: 'uid1', name: 'Test', email: 'test@test.com' };
    User.create.mockResolvedValue(fakeUser);

    const req = { body: { name: 'Test', email: 'test@test.com', password: 'pw123' } };
    const res = mockRes();

    await createUser(req, res);

    expect(User.create).toHaveBeenCalledWith({
      name: 'Test',
      email: 'test@test.com',
      password: 'hashedpw',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'User created successfully' })
    );
  });

  it('returns 500 on db error', async () => {
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedpw');
    User.create.mockRejectedValue(new Error('DB failure'));

    const req = { body: { name: 'Err', email: 'err@test.com', password: 'pw' } };
    const res = mockRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Server error' })
    );
  });

  it('hashes the password before storing', async () => {
    bcrypt.genSalt.mockResolvedValue('s');
    bcrypt.hash.mockResolvedValue('hashed');
    User.create.mockResolvedValue({ _id: 'x', name: 'A', email: 'a@b.com' });

    const req = { body: { name: 'A', email: 'a@b.com', password: 'plaintext' } };
    const res = mockRes();

    await createUser(req, res);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith('plaintext', 's');
    const callArg = User.create.mock.calls[0][0];
    expect(callArg.password).toBe('hashed');
    expect(callArg.password).not.toBe('plaintext');
  });
});
