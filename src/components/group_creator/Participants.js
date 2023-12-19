import { useState, useEffect } from "react";
import socketIOClient from 'socket.io-client';
import styles from './GroupCreator.module.css'

export default function Participants({
    ENDPOINT,
    rows,
    setRows
}) {

    const [socket, setSocket] = useState(null);

   
    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
    };
    
    
    const addNewRow = () => {
        setRows([...rows, { id: generateUniqueId(), name: '', email: '' }]);
    };
    
    const deleteRow = (idToDelete) => {
        const participantToDelete = rows.find(row => row.id === idToDelete);
        if (participantToDelete && window.confirm(`Ertu viss um að þú vilt eyða ${participantToDelete.name} úr hópnum?`)) {
            setRows(rows.filter(row => row.id !== idToDelete));
        }
    };
    
    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);

        newSocket.on('initialState', (data) => {
            // Destructure to get participants and title
            const { participants } = data;

            // Update rows and group title based on server data
            setRows(participants.map(participant => ({ 
                id: participant.id,
                name: participant.name, 
                email: participant.email,
                isChecked: participant.isChecked
            
            })));
            
        
        });

        return () => newSocket.disconnect();
    }, [ENDPOINT]);

    return(
        <div>
        <h2>Meðlimir</h2>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nafn</th>
                        <th>Netfang</th>
                    </tr>
                </thead>
                <tbody>

                {rows.map((row, index) => (
                        <tr key={row.id}>
                            <td>{index + 1}</td>
                            <td>      
                                <input 
                                    type='text' 
                                    value={row.name}
                                    onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].name = e.target.value;
                                        setRows(newRows);
                                    }}
                                />
                            </td>
                            <td>      
                                <input 
                                    type='email' 
                                    value={row.email}
                                    onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].email = e.target.value;
                                        setRows(newRows);
                                    }}
                                />
                            </td>

                            <td>
                            <button onClick={() => deleteRow(row.id)}>Eyða</button>                            </td>
                        </tr>
                    ))}
                
                </tbody>
                
            
            </table>

            <button onClick={addNewRow}>Skrá nýjan meðlim</button>

        </div>
    )
}