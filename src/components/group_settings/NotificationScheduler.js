
export default function NotificationScheduler({
    socket,
    timeBefore,
    setTimeBefore
}) {

  
    const timeOptions = [
        { value: '30m', label: '30 mínútum fyrir' },
        { value: '1h', label: '1 klukkutíma fyrir' },
        { value: '2h', label: '2 klukkutímum fyrir' },
        { value: '4h', label: '4 klukkutímum fyrir' },
        { value: '8h', label: '8 klukkutímum fyrir' },
        { value: '12h', label: '12 klukkutímum fyrir' },
        { value: '1d', label: '1 degi fyrir' },
        { value: '2d', label: '2 dögum fyrir' },
        { value: '4d', label: '4 dögum fyrir' },
        { value: '1w', label: '1 viku fyrir' },
        { value: '2w', label: '2 vikum fyrir' },
        { value: '1m', label: '1 mánuði fyrir' },
        { value: '2m', label: '2 mánuðum fyrir' },
    ];

    const handleChange = (e) => {
        const newTimeBefore = e.target.value;
        setTimeBefore(newTimeBefore);
        console.log(newTimeBefore)
        socket.emit('updateNotificationTime', { timeBefore: newTimeBefore });
    };

    return (
        <div>
            <h3>Senda tilkynningu</h3>
            <select value={timeBefore} onChange={handleChange}>
                {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
}
