import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import EventAdd from "./EventAdd";
import { sortEvents } from "../../utils/sortEvents";

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

    const deleteEvent = (eventNameToDelete) => {
        const isConfirmed = window.confirm(`Ertu viss um að þú viljir eyða viðburði: ${eventNameToDelete}?`);
        if (isConfirmed) {
            socket.emit('deleteEvent', eventNameToDelete);
        }
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

        
        <ul>
            {events.map(event => (
                <li key={event.id}> {/* Use event.id as key */}
                    {event.eventName} - {event.eventDate} at {event.eventTime} {event.eventLocation}
                    <button onClick={() => editEvent(event)}>Breyta</button>
                    <button onClick={() => deleteEvent(event.eventName)}>Eyða</button>
                </li>
            ))}
        </ul>
    </div>
);

}
