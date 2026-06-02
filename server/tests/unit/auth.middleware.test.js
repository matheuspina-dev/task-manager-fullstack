const ensureAuthenticated = require('../../middleware/auth');

describe('ensureAuthenticated', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test('calls next() when user is authenticated', () => {
    req.isAuthenticated = () => true;
    ensureAuthenticated(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('returns 401 when isAuthenticated returns false', () => {
    req.isAuthenticated = () => false;
    ensureAuthenticated(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Not authenticated' });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when isAuthenticated is not defined on req', () => {
    ensureAuthenticated(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Not authenticated' });
    expect(next).not.toHaveBeenCalled();
  });
});
