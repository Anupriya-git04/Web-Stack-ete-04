const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Import cors
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Enable CORS
app.use(cors());

const courses = [
  { courseId: "C101", title: "Web Development", instructor: "Mrs Sinha", duration: "10 hours", rating: 4.5 },
  { courseId: "C102", title: "Mathematics", instructor: "Nishant Sinha", duration: "12 hours", rating: 4.7 },
  { courseId: "C103", title: "Database Techniques", instructor: "Ankita Agarwal", duration: "15 hours", rating: 4.6 },
  { courseId: "C104", title: "Python Programming", instructor: "Priya Singh", duration: "07 hours", rating: 4.4 },
  { courseId: "C105", title: "Machine Learning", instructor: "Amrita Rao", duration: "18 hours", rating: 4.9 },
  { courseId: "C106", title: "Artificial Intelligence", instructor: "Prakash Gupta", duration: "15 hours", rating: 4.1 },
  { courseId: "C107", title: "Computer Design", instructor: "Gurpreet Singh", duration: "11 hours", rating: 4.2 },
  { courseId: "C108", title: "Introduction to C", instructor: "Nisha Suri", duration: "08 hours", rating: 4.8 },
  { courseId: "C109", title: "Statistics and Probability", instructor: "Ahaan Imam", duration: "10 hours", rating: 4.3 }
];

const users= [];

app.post('/signup', async(req, res) => {
  const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ name, email, password: hashedPassword });
    
    res.status(201).json({ message: 'User registered successfully.' });
});

// Endpoint to get courses with pagination and sorting
app.get('/courses', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sortBy = req.query.sortBy || 'title'; // Sort by title or rating
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Default is ascending

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Sort courses based on the sortBy and sortOrder
  const sortedCourses = [...courses].sort((a, b) => {
      if (sortBy === 'rating') {
          return (a.rating - b.rating) * sortOrder;
      } else {
          return (a.title.localeCompare(b.title)) * sortOrder;
      }
  });

  const paginatedCourses = sortedCourses.slice(startIndex, endIndex);

  res.json({
      courses: paginatedCourses,
      hasMore: endIndex < courses.length
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
