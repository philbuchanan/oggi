const isAfterToday = (date) => {
	if (date && typeof date.getMonth !== 'function') {
		return false;
	}

	let now = new Date();

	now.setHours(0, 0, 0, 0);
	now.setDate(now.getDate() + 1);

	return date >= now;
};

export default isAfterToday;
