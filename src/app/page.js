"use client";
import React, { useState, useEffect } from "react";
import HeroSection from "./Components/HeroSection";
import Intro from "./Components/Intro";
import Services from "./Components/Services";
import Head from "next/head";
import HowItWorks from "./Components/HowItWorks";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function page() {
  const [loggedin, setLogin] = useState(false);
  const [role, setRole] = useState();
  const router = useRouter();
  useEffect(() => {
    const Token = Cookies.get("token");
    if (Token) {
      const decoded = jwtDecode(Token);
      setLogin(decoded?.loggedIn);
      setRole(decoded.role);
    } else {
      setLogin(false);
    }
  });

  useEffect(() => {
    if (loggedin) {
      if (role == "customer") {
        router.push("/Routes/ServicePage");
      }
      else if(role == "provider"){
        router.push("/Routes/ProviderDashboard/main");

      }
    }
  });

  return (
    <React.Fragment>
      <Head>
        <link
          rel="stylesheet"
          href="https://unicons.iconscout.com/release/v4.0.8/css/solid.css"
        />
      </Head>
      <div className="pb-20 ">
        <Navbar />
        <HeroSection />
        <Intro />
        <Services />
        <HowItWorks />
      </div>
      <Footer />
    </React.Fragment>
  );
}
