"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket = io();
let username = '';
$('#start').click(function () {
    username = $('#username').val();
    console.log(username);
    $('#login').hide();
    $('#chat').show();
});
$('form').submit(function (e) {
    e.preventDefault();
    const message = {
        username: username,
        text: $('#m').val(),
        timestamp: new Date().toISOString(),
    };
    console.log(message);
    socket.emit('chat message', message);
    $('#m').val('');
    return false;
});
socket.on('chat message', function (message) {
    const time = new Date(message.timestamp).toLocaleTimeString();
    const text = `${message.username} (${time}): ${message.text}`;
    $('#messages').append($('<li>').text(text));
    window.scrollTo(0, document.body.scrollHeight);
});
