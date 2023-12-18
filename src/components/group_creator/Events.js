import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import EventAdd from "./EventAdd";
import { sortEvents } from "../../utils/sortEvents";

const ENDPOINT = "http://localhost:3001"; // Replace with your server's address

export default function Events({
    socket,
    setSocket
}) {
    const [showAddEventForm, setShowAddEventForm] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventToEdit, setEventToEdit] = useState(null);

    useEffect(() => {
        if (socket) {
            const handleEventsUpdate = (updatedEvents) => {
                setEvents(sortEvents(updatedEvents));
            };
    
            socket.on('eventsUpdated', handleEventsUpdate);
    
            return () => {
                socket.off('eventsUpdated', handleEventsUpdate);
            };
        }
    }, [socket]);

    const addOrEditEvent = (eventData) => {
        if (eventToEdit) {
            socket.emit('editEvent', eventData);
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

            <h3>Væntanlegir viðburðir</h3>
            <ul>
                {events.map(event => (
                    <li key={event.eventName}>
                        {event.eventName} - {event.eventDate} at {event.eventTime}
                        <button onClick={() => editEvent(event)}>Breyta</button>
                        <button onClick={() => deleteEvent(event.eventName)}>Eyða</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
