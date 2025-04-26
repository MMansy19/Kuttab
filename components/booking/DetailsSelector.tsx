import React, { useState } from "react";
import FollowUpAppointments from "./FollowUpAppointments";
interface DetailsSelectorProps {
  selectedDuration: number;
  handleDurationChange: (duration: number) => void;
  appointmentState: string;
  setAppointmentState: (state: string) => void;
  appointments: any[]; // Add appointments as a prop
}

const DetailsSelector: React.FC<DetailsSelectorProps> = ({
  selectedDuration,
  handleDurationChange,
  appointmentState,
  setAppointmentState,
  appointments,
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 w-full">
      <h3 className="text-xl font-semibold mb-4">Select session details:</h3>

      <div className="flex flex-row items-center gap-6">
        <div className="flex flex-col items-center">
          <label className="flex items-center">
            <input
              type="radio"
              name="duration"
              value={60}
              checked={selectedDuration === 60}
              onChange={() => handleDurationChange(60)}
            />
            <span className="ml-2">60 Min</span>
          </label>
          <label className=" flex items-center">
            <input
              type="radio"
              name="duration"
              value={30}
              checked={selectedDuration === 30}
              onChange={() => handleDurationChange(30)}
            />
            <span className="ml-2">30 Min</span>
          </label>
        </div>
        <div className="flex items-center flex-col">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="First_time"
              checked={appointmentState === "First_time"}
              onChange={() => setAppointmentState("First_time")}
            />
            <span className="ml-2">First time</span>
          </label>
          <FollowUpAppointments
            appointments={appointments}
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
            setAppointmentState={setAppointmentState}
            appointmentState={appointmentState}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailsSelector;
