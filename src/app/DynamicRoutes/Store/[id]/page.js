"use client";
import React from "react";
import { useState, useEffect } from "react";
import api from "@/api";
import Navbar from "@/app/Components/Navbar";
import Image from "next/image";
import {
  AiFillStar,
  AiFillCalendar,
  AiFillShop,
  AiFillDollarCircle,
} from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Skeleton } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function page({ params }) {
  const [name, setName] = useState();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const Token = Cookies.get("token");
    if (Token) {
      const decoded = jwtDecode(Token);
      setName(decoded?.name);
    } else {
    }
  });

  const [Data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/store/GetStore/${params.id}`);
        const data = response.data.data;
        setData(data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);
  const serviceAreas = Data?.ServiceArea?.split(",");
  const Tags = Data?.Tags?.split(",");
  Data?.ServiceHours.map((data, index) => {
    console.log(data.from);
  });
  return (
    <div>
      <Navbar />
      {!loading ? (
        <div className="mx-20  mt-[90px] max-sm:mx-2">
          <div className="grid grid-cols-3 gap-5 max-sm:grid-cols-1">
            <div className="col-span-2 mt-5 bg-white  rounded-lg max-sm:col-span-1">
              <Image
                src={Data?.Thumbnail}
                width={800}
                height={200}
                className="block m-auto h-80 rounded-lg w-[100%] mb-2"
              />

              <h1 className="text-3xl font-bold text-gray-700 px-8">
                {Data?.StoreName}
              </h1>
              <div className="flex px-8 items-center mt-5 gap-2 justify-between flex-wrap">
                <div>
                  {" "}
                  <Image
                    src={Data?.Logo}
                    width={50}
                    height={50}
                    alt="logo"
                    className="rounded-full"
                  />
                  <div className="block">
                    <div className="flex items-center mt-2">
                      <FaLocationDot />
                      <span className="text-sm">{Data?.address}</span>
                    </div>
                  </div>
                </div>
                <div>
                  {!name ? (
                    <Link
                      href={`/Routes/CustomerLogin`}
                      className="bg-blue-400 text-white px-4 py-2 rounded-3xl text-lg flex items-center gap-2 border"
                    >
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
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                        />
                      </svg>
                      Login now
                    </Link>
                  ) : (
                    <a
                      href={`/DynamicRoutes/BookingProcces/${Data?.userId}`}
                      className="bg-blue-400 text-center max-sm:px-20 hover:bg-blue-600 text-white px-10 py-2 rounded-3xl text-lg flex items-center gap-2 border"
                    >
                      <AiFillCalendar />
                      Book now
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-20 p-8 max-sm:p-2">
                <p className="text-xl font-semibold">About Store</p>
                <article className=" text-sm leading-8">
                  {Data?.Description}
                </article>
              </div>
              <div className="mt-10 p-8 max-sm:p-2">
                <p className="text-xl font-semibold">Our Services </p>
                <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1 ">
                  {Data?.Services.map((data, index) => {
                    return (
                      <div key={index}>
                        <div className="bg-white shadow-sm outline outline-gray-50 p-6 m-2 rounded-sm h-60">
                          <p className="text-lg font-semibold flex items-start gap-1 text-gray-700">
                            <AiFillShop className="w-6 h-6 text-blue-500" />
                            {data.service}
                          </p>{" "}
                          <p className="text-sm my-2 text-gray-700">
                            {data?.serviceDescription}
                          </p>{" "}
                          <p className="text-sm flex items-center gap-1 text-gray-700">
                            <AiFillDollarCircle className="w-6 h-6 text-blue-500" />
                            {data.price}$
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-10 p-8 max-sm:p-2">
                <p className="capitalize text-xl font-semibold">service area</p>
                <div className="flex flex-wrap">
                  {serviceAreas &&
                    serviceAreas.map((area, index) => (
                      <button
                        key={index}
                        className="bg-gray-100 m-2 py-3 px-6 rounded-sm flex items-center gap-1"
                      >
                        <HiOutlineLocationMarker /> {area}
                      </button>
                    ))}
                </div>
              </div>
              <div className="mt-10 p-8 max-sm:p-2">
                <p className="text-xl font-semibold">Related tags</p>
                <div className="">
                  {Tags &&
                    Tags.map((tags, index) => (
                      <button
                        key={index}
                        className="bg-gray-150 m-2 py-2 border opacity-50  px-4 rounded-sm "
                      >
                        {tags}
                      </button>
                    ))}
                </div>
              </div>
            </div>
            {/* book and message side  */}
            <div className="mt-10 col-span-1 bg-white rounded-lg p-4 block  ">
              <div className="h-96">
                <div className="bg-[#706ef3] text-white rounded-2xl p-2 w-[80%] m-auto block h-60 ">
                  <p className="text-center font-medium">Hello , {name}</p>
                  <article className="text-center text-sm mt-5">
                    Please if you have any query feel free to contact with me{" "}
                  </article>
                  <div className="w-[90%] shadow h-60 bg-white rounded-lg m-auto block mt-10 p-4">
                    <p className="text-gray-700 text-center capitalize">
                      Start chatting
                    </p>
                    <Image
                      src={Data?.Logo}
                      width={100}
                      height={100}
                      className="rounded-full m-auto block mt-4"
                    />
                    <p className="text-center text-gray-700 text-sm font-medium">
                      {Data?.user?.name}
                    </p>
                    <button className="py-2 px-4 bg-blue-400 m-auto gap-2 mt-2 rounded-lg flex items-center">
                      <BiMessageSquareDetail /> Send message
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <p className="text-center font-semibold capitalize">
                  business hour{" "}
                </p>
                {Data?.ServiceHours.map((data, index) => (
                  <div key={index}>
                    <hr />

                    <div className="flex justify-around items-center py-4 gap-5">
                      <p className="w-20">{data.day}</p>
                      {data.status ? (
                        <button className="uppercase bg-green-400 text-white px-2 py-1 rounded-lg text-sm">
                          Open
                        </button>
                      ) : (
                        <button className="uppercase bg-red-500 text-white px-8 w-40 py-2 rounded-lg text-sm ">
                          Close
                        </button>
                      )}

                      {data.status ? (
                        <p className="text- text-center text-black w-40">
                          {data.from || "00:00"} to {data.to || "00:00"}
                        </p>
                      ) : null}
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-40 mx-20 grid grid-cols-3">
          <div className="col-span-2">
            <Skeleton
              avatar
              paragraph={{
                rows: 4,
              }}
            />
            <Skeleton
              className="mt-10 "
              avatar
              paragraph={{
                rows: 8,
              }}
            />
          </div>
          <div className="col-span-1">
            <Skeleton
              avatar
              paragraph={{
                rows: 4,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
