const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const participants = [
  { id: 0, isChecked: false, name: "Helgi Freyr" },
  { id: 1, isChecked: false, name: "Davíð" },
  { id: 2, isChecked: false, name: "Kristín Inga" },
  { id: 3, isChecked: false, name: "Katrín Sól" },
  // Add more participants as needed
];

io.on('connection', (socket) => {
    // Send the initial state to the newly connected client
    socket.emit('initialState', participants);

    socket.on('toggleParticipant', (data) => {
        // Update the participant's state
        const participant = participants.find(p => p.id === data.id);
        if (participant) {
            participant.isChecked = data.isChecked;
            io.emit('participantToggled', data); // Broadcast the update to all clients
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(4000, () => {
    console.log('Server is running on port 4000');
});
