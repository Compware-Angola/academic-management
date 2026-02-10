export const formatarData = (dataString: string): string => {
  if (!dataString) return "-";

  const data = new Date(dataString);

  if (isNaN(data.getTime())) return dataString;

  return new Intl.DateTimeFormat("pt", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(data);
};
