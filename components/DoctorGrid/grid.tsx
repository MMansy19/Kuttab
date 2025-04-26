import React from "react";
import DoctorCard from "../doctorCard/card";

const DoctorGrid = ({ doctors }: { doctors: any[] }) => {
  let doctorList = doctors.map((doctor) => {
    return <DoctorCard doctor={doctor} key={doctor.id} />;
  });
  return (
    <div className="col-span-2 overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">{doctorList}</div>
    </div>
  );
};

export default DoctorGrid;
