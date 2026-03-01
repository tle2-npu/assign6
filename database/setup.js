// import sqlite3 
const sqlite3 = require('sqlite3').verbose();

// Connect to database file 
const db = new sqlite3.Database('./database/university.db', (err) => {
    if (err) {
        console.error('Error connecting database:', err.message);
    } else {
        console.log('Connected to university.db');
    }
});

// Create courses table 
db.run(`
    CREATE TABLE courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseCode TEXT,
        title TEXT,
        credits INTEGER,
        description TEXT,
        semester TEXT
      )
`);
console.log('Courses table created successfully');

// Close database connection 
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed');
    }
});