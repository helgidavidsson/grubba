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

    // Create a map of existing participants by ID for easy access
    const existingParticipantsMap = new Map(participants.map(p => [p.id, p]));

    // Update the participants array with new data, preserving comments
    participants = rows.map(row => {
        const existingParticipant = existingParticipantsMap.get(row.id);
        return {
            id: row.id,
            name: row.name,
            email: row.email,
            isChecked: row.isChecked,
            comments: existingParticipant ? existingParticipant.comments : [] // Preserve existing comments
        };
    });

    console.log('Updated participants:', participants);
    io.emit('participantsUpdated', participants);
});


socket.on('saveComment', (data) => {
    const { participantId, comment } = data;
    const participant = participants.find(p => p.id === participantId);

    if (participant) {
        // Initialize comments array if it doesn't exist
        if (!participant.comments) {
            participant.comments = [];
        }

        // Now you can safely push the comment
        participant.comments.push(comment);
        io.emit('commentsUpdated', participants); // Update all clients
    }
});

    socket.emit('eventsUpdated', events); 

    // Helper function to generate repeated event dates

    socket.on('addEvent', (newEvent) => {
        // The newEvent object already contains all the necessary information, 
        // including dates for repeated events.
    
        // Check if the event ID is provided, if not, generate a new ID.
        const eventID = newEvent.id || Date.now().toString(36) + Math.random().toString(36).substring(2);
    
        // Push the event to the events array.
        events.push({ ...newEvent, id: eventID });
    
        // Emit the updated events to all clients.
        io.emit('eventsUpdated', events);
    });

    socket.on('editEvent', (updatedEvent) => {
        const isRepeated = updatedEvent.eventRepeat && updatedEvent.eventRepeat !== 'none';
        console.log('isRepeated:', isRepeated);
    
        if (isRepeated) {
            if (updatedEvent.editScope === 'allEvents') {
                console.log('all events');
                 events = events.map(event => {
                    return event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event;
                });
            } else if (updatedEvent.editScope === 'thisAndFutureEvents') {
                console.log('this event and future');
                 // Find the index of the current event being edited
                 const currentIndex = events.findIndex(event => event.id === updatedEvent.id);
    
                 // Update this and all future events in the series
                 for (let i = currentIndex; i < events.length; i++) {
                     if (events[i].id === updatedEvent.id) {
                         events[i] = { ...events[i], ...updatedEvent };
                     }
                 }
            }
        }
        
        if (updatedEvent.editScope === 'thisEvent') {
            console.log('this event');
            const index = events.findIndex(event => event.id === updatedEvent.id);
            if (index !== -1) {
                const updatedEventData = { ...events[index], ...updatedEvent };
                updatedEventData.eventDate = events[index].eventDate;
                events[index] = updatedEventData;
            }
        }
    
        io.emit('eventsUpdated', events);
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

