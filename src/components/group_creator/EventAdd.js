import { useState, useEffect } from "react";
import styles from './Events.module.css'
export default function EventAdd({
    onSave, 
    onCancel,
    eventToEdit
}) {
    const [newEventName, setNewEventName] = useState('');
    const [newEventTime, setNewEventTime] = useState('');
    const [newEventDate, setNewEventDate] = useState('');

    useEffect(() => {
        if (eventToEdit) {
            setNewEventName(eventToEdit.eventName);
            setNewEventTime(eventToEdit.eventTime);
            setNewEventDate(eventToEdit.eventDate);
        }
    }, [eventToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Combine the date and time strings and convert them to a Date object
        const eventDateTime = new Date(`${newEventDate}T${newEventTime}`);
    
        // Get the current date and time
        const now = new Date();
    
        // Check if the event date and time are in the past
        if (eventDateTime < now) {
            alert('Þú getur ekki búið til viðburði í fortíðinni.');
            return;
        }
    

        onSave({
            eventName: newEventName,
            eventTime: newEventTime,
            eventDate: newEventDate,
            // Include an identifier if editing
            id: eventToEdit ? eventToEdit.id : null
        });

        // Reset form fields
        setNewEventName('');
        setNewEventTime('');
        setNewEventDate('');
    };



  

    return (
        <div className={styles.addEventForm}>
            <h2>{eventToEdit ? "Breyta viðburði" : "Búa til nýjan viðburð"}</h2>            <form onSubmit={handleSubmit}>
                <input type="text" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} placeholder="Nafn viðburðs" />
                <input type="time" value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} />
                <input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} />
                <button type="submit">Vista viðburð</button>
                <button type="button" onClick={onCancel}>Hætta við</button>
            </form>
        </div>
    );
}