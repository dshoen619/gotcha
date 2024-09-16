const { Server } = require('socket.io');
const { router: authRoutes, getEmailByToken, getuserDatabyToken, getTaskerIdbyEmail } = require('./auth'); // Destructure to get the router and function
const {executeQuery, createChat} = require('../mysql')
require('dotenv').config()
const mysql = require('../mysql')
const express = require('express')
const router = express.Router()


// parse tables
usersTable =    process.env.USERS_TABLE
taskersTable =  process.env.TASKERS_TABLE

// This will store messages for each room by room id
const chatRooms = {}; 

router.get('/rooms', async(req,res)=>{
    console.log('rooms entered')
    res.send({'status':true})
  
  })

const findConversation = async(userId, taskerData) =>{

    // const userId = await userData.map(item => item.id)[0]
    const taskerId = await taskerData.map(item => item.id)[0]

    selectQuery = `SELECT m.* 
                    FROM messages m
                    JOIN conversation_index ci ON m.conversation_id = ci.conversation_id
                    WHERE ci.user_id = ? AND ci.tasker_id = ?;`
    const messages = await executeQuery(selectQuery,[userId, taskerId])

    return {messages}
}

const chatSocket = (http) => {
    const io = new Server(http, {
        cors: {
            origin: "*", // Adjust the origin as needed
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected');

        // Handle the "findRoom" event
        socket.on('findRoom', async({taskerEmail, userToken}) => {
            try {
                const userData =                  await getuserDatabyToken(userToken);
                const userId =      userData.id
                const userEmail =   userData.email

                
                const taskerId =                  await getTaskerIdbyEmail(taskerEmail)
                const {messages} =                await findConversation(userId, taskerId)

                console.log('messages', messages)
                console.log('userEmail2',userEmail)


                socket.emit('roomMessages', {messages:messages, userEmail:userEmail}); // Send an empty array if the room does not exist
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
            
        });
        socket.on('newMessage', async({message,timestamp,userEmail,taskerEmail, userToken}) =>{
            console.log(message,timestamp,userEmail,taskerEmail, userToken)
            await mysql.createChat(userEmail,taskerEmail, message, timestamp)

            const userData =                  await getuserDatabyToken(userToken);
            const userId =      userData.id

            const taskerId =                  await getTaskerIdbyEmail(taskerEmail)
            const {messages} =                await findConversation(userId, taskerId)


            socket.emit('roomMessages', {messages:messages, userEmail:userEmail})
        })

        // Handle other events like message sending
        socket.on('sendMessage', ({ roomId, message }) => {
            if (!chatRooms[roomId]) {
                chatRooms[roomId] = [];
            }
            chatRooms[roomId].push(message);
            io.to(roomId).emit('newMessage', message);
        });

        // Join a room
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
        });

        // When a client disconnects
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    return io;
};

module.exports = {chatSocket, router};
