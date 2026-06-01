const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const userRouter = require('../../routes/users');
const initializePassport = require('../../config/passport');

let mongoServer;
let app;

function buildApp() {
  const testApp = express();
  testApp.use(express.json());
  testApp.use(
    session({ secret: 'test-secret', resave: false, saveUninitialized: false })
  );
  initializePassport(passport, async (email) => User.findOne({ email }));
  testApp.use(passport.initialize());
  testApp.use(passport.session());
  testApp.use('/api/v1/users', userRouter);
  return testApp;
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  app = buildApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('POST /api/v1/users/register', () => {
  it('registers a new user and returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/users/register')
      .send({ name: 'Alice', email: 'alice@test.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created successfully');
    expect(res.body.user).toMatchObject({ name: 'Alice', email: 'alice@test.com' });
  });

  it('stores a hashed password, not plaintext', async () => {
    await request(app)
      .post('/api/v1/users/register')
      .send({ name: 'Bob', email: 'bob@test.com', password: 'plaintext' });

    const user = await User.findOne({ email: 'bob@test.com' });
    expect(user).not.toBeNull();
    expect(user.password).not.toBe('plaintext');
    const match = await bcrypt.compare('plaintext', user.password);
    expect(match).toBe(true);
  });

  it('returns 500 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/users/register')
      .send({ email: 'noname@test.com' });

    expect(res.status).toBe(500);
  });
});

describe('POST /api/v1/users/login', () => {
  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('password123', salt);
    await User.create({ name: 'Carol', email: 'carol@test.com', password: hashed });
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ email: 'carol@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
  });

  it('returns 400 with wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ email: 'carol@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(400);
  });

  it('returns 400 with unknown email', async () => {
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ email: 'ghost@test.com', password: 'whatever' });

    expect(res.status).toBe(400);
  });
});
