import { useEffect, useState } from "react";
import socketIOClient from 'socket.io-client';
import EmailForm from "./EmailForm";
import NotificationScheduler from "./NotificationScheduler";

export default function Outreach({ ENDPOINT }) {
    const [rows, setRows] = useState([]);
    const [socket, setSocket] = useState(null);

    const [timeBefore, setTimeBefore] = useState('');
    const [emailTemplate, setEmailTemplate] = useState(''); // New state for email template

    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);
    
        // Fetch the email template from the server
        fetch('http://localhost:3001/getEmailTemplate')
            .then(response => response.json()) // Assuming the server sends JSON
            .then(data => {
                setEmailTemplate(data.emailTemplate); // Update the state with the fetched template
                console.log(data.emailTemplate); // Log the fetched template
            })
            .catch(error => console.error('Error fetching email template:', error));
    
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
                setTimeBefore(data.timeBefore);
            });
        });
    
        return () => newSocket.disconnect();
    }, [ENDPOINT]);
    

    
    const handleSaveEmailTemplate = (newTemplate) => {
        socket.emit('saveEmailTemplate', newTemplate);
    };
    


    const handleEmailCheckboxChange = (id) => {
        setRows(rows.map(row => 
            row.id === id ? { ...row, isCheckedEmail: !row.isCheckedEmail } : row
        ));
    };

    const handleSaveChanges = () => {
        socket.emit('saveParticipants', { rows });
        
    };

    const defaultEmailTemplate =  `
    <p>Hæ [memberName],</p>
    <p>[AdminName] hefur boðið þér í eftirfarandi viðburð:</p>
    <p>[EventName]</p>
    <p>Þú getur skráð mætingu gegnum þennan hlekk:</p>
    <p>[Hlekkur]</p>
    <p>Bestu kveðjur,<br>grubba.is</p>
    `


    return(
        <div>
            <h2>Tilkynningar</h2>
            <EmailForm
                onSave={handleSaveEmailTemplate}
                initialEmailTemplate={emailTemplate || defaultEmailTemplate} // Use fetched template
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
