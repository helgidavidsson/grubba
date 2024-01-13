import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import EventAdd from "./EventAdd";
import { sortEvents } from "../../utils/sortEvents";
import DeleteConfirmationDialog from "./DeleteConfirmation";

const ENDPOINT = "http://localhost:3001"; // Replace with your server's address

export default function Events() {
    const [showAddEventForm, setShowAddEventForm] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [ socket, setSocket ] = useState(null)

    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);

        newSocket.on('eventsUpdated', (updatedEvents) => {
            setEvents(sortEvents(updatedEvents));
        });

        return () => newSocket.disconnect();
    }, []);


    const addOrEditEvent = (eventData) => {
        // Assign a unique ID to the new event if it's being added
        if (!eventToEdit) {
            eventData.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
        }

        if (eventToEdit) {
            socket.emit('editEvent', { ...eventData, id: eventToEdit.id });
        } else {
            socket.emit('addEvent', eventData);
        }

        setShowAddEventForm(false);
        setEventToEdit(null);
    };

    const editEvent = (event) => {
        setEventToEdit(event);
        setShowAddEventForm(true);
    };

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

    const showDeleteConfirmation = (event) => {
        setEventToDelete(event);
        setShowDeleteDialog(true);
};

const deleteEvent = (event) => {
    // Check if the event is repeated
    if (event.eventRepeat && event.eventRepeat !== 'none') {
        showDeleteConfirmation(event);
    } else {
        // Use the traditional confirmation for non-repeated events
        const isConfirmed = window.confirm(`Ertu viss um að þú viljir eyða viðburði: "${event.eventName}"?`);
        if (isConfirmed) {
            socket.emit('deleteEvent', { eventId: event.id, scope: 'thisEvent' });
        }
    }
};


const handleDeleteConfirmation = (eventToDelete, deletionScope) => {
    socket.emit('deleteEvent', {
        eventName: eventToDelete.eventName,
        eventId: eventToDelete.id,
        scope: deletionScope
    });
};


    // ...
return (
    <div>
        <h2>Viðburðir</h2>
        <button onClick={() => {
            setShowAddEventForm(!showAddEventForm);
            setEventToEdit(null);
        }}>
            Búa til viðburð
        </button>

        {showAddEventForm && (
            <EventAdd 
                eventToEdit={eventToEdit}
                onSave={addOrEditEvent} 
                onCancel={() => {
                    setShowAddEventForm(false);
                    setEventToEdit(null);
                }} 
            />
        )}

     

        {showDeleteDialog && (
            <DeleteConfirmationDialog
                eventToDelete={eventToDelete}
                onDeleteConfirmed={handleDeleteConfirmation}
                onCancel={() => {
                    setShowDeleteDialog(false)
                    setEventToDelete(null)
                }}
                setShowDeleteDialog={setShowDeleteDialog}
            />
        )}

        
        <ul>
            {events.map(event => (
                <li key={event.id}> {/* Use event.id as key */}
                    {event.eventName} - {event.eventDate} at {event.eventTime} {event.eventLocation}
                    <button onClick={() => editEvent(event)}>Breyta</button>
                    <button onClick={() => deleteEvent(event)}>Eyða</button>

                </li>
            ))}
        </ul>
    </div>
);

}
