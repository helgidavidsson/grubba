export default function ParticipantsCheckbox(
    isChecked, 
    onChange,
    participantId
    ) {

        const handleCheckboxChange = () => {
            ontoggle(participantId)
        }
    return(
        <div>
            <input 
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                
                
                ></input>
        </div>
    )
}