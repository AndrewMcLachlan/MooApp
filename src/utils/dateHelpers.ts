export const dateOnly = (date: Date, separator = '-'): string => `${date.getFullYear()}${separator}${date.getMonth()+1}${separator}${date.getDate()}`;

export const nextSunday = (date: Date | string): Date => {

    if (typeof date === "string") {
        date = new Date(Date.parse(date));
    }

    const dayOfWeek = date.getDay();

    if (dayOfWeek !== 0) {
        date.setDate(date.getDate() + (7 - dayOfWeek));
    }

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    return date;
}

export const toUrl = (date: Date) => dateOnly(nextSunday(date), "/");
