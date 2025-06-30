// Date helper functions for the agenda application

export const MONTHS = {
  9: { name: 'Septembre', year: 2025 },
  10: { name: 'Octobre', year: 2025 },
  11: { name: 'Novembre', year: 2025 },
  12: { name: 'Décembre', year: 2025 }
};

/**
 * Get all days for a specific month and year
 * @param {number} month - Month number (9-12)
 * @param {number} year - Year
 * @returns {Array} Array of day objects with date, dayNumber, isWeekend
 */
export const getMonthDays = (month, year) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  const days = [];
  
  // Add days from previous month
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();
  for (let i = 0; i < startingDayOfWeek; i++) {
    const dayNum = daysInPrevMonth - startingDayOfWeek + 1 + i;
    const date = new Date(prevYear, prevMonth - 1, dayNum);
    days.push({
      date: formatDate(date),
      dayNumber: dayNum,
      isOtherMonth: true,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      fullDate: date
    });
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateString = formatDate(date);
    const dayOfWeek = date.getDay();
    
    days.push({
      date: dateString,
      dayNumber: day,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      fullDate: date
    });
  }
  
  // Add days from next month to fill the last week(s)
  while (days.length % 7 !== 0) {
    const nextDay = days.length - (daysInMonth + startingDayOfWeek) + 1;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const date = new Date(nextYear, nextMonth - 1, nextDay);
    days.push({
      date: formatDate(date),
      dayNumber: nextDay,
      isOtherMonth: true,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      fullDate: date
    });
  }
  // Always show 6 weeks (42 days)
  while (days.length < 42) {
    const nextDay = days.length - (daysInMonth + startingDayOfWeek) + 1;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const date = new Date(nextYear, nextMonth - 1, nextDay);
    days.push({
      date: formatDate(date),
      dayNumber: nextDay,
      isOtherMonth: true,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      fullDate: date
    });
  }
  
  return days;
};

/**
 * Format a date to YYYY-MM-DD string
 * @param {Date} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Parse a date string (YYYY-MM-DD) to Date object
 * @param {string} dateString 
 * @returns {Date}
 */
export const parseDate = (dateString) => {
  return new Date(dateString + 'T00:00:00');
};

/**
 * Get date range between two dates (inclusive)
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Array} Array of date strings
 */
export const getDateRange = (startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const dates = [];
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

/**
 * Format date range for display
 * @param {string} startDate 
 * @param {string} endDate 
 * @returns {string}
 */
export const formatDateRange = (startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  const formatOptions = { day: 'numeric', month: 'short' };
  
  if (startDate === endDate) {
    return start.toLocaleDateString('fr-FR', formatOptions);
  }
  
  return `${start.toLocaleDateString('fr-FR', formatOptions)} - ${end.toLocaleDateString('fr-FR', formatOptions)}`;
};

/**
 * Generate a unique ID
 * @returns {string}
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}; 