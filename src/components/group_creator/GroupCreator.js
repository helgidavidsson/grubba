import { useState, useEffect } from 'react'
import styles from './GroupCreator.module.css'
import Sidebar from './Sidebar';
import Info from './Info';
import Participants from './Participants';
import socketIOClient from 'socket.io-client';
import Events from './Events';


export default function GroupCreator({
    ENDPOINT
}) {

    const [groupTitle, setGroupTitle] = useState(''); 

    const [ groupDescription, setGroupDescription ] = useState('')


    const [rows, setRows] = useState([{ 
        name: '', email: '',
     }]);
    
  

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

    

    const handleSave = () => {
        const dataToEmit = { rows, title: groupTitle, description: groupDescription };
        console.log('Emitting data:', dataToEmit);
        socket.emit('saveParticipants', dataToEmit);
    };
    
    

    return(
        <div className={styles.flexContainer}>
        
            <Sidebar
               
            />


        <div className={styles.mainContent}>

            <Info
                ENDPOINT={ENDPOINT}
                setSocket={setSocket}
                groupTitle={groupTitle}
                setGroupTitle={setGroupTitle}
                groupDescription={groupDescription}
                setGroupDescription={setGroupDescription}
                 
            />
            
            
           
            <Participants
                ENDPOINT={ENDPOINT}
                rows={rows}
                setRows={setRows}
            />

            
            <Events
                socket={socket}
                setSocket={setSocket}
            />

          
        <button onClick={handleSave}>Save</button>               

        </div>

        </div>
       
    )
}