const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');


const app = express();
const server = http.createServer(app);


// This will parse JSON bodies
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chat-app', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected…'))
.catch(err => console.log(err))

// Routes
const User = require('./models/User');
const bcrypt = require('bcryptjs');
 
// Registration route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: 'User already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    res.json({ message: 'Registered successfully.' });
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

    res.json({ message: 'Logged in successfully.' });
});

// AI Config
const aiRoute = require('./routes/ai');

// AI route
app.use('/api/ai', aiRoute);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'An error occurred while processing your request.' });
  });
  

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
