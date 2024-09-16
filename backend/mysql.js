// db.js

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Wrapper function to execute queries
async function executeQuery(query, values) {
  const connection = await pool.getConnection();
  try {
    const [results, fields] = await connection.query(query, values);
    return results;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

const createChat = async (userEmail, taskerEmail, message, timestamp) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [userResult] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [userEmail]
    );
    const userId = userResult[0]?.id;

    const [taskerResult] = await connection.query(
      'SELECT id FROM taskers WHERE email = ?',
      [taskerEmail]
    );
    const taskerId = taskerResult[0]?.id;

    if (!userId || !taskerId) {
      throw new Error('User or Tasker not found');
    }

    console.log('userId, taskerId', userId, taskerId);

    // Check if a conversation already exists between the user and tasker
    const [existingConversation] = await connection.query(
      'SELECT conversation_id FROM conversation_index WHERE user_id = ? AND tasker_id = ?',
      [userId, taskerId]
    );

    let conversationId;
    if (existingConversation.length > 0) {
      // Use the existing conversation ID
      conversationId = existingConversation[0].conversation_id;
      console.log('Using existing conversationId:', conversationId);
    } else {
      // Create a new conversation if it doesn't exist
      const [conversationResult] = await connection.query(
        'INSERT INTO conversation_index (user_id, tasker_id) VALUES (?, ?)',
        [userId, taskerId]
      );
      conversationId = conversationResult.insertId;
      console.log('Created new conversationId:', conversationId);
    }

    // Insert the message into the messages table
    await connection.query(
      'INSERT INTO messages (conversation_id, body, created_at) VALUES (?, ?, NOW())',
      [conversationId, message]
    );

    await connection.commit();
    console.log('Data inserted successfully');
  } catch (err) {
    await connection.rollback();
    console.log('Create Chat Err:', err);
  } finally {
    connection.release();
  }
}

module.exports = {
  executeQuery,
  createChat
};
