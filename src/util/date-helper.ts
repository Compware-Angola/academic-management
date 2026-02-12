export const formatToUserTimeZone = (
    date: Date | string | number,

): string => {
    if (!date) return "";

    const dateObj = typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;


    if (isNaN(dateObj.getTime())) {
        console.error("Data inválida fornecida ao formatToUserTimeZone:", date);
        return "Data inválida";
    }


    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const locale = navigator.language

    const defaultOptions: Intl.DateTimeFormatOptions = {
        timeZone: userTimeZone,
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };

    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};