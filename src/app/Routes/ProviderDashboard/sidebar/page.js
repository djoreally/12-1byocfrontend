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
  AiOutlineTeam,
} from "react-icons/ai";
import { FiPackage } from "react-icons/fi"; // Added for Inventory icon
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import jwtDecode from "jwt-decode";
import { useDataContext } from "@/Contextapi";

export default function page() {
  const {data} = useDataContext();
  const router = useRouter();
  const Logout = () => {
    Cookies.remove("token");
    router.refresh();
  };

  const [name, setName] = useState("");

  useEffect(() => {
    const Token = Cookies.get("token");
    if (Token) {
      const decoded = jwtDecode(Token);
      setName(decoded?.name);
    } else {
      router.push("/Routes/CustomerLogin")
    }
  });
  return (
    <div className="bg-gray-100">
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
                className="flex mt-10 items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-200   group focus:bg-blue-100 "
              >
                <AiFillAppstore />
                <span className=" ml-2 text ">Dashboard</span>
              </Link>
              <hr />
              <Link
                href="ActiveBookings"
                className="flex items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-200    group focus:bg-blue-100 "
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
                className="flex items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-200    group focus:bg-blue-100 "
              >
                <AiOutlineHistory />
                <span className=" ml-2 text"> Booking History</span>
              </Link>
              <hr />

              <Link
                href="CreateStore"
                className="flex items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-200    group focus:bg-blue-100 "
              >
                <AiFillShop />
                <span className=" ml-2 text">Your store </span>{" "}
              </Link>
              <hr />
              <Link
                href="Inventory"
                className="flex items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-200    group focus:bg-blue-100 "
              >
                <FiPackage />
                <span className=" ml-2 text">Inventory</span>{" "}
              </Link>
              <hr />
              <Link
                href="Team"
                className="flex items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-200    group focus:bg-blue-100 "
              >
                <AiOutlineTeam />
                <span className=" ml-2 text">Team Management</span>{" "}
              </Link>
              <hr />
              <Link
                href="Clients"
                className="flex items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-200    group focus:bg-blue-100 "
              >
                <AiFillSmile /> {/* Using AiFillSmile as it was previously noted for 'Customer manage' */}
                <span className=" ml-2 text">Clients</span>{" "}
              </Link>
              <hr />
              {/* The mt-20 class on the next link seems like a large gap, might want to review later if this was intentional for specific spacing */}
              <Link
                href="BookingHistory"
                className="flex mt-20 items-center p-2 text-gray-700 rounded-lg  hover:bg-blue-200    group focus:bg-blue-100 "
              >
                <AiFillSmile /> {/* This was the original "Customer manage" link, now potentially redundant or could be renamed/removed if "Clients" covers it */}
                <span className=" ml-2 text">Customer manage</span>{" "}
              </Link>
              <hr />

              <Link
                href="/"
                onClick={Logout}
                className="flex items-center gap-3 p-2 text-gray-700 rounded-lg  hover:bg-blue-100   group focus:bg-blue-100 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
