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

export const formatDateTimeOutputString = (startDateTime: string, endDateTime: string) => {
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

export const formatDateString = (date: Date) => {
    return new Date(date).toDateString();
};

export const formatDuration = (value: string) => {
    return value.substring(0, 2) + ':' + value.substring(2);
};

export function formatAMPM(hours: number, minutes: number) {
    console.log(hours);
    let ampm = hours >= 12 ? 'PM' : 'AM';
    let newHours = hours % 12;
    newHours = hours ? hours : 12; // the hour '0' should be '12'
    newHours = newHours > 12 ? newHours - 12 : newHours;
    const newMinutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = newHours + ':' + newMinutes + ' ' + ampm;
    return strTime;
}

export function formatDurationClean(duration: string) {
    const durHrs = duration?.substring(0, 2);
    const durMin = duration?.substring(3);

    const hours = parseInt(durHrs!, 10);
    const mins = parseInt(durMin!, 10);

    return `${hours} Hours ${mins > 0 ? ' and ' + mins + ' Minutes' : ''}`;
}
