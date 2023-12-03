"use client";
import React from "react";
import { useState, useEffect } from "react";
import api from "@/api";
import { Toaster, toast } from "react-hot-toast";

export default function Pricing() {
  const array = [1];
  const [data, setData] = useState();
  useEffect(() => {
    const fetchdata = async () => {
      const response = await api.get("/subscribe/prices");
      //   console.log(response?.data?.data);
      setData(response?.data?.data);
    };
    fetchdata();
  }, []);
  // console.log(data);

  const createSession = async (id) => {
    try {
      const response = await api.post("/subscribe/session", {
        priceId: id,
      });
      // console.log(response);

      window.location.href = response?.data?.url;
    } catch (error) {
      console.log(error?.response?.data);
      toast((t) => (
        <div className="flex justify-center items-center gap-5 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
            />
          </svg>
          {error?.response?.data?.message}{" "}
          <button className="bg-blue-600 text-white font- px-4 py-2 rounded-lg" onClick={() => toast.dismiss(t.id)}>Dismiss</button>
        </div>
      ));
    }
  };

  return (
    <div className="mx-20 mt-10 max-sm:mx-4">
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="text-4xl capitalize font-bold text-center">
        Choose your plan today{" "}
      </h1>
      <div className="grid grid-cols-3 place-items-center mt-20 max-sm:grid-cols-1 gap-10">
        {/* pricing card */}
        {data?.map((data, index) => (
          <div
            key={index}
            className="bg-white shadow p-8 rounded-xl  w-[100%] "
          >
            <div
              className={`relative populartag bottom-[3rem] bg-red-300 py-3 text-white uppercase font-semibold ${
                index === 1 ? "block" : "hidden"
              }  rounded-full text-center w-50 flex items-center justify-center`}
            >
              {" "}
              popular{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
                />
              </svg>
            </div>
            <p className="text-center font-bold text-xl">{data?.nickname}</p>
            <hr />
            <h1 className="text-center font-bold text-4xl my-5">
              ${data?.unit_amount / 100}
            </h1>
            <h1 className="text-center font-bold text-xl my-5">
              /{data?.recurring?.interval}
            </h1>
            <p className="text-center">
              Level-up with more power and enhanced features
            </p>
            <button
              onClick={() => createSession(data?.id)}
              className="bg-blue-500 text-white font-bold capitalize w-[240px] px-4 py-3 rounded-3xl m-auto block mt-10"
            >
              get now
            </button>
            <hr className="mt-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
