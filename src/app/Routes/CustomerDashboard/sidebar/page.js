"use client";
import React from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { HiLogout } from "react-icons/hi";
import { useEffect } from "react";
import {
  AiFillAppstore,
  AiFillBell,
  AiOutlineHistory,
  AiFillRead,
  AiFillSnippets,
  AiFillSmile,
  AiFillShop,
} from "react-icons/ai";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import jwtDecode from "jwt-decode";
import { useDataContext } from "@/Contextapi";

export default function page() {
  const router = useRouter();
  const Logout = () => {
    Cookies.remove("token");
    router.refresh();
  };
  const {data} = useDataContext();
  const [name, setName] = useState("");

  useEffect(() => {
    const Token = Cookies.get("token");
    if (Token) {
      const decoded = jwtDecode(Token);
      setName(decoded?.name);
    } else {
      router.push("/Routes/CustomerLogin");
    }
  });
  return (
    <div>
      <div>2</div>
      <>
        <aside
          id="default-sidebar"
          className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div className="h-screen py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 shadow-sm">
            <ul className="space-y-2 font-medium px-6">
              <button className=" text-gray-800 w-full py-3 rounded-2xl flex items-center gap-2">
                <UserOutlined /> {name}
              </button>
              <hr />
                <Link
                  href="main"
                  className="flex mt-10 items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-300   group focus:bg-blue-100 "
                >
                  <AiFillAppstore />
                  <span className=" ml-2 text ">Dashboard</span>
                </Link>
              <hr />
                <Link
                  href="/Routes/ServicePage"
                  className="flex items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-300    group focus:bg-blue-100 "
                >
                  <svg
                    xmlns="http://www.w3.org/3000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                    />
                  </svg>

                  <span className=" ml-2 text"> Book now</span>
                </Link>
              <hr />
                <Link
                  href="ActiveBookings"
                  className="flex items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-300    group focus:bg-blue-100 "
                >
                  <AiFillBell />
                  <span className=" ml-2 text ">Active Bookings</span>{" "}
                  <span className="bg-red-400 rounded-sm  p-1 text-sm text-center text-white  ml-2">
                    {
                      data?.Bookings?.filter(
                        (booking) => booking?.status === "pending"
                      ).length
                    }
                  </span>
                </Link>
              <hr />
                <Link
                  href="BookingHistory"
                  className="flex items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-300    group focus:bg-blue-100 "
                >
                  <AiOutlineHistory />
                  <span className=" ml-2 text"> Booking History</span>
                </Link>
              <hr />

                <Link
                  href="settings"
                  className="flex items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-300    group focus:bg-blue-100 "
                >
                  <svg
                    xmlns="http://www.w3.org/3000/svg"
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

                  <span className=" ml-2 text"> Settings </span>
                </Link>
              <hr />

                <Link
                  href="/"
                  onClick={Logout}
                  className="flex items-center gap-3 p-2 text-gray-700 rounded-lg  hover:bg-blue-100   group focus:bg-blue-100 "
                >
                  <svg
                    xmlns="http://www.w3.org/3000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-red-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-500"> Sign out</span>
                </Link>
            </ul>
          </div>
        </aside>
      </>
    </div>
  );
}
