const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./src/models/db');
const bodyParser = require('body-parser');
const AuthRouter = require('./src/Routes/AuthRouter');
const StudentRouter = require('./src/Routes/StudentRouter');
const CourseRouter = require('./src/Routes/CourseRouter');
const TeacherRouter = require('./src/Routes/TeacherRouter');

const app = express();
const PORT = process.env.PORT || 5007;


app.use(cors({
  origin: '*', 
  credentials: true, 
}));


app.use((req, res, next) => {
  res.header("Content-Type", "application/json; charset=utf-8"); 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true"); 
  res.header("Vary", "Origin"); 
  res.header("X-Powered-By", "Express"); 
  next();
});

app.options('*', cors());
app.use(express.json());
app.use(bodyParser.json());

// Define routes
app.use('/auth', AuthRouter);
app.use('/student', StudentRouter);
app.use('/course', CourseRouter);
app.use('/teacher', TeacherRouter);

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
