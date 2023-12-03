/**
 * The above function is a React component that represents a multi-step form for selecting a vehicle,
 * location, and services, and displaying the selected items in a cart.
 * @returns The code is returning a React functional component named "Page".
 */
"use client";
import React, { useState, useEffect, use } from "react";
import { Steps, Spin, Input, Modal } from "antd";
import { Accordion } from "flowbite-react";
import {
  UserOutlined,
  CarOutlined,
  BgColorsOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import { FaCity } from "react-icons/fa";
import {
  AiFillHome,
  AiFillFileZip,
  AiOutlineFieldDate,
  AiTwotoneEdit,
} from "react-icons/ai";
import { GiStreetLight } from "react-icons/gi";
import { SiOpenstreetmap } from "react-icons/si";
import { BiHomeAlt2 } from "react-icons/bi";
import { IoLogoUsd } from "react-icons/io5";
import { BsCalendarDate } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { AiFillCar, AiFillContainer } from "react-icons/ai";
import api from "@/api";
import { FaLocationDot, FaBusinessDate } from "react-icons/fa6";
import Image from "next/image";
import { Select } from "antd";
import Empty from "/public/empty.png";
import { AiFillDollarCircle, AiFillShop } from "react-icons/ai";
import { Calendar } from "antd";
import Loader from "@/app/Components/Loader";
import { useRouter } from "next/navigation";
import cars from "./csvjson.json";

export default function Page({ params }) {
  const [steps, setSteps] = useState(0);
  const [Data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  // State for input values
  const [codes, setCodes] = useState("");
  const [street, setStreeet] = useState("");
  const [apt, setApt] = useState("");
  // const [cars, setCars] = useState();
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [engine, setEngine] = useState("");
  const [bookingDone, setBookingDone] = useState(false);

  // this data will sent to backend
  const [Vehicle, setVehicle] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [Date, setDate] = useState();
  const [Time, setTime] = useState();
  const [zipcode, setZipcode] = useState("");
  const [price, SetPrice] = useState();

  //  GET STORE DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/store/GetStore/${params.id}`);
        const data = response.data.data;
        setData(data);
        const cars = await api.get("/OuterApi/cars");
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setCodes();
    setStreeet();
    setZipcode();
    setApt();
  };
  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    fetchZipcode();
  }, [codes]);

  const fetchZipcode = async () => {
    try {
      const response = await api.post("/OuterApi/zipcode", {
        codes,
      });
      // console.log(response.data.results);
      setZipcode(response.data.results[codes][0]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const uniqueYears = [...new Set(cars?.map((data) => data?.Year))];
  const FilterByYear = cars?.filter((item) => item?.Year === year);
  const FilterByMake = FilterByYear?.filter((item) => item?.Make === make);
  const FilterByModel = FilterByMake?.filter((item) => item?.Model === model);
  // set data to vehicle state
  const setVehicleDataToState = () => {
    if (FilterByModel) {
      const YourVehicle = FilterByModel.filter(
        (item) => item?.Engine === engine
      );
      setVehicle((prevVehicle) => [...prevVehicle, ...YourVehicle]);
    }
  };

  // set data to selected service
  const setServiceToState = (data) => {
    setSelectedService((prevServices) => [...prevServices, data]);
  };

  const calculateTotalPrice = () => {
    let calculatedTotalPrice = 0;
    selectedService.forEach((data) => {
      calculatedTotalPrice += parseFloat(data?.price) * Vehicle.length;
    });
    SetPrice(calculatedTotalPrice);
  };
  useEffect(() => {
    calculateTotalPrice();
  }, [selectedService]);

  const addCar = () => {
    setMake();
    setYear();
    setEngine();
    setModel();
    setVehicleDataToState();
  };

  const onPanelChange = (value) => {
    setDate(value.format("YYYY-MM-DD"));
  };
  const router = useRouter();

  // POST booking
  const BookHandler = async () => {
    try {
      const response = await api.post(`/Book/CreateBooking`, {
        TotalPrice: price,
        Vehicle,
        Date,
        Time,
        selectedService,
        Location: zipcode,
        apt,
        street,
        storeId: Data._id,
      });
      setBookingDone(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      {bookingDone ? (
        <div className="mx-40 mt-40 max-sm:mx-5">
          <Loader />
          <button
            onClick={() => router.push("/Routes/CustomerDashboard/main")}
            className="px-4 py-3 bg-blue-400 text-sm font-bold text-white rounded-3xl m-auto block my-10"
          >
            Back to dashboard
          </button>
        </div>
      ) : (
        <div className="mx-40 mt-20 max-sm:mx-5">
          <>
            <Modal
              open={open}
              onCancel={handleCancel}
              footer={[
                <button
                  className="bg-blue-400 px-3 rounded-lg py-1 text-white mx-1"
                  onClick={handleOk}
                >
                  save
                </button>,
                <button
                  className="bg-red-500 px-3 rounded-lg py-1 text-white mx-1"
                  key="back"
                  onClick={handleCancel}
                >
                  cancel
                </button>,
              ]}
            >
              <p className="text-xl text-center">Set your address</p>
              <p className="capitalize text-sm text-gray-600 font-semibold">
                Enter your zipcode
              </p>
              <input
                onChange={(e) => setCodes(e.target.value)}
                value={codes}
                type="number"
                placeholder="Enter your zipcode"
                className="outline-0 border p-2 rounded-lg w-1/2 mb-4"
              />{" "}
              {zipcode ? (
                <div>
                  {zipcode?.city},{zipcode?.postal_code},{zipcode?.state},
                  {zipcode?.country_code}
                </div>
              ) : null}
              <br />
              <p className="capitalize text-sm text-gray-600 font-semibold">
                Enter your street number
              </p>
              <input
                value={street}
                onChange={(e) => setStreeet(e.target.value)}
                placeholder="Enter your street ex:428 railroad ave
                        "
                className="outline-0 border p-2 rounded-lg w-full mb-4"
              />
              <br />
              <p className="capitalize text-sm text-gray-600 font-semibold">
                Enter your apartment number
              </p>
              <input
                value={apt}
                onChange={(e) => setApt(e.target.value)}
                placeholder="Enter your apartment number "
                className="outline-0 border p-2 rounded-lg w-full mb-4"
              />
            </Modal>
          </>

          <Steps
            size="small"
            current={steps}
            items={[
              {
                title: "Vehicle data & address",
              },
              {
                title: "Select service",
              },

              {
                title: "Pay & Book",
              },
              {
                title: "Confirm",
              },
            ]}
          />
          <div className="grid grid-cols-3 mt-5 gap-5 max-sm:grid-cols-1">
            <div className="col-span-2 max-sm:col-span-1">
              {steps === 0 ? (
                <div className="bg-white rounded-lg">
                  <div className="bg-white p-4 rounded-lg ">
                    <Accordion>
                      <Accordion.Panel>
                        <Accordion.Title>
                          {" "}
                          <p className="font-semibol capitalize text-lg flex items-center gap-1">
                            <CiLocationOn />
                            location
                          </p>
                        </Accordion.Title>
                        <Accordion.Content>
                          <div className="flex items-center justify-between">
                            {zipcode ? (
                              <div className="text-sm ">
                                <p className="flex items-center gap-2">
                                  <SiOpenstreetmap />
                                  {zipcode?.city},{zipcode?.postal_code},
                                  {zipcode?.state},{zipcode?.country_code}
                                </p>
                                <p className="mt-2 flex items-center gap-2">
                                  <GiStreetLight /> {street}
                                </p>
                                <p className="mt-2 flex items-center gap-1">
                                  <BiHomeAlt2 />
                                  {apt}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm">Your location</p>
                            )}

                            <button onClick={showModal}>
                              <AiTwotoneEdit />
                            </button>
                          </div>
                        </Accordion.Content>
                      </Accordion.Panel>
                    </Accordion>
                  </div>
                  <div className="p-4 rounded-sm  gap-2 ">
                    <div className="w-full">
                      {" "}
                      <Accordion>
                        <Accordion.Panel>
                          <Accordion.Title>
                            <p className="font-semibol capitalize text-xl flex items-center gap-1">
                              <AiFillCar /> Vehicle
                            </p>
                          </Accordion.Title>
                          <Accordion.Content>
                            <div className="p-4 ">
                              <p className="mt-2 font-medium capitalize">
                                Select year
                              </p>
                              <Select
                                value={year}
                                onChange={(value) => setYear(value)}
                                className="w-full"
                              >
                                {uniqueYears?.map((data, index) => (
                                  <option key={index} value={data} className="">
                                    {data}
                                  </option>
                                ))}
                              </Select>
                              <p className="mt-2 font-medium capitalize">
                                Select make
                              </p>
                              <Select
                                value={make}
                                onChange={(value) => setMake(value)}
                                className="w-full"
                              >
                                {Array.from(
                                  new Set(FilterByYear.map((data) => data.Make))
                                ).map((make, index) => (
                                  <option key={index} value={make} className="">
                                    {make}
                                  </option>
                                ))}
                              </Select>

                              <p className="mt-2 font-medium capitalize">
                                Select car model
                              </p>
                              <Select
                                value={model}
                                onChange={(value) => setModel(value)}
                                className="w-full"
                              >
                                {FilterByMake?.map((data, index) => (
                                  <option
                                    key={index}
                                    value={data?.Model}
                                    className=""
                                  >
                                    {data?.Model}
                                  </option>
                                ))}
                              </Select>
                              <p className="mt-2 font-medium capitalize">
                                Select Engine
                              </p>
                              <Select
                                value={engine}
                                onChange={(value) => setEngine(value)}
                                className="w-full"
                              >
                                {FilterByModel?.map((data, index) => (
                                  <option
                                    key={index}
                                    value={data.Engine}
                                    className=""
                                  >
                                    {data?.Engine}
                                  </option>
                                ))}
                              </Select>
                              <button
                                onClick={addCar}
                                className="flex items-center bg-blue-500 text-white w-[40%] max-sm:w-[100%] capitalize px-4 py-2 rounded-lg justify-center mt-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-7 h-7 text-blue-400"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                add vehicle
                              </button>
                            </div>
                          </Accordion.Content>
                        </Accordion.Panel>
                      </Accordion>
                    </div>
                  </div>
                </div>
              ) : steps === 1 ? (
                <div className="grid grid-cols-2 gap-20 max-sm:gap-2 col-span-2 p-4 h-[90vh] max-sm:h-full overflow-scroll max-sm:grid-cols-1 max-sm:col-span-1">
                  {Data?.Services?.map((data, index) => (
                    <div className="shadow p-4 h-[15rem] rounded-lg bg-white flex flex-col justify-between items-start ">
                      <div key={index} className="">
                        <p className="text-lg font-semibold flex items-start gap-1">
                          <AiFillShop className="text-blue-400 w-7 h-7" />
                          {data?.service}
                        </p>
                        <p className="flex items-center gap-1">
                          <AiFillDollarCircle className="text-blue-400" />
                          {data?.price}$
                        </p>
                        <p className="text-sm  mt-1 text-gray-700">
                          {data?.serviceDescription}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setServiceToState(data);
                        }}
                        className="bg-blue-600 text-white shadow h-fit p-2 rounded-full flex items-center place-content-center mt-5 w-full"
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
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                          />
                        </svg>
                        add to cart
                      </button>
                    </div>
                  ))}
                </div>
              ) : steps === 2 ? (
                <div>
                  <p className="text-center mt-20 text-4xl font-bold">
                    Payment API will add here{" "}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="flex justify-between ">
                      <p className="text-lg flex items-center gap-2 capitalize font-medium text-gray-600">
                        {" "}
                        <CiLocationOn /> address
                      </p>
                      <button
                        onClick={showModal}
                        className="flex items-center gap-2 uppercase text-sm font-semibold text-gray-700"
                      >
                        edit
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-blue-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                    </div>
                    <hr className="" />
                    <p className="uppercase font-semibold mt-4 text-blue-500 flex items-center gap-2">
                      {" "}
                      <CiLocationOn /> {zipcode?.city} {zipcode?.postal_code}{" "}
                      {zipcode?.state} {zipcode?.country_code}
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-gray-600 text-sm uppercase font-medium">
                      <GiStreetLight /> {street}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-gray-600 text-sm uppercase font-medium">
                      <BiHomeAlt2 />
                      {apt}
                    </p>
                  </div>

                  <div className="bg-white l my-5 p-4 rounded-lg">
                    <div className="flex justify-between ">
                      <p className="text-lg flex items-center gap-2 capitalize font-medium text-gray-600">
                        {" "}
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
                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                          />
                        </svg>
                        Your booking Schedule
                      </p>
                    </div>
                    <hr className="" />
                    <div className="flex justify-between">
                      {" "}
                      <p className="flex items-center gap-2 mt-6">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 opacity-80 text-gray-800"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                          />
                        </svg>
                        {Date}
                      </p>
                      <div className="flex items-center">
                        <p className="flex items-center ">
                          {" "}
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
                        </p>
                        <Select
                          value={Time}
                          onChange={(value) => setTime(value)}
                          className="w-40"
                        >
                          {Data?.ServiceHours?.map((data, index) => (
                            <option
                              key={data._id}
                              value={data.from}
                              className=""
                            >
                              {data.from} - {data.to}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="h-96 overflow-scroll mt-10">
                      <Calendar onChange={onPanelChange} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* cart side  */}
            <div className="col-span-1 bg-white w-full  p-4">
              {Vehicle && Vehicle.length > 0 ? (
                <div>
                  {Vehicle.map((data, index) => (
                    <div
                      key={index}
                      className="border my-2 p-2 rounded-lg flex justify-around"
                    >
                      <p className="uppercase text-sm flex items-center">
                        car {index + 1} :
                      </p>
                      <p className="capitalize text-sm flex items-center">
                        <AiFillCar /> {data?.Model}
                      </p>
                      <p className="capitalize text-sm">{data?.Make}</p>
                    </div>
                  ))}
                  <div className="mt-5">
                    <div className="flex justify-between uppercase font-semibold text-sm bg-gray-200 px-2 py-2 rounded-sm mb-5">
                      <p>Product</p>
                      <p>price</p>
                    </div>

                    {selectedService.map((data, index) => (
                      <div className="">
                        <div className="flex justify-between ">
                          <p className="text-sm my-1">{data?.service}</p>
                          <p className="text-sm font-semibold my-1">
                            {data?.price}$
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="w-full h-[2px] bg-gray-200 rounded-full"></div>

                    <div className="flex justify-between uppercase font-semibold text-sm   mt- px-2 py-2 rounded-sm ">
                      <p>{Vehicle.length} Vehicle</p>
                      <p>
                        {price}x{Vehicle.length}
                      </p>
                    </div>
                    <div className="flex justify-between uppercase font-semibold text-sm   mt- px-2 py-2 rounded-sm ">
                      <p>Service Charge</p>
                      <p>+2$</p>
                    </div>
                    <div className="w-full h-[1px] bg-gray-800"></div>
                    <div className="flex justify-between uppercase font-semibold text-sm   mt- px-2 py-2 rounded-sm mb-5">
                      <p>total</p>
                      <p>{price + 2}$</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Image
                    src={Empty}
                    alt="empty cart"
                    width={200}
                    className="m-auto block mt-10"
                  />
                  <p className="text-center text-gray-500 font-semibold capitalize">
                    Your cart is empty
                  </p>
                </div>
              )}
            </div>
          </div>

          {steps > 2 ? (
            <button
              onClick={BookHandler}
              className="px-4 py-3 bg-blue-500 font-semibold text-white text-sm uppercase rounded-full w-[50%] m-auto block mt-5"
            >
              Book now
            </button>
          ) : (
            <button
              onClick={() => setSteps((previous) => previous + 1)}
              className="px-4 py-3 bg-blue-500 font-semibold text-white text-sm uppercase rounded-full w-[50%] m-auto block mt-5"
            >
              Continue next
            </button>
          )}
          {steps > 0 ? (
            <button
              onClick={() => setSteps((previous) => previous - 1)}
              className="px-4 py-3 bg-gray-800 font-semibold text-white text-sm uppercase rounded-full w-[50%] m-auto block mt-5"
            >
              Previous
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
