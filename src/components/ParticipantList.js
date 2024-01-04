import { useState, useEffect } from "react";
import ParticipantsRadio from "./ParticipantsRadio";
import socketIOClient from 'socket.io-client';
import styles from './ParticipantsList.module.css'
import sortParticipants from '../utils/sortParticipants'; 
import { sortEvents } from "../utils/sortEvents";

export default function ParticipantList({
    ENDPOINT,
}) {
    const [participants, setParticipants] = useState([]);
    const [groupTitle, setGroupTitle] = useState(''); 
    const [ groupDescription, setGroupDescription ] = useState('');
    const [ events, setEvents ] = useState([]);
 

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);
    
        newSocket.on('initialState', (data) => {
            // Destructure to get participants and title
            const { participants, title, description, events } = data;

            // Update participants and group title based on server data
            setParticipants(sortParticipants(participants)); 
            setGroupTitle(title);
            setGroupDescription(description);
            setEvents(sortEvents(events))
        });


        newSocket.on('groupTitle', (title) => {
            setGroupTitle(title)
        })

        newSocket.on('groupDescription', (description) => {
            setGroupDescription(description)
        })
    
    
        newSocket.on('participantToggled', (data) => {
            setParticipants(prevParticipants => {
                const updated = prevParticipants.map(p =>
                    p.id === data.id ? { ...p, isChecked: data.isChecked } : p
                );
                return sortParticipants(updated); // Sort participants after updating
            });
        });



      

        return () => newSocket.disconnect();
    }, [ENDPOINT]);

    const handleToggle = (id, newIsChecked) => {
        const updatedParticipants = participants.map(p => {
            if (p.id === id) {
                return { ...p, isChecked: newIsChecked };
            }
            return p;
        });
        setParticipants(updatedParticipants);
    
        // Emit the event to the server with the updated state
        socket.emit('toggleParticipant', { id, isChecked: newIsChecked });
    };
    

    const getNextEvent = () => {
        return events.find(event => new Date(event.eventDate + event.eventTime))
    }

    const nextEvent = getNextEvent()
    const upcomingEvents = events.filter(event => event !== nextEvent);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('is-IS', options).format(new Date(dateString));
    };

    const calculateTimeLeft = (eventDate) => {
        const now = new Date();
        const eventDateTime = new Date(eventDate);
        const difference = eventDateTime - now;
    
        const minutes = Math.floor(difference / (1000 * 60));
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const years = Math.floor(days / 365);
    
        if (years > 1) {
            return `${years} ár`;
        } else if (days > 1) {
            return `${days} daga`;
        } else if (hours > 1) {
            return `${hours} klukkutíma`;
        } else if (minutes > 1) {
            return `${minutes} mínútur`;
        } else {
            return 'Byrjar fljótlega';
        }
    };
    
    

    return (
        <div>
            <h2>{groupTitle}</h2>

            <p>{groupDescription}</p>
            
           
        
                {nextEvent ? (
                    <>

                    <div className={styles.eventCard}>
                    <p className={styles.timeLeft}>Næsti viðburður hefst eftir <b>{calculateTimeLeft(nextEvent.eventDate)}</b>...</p>

                        <h4 
                            className={styles.nextEventName}>
                                {nextEvent.eventName}
                        </h4>
                       
                        <p 
                            className={styles.nextEventDate}>
                               Dagsetning: <b>{formatDate(nextEvent.eventDate)}</b>
                        </p>
                        
                        <p 
                            className={styles.nextEventTime}>
                                Tími: <b>{nextEvent.eventTime}</b>
                        </p>

                        <p className={styles.nextEventLocation}>
                                Staðsetning: <b>{nextEvent.eventLocation}</b>
                        </p>

                        <h3 className={styles.h3}>Mætingarlisti</h3>
                          
                            {participants.map((participant) => (
                        
                        <ParticipantsRadio
                            ENDPOINT={ENDPOINT}
                            key={participant.id}
                            name={participant.name}
                            participantId={participant.id}
                            isChecked={participant.isChecked}
                            onToggle={handleToggle}
                        />
                    ))}

                        </div>

                          
               
                    </>
                   
                ) : (
                    <p>Engir væntanlegir viðburðir.</p>
                )}
              


            <h3>Væntanlegir viðburðir</h3>
                    {upcomingEvents.length > 0 ? (
                        <ul>
                            {upcomingEvents.map(event => (
                                <li key={event.eventName}>
                                    {event.eventName} - {event.eventDate} at {event.eventTime} {event.eventLocation}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Engir væntanlegir viðburðir.</p>
                    )}  

                    
        </div>
    );
}
