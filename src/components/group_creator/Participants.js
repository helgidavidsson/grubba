import { useState, useEffect } from "react";
import socketIOClient from 'socket.io-client';
import styles from './GroupCreator.module.css'

export default function Participants({
    ENDPOINT,
    rows,
    setRows
}) {

    const [socket, setSocket] = useState(null);

   
    
    
    const addNewRow = () => {
        setRows([...rows, { name: '', email: '' }]);
    };

    const deleteRow = (indexToDelete) => {
        const memberName = rows[indexToDelete].name;
        const confirmMessage = `Ertu viss um að þú viljir eyða ${memberName} úr hópnum?`;
        
        if (window.confirm(confirmMessage)) {
            setRows(rows.filter((row, index) => index !== indexToDelete));
        }
    };
    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);

        newSocket.on('initialState', (data) => {
            // Destructure to get participants and title
            const { participants } = data;

            // Update rows and group title based on server data
            setRows(participants.map(participant => ({ name: participant.name, email: participant.email })));
            
        
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
                        <tr key={index}>
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
                            <button onClick={() => deleteRow(index)}>Eyða</button>                            </td>
                        </tr>
                    ))}
                
                </tbody>
                
            
            </table>

            <button onClick={addNewRow}>Bæta við línu</button>

        </div>
    )
}