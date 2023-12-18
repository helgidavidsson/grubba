import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import EventAdd from "./EventAdd";

const ENDPOINT = "http://localhost:3001"; // Replace with your server's address

export default function Events({
    socket,
    setSocket
}) {
    const [showAddEventForm, setShowAddEventForm] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (socket) {
            const handleEventsUpdate = (updatedEvents) => {
                setEvents(updatedEvents);
            };
    
            socket.on('eventsUpdated', handleEventsUpdate);
    
            return () => {
                socket.off('eventsUpdated', handleEventsUpdate);
            };
        }
    }, [socket]);

    const addEvent = (eventData) => {
        socket.emit('addEvent', eventData);
    };

    const deleteEvent = (eventNameToDelete) => {
        socket.emit('deleteEvent', eventNameToDelete);
    };

    return (
        <div>
            <h2>Viðburðir</h2>
            <button onClick={() => setShowAddEventForm(!showAddEventForm)}>
                Búa til viðburð
            </button>

            {showAddEventForm && (
                <EventAdd 
                    onSave={addEvent} 
                    onCancel={() => setShowAddEventForm(false)} 
                />
            )}

            <h3>Væntanlegir viðburðir</h3>
            <ul>
                {events.map(event => (
                    <li key={event.eventName}>
                        {event.eventName} - {event.eventDate} at {event.eventTime}
                        <button onClick={() => deleteEvent(event.eventName)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
