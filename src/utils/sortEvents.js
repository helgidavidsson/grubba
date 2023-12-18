export const sortEvents = (events) => {
    return events.slice().sort((a, b) => {
        const dateA = new Date(a.eventDate + ' ' + a.eventTime);
        const dateB = new Date(b.eventDate + ' ' + b.eventTime);
        return dateA - dateB;
    });
};


