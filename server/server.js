const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://657b202f0aaeae0008f7c32d--regal-douhua-84bd69.netlify.app", // URL of your frontend application
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});






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
        console.log('Client disc Socket.io + ReactJS Tutorial | Learn Socket.io For Beginners onnected');
    });
});

server.listen(80, () => {
    console.log('Server is running on port 80');
});

