export default function ParticipantsRadio({
    isChecked,
    onToggle,
    participantId,
    name
}) {
    const handleRadioChange = (event) => {
        // Determine the new value based on the radio button selected
        const newValue = event.target.value === 'yes';
        onToggle(participantId, newValue);
    }

    return (
        <div>

           
            <label>{name}</label>

                <input 
                    type="radio"
                    value="yes"
                    checked={isChecked === true}
                    onChange={handleRadioChange}
                    name={`attending-${participantId}`}
                /> Yes

    <           input 
                    type="radio"
                    value="no"
                    checked={isChecked === false}
                    onChange={handleRadioChange}
                    name={`attending-${participantId}`}
                /> No
    

            
            

            
        </div>
    )
}
