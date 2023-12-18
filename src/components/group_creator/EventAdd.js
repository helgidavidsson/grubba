import { useState } from "react";
import styles from './Events.module.css'
export default function EventAdd({
    onSave, 
    onCancel
}) {
    const [newEventName, setNewEventName] = useState('');
    const [newEventTime, setNewEventTime] = useState('');
    const [newEventDate, setNewEventDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            eventName: newEventName,
            eventTime: newEventTime,
            eventDate: newEventDate,
        });
        setNewEventName('');
        setNewEventTime('');
        setNewEventDate('');
    };

  

    return (
        <div className={styles.addEventForm}>
            <h2>Búa til nýjan viðburð</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} placeholder="Nafn viðburðs" />
                <input type="time" value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} />
                <input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} />
                <button type="submit">Vista viðburð</button>
                <button type="button" onClick={onCancel}>Hætta við</button>
            </form>
        </div>
    );
}