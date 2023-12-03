"use client";
import React from "react";
import Sidebar from "../sidebar/page";
import Link from "next/link";
import { AiOutlineMessage } from "react-icons/ai";
import { FiBell, FiMail, FiX, FiPackage, FiCreditCard } from "react-icons/fi";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import Me from "/public/me.jpg";
import { useState } from "react";
import { CiWavePulse1, CiCoinInsert, CiBoxes } from "react-icons/ci";
import BusinessHours from "../BusinessHours/page";
import { HiArrowCircleUp, HiOutlineCurrencyDollar } from "react-icons/hi";
import Navbar from "../navbar";
import { useDataContext } from "@/Contextapi";
import api from "@/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Crown from "./crown.png";

export default function page() {
  const { data, open } = useDataContext();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("subscribe/subscriptions");
        setPaymentData(response?.data?.subscriptions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const subscriptionEndDate = new Date(
    paymentData?.data[0]?.current_period_end * 1000
  ).toLocaleString();

  return (
    <div className="mt-10 max-sm:mt-0">
      <div className="grid grid-cols-5 max-sm gap-10 max-sm:grid-cols-1">
        <div
          className={`col-span-1 ${
            open
              ? "translate-x-[15rem] duration-500"
              : "translate-x-0 duration-500"
          }  `}
        >
          <Sidebar />
        </div>
        <div className="col-span-4 mx-10">
          {/* navbar  */}
          <Navbar />
          {/* drop downs  */}

          {/* 3 bars  */}
          <div className="flex justify-between flex-wrap mt-5">
            <div className="flex bg-white p-4 justify-between rounded-md gap-5 w-80 max-sm:w-full my-2">
              <div className="">
                <p className="font-semibold text-gray-500 capitalize">
                  Total visitors
                </p>
                <p className="font-semibold text-xl text-gray-700">00</p>
                <p className="text-[12px] mt-5 text-gray-800">
                  Real time visitors in your store
                </p>
              </div>
              <div className="border-8 border-yellow-300 rounded-full p-5 ">
                <CiWavePulse1 className="w-10 h-10" />
              </div>
            </div>
            <div className="flex bg-white p-4 justify-between rounded-md gap-5 w-80 max-sm:w-full my-2">
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
            <div className="flex bg-white p-4 justify-between rounded-md gap-5 w-80 max-sm:w-full my-2">
              <div className="">
                <p className="font-semibold text-gray-500 capitalize">
                  Total earnings
                </p>
                <p className="font-semibold text-xl text-gray-700">0.00$</p>
                <p className="text-[12px] mt-5 text-gray-800">
                  total earnings from byoc
                </p>
              </div>
              <div className="border-8 border-green-400 rounded-full p-5 ">
                <CiCoinInsert className="w-10 h-10" />
              </div>
            </div>
          </div>
          {/* second part  */}
          <div className="grid grid-cols-3 mt-5 gap-2 max-sm:grid-cols-1">
            {/* business hours  */}
            <div className="col-span-2 max-sm:col-span-1">
              <BusinessHours />
            </div>
            {data?.Subscribed ? (
              <div className="">
                <div className="p-4 mb-2 rounded-lg bg-white flex justify-between items-center">
                  <div>
                    <h1 className=" text-sm w-fit capitalize">
                      <span className="bg-black p-1  rounded-sm text-white">
                        {" "}
                        {paymentData?.data[0]?.plan?.nickname}
                      </span>{" "}
                    </h1>
                    <p className="font-semibold text-gray-700 mt-2 flex items-center gap-2">
                      <HiOutlineCurrencyDollar /> ${" "}
                      {paymentData?.data[0]?.plan?.amount / 100}
                    </p>
                    <p className="text-sm text-gray-800">
                      Expire in {subscriptionEndDate}
                    </p>
                  </div>
                  <div className="border-8 border-black rounded-full p-5">
                    <FiPackage className="w-10 h-10" />
                  </div>
                </div>
                <div className="p-4 my-2 rounded-lg bg-white flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-800">Next payment</p>
                    <h1 className="font-[600] my-2">
                      ON {subscriptionEndDate}
                    </h1>
                    <button
                      onClick={() => router.push("/Components/Pricing")}
                      className="outline outline-blue-400 p-2 rounded-sm text-blue-400 mt-5"
                    >
                      Manage payment
                    </button>
                  </div>
                  <div className="border-8 border-blue-600 rounded-full p-5">
                    <FiCreditCard className="w-10 h-10 text-blue-400" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 h-fit">
                <Image src={Crown} alt="Crown" className="w-16 h-16 m-auto" />
                <p className="font-bold text-center text-gray-600">
                  Upgrade now{" "}
                </p>
                <hr />
                <p className="text-sm text-center mt-5 text-gray-400">
                  Book your oil change is a premium service, and access to this
                  feature requires a subscription. To enjoy the benefits of
                  hassle-free oil changes and ensure the smooth operation of
                  your vehicle, kindly purchase a subscription.
                </p>
                <button onClick={()=> router.push("/Components/Pricing")} className="m-auto flex items-center gap-3 mt-4 text-white font-medium bg-blue-500 px-6 py-2 rounded-lg">
                  See plans{" "}
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
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
