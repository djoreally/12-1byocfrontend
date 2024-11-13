"use client";
import React from "react";
import Image from "next/image";
import SideImage from "/public/choosezipcode.webp";
import SideImage2 from "/public/schedule.webp";
import { Divider, Steps } from "antd";
import { useRouter } from "next/navigation";
// import Pricing from "../Components/Pricing/page";
import Link from "next/link";

export default function HowItWorks() {
  const router = useRouter();

  return (
    <div className="mt-20 mx-20 py-10 max-sm:mx-3 max-sm:py-2">
      <h1 className="text-3xl font-extrabold text-gray-600 text-center max-sm:text-2xl">
        How Book Your Oil Change Works
      </h1>
      <div className="flex justify-around mt-10 gap-10  bg-white p-3 px-6 shadow rounded-md max-sm:block max-sm:">
        <Image src={SideImage} />
        <div>
          <h1 className="font-extrabold text-4xl mt-20 text-[#01acf1] max-sm:text-2xl">
            Choose or describe your service
          </h1>
          <p className="mt-5 text-lg leading-10 text-gray-600 ">
            Tell us what services you need, your maintenance interval, or
            describe your symptoms to request a diagnosis.
          </p>
        </div>
      </div>
      {/* schedule section  */}
      <div className="flex justify-around mt-10 gap-10  bg-white p-3 px-6 shadow rounded-md max-sm:flex-wrap max-sm:flex-col-reverse max-sm:gap-2">
        <div>
          <h1 className="font-extrabold text-4xl mt-20 text-[#01acf1] max-sm:text-2xl">
            Schedule an appointment
          </h1>
          <p className="mt-5 text-lg leading-10 text-gray-600">
          Our platform uses the customer's address or location to ensure they are within 
          the service radius and provide accurate availability.
          </p>
        </div>
        <Image src={SideImage2} />
      </div>
      {/* <Pricing /> */}
      <div className="bg-[#01acf1] py-10 max-sm:pb-5 mt-10 max-sm:mt-5 rounded-md shadow max-sm:py-1">
        <h1 className="font-extrabold text-center text-3xl mt-20 text-[#ffffff] max-sm:text-xl">
          User-Friendly Platform: With intuitive features for both the admin and customer.
        </h1>
        <div className="flex justify-around mt-20 max-sm:block max-sm:gap-5 max-sm:mt-10">
          <div className="bg-white w-96  rounded-md shadow p-4  max-sm:w-80 max-sm:m-auto ">
            <svg
              class="w-6 h-6 block m-auto text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="m17.351 3.063-8-3a1.009 1.009 0 0 0-.7 0l-8 3A1 1 0 0 0 0 4a19.394 19.394 0 0 0 8.47 15.848 1 1 0 0 0 1.06 0A19.394 19.394 0 0 0 18 4a1 1 0 0 0-.649-.937Zm-3.644 4.644-5 5A1 1 0 0 1 8 13c-.033 0-.065 0-.1-.005a1 1 0 0 1-.733-.44l-2-3a1 1 0 0 1 1.664-1.11l1.323 1.986 4.138-4.138a1 1 0 0 1 1.414 1.414h.001Z" />
            </svg>
            <h1 className="text-center text-2xl font-bold text-gray-700 capitalize">
              Get service{" "}
            </h1>
            <Divider />
            <Steps
              progressDot
              current={3}
              direction="vertical"
              className="text-sm capitalize"
              items={[
                {
                  title: "Select your problem",
                },
                {
                  title: "Enter zipcode",
                },
                {
                  title: "Book appointment",
                },
              ]}
            />
            <div className="flex items-center justify-center">
              <Link
                href="/Routes/ServicePage"
                className="bg-blue-400 text-white font-semibold capitalize px-5  py-3 rounded-lg "
              >
                Get start
              </Link>
            </div>
          </div>
          <Divider
            type="vertical"
            className="bg-gray-100  h-80 max-sm:hidden"
          />

          <div className="bg-white w-96  rounded-md shadow p-4 max-sm:mt-5 max-sm:w-80 max-sm:m-auto ">
            <svg
              class="w-6 h-6 m-auto block text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
            </svg>
            <h1 className="text-center text-2xl font-bold text-gray-700 capitalize">
              Provide service{" "}
            </h1>
            <Divider />
            <Steps
              progressDot
              current={3}
              direction="vertical"
              className="text-sm capitalize"
              items={[
                {
                  title: "Join Now as service provider",
                },
                {
                  title: "Select Your Services",
                },
                {
                  title: "Approve Or Decline Request",
                },
              ]}
            />
            <div className="flex items-center justify-center">
              <Link
                href="/Routes/CreateAccount"
                className="bg-blue-400 text-white font-semibold capitalize px-5  py-3 rounded-lg "
              >
                Get start
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
