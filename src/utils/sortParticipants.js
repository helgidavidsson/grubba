export default function sortParticipants(participants) {
    return participants.slice().sort((a, b) => {
        if (a.isCheckedAttendance === true && b.isCheckedAttendance !== true) {
            return -1; // a is Yes, b is not Yes - a should come first
        }
        if (a.isCheckedAttendance !== true && b.isCheckedAttendance === true) {
            return 1; // a is not Yes, b is Yes - b should come first
        }
        return 0; // both are Yes or both are not Yes - keep original order
    });
}
