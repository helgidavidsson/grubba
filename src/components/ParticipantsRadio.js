import React from 'react';
import Comments from './Comments';
import styles from './ParticipantsRadio.module.css';

export default function ParticipantsRadio({
    ENDPOINT,
    isChecked,
    onToggle,
    participantId,
    name
}) {

    console.log(isChecked)
    const handleRadioChange = (event) => {
        const newValue = event.target.value === 'yes';
        onToggle(participantId, newValue);
    };



    const backgroundColorClass = isChecked === true ? styles.greenBackground : '';
    const lineThroughClass = isChecked === false ? styles.lineThrough : '';

    return (
        <div className={styles.radioContainer}>
            <label className={`${styles.radioLabel} ${backgroundColorClass} ${lineThroughClass}`}>
                {name}
            </label>
            <div className={`${styles.radioGroup} ${backgroundColorClass}`}>
                <input 
                    type="radio"
                    value="yes"
                    checked={isChecked === true}
                    onChange={handleRadioChange}
                    name={`attending-${participantId}`}
                /> Já
                <input 
                    type="radio"
                    value="no"
                    checked={isChecked === false}
                    onChange={handleRadioChange}
                    name={`attending-${participantId}`}
                /> Nei
            </div>

            <Comments
                ENDPOINT={ENDPOINT}
                name={name}
                participantId={participantId}
                isChecked={isChecked}
                />

           

        </div>
    );
}
