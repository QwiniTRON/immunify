export const UNIX_START = 1970;

export const getYearOffestNow = (timestamp: number) => new Date(Date.now() - timestamp).getFullYear() - UNIX_START;