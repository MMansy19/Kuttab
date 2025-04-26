import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { formatDate } from "../../utils/date";
interface FollowUpAppointmentsProps {
  appointments: any[];
  selectedAppointment: any;
  setSelectedAppointment: (appointment: any) => void;
  setAppointmentState: (state: string) => void;
  appointmentState: string;
}
const FollowUpAppointments: React.FC<FollowUpAppointmentsProps> = ({
  appointments,
  selectedAppointment,
  setSelectedAppointment,
  setAppointmentState,
  appointmentState,
}) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleAppointmentSelect = (appointment: any) => {
    setSelectedAppointment(appointment);
  };

  const handleFollowUpClick = () => {
    setShowDialog(true);
  };

  const handleSaveAppointment = () => {
    // console.log("Selected appointment saved:", selectedAppointment);
    // console.log("appointmentState:", appointmentState);
    setShowDialog(false);
  };

  return (
    <div>
      <label className="flex items-center">
        <input
          type="radio"
          name="type"
          value="Follow_up"
          checked={appointmentState === "Follow_up"}
          onChange={() => {
            setAppointmentState(
              appointments && appointments.length > 0
                ? "Follow_up"
                : "First_time",
            );
            handleFollowUpClick();
          }}
        />
        <span className="ml-2">Follow up</span>
      </label>

      <Dialog
        className="bg-opacity-100 bg-gray-50 rounded-lg shadow-2xl"
        style={{
          width: "90vw",
          minHeight: "200px",
          maxWidth: "600px",
          padding: "1rem",
          zIndex: 1000,
        }}
        header={
          appointments && appointments.length > 0
            ? "Select Appointment for Follow Up"
            : ""
        }
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        footer={
          <div className="flex justify-between">
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold disabled:opacity-50"
              onClick={handleSaveAppointment}
              disabled={!selectedAppointment}
            >
              Save
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold disabled:opacity-50"
              onClick={handleSaveAppointment}
            >
              back
            </button>
          </div>
        }
      >
        <ul className="p-0">
          {Array.isArray(appointments) && appointments.length > 0 ? (
            appointments.map((appointment) => (
              <li key={appointment.appointment_id} className="mb-3">
                <Card
                  title={`Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p>
                        <strong>Specialization:</strong>{" "}
                        {appointment.doctor_specialization}
                      </p>
                      <p>
                        <strong>Appointment Type:</strong>{" "}
                        {appointment.appointment_type}
                      </p>
                      <p>
                        <strong>Date & Time:</strong>{" "}
                        {formatDate(appointment.doctor_availability_day_hour)}
                      </p>
                      <p>
                        <strong>Duration:</strong>{" "}
                        {appointment?.appointment_duration} min
                      </p>
                    </div>
                    <button
                      className={
                        selectedAppointment?.appointment_id ===
                        appointment.appointment_id
                          ? "bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold"
                          : "bg-blue-400 text-white py-2 px-4 rounded-lg font-semibold"
                      }
                      onClick={() => handleAppointmentSelect(appointment)}
                    >
                      Select
                    </button>
                  </div>
                </Card>
              </li>
            ))
          ) : (
            <p className="mx-auto  text-red-500 text-center mt-6 text-xs md:text-base italic">
              No appointments found
            </p>
          )}
        </ul>
      </Dialog>
    </div>
  );
};

export default FollowUpAppointments;
