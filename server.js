const express= require('express');
const mongoose= require('mongoose');
const cors = require('cors');
const bodyParser= require ('body-parser');
require('dotenv').config();

const app= express();
app.cors(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define User and Exercise Schemas
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }
});

const exerciseSchema = new mongoose.Schema({
    username: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);

// Create a new user
app.post('/api/users', async (req, res) => {
    const { username } = req.body;
    const newUser = new User({ username });
    
    try {
        await newUser.save();
        res.json({ username, _id: newUser._id });
    } catch (error) {
        res.status(400).json({ error: 'Username already exists' });
    }
});




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});