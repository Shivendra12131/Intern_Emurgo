
import { Pool } from 'pg';

import Fastify from 'fastify';
import bookRoutes from './routes/bookRoutes';
import userRoutes from './routes/userRoutes';
import { connectDB, pool } from './database';

const fastify = Fastify({ logger: true });



fastify.get('/', async (request, reply) => {
  try {
  
    // Get the list of all table names
    const data = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);

    const usersData = await pool.query('SELECT * FROM users');
    const booksData = await pool.query('SELECT * FROM books');
    const usersBooksData = await pool.query('SELECT * FROM users_books');

    // Send the result
    return {
      tables: data,
      users: usersData.fields,
      books: booksData.fields,
      usersBooks: usersBooksData.fields,
    };
  } catch (err) {
    console.log(err);
    reply.code(500).send({ error: 'Operation failed' });
  }
});
fastify.register(userRoutes);
fastify.register(bookRoutes);

const start = async () => {
  try {
    await connectDB();
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();