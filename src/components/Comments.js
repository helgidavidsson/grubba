import styles from './Comments.module.css'
import { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
export default function Comments({
    ENDPOINT,
    name,
    participantId,
    isCheckedAttendance
    
}) {

   
    const [showPopup, setShowPopup] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [socket, setSocket] = useState(null);

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };
    const saveComment = () => {
        const currentDateTime = new Date();
        const formattedDate = currentDateTime.toLocaleDateString('en-GB').replace(/\//g, '-');
        const formattedTime = currentDateTime.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const dateTimeString = `${formattedDate} ${formattedTime}`;
        const newComment = { text: comment, dateTime: dateTimeString };
        socket.emit('saveComment', { participantId, comment: newComment });
        setComment('')
    };
    

    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT);
        setSocket(newSocket);
    
        // Listen for initial state
        newSocket.on('initialState', (data) => {
            const participantData = data.participants.find(p => p.id === participantId);
            if (participantData && participantData.comments) {
                setComments(participantData.comments);
            }
        });
    
        // Listen for updated comments
        newSocket.on('commentsUpdated', updatedParticipants => {
            const updatedParticipant = updatedParticipants.find(p => p.id === participantId);
            if (updatedParticipant && updatedParticipant.comments) {
                setComments(updatedParticipant.comments);
            }
        });
    
        return () => {
            newSocket.disconnect();
        };
    }, [participantId, ENDPOINT]);
    
    


    return(
        <div>
            <button 
                className={styles.button}
                onClick={() => setShowPopup(true)}>
                    <img 
                        src="/assets/comment-icon.svg" 
                        alt="Comment Icon" />
            </button>

            {showPopup && (
                <div className={styles.commentPopUp}>
                    <p><b>{name}</b> {isCheckedAttendance === true ? 'mætir' : isCheckedAttendance === false ? 'mætir ekki' : 'hefur ekki merkt við'}</p>
                    <p></p>
                    {comments.map((comment, index) => (
                        <p key={index}>
                            <small className={styles.dateText}>{comment.dateTime}</small> - {comment.text}
                        </p>
                    ))}
                    <div>
                        <input 
                            type="text"
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Add a comment"
                        />
                        <button onClick={saveComment}>Senda</button>
                        
                    </div>
                    <button onClick={() => setShowPopup(false)}>Close</button>
                </div>
            )}
        </div>
        
    )
}