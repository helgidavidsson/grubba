import styles from './Info.module.css'
import { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
export default function Info({
    ENDPOINT,
   
    
}) {

    const [groupTitle, setGroupTitle] = useState(''); 

    const [ groupDescription, setGroupDescription ] = useState('')

    const [groupImage, setGroupImage] = useState('/assets/camera.png'); // Default image path

    const fileInputRef = useRef(null); // Ref for file input

    const [socket, setSocket] = useState(null);

    const [showPopup, setShowPopup] = useState(false);

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



    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const fileReader = new FileReader();
            fileReader.onload = function(e) {
                setGroupImage(e.target.result); // Set the preview image
            };
            fileReader.readAsDataURL(e.target.files[0]);
        }
    };

    
    const handleImageClick = () => {
        setShowPopup(true); // Open the popup
    };

    const handleUploadClick = () => {
        document.getElementById('group-image').click(); // Trigger file input click
        setShowPopup(false)
    };

    const handleRemoveImage = () => {
        setGroupImage('/assets/camera.png'); // Reset to default image
        setShowPopup(false)
    };

    // Info.js
    const handleSave = () => {
        const dataToEmit = {
            title: groupTitle,
            description: groupDescription
        };
        console.log('Emitting data:', dataToEmit);
        socket.emit('saveInfo', dataToEmit); // Emit the saveInfo event
    };

    const isDefaultImage = groupImage === '/assets/camera.png';
  
    return(
        <div>
         
                <h2>Upplýsingar</h2>


                <div className={styles.infoContainer}>
                    <label>Hópmynd</label>
                <img 
                    src={groupImage}
                    alt="Group"
                    onClick={handleImageClick}
                    className={isDefaultImage ? styles.cameraIcon : styles.groupImageUploaded}
                />
                <input 
                    type="file" 
                    id="group-image"
                    onChange={handleImageChange}
                    style={{display: 'none'}}
                />
            </div>

            {showPopup && (
                <div className={styles.popup}>
                    <button onClick={handleUploadClick}>Hlaða upp mynd</button>
                    <button onClick={handleRemoveImage} disabled={isDefaultImage}>
                        Fjarlægja mynd
                    </button>
                </div>
            )}

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