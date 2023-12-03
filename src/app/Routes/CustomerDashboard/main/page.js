"use client";
import React from "react";
import Sidebar from "../sidebar/page";
import Link from "next/link";
import { useDataContext } from "@/Contextapi";
import { CiWavePulse1, CiCoinInsert, CiBoxes } from "react-icons/ci";

export default function page() {
  const {data} = useDataContext();

  return (
    <div className="mt-10 max-sm:mt-0">
      <div className="grid grid-cols-5 gap-10 max-sm:grid-cols-1">
        <div className="col-span-1">
          <Sidebar />
        </div>
        <div className="col-span-4 max-sm:col-span-1">
          <div className="  rounded-sm">
            <div className="flex gap-5 flex-wrap mt-5">
              <div className="flex bg-white p-4 justify-between rounded-md gap-5 w-80">
                <div className="">
                  <p className="font-semibold text-gray-500 capitalize">
                    Total orders
                  </p>
                  <p className="font-semibold text-xl text-gray-700">
                    {data?.Bookings?.length}
                  </p>
                  <p className="text-[12px] mt-5 text-gray-800 ">
                    your total completed orders
                  </p>
                </div>
                <div className="border-8 border-blue-400 rounded-full p-5 ">
                  <CiBoxes className="w-10 h-10" />
                </div>
              </div>
              <div className="flex bg-white p-4 justify-between rounded-md gap-5 w-80">
                <div className="">
                  <p className="font-semibold text-gray-500 capitalize">
                    Total spend
                  </p>
                  <p className="font-semibold text-xl text-gray-700">{}$</p>
                  <p className="text-[12px] mt-5 text-gray-800">
                    total spend on byoc
                  </p>
                </div>
                <div className="border-8 border-green-400 rounded-full p-5 ">
                  <CiCoinInsert className="w-10 h-10" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-10 mx-5 max-sm:grid-cols-1">
            <div className="fle-col gap-5 col-span-1">
              <div className="mt-10">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold">My booking list</h1>
                  <Link
                    href="ActiveBookings"
                    className="underline text-yellow-700"
                  >
                    View all
                  </Link>
                </div>
                {data?.Bookings?.map((data, index) => (
                  <div key={index}>
                    <div className=" bg-white shadow-sm w-96 mt-5 py-4 px-4 rounded-2xl">
                      <div className="border-l-8 border-blue-400 rounded-xl px-7">
                        <p className="font-semibold capitalize flex items-center my-2 gap-2">
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
                              d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                            />
                          </svg>
                          {data?.provider?.StoreName}
                        </p>{" "}
                        <p className="text-sm flex items-center my-2 gap-2">
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
                              d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {data?.TotalPrice}
                        </p>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-sm font-thin flex items-center my-2 gap-2">
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
                                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                                />
                              </svg>

                              {data?.Date}
                            </p>{" "}
                          </div>
                          <div>
                            {data?.status == "pending" ? (
                              <p className="uppercase font-semibold text-[12px] bg-yellow-500 text-white px-2 rounded-lg">
                                pending
                              </p>
                            ) : data?.status == "complete" ? (
                              <p className="uppercase font-semibold text-[12px] bg-green-400 text-white px-2 rounded-lg">
                                completed
                              </p>
                            ) : data?.status == "cancel" ? (
                              <p className="uppercase font-semibold text-[12px] bg-red-500 text-white px-2 rounded-lg">
                                canceled
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
