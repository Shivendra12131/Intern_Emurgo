import Fastify from 'fastify';
import { createBook, attachBookToUser } from '../src/controllers/bookController';
import { pool } from '../src/database';

const fastify = Fastify();

fastify.post('/books', createBook);
fastify.post('/users/:userId/books/:bookId', attachBookToUser);

describe('Book Controller Tests', () => {
  beforeAll(async () => {
    await pool.query('CREATE TABLE books (id SERIAL PRIMARY KEY, title VARCHAR(255), author VARCHAR(255), isbn VARCHAR(13) UNIQUE, published_date DATE)');
    await pool.query('CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE, password VARCHAR(255))');
    await pool.query('CREATE TABLE users_books (user_id INT REFERENCES users(id), book_id INT REFERENCES books(id), PRIMARY KEY (user_id, book_id))');
  });

  afterAll(async () => {
    await pool.query('DROP TABLE users_books');
    await pool.query('DROP TABLE users');
    await pool.query('DROP TABLE books');
    await pool.end();
  });

  test('Create Book', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/books',
      payload: {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890123',
        published_date: '2024-01-01',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('id');
  });

  test('Attach Book to User', async () => {
    // Assume a user and book exist for this test
    const userId = 1;
    const bookId = 1;
    
    const response = await fastify.inject({
      method: 'POST',
      url: `/users/${userId}/books/${bookId}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('user_id', userId);
    expect(response.json()).toHaveProperty('book_id', bookId);
  });
});