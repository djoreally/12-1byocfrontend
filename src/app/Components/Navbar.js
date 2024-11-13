"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Dropdown, Avatar } from "flowbite-react";
import { HiViewGrid } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { HiLogout } from "react-icons/hi";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { Input } from "antd";
import { SearchOutlined ,UserOutlined } from "@ant-design/icons";

export default function Navbar() {
  const router = useRouter();
  const [name, setName] = useState("user");
  const [isLogin, setLogin] = useState(false);
  const [role, setRole ] = useState("")

  useEffect(() => {
    const Token = Cookies.get("token");
    if (Token) {
      const decoded = jwtDecode(Token);
      setLogin(decoded?.loggedIn);
      setName(decoded?.name);
      setRole(decoded.role)
    } else {
      setLogin(false);
    }
  });

  const Logout = () => {
    Cookies.remove("token");
    router.refresh();
    router.push("/")
  };

  return (
    <div>
      <nav className="bg-white  fixed w-full  top-0 left-0 border-b bg-transparent shadow py-2">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center">
            <img
              src="https://bookyouroilchange.com/_next/image?url=%2Fimages%2Fheader%2Flogo.png&w=256&q=75"
              className="h-8"
              alt="Flowbite Logo"
            />
            
          </a>
          <div className="flex md:order-2 flex space-x-1">
            {isLogin ? (
              <Dropdown
                inline
                label={
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                  </svg>
                }
              >
                <div className="w-full bg-white rounded-sm">
                  <Dropdown.Item>{name}</Dropdown.Item>
                  <hr />
                  <Dropdown.Item className="hover:bg-[#01acf1] hover:text-white duration-300 hover:font-semibold">
                    <HiViewGrid />
                    <button
                      onClick={() =>
                        role == "customer"? router.push("/Routes/CustomerDashboard/main"):router.push("/Routes/ProviderDashboard/main")
                      }
                      className="ml-2"
                    >
                      {" "}
                      Dashboard
                    </button>{" "}
                  </Dropdown.Item>
                  <hr />
                  <Dropdown.Item className="hover:bg-[#01acf1] hover:text-white duration-300 hover:font-semibold">
                    <FiSettings />
                    <button
                      onClick={() =>
                       role == "customer"? router.push("/Routes/CustomerDashboard/settings"):router.push("/Routes/ProviderDashboard/settings")
                      }
                      className="ml-2"
                    >
                      {" "}
                      Settings
                    </button>{" "}
                  </Dropdown.Item>
                  <hr />

                  <Dropdown.Item className="hover:bg-[#10eb90] hover:text-white duration-300 hover:font-semibold">
                  <UserOutlined />                   
                  <span className="ml-2 capitalize">loggedIn as {role}</span>
                  </Dropdown.Item>
                  <hr />
                  <Dropdown.Item className="hover:bg-[#f3483c] hover:text-white duration-300 hover:font-semibold">
                    <HiLogout />
                    <button onClick={Logout} className="ml-2">
                      Sign out
                    </button>
                  </Dropdown.Item>
                </div>
              </Dropdown>
            ) : (
              <button
                onClick={() => router.push("/Routes/CustomerLogin")}
                className="bg-[#2E53FF] text-white font-semibold px-4 py-2 rounded-lg max-sm:w-20 hover:bg-blue-500 hover:outline"
              >
                Login
              </button>
            )}
            <button
                onClick={() => router.push("/Routes/CreateAccount")}
                className="bg-[#2E53FF] text-white font-semibold px-4 py-2 rounded-lg max-sm:w-20 hover:bg-blue-500 hover:outline"
              >
                Registration
              </button>
              <img
              src="/user.png"
              className="h-8"
              alt="Flowbite Logo"
            />
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 "
            id="navbar-sticky"
          >
            {isLogin ? (
              <div className="flex items-center">
                 {/* <Input className="h-10 w-96 rounded-l-xl rounded-r-none" prefix={<SearchOutlined/>} placeholder="Search here"/>
                 <button className="text-sm bg-blue-400 text-white h-10 px-4 rounded-r-xl">Search</button> */}
              </div>
            ) : (
              <ul className="flex flex-col p-4 capitalize md:p-0 mt-4 font-medium  md:flex-row md:space-x-8 md:mt-0 md:border-0 ">
                <li>
                  <Link
                    href="/"
                    className="block  text-gray-900 text-sm hover:text-red-600 duration-300"
                    aria-current="page"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Routes/ServicePage"
                    className="block  text-gray-900 text-sm hover:text-red-600 duration-300"
                    aria-current="page"
                  >
                    our services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="block  text-gray-900 text-sm hover:text-red-600 duration-300"
                    aria-current="page"
                  >
                    Service areas
                  </Link>
                </li>

                <li>
                  <Link
                    href="/Routes/Pricing"
                    className="block  text-gray-900 text-sm hover:text-red-600 duration-300"
                    aria-current="page"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            )}
           
          </div>
        </div>
      </nav>
    </div>
  );
}
