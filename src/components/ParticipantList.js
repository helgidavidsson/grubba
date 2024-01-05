import { useState, useEffect } from "react";
import ParticipantsRadio from "./ParticipantsRadio";
import socketIOClient from 'socket.io-client';
import styles from './ParticipantsList.module.css'
import sortParticipants from '../utils/sortParticipants'; 
import { sortEvents } from "../utils/sortEvents";
import Sidebar from "./Sidebar";
import SubHeader from "./SubHeader";

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
                    p.id === data.id ? { ...p, isCheckedAttendance: data.isCheckedAttendance } : p
                );
                return sortParticipants(updated); // Sort participants after updating
            });
        });

            

      

        return () => newSocket.disconnect();
    }, [ENDPOINT]);

    const handleToggle = (id, newisCheckedAttendance) => {
        const updatedParticipants = participants.map(p => {
            if (p.id === id) {
                return { ...p, isCheckedAttendance: newisCheckedAttendance };
            }
            return p;
        });
        setParticipants(updatedParticipants);
    
        // Emit the event to the server with the updated state
        socket.emit('toggleParticipant', { id, isCheckedAttendance: newisCheckedAttendance });
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

    const calculateTimeLeft = (eventDateTime) => {
        const currentTime = new Date();
        const eventTime = new Date(eventDateTime);
    
        let difference = eventTime - currentTime;
    
        // Check if the event has already started
        if (difference <= 0) {
            return null;
        }
    
        // Calculate time left in different units
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24) % 30);
        const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30) % 12);
        const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
    
        // Construct the time left string
        let timeLeftString = '';
        if (years > 0) timeLeftString += `${years} ár `;
        if (months > 0) timeLeftString += `${months} mánuði `;
        if (days > 0) timeLeftString += `${days} daga `;
        if (hours > 0) timeLeftString += `${hours} klukkutíma `;
        if (minutes > 0) timeLeftString += `${minutes} mínútu`;
    
        return timeLeftString.trim();
    };
    

    return (
        <div>
            <SubHeader/>

<div className={styles.layout}>
            <Sidebar
                title={groupTitle}
                description={groupDescription}
            />
            <div className={styles.mainContent}>
            



                {nextEvent ? (
                    <>

                    <div className={styles.eventCard}>
                    {calculateTimeLeft(`${nextEvent.eventDate}T${nextEvent.eventTime}`) === null ? (
                <p className={styles.timeLeft}><b>Í gangi núna...</b></p>
            ) : (
                <p className={styles.timeLeft}>
                    Næsti viðburður hefst eftir <b>{calculateTimeLeft(`${nextEvent.eventDate}T${nextEvent.eventTime}`)}</b>...
                </p>
            )}
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
                            isCheckedAttendance={participant.isCheckedAttendance}
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
                    

                                
                    </div>
        </div>
        
                );
            }
