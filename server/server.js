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
        console.log(`Toggling participant ${data.id}, isChecked: ${data.isChecked}`);
        const participant = participants.find(p => p.id === data.id);
        if (participant) {
            participant.isChecked = data.isChecked;
            console.log(`Updated isChecked for participant ${data.id}: ${participant.isChecked}`);
            io.emit('participantToggled', data);
        }
    });
    

    // Add socket event for saving group information
socket.on('saveInfo', (data) => {
    const { title, description } = data;

    groupTitle = title;
    groupDescription = description;

    console.log('Updated group information:', { groupTitle, groupDescription });
    // Optionally, you can emit an event to confirm the update
    io.emit('infoUpdated', { groupTitle, groupDescription });
});


socket.on('saveParticipants', (data) => {
    const { rows } = data;

    // Update the participants array with new data
    participants = rows.map(row => ({
        id: row.id || generateUniqueId(), // Generate a new ID only if it's missing
        name: row.name,
        email: row.email,
        isChecked: row.isChecked
    }));

    console.log('Updated participants:', participants);
    // Optionally, emit an event to confirm the update
    io.emit('participantsUpdated', participants);
});

    

    socket.emit('eventsUpdated', events); 

    socket.on('addEvent', (newEvent) => {
        events.push(newEvent);
        io.emit('eventsUpdated', events); // Update all clients
    });

    socket.on('editEvent', (updatedEvent) => {
        const index = events.findIndex(event => event.id === updatedEvent.id);
        if (index !== -1) {
            events[index] = updatedEvent;
            io.emit('eventsUpdated', events);
        }
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

