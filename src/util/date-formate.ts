export const formatarData = (dataString: string): string => {
  if (!dataString) return "-";

  const data = new Date(dataString);

  if (isNaN(data.getTime())) return dataString;

  return new Intl.DateTimeFormat("pt", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    //timeZone: "Africa/Luanda",
  }).format(data);
};

export const formatDisplay = (data: Date): string => {
  return data.toLocaleDateString("en-CA");
};

export const formatDisplayPt = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatTimeFromDate = (dateTime: string | null) => {
  if (!dateTime) return "---";
  const date = new Date(dateTime);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
