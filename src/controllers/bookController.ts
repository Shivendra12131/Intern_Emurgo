import type { FastifyReply, FastifyRequest } from 'fastify';
import { pool } from '../database';
import type { Book } from '../models/bookModel';

export const createBook = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { title, author, isbn, published_date } = request.body as Book;
    const result = await pool.query(
      'INSERT INTO books (title, author, isbn, published_date) VALUES ($1, $2, $3, $4) RETURNING id, title, author, isbn, published_date',
      [title, author, isbn, published_date]
    );
    reply.send(result.rows[0]);
  } catch (err) {
    console.log(err);
    reply.code(500).send({ error: 'Book creation failed' });
  }
};

export const attachBookToUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { userId, bookId } = request.params as { userId: string, bookId: string };
    const existingAttachment = await pool.query(
      'SELECT * FROM users_books WHERE user_id = $1 AND book_id = $2',
      [userId, bookId]
    );
    if (existingAttachment?.rowCount && existingAttachment.rowCount > 0) {
      return reply.code(400).send({ error: 'Book is already attached to the user' });
    }
    const result = await pool.query(
      'INSERT INTO users_books (user_id, book_id) VALUES ($1, $2) RETURNING user_id, book_id',
      [userId, bookId]
    );

    reply.send(result.rows[0]);
  } catch (err) {
    reply.code(500).send({ error: 'Attaching book failed' });
  }
};