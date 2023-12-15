import { useState, useEffect } from 'react'
import styles from './GroupCreator.module.css'
import socketIOClient from 'socket.io-client';

export default function GroupCreator({
    ENDPOINT
}) {
    const [rows, setRows] = useState([{ 
        name: '', email: '',
     }]);
     const [groupTitle, setGroupTitle] = useState(''); 

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);

        newSocket.on('initialState', (data) => {
            // Destructure to get participants and title
            const { participants, title } = data;

            // Update rows and group title based on server data
            setRows(participants.map(participant => ({ name: participant.name, email: participant.email })));
            setGroupTitle(title);
        });

        return () => newSocket.disconnect();
    }, [ENDPOINT]);

    const addNewRow = () => {
        setRows([...rows, { name: '', email: '' }]);
    };

    const handleSave = () => {
        const dataToEmit = { rows, title: groupTitle };
        console.log('Emitting data:', dataToEmit);
        socket.emit('saveParticipants', dataToEmit);
    };

    return(
        <div>
            <h2>Nýr hópur</h2>

            <form>
            <div className={styles.nameContainer}>
                    <label>Nafn hópar</label>
                    <input
                        className={styles.input}
                        type='text'
                        value={groupTitle}
                        onChange={(e) => setGroupTitle(e.target.value)}
                    />
                </div>
           

            <h3>Bjóddu </h3>

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
                        </tr>
                    ))}
                 
                </tbody>
                
              
            </table>

            <label></label>

         

            </form>
            <button onClick={addNewRow}>Bæta við línu</button>

            <button onClick={handleSave}>Save</button>               
          

        </div>
    )
}