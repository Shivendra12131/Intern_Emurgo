import type { FastifyReply, FastifyRequest } from 'fastify';
import { pool } from '../database';
import type { User } from '../models/userModel';
import { signToken } from '../services/jwtService';
import bcrypt from 'bcryptjs';

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { username, password } = request.body as User;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const result = await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
        [username, hashedPassword]
      );
  
      const alldata = await pool.query('SELECT * FROM users');
  
      return {
        createdUser: result.rows[0],
        allUsers: alldata.rows,
      };
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: 'User creation failed' });
    }
  };


export const authenticateUser = async (request: FastifyRequest, reply: FastifyReply) => {
    
    try {
        const { username, password } = request.body as User;
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      const token = signToken(user.id);
      reply.send({ token });
    } else {
      reply.code(401).send({ error: 'Invalid credentials' });
    }
  } catch (err) {
    reply.code(500).send({ error: 'Authentication failed' });
  }
};