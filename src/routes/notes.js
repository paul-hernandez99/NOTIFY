const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
  res.render('notes/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
  const {title, url, description } = req.body;
  const newNote = {
    title,
    description,
    user_id: req.user.id
  };
  await pool.query('INSERT INTO notes set ?', [newNote]);
  req.flash('success', 'Note saved successfully');
  res.redirect('/notes');
});

router.get('/', isLoggedIn, async (req, res) => {
  const notes = await pool.query('SELECT * FROM notes WHERE user_id = ?', [req.user.id]);
  res.render('notes/list', {notes});
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM notes WHERE id = ?', [id]);
  req.flash('success', 'Note removed successfully');
  res.redirect('/notes');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const notes = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
  res.render('notes/edit', {note: notes[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const {id} = req.params;
  const {title, description} = req.body;
  const newLink = {
    title,
    description
  };
  await pool.query('UPDATE notes set ? WHERE id = ?', [newLink, id]);
  req.flash('success', 'Note updated successfully');
  res.redirect('/notes');
});

module.exports = router;
