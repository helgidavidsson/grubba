import { useState, useEffect } from "react";
import ParticipantsCheckbox from "./ParticipantsCheckbox";
import socketIOClient from 'socket.io-client';


export default function ParticipantList({
    ENDPOINT,
}) {
    const [participants, setParticipants] = useState([]);
    const [groupTitle, setGroupTitle] = useState(''); 

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);
    
        newSocket.on('initialState', (data) => {
            // Destructure to get participants and title
            const { participants, title } = data;

            // Update participants and group title based on server data
            setParticipants(participants);
            setGroupTitle(title);
        });


        newSocket.on('groupTitle', (title) => {
            setGroupTitle(title)
        })
    
        newSocket.on('participantToggled', (data) => {
            setParticipants(prevParticipants =>
                prevParticipants.map(p =>
                    p.id === data.id ? { ...p, isChecked: data.isChecked } : p
                )
            );
        });
    
        return () => newSocket.disconnect();
    }, []);

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
            {participants.map((participant) => (
                <ParticipantsCheckbox
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
