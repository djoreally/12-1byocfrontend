import React from "react";
import Image from "next/image";
import Picture from "/public/side.png";
import Link from "next/link";

export default function Intro() {
  return (
    <div className="mt-20 mx-20 max-sm:mx-3">
      <div>
        <h1 className="text-4xl font-bold text-center max-sm:text-xl">
          Mobile Automotive Service You Can Trust
        </h1>
      </div>
      <div className="grid grid-cols-2 mt-20 gap-20 max-sm:grid-cols-1 max-sm:gap-5">
        <div className="">
          {" "}
          <Image src={Picture} className="rounded-2xl h-96 m-auto block" />
        </div>
        <div className="block">
          <div className="grid grid-cols-5 gap-5 shadow py-5 px-1 rounded-md bg-white ">
            <div className="col-span-2 text-center">
              <h1 className="text-center">
                {" "}
                <span className="text-6xl font-bold text-gray-800 text-center">
                  100
                </span>{" "}
                <span className="text-3xl text-red-600 font-semibold">%</span>
                <p className="text-xl font-semibold text-center">
                  Contact-free service
                </p>
              </h1>
            </div>
            <div className="col-span-3">
              <p className="text-sm text-gray-600">
                Our services are safe, contact-free, and even mess-free with a
                thorough clean-up and sanitization after the job is done.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-5 shadow py-5 px-1 rounded-md bg-white mt-10 ">
            <div className="col-span-2 text-center">
              <h1 className="text-center">
                {" "}
                <span className="text-6xl font-bold text-gray-800 text-center">
                  120
                </span>{" "}
                <span className="text-3xl text-red-600 font-semibold">+</span>
                <p className="text-xl font-semibold text-center">
                  Years of experience
                </p>
              </h1>
            </div>
            <div className="col-span-3">
              <p className="text-sm text-gray-600">
                Our ASE-certified technicians give you the same personable
                expert service that you get at our Firestone locations.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-5 shadow py-5 px-1 rounded-md bg-white mt-10 ">
            <div className="col-span-2 text-center">
              <h1 className="text-center">
                {" "}
                <span className="text-6xl font-bold text-gray-800 text-center">
                  12
                </span>{" "}
                {/* <span className="text-3xl text-red-600 font-semibold">%</span> */}
                <p className="text-xl font-semibold text-center">
                  Services available
                </p>
              </h1>
            </div>
            <div className="col-span-3">
              <p className="text-sm text-gray-600">
                We offer a range of services including Oil Changes, Tire
                Replacement, Battery Replacement and more.
              </p>
            </div>
          </div>
         <div className="flex items-center justify-center">
         <Link href="/Routes/ServicePage" className="m-auto block mt-5 border-3 px-4 bg-white py-3 outline outline-[#01acf1] rounded-2xl font-semibold">
            Explore our services
          </Link>
         </div>
        </div>
      </div>
    </div>
  );
}
