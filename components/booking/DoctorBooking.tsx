"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DoctorInfo from "@/components/booking/DoctorInfo";
import DetailsSelector from "@/components/booking/DetailsSelector";
import BookingSummary from "@/components/booking/BookingSummary";
import SlotSelector from "@/components/booking/SlotSelector";
import WeekCalendar from "@/components/booking/WeekCalendar";
import { formatDoctorAvailabilities } from "@/utils/formatDoctorAvailabilities";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import type { Doctor } from "@/types";

const dayCodes: { [key: string]: string } = {
  "1": "Saturday",
  "2": "Sunday",
  "3": "Monday",
  "4": "Tuesday",
  "5": "Wednesday",
  "6": "Thursday",
  "7": "Friday",
};

const DoctorBooking = () => {
  const searchParams = useSearchParams();
  const [doctor, setDoctor] = useState<Doctor>();
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("L");
  const [availableDates, setAvailableDates] = useState<
    { date: string; slots: { time: string; id: number; type: string }[] }[]
  >([{ date: "loading", slots: [] }]);

  const [bookedDates, setBookedDates] = useState<string[]>([]);

  const [appointmentState, setAppointmentState] = useState("First_time");
  const [appointments, setAppointments] = useState<any[]>([]);

  const formattedDatesFunc = (data: any) => {
    if (!data.booked || !Array.isArray(data.booked)) {
      throw new Error("Invalid data structure for booked dates");
    }

    const formattedDates = data.booked.map((date: string) => {
      if (!date) {
        console.error("Invalid date found in booked dates:", date);
        return "Invalid date"; // Handle the invalid date case as needed
      }

      const formattedDate = date.split("T");
      return `${formattedDate[0]} ${formattedDate[1]?.slice(0, 8)}`; // Slice to get only HH:mm:ss
    });

    return formattedDates;
  };

  // Retrieve the doctor data from the query parameters
  useEffect(() => {
    const doctorParam = searchParams.get("doctorBooking");

    if (doctorParam) {
      try {
        const parsedDoctor = JSON.parse(decodeURIComponent(doctorParam));
        setDoctor(parsedDoctor);
      } catch (error) {
        console.error("Error parsing doctor parameter:", error);
      }
    }
  }, [searchParams]);

  // Fetch doctor availability
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    const fetchDoctorAvailability = async () => {
      if (doctor?.id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_NAME}/patient/appointment/Availabilities/${doctor.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (!response.ok) throw new Error("Failed to fetch availability");

          const data = await response.json();

          if (!data || typeof data !== "object" || !data.available_slots) {
            setAvailableDates([]);
            throw new Error("Invalid data structure");
          }
          console.log("data: ", data);

          const formattedDates = formatDoctorAvailabilities(
            data.available_slots,
          );

          setAvailableDates(formattedDates);
          setBookedDates(formattedDatesFunc(data));
          console.log("bookedAppointments: ", bookedDates);
        } catch (error) {
          console.error("Error fetching availability:", error);
        }
      }
    };
    // Generate staticAvailableSlots in the expected format
    const staticAvailableSlots = Array.from({ length: 20 }, (_, index) => {
      const date = new Date(Date.now() + index * 24 * 60 * 60 * 1000);
      const dayCode = Object.keys(dayCodes).find(
        (key) =>
          dayCodes[key] ===
          date.toLocaleDateString("en-US", { weekday: "long" }),
      );

      return Array.from({ length: 5 }, (_, slotIndex) => {
        const timeCode = String(slotIndex + 1).padStart(2, "0");
        const typeCode = "L"; // Static for now; adjust as needed
        return `${dayCode}_${timeCode}_${typeCode}`;
      }).join(",");
    }).join(",");
    const formattedDates = formatDoctorAvailabilities(staticAvailableSlots);

    setAvailableDates(formattedDates);
    setBookedDates(formattedDatesFunc({ booked: [] }));
    console.log("bookedAppointments: ", bookedDates);

    if (doctor) fetchDoctorAvailability();
  }, [doctor]);

  // Fetch patient appointments
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/patient/appointment/appointmentsHistory`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((response) => setAppointments(response?.appointments || []));
  }, [appointmentState]);

  const handleDurationChange = (duration: number) =>
    setSelectedDuration(duration);

  const handleDateSelect = (dateObj: {
    date: string;
    slots: { time: string; type: string }[];
  }) => {
    setSelectedSlot("");
    setSelectedDate(dateObj);
  };

  const handleSlotSelect = (slot: { time: string; type: string }) => {
    setSelectedSlot(slot.time);
    setSelectedType(slot.type);
  };

  if (!doctor || !searchParams || !searchParams.get("doctorBooking")) {
    return <CircularProgress className="absolute top-1/2 left-1/2" />;
  }

  return (
    <div className="flex flex-col md:flex-row items-center md:justify-center p-6 bg-gray-50 gap-4 mx-auto max-w-[1200px]">
      <div className="flex flex-col p-6 bg-gray-50 gap-5 min-w-[350px] md:min-w-[450px] md:h-[500px]">
        <DoctorInfo doctor={doctor} />
        <DetailsSelector
          selectedDuration={selectedDuration}
          handleDurationChange={handleDurationChange}
          appointmentState={appointmentState}
          setAppointmentState={setAppointmentState}
          appointments={appointments}
        />
        <BookingSummary
          selectedSlot={selectedSlot}
          selectedDuration={selectedDuration}
          selectedType={selectedType}
          doctor={doctor}
          selectedDate={selectedDate}
          appointmentState={appointmentState}
        />
      </div>

      <div className="flex gap-8 flex-col bg-white rounded-3xl shadow-md p-6 min-w-[350px] lg:min-w-[650px] lg:h-[450px]">
        <WeekCalendar
          selectedDate={selectedDate}
          handleDateSelect={handleDateSelect}
          availableDates={availableDates}
          bookedDates={bookedDates}
        />
        <SlotSelector
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          handleSlotSelect={handleSlotSelect}
          availableDates={availableDates}
        />
      </div>
    </div>
  );
};

export default DoctorBooking;
