"use client";
import React from "react";
import { Input } from "antd";
import { MailOutlined, KeyOutlined, NumberOutlined } from "@ant-design/icons";
import { useState } from "react";
import api from "@/api";
import Loader from "@/app/Components/Loader";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import ForgotPng from "/public/forgotpass.png";
import Done from "/public/done.gif";
import PassSave from "/public/savepass.png";

export default function page() {
  const [email, setEmail] = useState();
  const [phone, setphone] = useState();
  const [code, setCode] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [emailSended, setEmailSended] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isverified, setverified] = useState(false);
  const [matchpassword, setMatchPassword] = useState();

  const [method, setMethod] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();

  // OTP SENDER
  const submithandler = async () => {
    try {
      await api.post("/auth/forgotpassword", {
        email,
        phone,
      });
      toast.success("OTP sended  please check your Inbox !");

      setEmailSended(true);
    } catch (error) {
      console.log(error);
      toast((t) => (
        <div className="flex justify-center items-center gap-5 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Account dosen't exist
          <button
            className="bg-blue-600 text-white font- px-4 py-2 rounded-lg"
            onClick={() => router.push("CreateAccount")}
          >
            signup
          </button>
        </div>
      ));
    }
  };
  // OTP VERIFY
  const verifyotp = async () => {
    try {
      const response = await api.post("/auth/verifyotp", {
        token: code,
      });
      setverified(response.data.verified);
    } catch (error) {
      console.log(error);
      toast((t) => (
        <div className="flex justify-center items-center gap-5 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          Invalid Token
          <button
            className="bg-blue-600 text-white font- px-4 py-2 rounded-lg"
            onClick={() => location.reload()}
          >
            Try again
          </button>
        </div>
      ));
    }
  };
  // reset Password
  const resetpassword = async () => {
    try {
      const response = await api.post("/auth/resetpassword", {
        token: code,
        newPassword,
      });
      setSuccess(true);
    } catch (error) {
      toast((t) => (
        <div className="flex justify-center items-center gap-5 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          Invalid Token
          <button
            className="bg-blue-600 text-white font- px-4 py-2 rounded-lg"
            onClick={() => location.reload()}
          >
            Try again
          </button>
        </div>
      ));
    }
  };

  return (
    <div className="mx-40 mt-20 max-sm:mx-2 max-sm:mt-1">
      <Toaster position="top-center" reverseOrder={false} />
      {isSuccess ? (
        <div>
          <Loader />
          <button
            onClick={() => router.push("CustomerLogin")}
            className="text-white bg-blue-400 px-4 py-3 rounded-full capitalize m-auto block mt-5"
          >
            {" "}
            login your Account{" "}
          </button>
        </div>
      ) : (
        <div>
          {emailSended ? (
            <div>
              {!isverified ? (
                <div
                  className={`m-auto block w-[50%] max-sm:w-[100%] max-sm:mt-20 max-sm:mx-3 `}
                >
                  {/* OTP verify section */}

                  <div className="bg-[#FFF] w-full p-8 max-sm:p-2">
                    <div className="mx-10 max-sm:mx-2">
                      <Image
                        src={ForgotPng}
                        alt="ForgotPng"
                        className="m-auto block "
                      />
                      <p className="text-center text-[#444444] text-[20px] font-sans">
                        Enter your OTP
                      </p>
                    </div>
                    <div className="flex items-center justify-center mt-5 gap-4">
                      {isverified ? (
                        <Image src={Done} alt="done" className="w-40" />
                      ) : (
                        <input
                          className="forminput w-full text-center tracking-[2rem] font-bold text-xl"
                          onChange={(e) => setCode(e.target.value)}
                          value={code}
                        />
                      )}
                    </div>
                    <div className="flex justify-center mt-4 items-center gap-2">
                      <p className="font-medium text-[#7C7C8A]">
                        Don’t receive OTP?{" "}
                      </p>
                      <button
                        onClick={submithandler}
                        className="text-sm hover:underline text-[#2E53FF] font-bold"
                      >
                        Resend OTP
                      </button>
                    </div>
                    <div>
                      {/* next button */}
                      <button
                        disabled={isverified}
                        onClick={verifyotp}
                        className={`w-full m-auto block bg-[#2E53FF] ${
                          isverified ? "bg-green-500" : ""
                        } mt-5 rounded-[10px] py-4 text-white font-semibold `}
                      >
                        {isverified ? (
                          <span className="flex justify-center text-center items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 "
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            verified
                          </span>
                        ) : (
                          <span> Verify</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    {" "}
                    {/* password input */}
                    <div
                      className={`m-auto block w-[50%] max-sm:w-[100%] max-sm:mt-20 max-sm:mx-3 `}
                    >
                      <div className="bg-[#FFF] w-full p-8 max-sm:p-2">
                        <div className="mx-10 max-sm:mx-2">
                          <Image
                            src={PassSave}
                            alt="PassSave"
                            className="m-auto block "
                          />
                          <p className="text-center text-[#444444] text-[20px] font-sans">
                            set your new password
                          </p>
                        </div>
                        <input
                          className="forminput w-full my-5 px-2 text-center"
                          type="text"
                          placeholder="Enter your new password "
                          value={newPassword}
                          onChange={(e) => setnewPassword(e.target.value)}
                        />
                        <input
                          className="forminput w-full my-5 px-2 text-center"
                          type="text"
                          value={matchpassword}
                          placeholder="Confirm password"
                          onChange={(e) => setMatchPassword(e.target.value)}
                        />

                        {/* next button */}
                        <button
                          onClick={resetpassword}
                          className={`w-full m-auto block bg-[#2E53FF] mt-5 rounded-[10px] py-4 text-white font-semibold ${
                            newPassword === matchpassword
                              ? ""
                              : "cursor-not-allowed	opacity-40"
                          }`}
                          disabled={newPassword !== matchpassword}
                        >
                          Save password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {!step > 0 ? (
                <div>
                  {/* method selection page */}
                  <div
                    className={`m-auto block w-[50%] max-sm:w-[100%] max-sm:mt-20 max-sm:mx-3 `}
                  >
                    <div className="bg-[#FFF] w-full p-8 max-sm:p-2">
                      <div className="mx-10 max-sm:mx-2">
                        <Image
                          src={ForgotPng}
                          alt="ForgotPng"
                          className="m-auto block "
                        />
                        <p className="text-center text-[#444444] text-[20px] font-sans">
                          Select which contact details should we use to reset
                          your password
                        </p>
                      </div>
                      <div>
                        {/* number button */}
                        <button
                          value="phone"
                          onClick={(e) => setMethod(e.target.value)}
                          className={`mt-5 flex items-center gap-3 border ${
                            method === "phone" ? "border-[#0735ee]" : ""
                          } rounded-[18px] p-4 w-full`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 78 78"
                            fill="none"
                          >
                            <circle cx="39" cy="39" r="39" fill="#EDF4FC" />
                            <path
                              d="M47.4148 30.5307C45.4553 28.5555 42.869 27.3268 40.1019 27.0565C37.3348 26.7862 34.5602 27.4913 32.2565 29.0502C29.9528 30.6091 28.2643 32.924 27.4823 35.596C26.7002 38.268 26.8734 41.1295 27.9722 43.6873C28.0867 43.925 28.1243 44.1926 28.0797 44.4528L27.0287 49.5121C26.9882 49.706 26.9965 49.907 27.0528 50.097C27.1091 50.287 27.2116 50.46 27.3512 50.6005C27.4656 50.7142 27.6018 50.8036 27.7516 50.8632C27.9015 50.9228 28.0618 50.9514 28.223 50.9473H28.4618L33.5733 49.9187C33.8331 49.8874 34.0965 49.9245 34.3376 50.0264C36.8916 51.1268 39.7488 51.3003 42.4168 50.517C45.0848 49.7338 47.3963 48.0428 48.9529 45.7357C50.5094 43.4285 51.2135 40.6498 50.9436 37.8785C50.6737 35.1073 49.4469 32.5171 47.4745 30.5547L47.4148 30.5307ZM34.1943 40.1829C33.9581 40.1829 33.7272 40.1127 33.5308 39.9813C33.3344 39.8499 33.1813 39.6631 33.0909 39.4445C33.0006 39.226 32.9769 38.9855 33.023 38.7535C33.0691 38.5215 33.1828 38.3083 33.3498 38.1411C33.5169 37.9738 33.7297 37.8599 33.9613 37.8137C34.193 37.7676 34.4331 37.7913 34.6513 37.8818C34.8696 37.9723 35.0561 38.1256 35.1873 38.3223C35.3185 38.519 35.3886 38.7503 35.3886 38.9868C35.3886 39.304 35.2627 39.6082 35.0388 39.8325C34.8148 40.0569 34.511 40.1829 34.1943 40.1829ZM38.9714 40.1829C38.7352 40.1829 38.5043 40.1127 38.3079 39.9813C38.1115 39.8499 37.9584 39.6631 37.868 39.4445C37.7776 39.226 37.754 38.9855 37.8 38.7535C37.8461 38.5215 37.9599 38.3083 38.1269 38.1411C38.2939 37.9738 38.5067 37.8599 38.7384 37.8137C38.97 37.7676 39.2102 37.7913 39.4284 37.8818C39.6466 37.9723 39.8331 38.1256 39.9644 38.3223C40.0956 38.519 40.1656 38.7503 40.1656 38.9868C40.1656 39.304 40.0398 39.6082 39.8158 39.8325C39.5919 40.0569 39.2881 40.1829 38.9714 40.1829ZM43.7484 40.1829C43.5122 40.1829 43.2813 40.1127 43.0849 39.9813C42.8885 39.8499 42.7355 39.6631 42.6451 39.4445C42.5547 39.226 42.531 38.9855 42.5771 38.7535C42.6232 38.5215 42.7369 38.3083 42.904 38.1411C43.071 37.9738 43.2838 37.8599 43.5154 37.8137C43.7471 37.7676 43.9872 37.7913 44.2055 37.8818C44.4237 37.9723 44.6102 38.1256 44.7414 38.3223C44.8727 38.519 44.9427 38.7503 44.9427 38.9868C44.9427 39.304 44.8169 39.6082 44.5929 39.8325C44.3689 40.0569 44.0652 40.1829 43.7484 40.1829Z"
                              fill="#2E53FF"
                            />
                          </svg>
                          <div>
                            <p className="text-[#898888] text-left text-[13px] ">
                              Via SMS
                            </p>
                            <p className="text-[#313030] text-sm">+1 ***-***</p>
                          </div>
                        </button>
                        {/* email button */}
                        <button
                          value="email"
                          onClick={(e) => setMethod(e.target.value)}
                          className={`mt-5 flex items-center gap-3 border ${
                            method === "email" ? "border-[#0735ee]" : ""
                          } rounded-[18px] p-4 w-full`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 78 78"
                            fill="none"
                          >
                            <circle cx="39" cy="39" r="39" fill="#EDF4FC" />
                            <path
                              d="M47.1 30H31.9C30.855 30 30.0095 31.0125 30.0095 32.25L30 45.75C30 46.9875 30.855 48 31.9 48H47.1C48.145 48 49 46.9875 49 45.75V32.25C49 31.0125 48.145 30 47.1 30ZM46.72 34.7812L40.0035 39.7537C39.6995 39.9788 39.3005 39.9788 38.9965 39.7537L32.28 34.7812C32.1847 34.7179 32.1013 34.6324 32.0348 34.5298C31.9683 34.4272 31.92 34.3096 31.8929 34.1843C31.8659 34.059 31.8606 33.9284 31.8773 33.8006C31.8941 33.6728 31.9326 33.5503 31.9905 33.4406C32.0484 33.3309 32.1245 33.2362 32.2142 33.1624C32.3039 33.0885 32.4053 33.037 32.5123 33.0108C32.6193 32.9847 32.7296 32.9846 32.8367 33.0104C32.9437 33.0363 33.0452 33.0876 33.135 33.1612L39.5 37.875L45.865 33.1612C45.9548 33.0876 46.0563 33.0363 46.1633 33.0104C46.2704 32.9846 46.3807 32.9847 46.4877 33.0108C46.5947 33.037 46.6961 33.0885 46.7858 33.1624C46.8755 33.2362 46.9516 33.3309 47.0095 33.4406C47.0674 33.5503 47.1059 33.6728 47.1227 33.8006C47.1394 33.9284 47.1341 34.059 47.1071 34.1843C47.08 34.3096 47.0317 34.4272 46.9652 34.5298C46.8987 34.6324 46.8153 34.7179 46.72 34.7812Z"
                              fill="#737373"
                            />
                          </svg>
                          <div>
                            <p className="text-[#898888] text-left text-[13px]">
                              Via email
                            </p>
                            <p className="text-[#313030] text-sm">
                              user@gmail.com
                            </p>
                          </div>
                        </button>
                        {/* next button */}
                        <button
                          onClick={() => setStep((prev) => prev + 1)}
                          className={`w-full m-auto block bg-[#2E53FF] mt-5 rounded-[10px] py-4 text-white font-semibold ${
                            method ? "" : "cursor-not-allowed	opacity-40"
                          }`}
                          disabled={!method}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : method === "phone" ? (
                <div>
                  {" "}
                  {/* number input */}
                  <div
                    className={`m-auto block w-[50%] max-sm:w-[100%] max-sm:mt-20 max-sm:mx-3 `}
                  >
                    <div className="bg-[#FFF] w-full p-8 max-sm:p-2">
                      <div className="mx-10 max-sm:mx-2">
                        <Image
                          src={ForgotPng}
                          alt="ForgotPng"
                          className="m-auto block "
                        />
                        <p className="text-center text-[#444444] text-[20px] font-sans">
                          Enter your number
                        </p>
                      </div>
                      <input
                        className="forminput w-full my-5 px-2 text-center"
                        type="number"
                        value={phone}
                        onChange={(e) => setphone(e.target.value)}
                      />
                      {/* next button */}
                      <button
                        onClick={submithandler}
                        className={`w-full m-auto block bg-[#2E53FF] mt-5 rounded-[10px] py-4 text-white font-semibold ${
                          phone ? "" : "cursor-not-allowed	opacity-40"
                        }`}
                      >
                        Send OTP
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* email input */}
                  <div
                    className={`m-auto block w-[50%] max-sm:w-[100%] max-sm:mt-20 max-sm:mx-3 `}
                  >
                    <div className="bg-[#FFF] w-full p-8 max-sm:p-2">
                      <div className="mx-10 max-sm:mx-2">
                        <Image
                          src={ForgotPng}
                          alt="ForgotPng"
                          className="m-auto block "
                        />
                        <p className="text-center text-[#444444] text-[20px] font-sans">
                          Enter your email address
                        </p>
                      </div>
                      <input
                        className="forminput w-full my-5 px-2 text-center"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {/* next button */}
                      <button
                        onClick={submithandler}
                        className={`w-full m-auto block bg-[#2E53FF] mt-5 rounded-[10px] py-4 text-white font-semibold ${
                          email ? "" : "cursor-not-allowed	opacity-40"
                        }`}
                      >
                        Send OTP
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
