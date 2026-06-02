const request = require('supertest');
const app = require('../../app');
const { connect, disconnect, clear } = require('../helpers/db');

beforeAll(async () => {
  process.env.SESSION_SECRET = 'test-secret';
  await connect();
});

afterEach(async () => {
  await clear();
});

afterAll(async () => {
  await disconnect();
});

describe('POST /api/v1/users/register', () => {
  const validUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  test('registers a new user and returns 201', async () => {
    const res = await request(app).post('/api/v1/users/register').send(validUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'User created successfully');
    expect(res.body.user).toHaveProperty('email', validUser.email);
    expect(res.body.user).not.toHaveProperty('password', validUser.password);
  });

  test('returns 500 on duplicate email', async () => {
    await request(app).post('/api/v1/users/register').send(validUser);
    const res = await request(app).post('/api/v1/users/register').send(validUser);
    expect(res.status).toBe(500);
  });

  test('returns 500 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/users/register')
      .send({ email: 'no-name@example.com' });
    expect(res.status).toBe(500);
  });
});

describe('POST /api/v1/users/login', () => {
  const user = {
    name: 'Login User',
    email: 'login@example.com',
    password: 'mypassword',
  };

  beforeEach(async () => {
    await request(app).post('/api/v1/users/register').send(user);
  });

  test('logs in with valid credentials and returns 200', async () => {
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body.user).toHaveProperty('email', user.email);
  });

  test('returns 400 with wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ email: user.email, password: 'wrong' });
    expect(res.status).toBe(400);
  });

  test('returns 400 with unknown email', async () => {
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ email: 'ghost@example.com', password: 'any' });
    expect(res.status).toBe(400);
  });
});
