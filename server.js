const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('sendMessage', async (data) => {
    try {
      const { content, receiverId } = data;
      const message = await Message.create({
        content,
        senderId: socket.user.id,
        receiverId
      });
      io.to(receiverId).emit('newMessage', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
  sequelize.authenticate().then(() => {
    console.log('Database connected');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });
});
