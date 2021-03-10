const express = require('express');
const router = express.Router();
const pool = require('../../database');
const {api_auth} = require('../../lib/auth');

router.get('/users', api_auth, async (req, res) => {
  const users = await pool.query('SELECT * FROM users');
  res.json(users);
});

router.get('/users/:id', api_auth, async (req, res) => {
  const {id} = req.params;
  const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  res.json(users);
});

router.get('/users/:id/notes', api_auth, async (req, res) => {
  const {id} = req.params;
  const notes = await pool.query('SELECT * FROM notes WHERE user_id = ?', [id]);
  res.json(notes);
});

router.get('/notes', api_auth, async (req, res) => {
    const notes = await pool.query('SELECT * FROM notes');
  res.json(notes);
});

router.get('/notes/:id', api_auth, async (req, res) => {
  const { id } = req.params;
  const notes = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
  res.json(notes[0]);
});

router.post('/notes/add', api_auth, async (req, res) => {
  const {title, description, user_id} = req.body;
  const newNote = {
    title,
    description,
    user_id
  };
  await pool.query('INSERT INTO notes set ?', [newNote]);
  res.json({newNote, Status: 'Note saved successfully'});
});

router.put('/notes/edit/:id', api_auth, async (req, res) => {
  const {id} = req.params;
  const {title, description, user_id} = req.body;
  console.log('yeah');
  const newNote = {
    title,
    description,
    user_id
  };
  await pool.query('UPDATE notes set ? WHERE id = ?', [newNote, id]);
  res.json({newNote, Status: 'Note edited successfully'});
});

router.delete('/notes/delete/:id', api_auth, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM notes WHERE id = ?', [id]);
  res.json({Status: 'Note removed successfully'});
});

module.exports = router;
