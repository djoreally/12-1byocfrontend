"use client";
import React, { use } from "react";
import { Input, Select } from "antd";
import {
  MailOutlined,
  KeyOutlined,
  UserOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Cars from "/public/cars.png";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import api from "@/api";
import Loader from "@/app/Components/Loader";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import LoginPageCar from "/public/login.png";
import Navbar from "@/app/Components/Navbar";
import { SocialIcon } from "react-social-icons";

export default function page() {
  // state for handling form
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSuccessful, setSuccesful] = useState(false);
  const [role, setRole] = useState("customer");
  const router = useRouter();
  const [validatorErrors, setValidatorErrors] = useState({
    email: "",
    password: "",
  });

  //  form field validator
  const FormValidationHandler = () => {
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setValidatorErrors(newErrors);
  };
  //  submit form in backend
  const SubmitHandler = async () => {
    try {
      const response = await api.post("/auth/signup", {
        name,
        email,
        phone,
        password,
        role,
      });
      setValidatorErrors("");
      setSuccesful(true);
      console.log(response);
    } catch (error) {
      console.log("Error:", error.response.data.message);
      toast.error(error.response.data.message);
      FormValidationHandler();
    }
  };

  return (
    // main div
    <div>
      <Navbar />
    <div className="mx-80 mt-20 max-sm:mx-3 max-sm:mt-1" style={{ marginTop: "8rem" }}>
      <Toaster />
      {/* if login successfull and then redirect into this page  */}
      {isSuccessful ? (
        <div>
          <Loader />
          <button
            onClick={() => router.push("/Routes/CustomerLogin")}
            className="px-4 py-3 bg-blue-400 text-sm font-bold text-white rounded-3xl m-auto block my-10"
          >
            Continue to login page
          </button>
        </div>
      ) : (
        <div className="">
          <div className="bg-[#FFF] w-[] m-auto  p-8 max-sm:p-2">
            <div className="mx-10 max-sm:mx-2">
              {/* logo here */}
              <Image
                src={LoginPageCar}
                alt="LoginPageCar"
                className="m-auto block"
              />{" "}
              <h1 className="font-bold text-2xl my-5 text-center text-[#3A3A3A]">
                Registration
              </h1>
              {/* name input and text */}
              <div className=" flex items-center mt-10 justify-between">
                <p className="text-[#7C7C8A] text-lg capitalize w-fit px-2 rounded-sm">
                  Enter your full name
                </p>
              </div>
              <input
                type="text"
                className="mb-6 w-full  forminput"
                size="large"
                placeholder="Enter your full name"
                prefix={<UserOutlined />}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className=" flex items-center  justify-between">
                <div>
                  {/* email input and text */}
                  <p className="text-[#7C7C8A] text-lg capitalize w-fit px-2 rounded-sm">
                    Enter your email adress
                  </p>
                  {validatorErrors.email && (
                    <p style={{ color: "red" }}>{validatorErrors.email}</p>
                  )}
                </div>
              </div>
              <input
                type="email"
                className="mb-6 w-full  forminput"
                size="large"
                placeholder="Enter your mail"
                prefix={<MailOutlined />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className=" flex items-center  justify-between">
                <div>
                  {/* password  input and text */}

                  <p className="text-[#7C7C8A] text-lg capitalize w-fit px-2 rounded-sm">
                    Set your password
                  </p>
                  {validatorErrors.password && (
                    <p style={{ color: "red" }}>{validatorErrors.password}</p>
                  )}
                </div>
              </div>
              <input
                type="password"
                className="mb-6 w-full  forminput"
                size="large"
                placeholder="Enter your password"
                prefix={<KeyOutlined />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* signup action button */}
              <button
                onClick={SubmitHandler}
                className="m-auto block bg-[#2E53FF] text-white w-full rounded-[8px] py-[13px] font-semibold"
              >
                Singup
              </button>
              {/* social login icons */}
              <div>
                <p className="text-center text-[#7C7C8A] text-[16px] mt-5 font-semibold">
                  Or connect with:
                </p>
                <div class="flex justify-center flex space-x-4 grid-rows-1 grid-flow-col">
                      <SocialIcon url="https://google.com"/>
                      <SocialIcon url="https://facebook.com" />
                      <SocialIcon url="https://twitter.com" />
                    </div>
              </div>
              {/* If user don't have account and then redirect to signup page if forgot password then reset password page by Nextjs Link */}
              <div className="my-2">
                      <p className="text-center font-medium text-[#7C7C8A]">
                        Already have account? <Link href="/Routes/CustomerLogin" className="text-sm hover:underline text-[#2E53FF] font-bold">Login</Link>
                      </p>
                  </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
