"use client";
import React from "react";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import api from "@/api";
import Image from "next/image";
import { Modal, Input, Spin } from "antd";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import PageLoader from "@/app/Components/pageLoader";

export default function page() {
  // states for store datas
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [preveiwImage, setPreveiwImage] = useState(null);
  const [website, setwebsite] = useState("");
  const router = useRouter();

  // state for handling events
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [loading, setLoading] = useState(false);

  // token data
  useEffect(() => {
    const Token = Cookies.get("token");
    if (Token) {
      const decoded = jwtDecode(Token);
      setRole(decoded.role);
      setEmail(decoded.userEmail);
    }
    else{
      router.push("/Routes/CustomerLogin");
    }
  });
  // handle logo
  const handleLogoChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
  };
  // handle insurance paper
  const handleInsurance = (e) => {
    const selectedFiles = e.target.files[0];
    setInsurance(selectedFiles);
  };
  //  update data
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("image", image);
    formData.append("phone", phone);
    formData.append("insurance", insurance);
    formData.append("website", website);
    handleOk();
    try {
      await api.patch("/auth/updateProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Data updated successfully");
      router.refresh();
    } catch (error) {
      toast.error(error.response.data.message);
      router.refresh();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Token = Cookies.get("token");
        if (Token) {
          const response = await api.get("/Auth/GetUserData");
          const data = response.data.result;
          setName(data.name);
          setAddress(data.address);
          setPhone(data.phone);
          setPreveiwImage(data.image);
          setwebsite(data.website);
          setLoading(true);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="mx-0 my-10 max-sm:mx-2 max-sm:my-5 bg-[#E2F0FF] p-8 rounded-md">
          <Toaster />
          <div className="flex justify-between items-center flex-wrap gap-5">
            <div className="flex gap-3 items-center">
              {preveiwImage ? (
                <Image
                  src={preveiwImage}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 m-auto block mt-7 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold capitalize">{name}</h1>
                <a
                  href={website}
                  target="_blank"
                  className="text-sm text-gray-600 flex items-center gap-2 "
                >
                  {website}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-20 flex justify-between flex-wrap gap-5">
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                {" "}
                <UserOutlined /> Your Profile
              </h1>
              <p className="text-sm capitalize text-gray-500">
                update your profile from here{" "}
              </p>
            </div>
            {/* control buttons  */}
            <div>
              <button
                className="bg-blue-400 px-5 py-3 rounded-xl text-white "
                onClick={showModal}
              >
                Edit information
              </button>
            </div>
          </div>
          {/* user datas  */}
          <div className="grid grid-cols-2 gap-10 max-sm:grid-cols-1">
            <div className="mt-20 block gap-5">
              <p className="text-gray-600">Your name</p>
              <div className="rounded-xl border-0 py-2 w-full  my-2  outline-0 text-gray-900 px-4 capitalize bg-white">
                <span>{name}</span>
              </div>
              <p className="text-gray-600">Your email address</p>
              <div className="rounded-xl border-0 py-2 w-full  my-2  outline-0 text-gray-900 px-4  bg-white">
                <span>{email}</span>
              </div>
              <p className="text-gray-600">Your phone number</p>
              <div className="rounded-xl border-0 py-2 w-full  my-2  outline-0 text-gray-900 px-4 capitalize bg-white">
                <span>{phone}</span>
              </div>
              <p className="text-gray-600">Your address</p>
              <div className="rounded-xl border-0 py-2 w-full  my-2  outline-0 text-gray-900 px-4 capitalize bg-white">
                <span>{address}</span>
              </div>
              <p className="text-gray-600">Your Account type</p>
              <div className="rounded-xl border-0 py-2 w-full  my-2  outline-0 text-gray-900 px-4 capitalize bg-white">
                <span>{role}</span>
              </div>
            </div>

            {/* modal for updatedata  */}
            <div className="mt-20"></div>
            <Modal
              title="Edit profile information"
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
              width={1000}
            >
              {/* datas */}
              <div className="grid grid-cols-2 w-full max-sm:grid-cols-1">
                <div>
                  <p className=" capitalize">your name </p>
                  <Input
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl bg-gray-50 border-0 my-2"
                  />
                  <p className=" capitalize">your Phone number </p>
                  <Input
                    placeholder="name"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl bg-gray-50 border-0 my-2"
                  />
                  <p className=" capitalize">your address </p>

                  <Input
                    placeholder="name"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="rounded-xl bg-gray-50 border-0 my-2"
                  />
                  <p className=" capitalize">your website link</p>
                  <Input
                    placeholder="name"
                    value={website}
                    onChange={(e) => setwebsite(e.target.value)}
                    className="rounded-xl bg-gray-50 border-0 my-2"
                  />
                </div>

                {/* images  */}
                <div className="mt-20 flex gap-5 justify-around flex-wrap">
                  {/* profile picture  */}
                  <div>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file-logo"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
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
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG ,PDF,JPEG
                          </p>
                        </div>
                        <input
                          id="dropzone-file-logo"
                          type="file"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </label>
                    </div>
                    <p className="text-sm mt-5 capitalize font-semibold">
                      upload your Profile picture
                    </p>
                  </div>
                  {/* insurance paper  */}
                  {/* <div>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file-insu"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
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
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG ,PDF,JPEG
                          </p>
                        </div>
                        <input
                          id="dropzone-file-insu"
                          type="file"
                          className="hidden"
                          onChange={handleInsurance}
                        />
                      </label>
                    </div>
                    <p className="text-sm mt-5 capitalize font-semibold">
                      upload your insurance paper
                    </p>
                  </div> */}
                </div>
              </div>
              <button
                onClick={handleFormSubmit}
                className="px-6 py-2 bg-blue-400 text-white rounded-lg mt-5 w-full"
              >
                save
              </button>
            </Modal>
          </div>
        </div>
      ) : (
        <div>
          <PageLoader />
        </div>
      )}
    </div>
  );
}
