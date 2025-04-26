import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import type { Doctor } from "@/types";
import RatingComp from "@/components/common/RatingComp";
const DoctorInfo = ({ doctor }: { doctor: Doctor }) => {
  const userImage = <FaUserCircle className="h-10 w-10 text-[#035fe9]" />;
  const [doctorRating, setDoctorRating] = useState<number | null>(
    doctor.rating || 0,
  );

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 w-full">
      <div className="flex flex-row gap-10 items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          {userImage}
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">{doctor.name}</h2>
            <p className="text-base text-blue-500">{doctor.title}</p>
          </div>
        </div>
        <div className="flex items-center flex-col gap-2">
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
  );
};

export default DoctorInfo;
