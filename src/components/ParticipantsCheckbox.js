export default function ParticipantsCheckbox({
    isChecked, 
    onToggle,
    participantId,
    name
}) 
{ 
        const handleCheckboxChange = () => {
            onToggle(participantId)   
        }
    return(
        <div>
            <input 
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
            ></input>
            <label>{name}</label>
        </div>
    )
}