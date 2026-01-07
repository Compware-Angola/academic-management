import { parseISO, format } from "date-fns";

/**
 * Receives a start time and end time in ISO format
 * Returns a readable string in the format "HH:mm - HH:mm"
 */
export function formatReadableTimeInterval(
  startTimeISO: string,
  endTimeISO: string
): string {
  const start = parseISO(startTimeISO);
  const end = parseISO(endTimeISO);

  return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
}
