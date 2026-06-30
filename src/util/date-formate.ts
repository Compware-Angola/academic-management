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

export const formatDateOnlyPt = (dateString: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);

  if (!match) return formatDisplayPt(dateString);

  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
};

export const formatDateForInput = (value: string): string => {
  if (!value) return "";

  const isoDate = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (isoDate) return isoDate;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export function formatDateTimePt(value?: string | null) {
  if (!value) return "Sem data";

  return new Date(value).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const formatTimeFromDate = (dateTime: string | null) => {
  if (!dateTime) return "---";
  const date = new Date(dateTime);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // local time, não UTC
};
