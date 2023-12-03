"use client";
import React from "react";

import { AiOutlineMessage } from "react-icons/ai";
import { FiBell, FiMail, FiX, FiPackage, FiCreditCard } from "react-icons/fi";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { useState } from "react";
import { useDataContext } from "@/Contextapi";

export default function navbar() {
  const [openChat, setOpenChat] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const handleNotificationClick = () => {
    setOpenNotification(!openNotification);
    setOpenChat(false);
  };

  const handleChatClick = () => {
    setOpenChat(!openChat);
    setOpenNotification(false);
  };
  const { data, setOpen, open } = useDataContext();

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">Dashboard</p>
          <p className="text-sm">Hello welcome </p>
        </div>
        <div className="flex gap-5">
          <button onClick={handleNotificationClick}>
            <FiBell className="w-6 h-6" />
          </button>
          <button onClick={handleChatClick}>
            <AiOutlineMessage className="w-6 h-6" />
          </button>
          <button
            className="hidden max-sm:block"
            onClick={() => setOpen(!open)}
          >
            {open ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
                  d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div>
        {/* message bar  */}
        <div
          className={`bg-white w-80 h-96 rounded-lg shadow-sm fixed  right-10 ${
            openChat ? "" : "hidden"
          }`}
        >
          <div className=" h-10 border-1 flex justify-between items-center mx-2">
            <p className=" text-lg">Messages</p>
            <button
              onClick={handleChatClick}
              className="hover:bg-gray-100 duration-100 p-2 "
            >
              <FiX />
            </button>
          </div>
          <hr />
          <div className="">
            <Input
              prefix={<SearchOutlined />}
              className="w-80 mt-1  rounded-full "
              placeholder="Search conversation"
            />
          </div>
          <div className="">
            {/* sms toltip */}
            <div className="grid grid-cols-4 gap-2 m-2 h-20 w-65 overflow-hidden">
              <div className="w-20 col-span-1">
                {/* <Image
                  src={Me}
                  height={100}
                  width={100}
                  className="rounded-full w-20 h-20"
                /> */}
              </div>
              <div className="col-span-3">
                <div className="flex justify-between ">
                  <p className="text-sm font-semibold text-gray-600">Imtiaz</p>{" "}
                  <div className="flex gap-2 items-center ">
                    <p className="text-gray-700 text-sm">02/17</p>
                    <p className="bg-blue-500 text-white rounded-full px-1 text-[10px]">
                      2
                    </p>
                  </div>
                </div>
                <p className="text-[13px] overflow-hidden h-10 ">
                  Hello how are you how can I help you today Hello how are you
                  how can I help you today Hello how are you how can I help you
                  today Hello how are you how can I help you todayHello how are
                  you how can I help you today
                </p>
              </div>
            </div>
            <hr />
            <button className="right-0 left-0 absolute bottom-0 p-2 bg-blue-400 rounded-full text-white mx-20 m-5 text-sm">
              View all messages
            </button>
            {/* sms toltip */}
          </div>
        </div>
        {/* Notification bar  */}
        <div
          className={`bg-white w-80 h-96 rounded-lg shadow-sm fixed  right-10 overflow-scroll ${
            openNotification ? "" : "hidden"
          }`}
        >
          <div className=" h-10 border-1 flex justify-between items-center mx-2">
            <p className=" text-lg">Notifications</p>
            <button
              onClick={handleNotificationClick}
              className="hover:bg-gray-100 duration-100 p-2 "
            >
              <FiX />
            </button>
          </div>
          <hr />

          <div className="">
            {/* sms toltip */}
            <div className="grid grid-cols-4 gap-2 m-2 h-20 w-65 overflow-hidden">
              <div className=" rounded-full col-span-1 flex items-center">
                <FiBell className="m-auto w-6 h-6" />
              </div>
              <div className="col-span-3">
                <div className="flex justify-between ">
                  <p className="text-gray-700 text-sm font-[500]">02/17</p>
                </div>
                <p className="text-[13px] overflow-hidden h-10 ">
                  Hello how are you how can I help you today Hello how are you
                  how can I help you today Hello how are you how can I help you
                  today Hello how are you how can I help you todayHello how are
                  you how can I help you today
                </p>
              </div>
            </div>
            <hr />
            {/* sms toltip */}
          </div>
        </div>
      </div>
    </div>
  );
}
