const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Connect to database 
const db = new sqlite3.Database("./database/university.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Connected to university.db");
  }
});

// SELECT all courses
app.get("/api/courses", (req, res) => {
  db.all("SELECT * FROM courses", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// SELECT course by ID
app.get("/api/courses/:id", (req, res) => {
  db.get("SELECT * FROM courses WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ message: "Course not found" });
    } else {
      res.json(row);
    }
  });
});

// INSERT new course
app.post("/api/courses", (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;

  db.run(
    "INSERT INTO courses (courseCode, title, credits, description, semester) VALUES (?, ?, ?, ?, ?)",
    [courseCode, title, credits, description, semester],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

// UPDATE existing course
app.put("/api/courses/:id", (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;

  db.run(
    "UPDATE courses SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ? WHERE id = ?",
    [courseCode, title, credits, description, semester, req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ updated: this.changes });
      }
    }
  );
});

// DELETE course
app.delete("/api/courses/:id", (req, res) => {
  db.run("DELETE FROM courses WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ deleted: this.changes });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});