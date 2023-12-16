import { useState, useEffect } from "react";
import ParticipantsRadio from "./ParticipantsRadio";
import socketIOClient from 'socket.io-client';
import styles from './ParticipantsList.module.css'
import sortParticipants from '../utils/participantUtils'; 

export default function ParticipantList({
    ENDPOINT,
}) {
    const [participants, setParticipants] = useState([]);
    const [groupTitle, setGroupTitle] = useState(''); 
    const [ groupDescription, setGroupDescription ] = useState('')
 

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);
    
        newSocket.on('initialState', (data) => {
            // Destructure to get participants and title
            const { participants, title, description } = data;

            // Update participants and group title based on server data
            setParticipants(sortParticipants(participants)); // Sort participants here
            setGroupTitle(title);
            setGroupDescription(description);
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

    const handleToggle = (id) => {
        const updatedParticipants = participants.map(p => {
            if (p.id === id) {
                return { ...p, isChecked: !p.isChecked };
            }
            return p;
        });
        setParticipants(updatedParticipants);

        // Emit the event to the server with the updated state
        const toggledParticipant = updatedParticipants.find(p => p.id === id);
        socket.emit('toggleParticipant', { id, isChecked: toggledParticipant.isChecked });
        
        
    };

    return (
        <div>
            <h2>{groupTitle}</h2>

            <p>{groupDescription}</p>
            
            <h3>Mætingarlisti</h3>
                    {participants.map((participant) => (
                <ParticipantsRadio
                    key={participant.id}
                    name={participant.name}
                    participantId={participant.id}
                    isChecked={participant.isChecked}
                    onToggle={handleToggle}

                />
            ))}
                    
        </div>
    );
}
