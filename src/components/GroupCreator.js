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

    const [ groupDescription, setGroupDescription ] = useState('')

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);

        newSocket.on('initialState', (data) => {
            // Destructure to get participants and title
            const { participants, title, description } = data;

            // Update rows and group title based on server data
            setRows(participants.map(participant => ({ name: participant.name, email: participant.email })));
            
            setGroupTitle(title);
            setGroupDescription(description)
        });

        return () => newSocket.disconnect();
    }, [ENDPOINT]);

    const addNewRow = () => {
        setRows([...rows, { name: '', email: '' }]);
    };

    const handleSave = () => {
        const dataToEmit = { rows, title: groupTitle, description: groupDescription };
        console.log('Emitting data:', dataToEmit);
        socket.emit('saveParticipants', dataToEmit);
    };
    console.log(groupDescription)

    return(
        <div>
            <h2>Breyta hópi</h2>

        <div className={styles.container}>

            <div>
                <h3>Upplýsingar</h3>
                <div className={styles.infoContainer}>
                        <label>Nafn hópar</label>
                        <input
                            className={styles.input}
                            type='text'
                            value={groupTitle}
                            onChange={(e) => setGroupTitle(e.target.value)}
                        />
                    </div>

                    <div className={styles.infoContainer}>
                        <label>Lýsing á hópi</label>
                        <textarea
                        className={styles.inputLarge}
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        >
                            
                        </textarea>
                    </div>
            </div>
            
           
        <div>
        <h3>Meðlimir </h3>

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

            <button onClick={addNewRow}>Bæta við línu</button>
            <button onClick={handleSave}>Save</button>               

        </div>
           

          

        </div>
        </div>
       
    )
}