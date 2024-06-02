const express = require('express')
const cors = require('cors')
require('dotenv').config();

const app = express()
const port = process.env.PORT

const http = require("http").Server(app)

app.use(cors())

const socketIO = require('socket.io')(http, {
    cors: {
        origin: `<http://localhost:${port}>`
    }
});

//👇🏻 Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('disconnect', () => {
      socket.disconnect()
      console.log('🔥: A user disconnected');
    });
});

const movingRoutes = require('./routes/moving')
const authRoutes = require('./routes/auth')

app.use('/moving', movingRoutes)
app.use('/auth', authRoutes)

app.get('/movingInfo', (req, res) => {
  // Your route logic here
  res.json(req.query);
});

app.get('/test', (req,res) =>{
  console.log('test')
})

app.listen(port, ()=>{
  console.log(`Server listening on port ${port}`)
})