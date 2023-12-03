"use client";
import React from "react";
import { CiAlarmOn } from "react-icons/ci";
import { useState, useEffect } from "react";
// import TimezoneSelect from "react-timezone-select";
import { Toaster, toast } from "react-hot-toast";
import api from "@/api";
import { useDataContext } from "@/Contextapi";

export default function page() {
  // const [selectedTimezone, setSelectedTimezone] = useState(
  //   Intl.DateTimeFormat().resolvedOptions().timeZone
  // );
  const [weekData, setWeekData] = useState([
    { day: "Sunday", from: "", to: "", status: false },
    { day: "Monday", from: "", to: "", status: false },
    { day: "Tuesday", from: "", to: "", status: false },
    { day: "Wednesday", from: "", to: "", status: false },
    { day: "Thursday", from: "", to: "", status: false },
    { day: "Friday", from: "", to: "", status: false },
    { day: "Saturday", from: "", to: "", status: false },
  ]);
  const [update, setUpdate] = useState(false);
  const handleInputChange = (dayIndex, property, value) => {
    setWeekData((prevWeekData) => {
      const updatedWeekData = [...prevWeekData];
      updatedWeekData[dayIndex][property] = value;
      return updatedWeekData;
    });
  };

  const handleCheckboxChange = (dayIndex) => {
    setWeekData((prevWeekData) => {
      const updatedWeekData = [...prevWeekData];
      updatedWeekData[dayIndex].status = !updatedWeekData[dayIndex].status;
      return updatedWeekData;
    });
  };
  const handleFormSubmit = async (e) => {
    try {
      const response = await api.patch(
        "/store/UpdateStore",
        {
          ServiceHours: weekData,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };
  const {data} = useDataContext();
  console.log(data?.ServiceHours?.length)
  useEffect(() => {
    if (data.ServiceHours?.length > 0) {
      setWeekData(data.ServiceHours);
    }
  }, [data]);
  

  return (
    <div className="bg-white p-4 rounded-lg">
      <Toaster />
      <div className="flex items-center gap-2">
        <CiAlarmOn className="w-7 h-7" />
        <div>
          <h1 className=" font-[400]">Business hours</h1>
          <p className="text-sm text-gray-500">
            Control your business hour or your service hours
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-10 justify-between">
        <div>
          <button
            onClick={() => {
              setUpdate(false)
              handleFormSubmit();
              toast.success("Open hour updated");
            }}
            className={` text-white px-6 py-1 rounded-sm flex items-center gap-2${
              update ? "opacity-100 bg-blue-400" : "opacity-25 bg-gray-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
            save
          </button>
        </div>
        
      </div>

      {/* business hour controls */}

      {weekData?.map((dayData, index) => (
        <div className="grid grid-cols-3 max-sm:place-items-start mt-6 max-sm:grid-cols-1">
          <div className="flex items-center gap-2 my-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dayData.status}
                onChange={() => {
                  setUpdate(true);
                  handleCheckboxChange(index);
                  handleFormSubmit();
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 rounded-full peer bg-gray-400 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-100 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-400" />
            </label>
            <button className="capitalize">{dayData.day}</button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm w-10">From</span>{" "}
            <input
              className="outline-none text-sm border rounded-sm px-2 w-40"
              value={dayData.from}
              onChange={(e) => {
                setUpdate(true);
                handleInputChange(index, "from", e.target.value);
                handleFormSubmit();
              }}
            />
          </div>

          <div className="flex items-center gap-2 my-2">
            <span className="text-sm w-10">To</span>{" "}
            <input
              className="outline-none border rounded-sm px-2 w-40"
              value={dayData.to}
              onChange={(e) => {
                setUpdate(true);
                handleInputChange(index, "to", e.target.value);
                handleFormSubmit();
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
