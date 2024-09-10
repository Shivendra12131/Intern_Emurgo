import Fastify from 'fastify';
import { createUser, authenticateUser } from '../src/controllers/userController';
import bcrypt from 'bcryptjs';
import { pool } from '../src/database';

const fastify = Fastify();

fastify.post('/users', createUser);
fastify.post('/users/authenticate', authenticateUser);

describe('User Controller Tests', () => {
  beforeAll(async () => {
    await pool.query('CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE, password VARCHAR(255))');
  });

  afterAll(async () => {
    await pool.query('DROP TABLE users');
    await pool.end();
  });

  test('Create User', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'testuser',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('id');
  });

  test('Authenticate User', async () => {
    // Create a user first
    const hashedPassword = await bcrypt.hash('password123', 10);
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', ['testuser', hashedPassword]);

    const response = await fastify.inject({
      method: 'POST',
      url: '/users/authenticate',
      payload: {
        username: 'testuser',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('token');
  });
});