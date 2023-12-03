"use client";
import React from "react";
import Navbar from "@/app/Components/Navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import api from "@/api";
import { AiFillStar } from "react-icons/ai";
import Link from "next/link";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import Notfound from "/public/error.png";

export default function page() {
  const [Data, setData] = useState();
  const [FilteredStores, setFilteredStores] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/store/GetStore`);
        const data = response.data.data;
        setData(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  const [zipcode, setZipcode] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const zip = Cookies.get("zipcode");
    if (zip) {
      setZipcode(zip);
    }
    if (!zip) {
      setOpenModal(true);
    }
  }, []);
  const setziptoken = () => {
    Cookies.set("zipcode", zipcode);
  };

  useEffect(() => {
    const filteredData = Data?.filter((Data) =>
      Data.ServiceArea.includes(zipcode)
    );
    setFilteredStores(filteredData);
  }, [Data, zipcode]);

  return (
    <div>
      <div>
        <>
          <Modal
            open={openModal}
            onCancel={()=>setOpenModal(false)}
            footer={[
              <button
                className="bg-blue-400 px-8 rounded-lg py-1 text-white mx-1"
                onClick={() => {
                  setziptoken();
                  setOpenModal(false);
                }}
              >
                save
              </button>,
              <button
                className="bg-red-500 px-8 rounded-lg py-1 text-white mx-1"
                key="back"
                onClick={() => setOpenModal(false)}
              >
                cancel
              </button>,
            ]}
          >
            <p className="text-xl text-center">
              Set zipcode for search nearby stores
            </p>
            <p className="capitalize text-sm text-gray-600 font-semibold text-center mt-5">
              Enter your zipcode
            </p>
            <input
              onChange={(e) => setZipcode(e.target.value)}
              value={zipcode}
              type="number"
              placeholder="Enter your zipcode"
              className="outline-0 border-blue-400 border-[1px] p-2 rounded-lg w-full my-4 text-center"
            />{" "}
          </Modal>
        </>
      </div>

      <Navbar />
      <div className="m-10 mt-[100px]">
        {/* <div>
            {" "}
            {userName ? (
              <h1 className="font-semibold text-2xl">
                How its going, {userName}?
              </h1>
            ) : (
              <h1 className="font-semibold text-2xl capitalize">
                You need to login before book{" "}
              </h1>
            )}
          </div> */}
        <button
          onClick={() => setOpenModal(true)}
          className="flex max-sm:text-sm max-sm:mx-2 items-center gap-2 bg-blue-500 py-3 px-6 text-white font-semibold rounded-xl uppercase"
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
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          {zipcode ? <span> {zipcode}</span> : <span>set location</span>}
        </button>
        {FilteredStores?.length > 0 ? (
          <div className="grid grid-cols-4 mt-10 gap-5 max-sm:grid-cols-1">
            {FilteredStores?.map((data, index) => (
              <a
                href={`/DynamicRoutes/Store/${data.userId}`}
                key={index}
                className="bg-[#ffffff] p-4 rounded-lg"
              >
                <Image
                  src={data.Thumbnail}
                  width={300}
                  height={100}
                  className="w-full h-60   rounded-sm"
                />
                <div className="flex items-center mt-2 gap-2 cursor-pointer">
                  <Image
                    src={data.Logo}
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer"
                  />

                  <a
                    href={`/DynamicRoutes/Store/${data.userId}`}
                    className="font-[500] hover:underline text-sm"
                  >
                    @{data?.user?.name}
                  </a>
                </div>
                <Link
                  href={`/DynamicRoutes/Store/${data.userId}`}
                  className="mt-2 text-xl font-semibold hover:underline"
                >
                  {data.StoreName}
                </Link>
              </a>
            ))}
          </div>
        ) : (
          <div>
            <div className="block m-auto ">
              <Image src={Notfound} alt="Notfound" className="w-60 h-60 m-auto block" />
              <p className="text-xl  text-gray-700 text-center">Sorry!🙁</p>

              <p className="text-lg  text-gray-500 text-center">There is No service provider in your area</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
