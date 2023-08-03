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

export const getEndDate = (startDate: Date, duration: string) => {
	const durHrs = duration?.substring(0, 2);
	const durMin = duration?.substring(3);

	const hours = parseInt(durHrs!, 10);
	const mins = parseInt(durMin!, 10);

	const endDate = new Date(startDate);

	endDate.setTime(endDate.getTime() + hours * 60 * 60 * 1000 + mins * 60 * 1000);

	return endDate;
};
