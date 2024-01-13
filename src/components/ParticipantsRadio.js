import React from 'react';
import Comments from './Comments';
import styles from './ParticipantsRadio.module.css';

export default function ParticipantsRadio({
    ENDPOINT,
    isCheckedAttendance,
    onToggle,
    participantId,
    name
}) {

    const handleRadioChange = (event) => {
        const newValue = event.target.value === 'yes';
        onToggle(participantId, newValue);
    };



    const backgroundColorClass = isCheckedAttendance === true ? styles.greenBackground : '';
    const lineThroughClass = isCheckedAttendance === false ? styles.lineThrough : '';

    return (
        <div className={styles.radioContainer}>
            <label className={`${styles.radioLabel} ${backgroundColorClass} ${lineThroughClass}`}>
                {name}
            </label>
            <div className={`${styles.radioGroup} ${backgroundColorClass}`}>
                <input 
                    type="radio"
                    value="yes"
                    checked={isCheckedAttendance === true}
                    onChange={handleRadioChange}
                    name={`attending-${participantId}`}
                /> Já
                <input 
                    type="radio"
                    value="no"
                    checked={isCheckedAttendance === false}
                    onChange={handleRadioChange}
                    name={`attending-${participantId}`}
                /> Nei
            </div>

            <Comments
                ENDPOINT={ENDPOINT}
                name={name}
                participantId={participantId}
                isCheckedAttendance={isCheckedAttendance}
                />

           

        </div>
    );
}
