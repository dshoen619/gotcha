const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; // Ensure the port is defined, fallback to 3000 if not

const http = require('http').createServer(app);

app.use(cors());
app.use(express.json());

// Import routes
const movingRoutes = require('./routes/moving');
const { router: authRoutes, getDataByToken }  = require('./routes/auth');
const chatRoutes = require('./routes/chat').router;

// Use routes
app.use('/moving', movingRoutes);
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

app.get('/movingInfo', (req, res) => {
    res.json(req.query);
});

app.get('/test', (req, res) => {
    res.send('test');
});

// Import and use the chatSocket function
const chatSocket = require('./routes/chat').chatSocket;
chatSocket(http);

http.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
