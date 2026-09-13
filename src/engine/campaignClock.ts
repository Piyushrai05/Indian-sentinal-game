export function advanceCampaignTime(
  currentDate: string,
  currentTime: string,
  addMinutes: number
): { newDate: string; newTime: string; formattedTime: string } {
  const parts = currentTime.split(':');
  let hours = parseInt(parts[0] || '7', 10);
  let mins = parseInt(parts[1] || '30', 10);
  let secs = parseInt(parts[2] || '0', 10);

  mins += addMinutes;
  while (mins >= 60) {
    mins -= 60;
    hours += 1;
  }
  while (hours >= 24) {
    hours -= 24;
  }

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(mins).padStart(2, '0');
  const sStr = String(secs).padStart(2, '0');

  const newTime = `${hStr}:${mStr}:${sStr}`;
  const formattedTime = `${hStr}:${mStr} HRS`;

  return {
    newDate: currentDate,
    newTime,
    formattedTime
  };
}
