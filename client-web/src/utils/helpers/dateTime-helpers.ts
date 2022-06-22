export const getTodayAndTomorrowDates = () => {
    const todayDate = new Date();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(new Date().getDate() + 1);
    tomorrowDate.setHours(23);
    tomorrowDate.setMinutes(59);

    return {
        today: todayDate,
        tomorrow: tomorrowDate,
    };
};
