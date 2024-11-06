const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
require('./models/db')
const bodyParser = require('body-parser');
const AuthRouter = require('./Routes/AuthRouter');
const StudentRouter = require('./Routes/StudentRouter');
const CourseRouter = require('./Routes/CourseRouter');
const TeacherRouter = require('./Routes/TeacherRouter');
// const User = require('./models/User.tsx');

const app = express();
const PORT = process.env.PORT || 5007;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/auth',AuthRouter);
app.use('/student',StudentRouter);
app.use('/course',CourseRouter);
app.use('/teacher',TeacherRouter);


// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

  // Signup route
  // app.post('/api/signup', async (req, res) => {
  //   const { firstName, lastName, email, password } = req.body;
  
  //   try {
  //     const newUser = new User({ firstName, lastName, email, password });
  //     await newUser.save();
  //     res.status(201).json({ message: 'User created successfully!' });
  //   } catch (error) {
  //     res.status(400).json({ error: 'Error creating user', details: error });
  //   }
  // });
  
// Example Route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
