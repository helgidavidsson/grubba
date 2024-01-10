const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const { scheduleEmails, scheduleAllEmails, cancelScheduledEmail } = require('./nodemailer');


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

let globalNotificationTime = '1h'; // Default value or load from a database if persisted

let adminName = "Helgi"

groupLink = "http://localhost:3000"



io.on('connection', (socket) => {
    // Send the initial state to the newly connected client
    socket.emit('initialState', { 
        participants, 
        title: groupTitle, 
        description: groupDescription, 
        events, 
         });

    socket.emit('initialNotificationTime', { timeBefore: globalNotificationTime });


    socket.on('toggleParticipant', (data) => {
        console.log(`Toggling participant ${data.id}, isCheckedAttendance: ${data.isCheckedAttendance}`);
        const participant = participants.find(p => p.id === data.id);
        if (participant) {
            participant.isCheckedAttendance = data.isCheckedAttendance;
            console.log(`Updated isCheckedAttendance for participant ${data.id}: ${participant.isCheckedAttendance}`);
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


// Assuming your participant structure now has 'isCheckedEmail' and 'isCheckedAttendance'

socket.on('toggleParticipantAttendance', (data) => {
    const participant = participants.find(p => p.id === data.id);
    if (participant) {
        participant.isCheckedAttendance = data.isCheckedAttendance;
        io.emit('participantAttendanceToggled', data);
    }
});


socket.on('saveParticipants', (data) => {
    const { rows } = data;
    const existingParticipantsMap = new Map(participants.map(p => [p.id, p]));
    console.log("data : ", data)
    participants = rows.map(row => {
        const existingParticipant = existingParticipantsMap.get(row.id);
        return {
            id: row.id,
            name: row.name,
            email: row.email,
            isCheckedEmail: row.isCheckedEmail, // Update with the new isCheckedEmail state
            isCheckedAttendance: existingParticipant ? existingParticipant.isCheckedAttendance : null, // Preserve existing isCheckedAttendance or set to null            
            comments: existingParticipant ? existingParticipant.comments : [],
        
        };
    });

    io.emit('participantsUpdated', participants);
});

socket.on('updateNotificationTime', (data) => {
    globalNotificationTime = data.timeBefore;
    
    // Optionally, you can persist this update to a database

    console.log('Updated global notification time:', globalNotificationTime);
    
    
    

    // Emit an event to update all clients with the new time
    io.emit('notificationTimeUpdated', { timeBefore: globalNotificationTime });

    scheduleAllEmails(events, participants, emailTemplate, globalNotificationTime, adminName, groupTitle, groupLink);
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
        console.log('Received New Event:', newEvent);
    
        const eventID = newEvent.id || Date.now().toString(36) + Math.random().toString(36).substring(2);
        events.push({ ...newEvent, id: eventID });
        io.emit('eventsUpdated', events);
    
        const emailParticipants = participants.filter(p => p.isCheckedEmail);
    

    scheduleEmails(emailParticipants, newEvent, emailTemplate, globalNotificationTime, adminName, groupTitle, groupLink );
});

    socket.on('editEvent', (updatedEvent) => {
        // Find the index of the event to be updated
        const index = events.findIndex(event => event.id === updatedEvent.id);
    
        // If the event is found, update it
        if (index !== -1) {
            events[index] = { ...events[index], ...updatedEvent };
        }
    
        // Emit the updated events to all clients
        io.emit('eventsUpdated', events);

        // Reschedule email for the updated event
        const task = scheduledTasks.get(updatedEvent.id);
        if (task) {
            task.stop(); // Stop the existing task
            scheduledTasks.delete(updatedEvent.id); // Remove it from the map
        }
        const emailParticipants = participants.filter(p => p.isCheckedEmail);
        const newTask =  scheduleEmails(emailParticipants, updatedEvent, emailTemplate, globalNotificationTime, adminName, groupTitle, groupLink );
        scheduledTasks.set(updatedEvent.id, newTask); // Store the new task
    
    });
    
    
    

    socket.on('deleteEvent', (data) => {
        const { eventName, eventId, scope } = data;
        if (scope === 'allEvents') {
            events = events.filter(event => event.eventName !== eventName);
        } else {
            console.log("Received event ID for deletion:", eventId);
            events = events.filter(event => event.id !== eventId); // Use eventId to identify the event
        }
        io.emit('eventsUpdated', events);
        console.log("Attempting to cancel scheduled email for event:", eventId);
        cancelScheduledEmail(eventId);
        console.log("Cancellation attempted for event:", eventId);
    });
    let emailTemplate;
    const fs = require('fs');
    const path = require('path');
    
    // Path to the template file
    const TEMPLATE_FILE_PATH = path.join(__dirname, 'emailTemplate.html');
    
    fs.readFile(TEMPLATE_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading template file at startup:', err);
            emailTemplate = "Default template content here"; // Fallback content
        } else {
            emailTemplate = data;
        }
    });
    

    app.get('/getEmailTemplate', (req, res) => {
        fs.readFile(TEMPLATE_FILE_PATH, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading template file:', err);
                return res.status(500).send('Error reading template');
            }
            res.send({ emailTemplate: data });
            console.log(emailTemplate)
        });
    });
    
    

        socket.on('saveEmailTemplate', (newTemplate) => {
            fs.writeFile(TEMPLATE_FILE_PATH, newTemplate, (err) => {
                if (err) {
                    console.error('Error writing to template file:', err);
                    // Handle error (e.g., emit an error event back to the client)
                    return;
                }
                console.log('Email template updated successfully', emailTemplate);
                // Optionally, emit a confirmation event back to the client
                socket.emit('emailTemplateUpdated');
            });
        });

    


    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});

