export const UNIX_START = 1970;

export const eyars18 = 1000 * 60 * 60 * 24 * 365 * 18; // 18 лет

/**
 * функция возвращает разницу в годах между датой и настоящим временем
 * 
 * @param {number} timestamp ваша дата
 */
export const getYearOffsetNow = (timestamp: number) => new Date(Date.now() - timestamp).getFullYear() - UNIX_START;