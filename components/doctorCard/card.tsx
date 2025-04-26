import React, { useState, useMemo } from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import RatingComp from "@/components/common/RatingComp";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoMdAlarm } from "react-icons/io";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { formatDateString } from "@/utils/date";
import BookingButton from "./BookingButton";
import styles from "./card.module.css";
import type { Doctor } from "@/types";

interface DoctorInterestsProps {
  interests: string[];
}

const DoctorInterests: React.FC<DoctorInterestsProps> = ({ interests }) => (
  <div className="flex flex-col space-y-2">
    <div className="text-sm">Interests:</div>
    <div className="flex flex-wrap gap-2">
      {interests.map((interest) => (
        <span
          key={interest}
          className={`${styles.text_control} text-xs text-center text-[#60A899] bg-[#6CCA871A] px-2 py-1 rounded-full`}
        >
          {interest}
        </span>
      ))}
    </div>
  </div>
);

interface DoctorAvailabilityProps {
  date: string;
}

const DoctorAvailability: React.FC<DoctorAvailabilityProps> = ({ date }) =>
  date && (
    <div className="flex justify-between items-center space-x-2">
      <IoMdAlarm className="h-6 w-6 text-[#035fe9]" />
      <div className="grow text-xs md:text-sm">
        Next available: {formatDateString(date)}
        {/* Next available: {date} */}
      </div>
    </div>
  );

interface DoctorFeesProps {
  fees60min: number;
  fees30min: number;
}

const DoctorFees: React.FC<DoctorFeesProps> = ({ fees60min, fees30min }) => (
  <div className="flex justify-between items-center space-x-2">
    <FaMoneyBill1Wave className="h-6 w-6 text-[#035fe9]" />
    <div className="text-xs md:text-md grow">
      <span className="text-[#035fe9]">{fees60min} EGP</span>/ 60 min
      <span className="text-[#035fe9]">{fees30min} EGP</span> / 30 min
    </div>
  </div>
);

// Define the type for the doctor prop

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const [doctorRating, setDoctorRating] = useState<number | null>(
    doctor.rating || 0,
  );

  // Convert buffer data to base64 image
  const base64Image = useMemo(() => {
    if (!doctor.image) return null;
    const binary = String.fromCharCode(...doctor.image.data);
    return `data:image/jpeg;base64,${window.btoa(binary)}`;
  }, [doctor.image]);

  return (
    <div className="bg-white rounded-3xl p-4 flex flex-col space-y-8 hover:scale-105 transition shadow-lg max-w-96 min-w-72 md:mx-2 mx-auto">
      <div className="flex flex-col space-y-4 md:space-y-0 items-center md:items-start md:flex-row space-x-2">
        <div>
          {base64Image ? (
            <img
              className="w-20 h-20 rounded-full object-cover"
              src={base64Image}
              alt="Doctor"
            />
          ) : (
            <FaUserCircle className="h-20 w-20 text-[#035fe9]" />
          )}
        </div>
        <div className="flex flex-col space-y-2 grow">
          <h2 className="text-xs md:text-sm">{doctor.name}</h2>
          <div className="flex justify-between items-center">
            <p className="text-[#035fe9] text-xs md:text-sm">{doctor.title}</p>
            <p className="text-[#035fe9] text-xs md:text-sm flex items-center">
              <HiOutlineUserGroup className="h-6 w-6 mr-2" />
              {doctor.numSessions} Sessions
            </p>
          </div>
          <div className="flex justify-between items-center">
            <Stack spacing={1}>
              {doctorRating ? (
                <Rating
                  name="doctor-rating"
                  value={doctorRating}
                  precision={0.01}
                  readOnly
                />
              ) : (
                <RatingComp
                  text="Review"
                  variant="text"
                  doctor={doctor}
                  setDoctorRating={setDoctorRating}
                />
              )}
            </Stack>
            <p className="text-[#343a40] text-xs">
              {doctorRating && doctorRating > 0
                ? `${doctorRating} (${doctor.numReviews} Reviews)`
                : "No Reviews"}
            </p>
          </div>
        </div>
      </div>
      {doctor.interests && <DoctorInterests interests={doctor.interests} />}
      {doctor.nearestApp && <DoctorAvailability date={doctor.nearestApp} />}
      <DoctorFees fees60min={doctor.fees60min} fees30min={doctor.fees30min} />
      <div className="flex justify-center space-x-12">
        <button className="text-xs md:text-md text-[#60A899] hover:text-[#4b8377] py-1 px-1 md:px-0 md:py-2 rounded-xl w-full hover:scale-110 transition">
          View Profile
        </button>
        <BookingButton doctor={doctor} />
      </div>
    </div>
  );
};

export default React.memo(DoctorCard);
