const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000; // Choose your port

app.use(bodyParser.json());

// Endpoint to get student data
app.get('/students', (req, res) => {
  fs.readFile(path.join(__dirname, 'studentdata.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint to add a new student
app.post('/students', (req, res) => {
  const newStudent = req.body;

  // Read existing data
  fs.readFile(path.join(__dirname, 'studentdata.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }

    const students = JSON.parse(data);
    newStudent.id = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;

    // Save new student
    students.push(newStudent);

    fs.writeFile(path.join(__dirname, 'studentdata.json'), JSON.stringify(students, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save data' });
      }
      res.status(201).json(newStudent);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
