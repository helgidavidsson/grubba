const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // URL of your frontend application
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

let participants = [];

let groupTitle = "Nafn hópar";

let groupDescription = "";

let events = [];


io.on('connection', (socket) => {
    // Send the initial state to the newly connected client
    socket.emit('initialState', { participants, title: groupTitle, description: groupDescription, events });
    socket.on('toggleParticipant', (data) => {
        // Update the participant's state
        const participant = participants.find(p => p.id === data.id);
        if (participant) {
            participant.isChecked = data.isChecked;
            io.emit('participantToggled', data); // Broadcast the update to all clients
        }  
    });


// Handle saveParticipants event
socket.on('saveParticipants', (data) => {
    console.log("Received data:", data); // Log the entire data object

    const { rows, title, description, events } = data;
    if (!rows) {
        console.log("Error: 'rows' is undefined");
        return; // Early return if rows is undefined
    }
    // Update the participants array with new data
    participants = rows.map((row, index) => ({
        id: index,
        isChecked: null,
        name: row.name,
        email: row.email
    }));

   

    console.log('Broadcasting new participants:', participants);

    // Broadcast the updated participants to all clients
    io.emit('initialState', { 
        participants, 
        title: groupTitle, 
        description: groupDescription,
        events
    });
});

    socket.emit('eventsUpdated', events); 
    
    socket.on('addEvent', (newEvent) => {
        events.push(newEvent);
        io.emit('eventsUpdated', events); // Update all clients
    });

    socket.on('deleteEvent', (eventNameToDelete) => {
        events = events.filter(event => event.eventName !== eventNameToDelete);
        io.emit('eventsUpdated', events); // Update all clients
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});

