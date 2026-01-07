export function formatMillisecondsToHoursMinutes(ms) {
  const totalMinutes = Math.floor(ms / 60000); // converte para minutos
  const hours = Math.floor(totalMinutes / 60); // calcula horas
  const minutes = totalMinutes % 60; // minutos restantes
  return `${hours}h ${minutes}m`;
}
