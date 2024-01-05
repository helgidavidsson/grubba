import styles from './DeleteConfirmation.module.css'
import { useState } from 'react';
export default function DeleteConfirmationDialog({
    onCancel,
    onDeleteConfirmed,
    eventToDelete,
    setShowDeleteDialog
}) {
    const [deletionScope, setDeletionScope] = useState('thisEvent');

    const handleDelete = () => {
        onDeleteConfirmed(eventToDelete, deletionScope);
        setShowDeleteDialog(false)

    };

   
    
    
        return (
            <div className={styles.dialog}>
                <p>Hvernig viltu eyða viðburðinum "{eventToDelete.eventName}"?</p>
                <div>
                    <input
                        type="radio"
                        id="thisEvent"
                        name="deletionScope"
                        value="thisEvent"
                        checked={deletionScope === 'thisEvent'}
                        onChange={(e) => setDeletionScope(e.target.value)}
                    />
                    <label htmlFor="thisEvent">Aðeins þessi viðburður</label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="allEvents"
                        name="deletionScope"
                        value="allEvents"
                        checked={deletionScope === 'allEvents'}
                        onChange={(e) => setDeletionScope(e.target.value)}
                    />
                    <label htmlFor="allEvents">Allir endurteknir viðburðir</label>
                </div>
                <button onClick={handleDelete}>Eyða</button>
                <button type="button" onClick={onCancel}>Hætta við</button>
            </div>
        );
    };
    
