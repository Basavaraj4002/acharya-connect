 // server.js (backend)
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chat server running...');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinTask', (taskId) => {
    socket.join(taskId);
    console.log(`User joined task: ${taskId}`);
    // Send some dummy messages
    socket.emit('previousMessages', [
      { sender: 'faculty', message: 'Welcome to the task chat!', timestamp: new Date() }
    ]);
  });

  socket.on('sendMessage', ({ taskId, sender, message }) => {
    const msgData = { sender, message, timestamp: new Date() };
    io.to(taskId).emit('newMessage', msgData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
