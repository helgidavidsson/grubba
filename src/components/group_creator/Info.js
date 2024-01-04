import styles from './GroupCreator.module.css'
import { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
export default function Info({
    ENDPOINT,
   
    
}) {

    const [groupTitle, setGroupTitle] = useState(''); 

    const [ groupDescription, setGroupDescription ] = useState('')

  

  

    const [socket, setSocket] = useState(null);


    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);


        newSocket.on('initialState', (data) => {
            // Destructure to get participants and title
            const {title, description } = data;
            
            setGroupTitle(title);
            setGroupDescription(description)
        });

        return () => newSocket.disconnect();
    }, [ENDPOINT]);


    // Info.js
    const handleSave = () => {
        const dataToEmit = {
            title: groupTitle,
            description: groupDescription
        };
        console.log('Emitting data:', dataToEmit);
        socket.emit('saveInfo', dataToEmit); // Emit the saveInfo event
    };


  
    return(
        <div>
         
                <h2>Upplýsingar</h2>
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

                    <button onClick={handleSave}>Save</button>               

            </div>
    )
}