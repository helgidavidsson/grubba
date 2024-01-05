import { useEffect, useState } from "react";
import socketIOClient from 'socket.io-client';
import EmailForm from "./EmailForm";
import NotificationScheduler from "./NotificationScheduler";

export default function Outreach({ ENDPOINT }) {
    const [rows, setRows] = useState([]);
    const [socket, setSocket] = useState(null);

    const [timeBefore, setTimeBefore] = useState('');

    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);

        newSocket.on('initialState', (data) => {
            const { participants } = data;

            setRows(participants.map(participant => ({
                id: participant.id,
                name: participant.name,
                email: participant.email,
                isCheckedAttendance: participant.isCheckedAttendance,
                isCheckedEmail: participant.isCheckedEmail !== undefined ? participant.isCheckedEmail : true,
                

            })));

            newSocket.on('initialNotificationTime', (data) => {
                setTimeBefore(data.timeBefore); // Assuming the server sends the time as 'timeBefore'
                
            });

        
        });
        return () => newSocket.disconnect();
    }, [ENDPOINT]);


    const handleEmailCheckboxChange = (id) => {
        setRows(rows.map(row => 
            row.id === id ? { ...row, isCheckedEmail: !row.isCheckedEmail } : row
        ));
    };

    const handleSaveChanges = () => {
        socket.emit('saveParticipants', { rows });
        
    };

    return(
        <div>
            <h2>Tilkynningar</h2>
            <EmailForm
            />
            <NotificationScheduler
                socket={socket}
                timeBefore={timeBefore}
                setTimeBefore={setTimeBefore}
                />
            
            <h3>Meðlimir</h3>
            <ul>
                {rows.map((participant) => (
                    <li key={participant.id}>
                    <input 
                        type="checkbox" 
                        checked={participant.isCheckedEmail}
                        onChange={() => handleEmailCheckboxChange(participant.id)}
                    />
                        {participant.name} - {participant.email}
                    </li>
                ))}
            </ul>

            <button onClick={handleSaveChanges}>Save Changes</button>
        </div>
    )
}
