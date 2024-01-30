export const formatDate = (date: string, locale?: string, options?: Object): string => {
    const formattedDate = new Date(date).toLocaleDateString(locale, options);
    return formattedDate;
}