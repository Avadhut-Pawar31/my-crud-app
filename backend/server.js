require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ Health check (IMPORTANT)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


// ➕ CREATE
app.post('/items', (req, res) => {
  const { topic, duration, date } = req.body;

  if (!topic || !duration || !date) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const stmt = db.prepare(`
    INSERT INTO studies (topic, duration, date)
    VALUES (?, ?, ?)
  `);

  const result = stmt.run(topic, duration, date);

  res.json({
    id: result.lastInsertRowid,
    topic,
    duration,
    date
  });
});


// 👁️ READ
app.get('/items', (req, res) => {
  const rows = db.prepare(`SELECT * FROM studies`).all();
  res.json(rows);
});


// ✏️ UPDATE
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { topic, duration, date } = req.body;

  const stmt = db.prepare(`
    UPDATE studies
    SET topic = ?, duration = ?, date = ?
    WHERE id = ?
  `);

  const result = stmt.run(topic, duration, date, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ message: 'Updated successfully' });
});


// 🗑️ DELETE
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare(`DELETE FROM studies WHERE id = ?`);
  const result = stmt.run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ message: 'Deleted successfully' });
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});