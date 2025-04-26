const formatDate = (date: Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};
const formatDateString = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};
const getTimeString = (date: string) => {
  const d = new Date(date);
  let time = d.toLocaleTimeString();
  return time;
};
const unFormatDate = (date: string) => {
  const d = new Date(date);
  return d;
};

const getWeekStartAndEnd = (today: Date) => {
  const firstDay = today.getDate() - today.getDay();
  const lastDay = firstDay + 6;
  const startOfWeek = new Date(today.setDate(firstDay));
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today.setDate(lastDay));
  endOfWeek.setHours(23, 59, 59, 999);
  const start = formatDate(startOfWeek);
  const end = formatDate(endOfWeek);
  const week = [start, end];

  return week;
};

export {
  formatDate,
  unFormatDate,
  getWeekStartAndEnd,
  getTimeString,
  formatDateString,
};
