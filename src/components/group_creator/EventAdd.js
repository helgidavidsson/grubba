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
    const [ newEventLocation, setNewEventLocation ] = useState('');
    const [ newEventRepeat, setNewEventRepeat ] = useState('none'); // 'daily', 'weekly', 'monthly', 'yearly', 'none'
    const [ newRepeatEndDate, setNewRepeatEndDate] = useState('');
    const [ editScope, setEditScope ] = useState('This event')

    useEffect(() => {
        if (eventToEdit) {
            setNewEventName(eventToEdit.eventName);
            setNewEventTime(eventToEdit.eventTime);
            setNewEventDate(eventToEdit.eventDate);
            setNewEventLocation(eventToEdit.eventLocation)
            setNewEventRepeat(eventToEdit.eventRepeat || 'none');
            setNewRepeatEndDate(eventToEdit.eventRepeatEndDate)
        }
    }, [eventToEdit]);


    const createRepeatedEvents = (startDate, repeatType) => {
        let dates = [];
        let currentDate = new Date(startDate);
        let endDate = newRepeatEndDate ? new Date(newRepeatEndDate) : null;

        while (endDate ? currentDate <= endDate : dates.length < 30) { // Limit to 30 occurrences
            dates.push(new Date(currentDate));

            switch (repeatType) {
                case 'daily':
                    currentDate.setDate(currentDate.getDate() + 1);
                    break;
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + 7);
                    break;
                case 'monthly':
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    break;
                case 'yearly':
                    currentDate.setFullYear(currentDate.getFullYear() + 1);
                    break;
                default:
                    break;
            }
        }
        return dates;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
    
        const eventDateTime = new Date(`${newEventDate}T${newEventTime}`);
        const now = new Date();
        if (eventDateTime < now) {
            alert('Þú getur ekki búið til viðburði í fortíðinni.');
            return;
        }
    
    
        if (newEventRepeat !== 'none') {
            const repeatedDates = createRepeatedEvents(new Date(newEventDate + 'T' + newEventTime), newEventRepeat);
            repeatedDates.forEach(date => {
                onSave({
                    eventName: newEventName,
                    eventTime: newEventTime,
                    eventDate: date.toISOString().split('T')[0],
                    eventLocation: newEventLocation,
                    eventRepeat: newEventRepeat,
                    eventRepeatEndDate: newRepeatEndDate,
                    id: eventToEdit ? eventToEdit.id : null,
                    editScope: editScope
                });
            });
        } else {
            onSave({
                eventName: newEventName,
                eventTime: newEventTime,
                eventDate: newEventDate,
                eventLocation: newEventLocation,
                repeatOption: newEventRepeat,
                eventRepeatEndDate: newRepeatEndDate,
                id: eventToEdit ? eventToEdit.id : null,
                editScope: editScope
            });
        }
    
    
        setNewEventName('');
        setNewEventTime('');
        setNewEventDate('');
        setNewEventLocation('');
    };
    
    


  

    return (
        <div className={styles.addEventForm}>
            <h2>{eventToEdit ? "Breyta viðburði" : "Búa til nýjan viðburð"}</h2>            
            <form onSubmit={handleSubmit}>
           

                <input type="text" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} placeholder="Nafn viðburðs" />
                <input type="time" value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} />
                <input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} />
                <input type="text" value={newEventLocation} onChange={(e) => setNewEventLocation(e.target.value)} placeholder="Staðsetning" />
                <div>
                <label htmlFor="eventRepeat">Endurtaka:</label>
                <select id="eventRepeat" value={newEventRepeat} onChange={(e) => setNewEventRepeat(e.target.value)}>
                    <option value="none">Engin</option>
                    <option value="daily">Daglega</option>
                    <option value="weekly">Vikulega</option>
                    <option value="monthly">Mánaðarlega</option>
                    <option value="yearly">Árlega</option>
                </select>
            </div>
        
        {newEventRepeat !== 'none' && (
            <div>
                <label htmlFor="repeatEndDate">Endurtekning lýkur:</label>
                <input type="date" id="repeatEndDate" value={newRepeatEndDate} onChange={(e) => setNewRepeatEndDate(e.target.value)} />
            </div>
        )}
         {eventToEdit && eventToEdit.eventRepeat !== 'none' && (
                    <div>
                        <label htmlFor="editScope">Breyta umfangi:</label>
                        <select id="editScope" value={editScope} onChange={(e) => setEditScope(e.target.value)}>
                            <option value="thisEvent">Aðeins þessi viðburður</option>
                            <option value="thisAndFutureEvents">Þessi og framtíðarviðburðir</option>
                            <option value="allEvents">Allir viðburðir í seríunni</option>
                        </select>
                    </div>
                )}
                <button type="submit">Vista viðburð</button>
                <button type="button" onClick={onCancel}>Hætta við</button>
            </form>
        </div>
    );
}