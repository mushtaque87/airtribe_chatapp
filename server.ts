// server.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { generateId } from './utils';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket: any) => {
  console.log('New client connected');

  socket.on('start', (data: any) => {
    console.log('start message', data?.username);
    socket.emit('chat message', 'Welcome to the chat!');
  });

  socket.on('join room', (room: string, username: string) => {
    console.log('join room message', room, username);
    socket.join(room);
    socket.to(room).emit('chat message', `${username} has joined the room`);
  });

  socket.on('chat message', (room: string, msg: string) => {
    console.log('chat message', room, msg);
    //socket.to(room).emit('chat message', msg);
    io.emit('chat message', { id: generateId(), room, msg });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on *:3000');
});
