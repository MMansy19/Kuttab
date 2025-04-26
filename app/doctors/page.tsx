"use client";
import React, { useEffect, useState } from "react";
import DoctorGrid from "@/components/DoctorGrid/grid";
import FilterComponent from "@/components/FilterComponent/filter";
import ReadyTherapist from "@/components/ReadyTherapistComp/readyTherapist";
import SearchBar from "@/components/SearchBar/searchbar";
import SortDropDown from "@/components/SortDropDown/sortdropdown";
import CircularProgress from "@mui/material/CircularProgress";
import { IoFilter } from "react-icons/io5";
import { unFormatDate } from "@/utils/date";
import { useDoctorContext } from "@/context/GetDoctorsContext";

const Doctors = () => {
  const { doctors, isLoading, error } = useDoctorContext();
  const [minMaxFees, setMinMaxFees] = useState({ min: 0, max: 1000 });
  const [filteredDoctors, setFilteredDoctors] = useState<any>([]);
  const [filters, setFilters] = useState({
    speciality: "",
    gender: "",
    rating: "",
    price: [],
    todayDate: "",
    thisWeek: "",
    dateRange1: "",
    dateRange2: "",
    country: [],
    language: [],
    sort: "",
    isOnline: "",
  });
  const [specializationOptions, setSpecializationOptions] = useState<any>([]);
  const [countryOptions, setCountryOptions] = useState<any>([]);
  const [languageOptions, setLanguageOptions] = useState<any>([]);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleFillOptions = (doctors: any[]) => {
    let speciality: any[] = [];
    let country: any[] = [];
    let language: any[] = [];

    doctors.forEach((doctor: any) => {
      if (!speciality.some((s) => s.value === doctor.title)) {
        speciality.push({ value: doctor.title, label: doctor.title });
      }
      if (!country.some((c) => c.value === doctor.country)) {
        country.push({ value: doctor.country, label: doctor.country });
      }
      doctor.language.forEach((lang: string) => {
        if (!language.some((l) => l.value === lang)) {
          language.push({ value: lang, label: lang });
        }
      });
    });

    setSpecializationOptions(speciality);
    setCountryOptions(country);
    setLanguageOptions(language);
  };

  const handleShownDoctors = (filters: any) => {
    let filtered = [...doctors];

    // Apply various filters to the doctors list
    if (filters.todayDate) {
      const today = unFormatDate(filters.todayDate);
      filtered = filtered.filter(
        (doctor: any) =>
          unFormatDate(doctor.nearestApp).getFullYear() ===
            today.getFullYear() &&
          unFormatDate(doctor.nearestApp).getMonth() === today.getMonth() &&
          unFormatDate(doctor.nearestApp).getDate() === today.getDate(),
      );
    }

    if (filters.thisWeek) {
      const [startDate, endDate] = filters.thisWeek;
      filtered = filtered.filter(
        (doctor: any) =>
          unFormatDate(doctor.nearestApp) >= unFormatDate(startDate) &&
          unFormatDate(doctor.nearestApp) <= unFormatDate(endDate),
      );
    }

    if (filters.isOnline) {
      filtered = filtered.filter(
        (doctor: any) => doctor.isOnline === filters.isOnline,
      );
    }

    if (filters.speciality.length > 0) {
      filtered = filtered.filter((doctor: any) =>
        filters.speciality.includes(doctor.title),
      );
    }

    if (filters.gender) {
      filtered = filtered.filter(
        (doctor: any) => doctor.gender === filters.gender,
      );
    }

    if (filters.rating) {
      const ratingValue = parseFloat(filters.rating);
      if (!isNaN(ratingValue)) {
        filtered = filtered.filter(
          (doctor: any) => doctor.rating >= ratingValue,
        );
      }
    }

    if (filters.price.length > 0) {
      if (!isNaN(filters.price[0]) && !isNaN(filters.price[1])) {
        filtered = filtered.filter(
          (doctor: any) =>
            doctor.fees60min >= filters.price[0] &&
            doctor.fees60min <= filters.price[1],
        );
      }
    }

    if (filters.country.length > 0) {
      filtered = filtered.filter((doctor: any) =>
        filters.country.includes(doctor.country),
      );
    }

    if (filters.language.length > 0) {
      filtered = filtered.filter((doctor: any) =>
        doctor.language.some((lang: string) => filters.language.includes(lang)),
      );
    }

    if (filters.sort) {
      switch (filters.sort) {
        case "ascFees":
          filtered = filtered.sort(
            (a: any, b: any) => a.fees60min - b.fees60min,
          );
          break;
        case "descFees":
          filtered = filtered.sort(
            (a: any, b: any) => b.fees60min - a.fees60min,
          );
          break;
        case "rating":
          filtered = filtered.sort((a: any, b: any) => b.rating - a.rating);
          break;
        default:
          break;
      }
    }

    setFilteredDoctors(filtered);
  };

  const handleResetFilters = () => {
    setFilters({
      speciality: "",
      gender: "",
      rating: "",
      price: [],
      todayDate: "",
      thisWeek: "",
      dateRange1: "",
      dateRange2: "",
      country: [],
      language: [],
      sort: "",
      isOnline: "",
    });
  };

  const handleChangeFilterDrop = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption
      ? Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : selectedOption.value
      : [];
    setFilters({ ...filters, [name]: value });
  };

  const handleChangeOptions = (e: any) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    if (doctors.length > 0) {
      handleFillOptions(doctors);
      handleShownDoctors(filters);
    }
  }, [doctors, filters]);

  useEffect(() => {
    if (doctors.length > 0) {
      const min = Math.min(...doctors.map((doctor: any) => doctor.fees60min));
      const max = Math.max(...doctors.map((doctor: any) => doctor.fees60min));
      setMinMaxFees({ min, max });
    }
  }, [doctors]);

  if (isLoading)
    return <CircularProgress className="absolute top-1/2 left-1/2" />;

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <main className="space-y-12 mb-4">
      <ReadyTherapist />
      <h1 className="text-[#035fe9] font-bold text-[40px] text-center">
        Our Doctors
      </h1>
      <section className="max-w-full md:max-w-[90%] lg:max-w-[85%] xl:max-w-[75%] mx-auto grid grid-cols-2 lg:grid-cols-3 gap-4 h-lvh">
        <SearchBar placeholder="Doctor name or title" />
        <SortDropDown
          handleChangeFilter={handleChangeFilterDrop}
          options={[
            { value: "ascFees", label: "Fees Low to High" },
            { value: "descFees", label: "Fees High to Low" },
            { value: "rating", label: "Top Rated" },
            { value: "reset", label: "Reset" },
          ]}
          name="sort"
          id="sort"
          isMulti={false}
        />
        <div className="lg:hidden ml-4 text-[#035fe9]">
          <button onClick={handleOpenModal} className="flex items-center">
            Filters <IoFilter className="w-4 h-4 ml-2" />
          </button>
        </div>
        <FilterComponent
          specializationOptions={specializationOptions}
          countryOptions={countryOptions}
          languageOptions={languageOptions}
          minFees={minMaxFees.min}
          maxFees={minMaxFees.max}
          handleOpenModal={handleOpenModal}
          openModal={openModal}
          handleChangeOptions={handleChangeOptions}
          handleChangeFilterDrop={handleChangeFilterDrop}
          handleResetFilters={handleResetFilters}
        />
        {filteredDoctors.length > 0 ? (
          <DoctorGrid doctors={filteredDoctors} />
        ) : (
          <div className="mx-auto">
            <CircularProgress className=" my-10" />
          </div>
        )}
      </section>
    </main>
  );
};

export default Doctors;
