export const dateOnly = (date: Date, separator = '-'): string => `${date.getFullYear()}${separator}${String(date.getMonth()+1).padStart(2, "0")}${separator}${String(date.getDate()).padStart(2, "0")}`;

export const nextSunday = (date: Date | string): Date => {

    if (typeof date === "string") {
        date = new Date(Date.parse(date));
    }

    // Clone so we never mutate the caller's Date instance.
    date = new Date(date);

    const dayOfWeek = date.getDay();

    if (dayOfWeek !== 0) {
        date.setDate(date.getDate() + (7 - dayOfWeek));
    }

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
}

export const toUrl = (date: Date) => dateOnly(nextSunday(date), "/");
