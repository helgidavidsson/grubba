import styles from './GroupCreator.module.css'
import { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
export default function Info({
    ENDPOINT,
    setSocket,
    groupTitle,
    setGroupTitle,
    groupDescription,
    setGroupDescription
    
}) {
  
   


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
            </div>
    )
}