"use strict";
// server.ts
// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
//import path from 'path';
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('join room', (room, username) => {
        socket.join(room);
        socket.to(room).emit('chat message', `${username} has joined the room`);
    });
    socket.on('chat message', (room, msg) => {
        socket.to(room).emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
server.listen(3000, () => {
    console.log('Listening on *:3000');
});
