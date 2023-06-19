const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const openai = require('openai');
openai.apiKey = process.env.OPENAI_API_KEY;

// This will parse JSON bodies
app.use(express.json());

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

const Message = require('./models/Message');

// Socket connection
io.on('connection', socket => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Message handling
    socket.on('message', async ({ sender, recipient, content }) => {
        try {
            // Analyze the sentiment of the content
            const analysis = await openai.Completion.create({
                engine: 'text-davinci-002',
                prompt: `Is the following message positive, negative, or neutral? "${content}"`,
                max_tokens: 3,
            });

            const sentiment = analysis.choices[0].text.trim();

            // Create a new message with the sentiment
            const message = new Message({
                sender,
                recipient,
                content,
                sentiment,
            });

            // Save the message to the database
            await message.save();

            // Send the message to the recipient
            io.to(recipient).emit('message', message);
        } catch (err) {
            console.error(err);
        }
    });
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
