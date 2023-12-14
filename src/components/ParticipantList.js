import { useState, useEffect } from "react";
import ParticipantsCheckbox from "./ParticipantsCheckbox";
import socketIOClient from 'socket.io-client';


export default function ParticipantList() {
    const [participants, setParticipants] = useState([
        { id: 0, isChecked: false, name: "Helgi Freyr" },
        { id: 1, isChecked: false, name: "Davíð"},
        { id: 2, isChecked: false, name: "Kristín Inga" },
        { id: 3, isChecked: false, name: "Katrín Sól" },
    ]);
    const [socket, setSocket] = useState(null);

    const ENDPOINT = "http://hopurinn-dev.eu-north-1.elasticbeanstalk.com/"; // Replace with your server's address

    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);
    
        newSocket.on('initialState', (initialParticipants) => {
            setParticipants(initialParticipants);
        });
    
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
