"use client";
import React from "react";
import { MailOutlined, KeyOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";
import api from "@/api";
import Cookies from "js-cookie";
import { notification } from "antd";
import Loader from "@/app/Components/Loader";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";
import LoginPageCar from "/public/login.png";
import Image from "next/image";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccessfull, setSuccessfull] = useState(false);
  const router = useRouter();
  const [Api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    Api.error({
      message: `Authentication failure`,
      description: "Please enter correct Password & Email and please try again",
      placement,
    });
  };

  const SubmitHandler = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      setSuccessfull(true);
      Cookies.set("token", response.data.accessToken);
      const Token = Cookies.get("token");
      const decoded = jwtDecode(Token);
      if (decoded.role == "provider") {
        setTimeout(() => {
          router.push("/Routes/ProviderDashboard/main");
        }, 1500);
      } else if (decoded.role == "customer") {
        setTimeout(() => {
          router.push("/Routes/ServicePage");
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      openNotification("top");
    }
  };

  return (
    <div className="mx-80 mt-10 max-sm:mx-5 max-sm:mt-1 max-sm:pb-20">
      {/* Authentication failure notification handler */}
      {contextHolder}
      {/* if login successfull and then redirect into this page  */}
      {isSuccessfull ? (
        <div>
          <Loader />
          <p className="text-sm  mt-5 bg-blue-400 text-center w-fit m-auto px-8 py-4 rounded-3xl text-white font-bold capitalize">
            Please wait redirecting in your dashboard....
          </p>
        </div>
      ) : (
        // if loggedin fail it will not redirect , it will show auth failure notification
        <div className="">
          <div className="bg-[#FFF] w-[] m-auto  p-8 max-sm:p-2">
            <div className="mx-10 max-sm:mx-2">
              {/* login page header logo */}
              <Image
                src={LoginPageCar}
                alt="LoginPageCar"
                className="m-auto block"
              />
              {/* login page header title */}
              <h1 className="font-bold text-2xl my-b text-center text-[#2E53FF] ">
                Maintenance
              </h1>
              <p className="text-center text-[24px] text-[#3A3A3A] ">
                Log in with your credentials
              </p>

              {/* form Component */}
              <div className="mt-10">
                {/* email input text and input field */}
                <p className="text-[#7C7C8A] text-lg capitalize w-fit px-2 rounded-sm">
                  Enter your email
                </p>
                <input
                  className="mb-6 w-full  forminput"
                  type="email"
                  size="large"
                  placeholder="Enter your mail"
                  prefix={<MailOutlined />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {/* Password input text and input field */}
                <p className="text-[#7C7C8A] text-lg capitalize w-fit px-2 rounded-sm">
                  Enter your password
                </p>

                <input
                  className="mb-6 w-full  forminput"
                  size="large"
                  type="password"
                  placeholder="Enter your password"
                  prefix={<KeyOutlined />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* login action button */}
                <button
                  onClick={SubmitHandler}
                  className="m-auto block mt-5 bg-[#2E53FF] hover:bg-blue-700 text-white w-full rounded-[8px] py-[13px] font-semibold"
                >
                  Login
                </button>
                {/* social login icons */}
                <div>
                  <p className="text-center text-[#7C7C8A] text-[16px] mt-5 font-semibold">
                    Or connect with:
                  </p>
                </div>
                {/* If user don't have account and then redirect to signup page if forgot password then reset password page by Nextjs Link */}
                <div className="my-2 flex max-sm:flex-wrap max-sm:justify-center items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[#7C7C8A]">
                      Forgot password?
                    </p>
                    <Link
                      href="/Routes/ForgotPassword"
                      className="text-sm hover:underline text-[#2E53FF] font-bold"
                    >
                      Reset password
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[#7C7C8A]">
                      Don't have an account?{" "}
                    </p>
                    <Link
                      href="/Routes/CreateAccount"
                      className="text-sm hover:underline text-[#2E53FF] font-bold"
                    >
                      Registration
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
