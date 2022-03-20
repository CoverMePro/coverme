const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const formatDateOutputString = (startDateTime: string, endDateTime: string) => {
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    const outputString = `${days[startDate.getDay()]} ${
        months[startDate.getMonth()]
    } ${startDate.getUTCDate()}  (${startDate.toLocaleTimeString('en', {
        hour12: true,
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
    })} - ${endDate.toLocaleTimeString('en', {
        hour12: true,
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
    })})`;

    return outputString;
};
