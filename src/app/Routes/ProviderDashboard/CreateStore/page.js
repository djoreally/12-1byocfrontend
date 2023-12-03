"use client";
import React, { use, useEffect, useRef } from "react";
import { Steps, Spin } from "antd";
import { ShopOutlined } from "@ant-design/icons";

import { input } from "antd";
const { TextArea } = input;
import { useState } from "react";
import api from "@/api";
import { toast, Toaster } from "react-hot-toast";
import Data from "../data.json";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiFillDollarCircle, AiFillShop } from "react-icons/ai";

export default function page() {
  const [steps, setSteps] = useState(0);
  const [storename, setStorename] = useState("");
  const [description, setDescription] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [tags, setTags] = useState("");
  const [logo, setLogo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewLogo, setPreviewLogo] = useState("");
  const [address, setAddress] = useState("");
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [resData, setResData] = useState("");
  const [Services, setServices] = useState([]);
  const [service, setService] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("");
  const router = useRouter();

  const handleLogo = (e) => {
    const selectedFile = e.target.files[0];
    setLogo(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewLogo(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleThumbnail = (e) => {
    const selectedFile = e.target.files[0];
    setThumbnail(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewThumbnail(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const addItem = () => {
    if (service && price) {
      setServices((oldItems) => {
        return [...oldItems, { service, price, serviceDescription }]; // Store both service and price in an object
      });
      setService("");
      setPrice("");
      setServiceDescription("");
    }
  };

  const handleDescription = (e) => {
    const selectedService = e.target.value;
    const selectedServiceData = Data.Services.find(
      (serviceData) => serviceData.ServiceName === selectedService
    );
    if (selectedServiceData) {
      // Set the description based on the selected service
      setServiceDescription(selectedServiceData.Description);
    } else {
      // Handle the case where the selected service is not found
      setServiceDescription("");
    }
  };
  const deleteItem = (index) => {
    setServices((oldItems) => {
      const updatedItems = [...oldItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  const handleFormSubmit = async (e) => {
    const formData = new FormData();
    formData.append("StoreName", storename);
    formData.append("Description", description);
    formData.append("ServiceArea", serviceArea);
    formData.append("Tags", tags);
    formData.append("Logo", logo);
    formData.append("Thumbnail", thumbnail);
    formData.append("address", address);
    formData.append("Services", JSON.stringify(Services));
    setLoading(true);
    try {
      const response = await api.post(
        "/store/CreateStore",
        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Your Store updated successfully");
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const Token = Cookies.get("token");
        if (Token) {
          const decoded = jwtDecode(Token);
          const response = await api.get(`/store/GetStore/${decoded.userId}`);
          const data = response.data.data;
          console.log(data.Services);
          setPreviewThumbnail(data?.Thumbnail);
          setPreviewLogo(data?.Logo);
          setResData(data?.user);
          setStorename(data?.StoreName);
          setDescription(data?.Description);
          setServiceArea(data?.ServiceArea);
          setTags(data?.Tags);
          setAddress(data?.address);
          setServices(data?.Services);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="mx-40 my-20 max-sm:m-5 max-sm:mx-5">
      <Toaster />
      {loading ? (
        <div class="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black bg-opacity-50">
          <div role="status" class="loader">
            <svg
              aria-hidden="true"
              class="w-[100px] h-[100px] mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) : null}
      <h1 className="my-5 font-semibold text-2xl uppercase text-center">
        Setup your store{" "}
      </h1>
      <div>
        <Steps
          size="small"
          current={steps}
          items={[
            {
              title: "Create Store",
            },
            {
              title: "Select Your service",
            },
            {
              title: "Review and submit",
            },
          ]}
        />
      </div>

      <div className="mt-5 flex justify-between max-sm:">
        <button
          onClick={() => {
            handleFormSubmit();
            router.push(`/DynamicRoutes/Store/${resData}`);
          }}
          className="px-8 py-3 max-sm:px-3 max-sm:py-3 max-sm:text-sm text-blue-400 hover:bg-blue-200 rounded-xl border border-blue-400 font-semibold flex items-center gap-2"
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
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
          Save and preview
        </button>
        <button
          onClick={() => {
            handleFormSubmit();
            router.push(`main`);
          }}
          className="px-8 py-3 max-sm:px-3 max-sm:py-3 max-sm:text-sm text-blue-100 hover:bg-blue-200 rounded-xl border bg-blue-400 font-semibold flex items-center gap-2"
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
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to dashboard
        </button>
      </div>

      {steps == 0 ? (
        <div className="mt-20 ">
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
            <div className="bg-white p-6 rounded-lg px-10 ">
              <p className="">Store name </p>
              <input
                placeholder="Your store name "
                className="my-2 w-[100%] outline-0  py-1 px-2 rounded-lg border-[1px]"
                value={storename}
                onChange={(e) => setStorename(e.target.value)}
              />

              <p className="text-sm">Your Address</p>

              <input
                className="my-2 w-[100%] outline-0  py-1 px-2 rounded-lg border-[1px]"
                placeholder="address here"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <p className="text-sm">Description</p>
              <textArea
                rows={4}
                placeholder="Description"
                className="my-2 w-[100%] outline-0  py-1 px-2 rounded-lg border-[1px] border-teal-100"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-sm">
                Set your service areas zipcode with comma separate
              </p>

              <input
                className="my-2 w-[100%] outline-0  py-1 px-2 rounded-lg border-[1px]"
                placeholder="example:35000,9000,30005,23400, "
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
              />
              <p className="text-sm">
                Enter your service tags with comma separate
              </p>
              <input
                className="my-2 w-[100%] outline-0  py-1 px-2 rounded-lg border-[1px]"
                placeholder="example: break,car wash,oil change,engine check,painting"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="">
              <div className="bg-white p-8 rounded-lg">
                <div>
                  <p className="text-left text-gray-700">
                    Upload your store logo
                  </p>

                  <label
                    htmlFor="dropzone-file-logo"
                    className="flex flex-col  items-center justify-center w-[100%] h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    {previewLogo ? (
                      <Image
                        src={previewLogo}
                        width={200}
                        height={200}
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or
                        </p>
                      </div>
                    )}
                    <input
                      id="dropzone-file-logo"
                      type="file"
                      className="hidden"
                      onChange={handleLogo}
                    />
                  </label>
                </div>

                <div>
                  <p className="text-left text-gray-700">
                    Upload your store thumbnail
                  </p>

                  <label
                    htmlFor="dropzone-file-thumbnail"
                    className="flex flex-col items-center justify-center  h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    {previewThumbnail ? (
                      <Image
                        src={previewThumbnail}
                        width={200}
                        height={200}
                        className="rounded-lg w-[100%] h-[100%]"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or
                        </p>
                      </div>
                    )}
                    <input
                      id="dropzone-file-thumbnail"
                      type="file"
                      className="hidden"
                      onChange={handleThumbnail}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {steps == 1 ? (
            <div>
              <div className=" mt-10 mb-0">
                <div className="grid grid-cols-3 gap-10 max-sm:grid-cols-1">
                  <div className="col-span-1">
                    <div className="bg-white p-6 col-span-1 rounded-lg">
                      <p className="text-sm">Select Service name</p>
                      <select
                        className="my-2 w-[100%] outline-0  py-1 px-2 rounded-lg border-[1px] border-gray-200"
                        placeholder="service name"
                        value={service}
                        onChange={(e) => {
                          setService(e.target.value);
                          handleDescription(e);
                        }}
                      >
                        {Data?.Services?.map((data, index) => (
                          <>
                            <option className="bg-white">
                              {data?.ServiceName}
                            </option>
                          </>
                        ))}
                      </select>
                      <p className="text-sm mt-2">Description</p>

                      <textarea
                        className="my-2 w-[100%] text-gray-600 outline-0  py-1 px-2 rounded-lg border-[1px] border-gray-200"
                        rows="3"
                        value={serviceDescription}
                        readOnly
                      />

                      <p className="text-xm mt-1">Price</p>
                      <input
                        name="price"
                        className="my-2 w-[100%] outline-0  py-1 px-2 rounded-lg border-[1px] border-gray-200"
                        placeholder="price"
                        value={price}
                        type="number"
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      <br />

                      <button
                        onClick={addItem}
                        className="text-[15px] bg-blue-400 w-full text-white px-2 py-2 mt-5 rounded-lg"
                      >
                        Add service
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 max-sm:col-span-1 grid grid-cols-2 max-sm:grid-cols-1 gap-2  overflow-scroll">
                    {Services.map((data, index) => {
                      return (
                        <div key={index}>
                          <div className="bg-white p-6 col-span-1  rounded-sm">
                            <p className="text-lg font-medium flex items-center gap-1 text-gray-600">
                              <AiFillShop className="w-6 h-6 text-blue-400" />
                              {data.service}
                            </p>{" "}
                            <p className="text-sm  flex items-center gap-1 text-gray-700 ">
                              {data.serviceDescription}
                            </p>{" "}
                            <p className="text-sm flex items-center gap-1">
                              <AiFillDollarCircle className="w-6 h-6 text-blue-400" />
                              {data.price}$
                            </p>
                            <button
                              className="text-sm bg-[#E70404] text-white px-2 py-2 mt-5 rounded-sm w-full"
                              onClick={() => {
                                deleteItem(index), handleFormSubmit();
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-20 grid grid-cols-3 gap-5 max-sm:grid-cols-1">
              <div className="col-span-2">
                <div className="flex items-center gap-4">
                  <Image
                    src={previewLogo}
                    width={50}
                    height={50}
                    className="rounded-full mt-2"
                  />
                  <h1 className="text-3xl font-bold">{storename}</h1>
                </div>
                <Image
                  src={previewThumbnail}
                  width={800}
                  height={800}
                  className="mt-5 rounded-xl"
                />
                <article className="mt-10 text-sm leading-8 text-justify">
                  {description}
                </article>
                <hr className="mt-5" />
                <p className="mt-4 capitalize font-semibold">
                  Your service tags
                </p>
                <div className="bg-teal-100 w-full rounded-lg py-4 uppercase font-semibold border-3 border-gray-200 border px-4">
                  {tags}
                </div>
                <p className="mt-4 capitalize font-semibold">
                  Your service areas
                </p>
                <div className="bg-teal-100 w-full rounded-lg py-4 uppercase font-semibold border-3 border-gray-200 border px-4">
                  {serviceArea}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-semibold ">Your services</h1>
                <hr />
                {Services.map((data, index) => {
                  return (
                    <div key={index}>
                      <div className="bg-white p-6 m-2 rounded-sm">
                        <p className="text-lg font-semibold flex items-center gap-1">
                          <AiFillShop className="w-6 h-6" />
                          {data.service}
                        </p>{" "}
                        <p className="text-sm flex items-center gap-1">
                          <AiFillDollarCircle className="w-6 h-6" />
                          {data.price}$
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-center mt-4 max-sm:flex-wrap">
        {steps > 0 ? (
          <button
            onClick={() => setSteps((previous) => previous - 1)}
            className="px-8 py-3 max-sm:w-screen bg-blue-400 hover:bg-blue-600 rounded-xl text-white font-semibold m-auto block mt-5"
          >
            Previous
          </button>
        ) : null}

        {steps < 2 ? (
          <button
            onClick={() => {
              handleFormSubmit();
              setSteps((previous) => previous + 1);
            }}
            className="px-8 py-3 max-sm:w-screen bg-blue-400 hover:bg-blue-600 rounded-xl text-white font-semibold m-auto block mt-5"
          >
            continue next
          </button>
        ) : null}
      </div>
    </div>
  );
}
