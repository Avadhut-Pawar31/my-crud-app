const Database = require('better-sqlite3');

// create database file
const db = new Database('study.db');

// create table
db.prepare(`
  CREATE TABLE IF NOT EXISTS studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT,
    duration INTEGER,
    date TEXT
  )
`).run();

module.exports = db;