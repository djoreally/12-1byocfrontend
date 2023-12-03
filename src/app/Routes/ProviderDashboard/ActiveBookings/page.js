"use client";
import React from "react";
import { useState } from "react";

import Image from "next/image";
import { useDataContext } from "@/Contextapi";
import { Drawer } from "antd";
import { Accordion } from "flowbite-react";
import Navbar from "../navbar";

export default function page() {
  const {data} = useDataContext();
  const [bookingdata, setBookingdata] = useState();
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const drawerStyle = {
    background: "#eef2f5",
  };


  return (
    <div className="mt-10 mx-20 max-sm:mt-5 max-sm:mx-5">
      <Navbar/>
      <p className="mt-6 text-xl text-gray-900 capitalize font-semibold flex items-center gap-1">
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
        My bookings{" "}
      </p>
      {data?.Bookings?.filter((booking) => booking?.status === "pending") ? (
        <div className="grid grid-cols-3 gap-5 mt-5 max-sm:grid-cols-1 ">
          {data?.Bookings?.filter(
            (booking) => booking?.status === "pending"
          ).map((data, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl grid grid-cols-1  "
            >
              {/* {console.log(data?.user?.image)} */}
              <div className="col-span-1">
                <div className="flex items-center gap-1">
                  <Image
                    src={data?.user?.image}
                    width={100}
                    height={100}
                    className="w-10 h-10 rounded-full"
                  />
                  {}
                  <p className="text-lg capitalize font-semibold text-gray-900">
                    {data?.user?.name}
                  </p>
                </div>
                <p className="flex items-center gap-1 text-sm font-medium my-2">
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
                </p>
                <p className="flex items-center gap-1 text-sm font-medium my-2">
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
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {data?.Time}
                </p>
                <p className="flex items-center gap-1 text-sm font-medium my-2">
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
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  {data?.Location[0]?.city} ,{data?.Location[0]?.postal_code}
                </p>
              </div>
              <div className="col-span-1 flex  justify-between ">
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
                <button
                  onClick={() => {
                    showDrawer(), setBookingdata(data);
                  }}
                  className="m-auto mb-0 mr-0 block capitalize font-medium text-blue-500 px-4 hover:bg-blue-100 duration-200 rounded-sm"
                >
                  full info
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-60 h-60 m-auto block opacity-50"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
            />
          </svg>
          <p className="capitalize font-semibold opacity-60 text-center text-2xl ">
            You have no active bookings
          </p>
        </div>
      )}

      <Drawer
        width={1050}
        height={700}
        placement="bottom"
        closable={false}
        onClose={onClose}
        open={open}
        style={drawerStyle}
      >
        <div className="grid grid-cols-2 mb-5 gap-10 max-sm:grid-cols-1">
          <div className=" bg-white rounded-sm p-4">
            <p className="text-lg flex items-center gap-2 ">
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
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              Location
            </p>
            <hr className="mb-3" />
            <div className="flex justify-between e ">
              <div className="capitalize text-sm text-gray-700 font-medium">
                <p>
                  {" "}
                  <strong className="text-gray-900">postal code : </strong>{" "}
                  {bookingdata?.Location[0]?.postal_code}
                </p>
                <p>
                  {" "}
                  <strong className="text-gray-900">city : </strong>{" "}
                  {bookingdata?.Location[0]?.city}
                </p>
                <p>
                  {" "}
                  <strong className="text-gray-900">state code : </strong>{" "}
                  {bookingdata?.Location[0]?.state_code}
                </p>
                <p>
                  {" "}
                  <strong className="text-gray-900">state : </strong>{" "}
                  {bookingdata?.Location[0]?.state}
                </p>
                <p>
                  {" "}
                  <strong className="text-gray-900">province : </strong>{" "}
                  {bookingdata?.Location[0]?.province}
                </p>
                <p>
                  {" "}
                  <strong className="text-gray-900">
                    province code :{" "}
                  </strong>{" "}
                  {bookingdata?.Location[0]?.province_code}
                </p>
              </div>
              <div className="capitalize text-sm text-gray-700 font-medium">
                <p>
                  {" "}
                  <strong className="text-gray-900">street : </strong>{" "}
                  {bookingdata?.street}
                </p>
                <p>
                  {" "}
                  <strong className="text-gray-900">Apartment : </strong>{" "}
                  {bookingdata?.apt}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between bg-white p-4 rounded-sm max-sm:flex-wrap">
            <div>
              <div className="flex items-center gap-1">
                <Image
                  src={bookingdata?.user?.image}
                  width={100}
                  height={100}
                  className="w-10 h-10 rounded-full"
                />
                <p className="text-lg capitalize font-semibold text-gray-900">
                  {bookingdata?.user?.name}
                </p>
              </div>
              <p className="flex items-center gap-1 text-sm font-medium my-2">
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
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                {bookingdata?.user?.email}
              </p>
              <p className="flex items-center gap-1 text-sm font-medium my-2">
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
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                {bookingdata?.user?.phone}
              </p>
              <p className="flex items-center gap-1 text-sm font-medium my-2">
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
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>

                {bookingdata?.user?.address}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-medium my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Booking date & Time
              </p>
              <hr />
              <p className="flex items-center gap-1 text-sm font-medium my-2">
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
                {bookingdata?.Date}
              </p>
              <p className="flex items-center gap-1 text-sm font-medium my-2">
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {bookingdata?.Time}
              </p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-lg capitalize font-medium p-2 rounded-lg bg-white">
            Vehicles
          </p>
          <div className="  mt-5">
            {bookingdata?.Vehicle?.map((data, index) => (
              <Accordion>
                <Accordion.Panel>
                  <Accordion.Title>
                    <p className="uppercase text-lg flex items-center gap-2">
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
                          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                        />
                      </svg>
                      Vehicle {index + 1}{" "}
                    </p>
                  </Accordion.Title>
                  <Accordion.Content>
                    <div key={index} className=" ">
                      <div className="grid grid-cols-2 gap-10">
                        <div>
                          <p className="font-semibold capitalize mt-2 text-gray-900">
                            year:
                            <span className="font-normal">{data?.Year}</span>
                          </p>
                          <p className="font-semibold capitalize mt-2 text-gray-900">
                            year:
                            <span className="font-normal">{data?.Make}</span>
                          </p>
                          <p className="font-semibold capitalize mt-2 text-gray-900">
                            Model:
                            <span className="font-normal">{data?.Model}</span>
                          </p>
                          <p className="font-semibold capitalize mt-2 text-gray-900">
                            Engine:
                            <span className="font-normal">{data?.Engine}</span>
                          </p>
                          <p className="font-semibold capitalize mt-2 text-gray-900">
                            Oil Life Reset Instructions:
                            <span className="font-normal">
                              {data?.["Oil Life Reset Instructions"]}
                            </span>{" "}
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold capitalize mt-2 text-gray-900">
                            Automatic Transmission Fluid:
                            <span className="font-normal">
                              {data?.["Automatic Transmission Fluid"]}
                            </span>
                          </p>
                          <p className="font-semibold capitalize mt-2 text-gray-900">
                            Transfer Case:
                            <span className="font-normal">
                              {data?.["Transfer Case"]}
                            </span>
                          </p>
                          <p className="font-semibold capitalize mt-2 text-gray-900">
                            Rear Differential:
                            <span className="font-normal">
                              {data?.["Rear Differential"]}
                            </span>
                          </p>
                          <p className="font-semibold capitalize mt-2 text-gray-900">
                            Front Differential:
                            <span className="font-normal">
                              {data?.["Front Differential"]}
                            </span>
                          </p>
                          <p className="font-semibold capitalize mt-2 text-gray-900">
                            Manual Transmission Fluid:
                            <span className="font-normal">
                              {data?.["Manual Transmission Fluid"]}
                            </span>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
            ))}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-6 bg-white my-1 gap-x-6 px-2 p-4 rounded-lg ">
            <div className="col-span-2 flex items-center gap-2  text-gray-600 uppercase  font-bold  rounded-sm px-2">
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
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Items
            </div>
            <div className="col-span-3 flex items-center gap-2  text-gray-600 uppercase  font-bold border-l-4 rounded-sm px-2 border-blue-400">
              Description
            </div>
            <div className="col-span-1 flex items-center gap-2  text-gray-600 uppercase  font-bold border-l-4 rounded-sm px-2 border-blue-400">
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
              Price{" "}
            </div>
          </div>
          {bookingdata?.selectedService?.map((data, index) => (
            <div className="">
              <div className="grid grid-cols-6 bg-white my-5 gap-x-6 px-2 p-4 rounded-lg border-l-8 border-lime-400">
                <div className="col-span-2 flex items-center gap-2 font-medium text-gray-600 ">
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
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {data?.service}
                </div>
                <div className="col-span-3 flex items-center gap-2 font-medium text-gray-600 border-l-2 rounded-sm px-2 border-blue-400">
                  {data?.serviceDescription}
                </div>
                <div className="col-span-1 flex items-center gap-2 font-medium text-gray-600 border-l-2 rounded-sm px-2 border-blue-400">
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
                  {data?.price}$
                </div>
              </div>
            </div>
          ))}
        </div>
        <hr />
        <div className="flex items-center justify-between mr-20 uppercase mt-4">
          <p className="font-bold ">total price</p>
          <p className="font-bold flex items-center">
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
            {bookingdata?.TotalPrice || "00.0"}$
          </p>
        </div>
        <div className="flex items-center justify-between mt-5">
          <button className="uppercase font-semibold text-white bg-green-400 p-2 rounded-sm flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              <path
                fillRule="evenodd"
                d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                clipRule="evenodd"
              />
            </svg>
            reschedule
          </button>
          <button className="uppercase font-semibold text-white bg-red-600 p-2 rounded-sm flex items-center gap-2">
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
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            cancel booking
          </button>
        </div>
      </Drawer>
    </div>
  );
}
