const dayCodes: { [key: string]: string } = {
  "1": "Saturday",
  "2": "Sunday",
  "3": "Monday",
  "4": "Tuesday",
  "5": "Wednesday",
  "6": "Thursday",
  "7": "Friday",
};

const timeSlotCodes: { [key: string]: string } = {
  "01": "09:00:00",
  "02": "10:00:00",
  "03": "11:00:00",
  "04": "12:00:00",
  "05": "13:00:00",
  "06": "14:00:00",
  "07": "15:00:00",
  "08": "16:00:00",
  "09": "17:00:00",
  "10": "18:00:00",
  "11": "19:00:00",
  "12": "20:00:00",
};

const typeCodes: Record<string, string> = {
  L: "Online",
  S: "Onsite",
};
export const formatDoctorAvailabilities = (slotsString: string) => {
  const availabilityMap: Record<
    string,
    { time: string; id: number; type: string }[]
  > = {};
  // Split the incoming string into an array of slot IDs
  const slots = slotsString.split(",");

  slots.forEach((slotId) => {
    const [dayCode, timeCode, typeCode] = slotId.split("_");
    const date = dayCodes[dayCode];

    if (!availabilityMap[date]) {
      availabilityMap[date] = [];
    }

    availabilityMap[date].push({
      time: timeSlotCodes[timeCode],
      id: parseInt(timeCode),
      type: typeCodes[typeCode],
    });
  });

  // Convert the map to an array of dates with slots
  return Object.keys(availabilityMap).map((date) => ({
    date,
    slots: availabilityMap[date],
  }));
};

export const convertDateToCode = (day: string, time: string, type: string) => {
  console.log(day, time, type);
  const dayCode = Object.keys(dayCodes).find((key) => dayCodes[key] === day);
  const timeCode = Object.keys(timeSlotCodes).find(
    (key) => timeSlotCodes[key] === time,
  );
  const typeCode = Object.keys(typeCodes).find(
    (key) => typeCodes[key] === type,
  );

  return `${dayCode}_${timeCode}_${typeCode}`;
};
