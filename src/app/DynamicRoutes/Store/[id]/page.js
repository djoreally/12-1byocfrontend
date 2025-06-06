"use client";
import React from "react";
import { useState, useEffect } from "react";
// import api from "@/api"; // Commenting out for simulation
import Navbar from "@/app/Components/Navbar";
import Image from "next/image";
import { useParams } from 'next/navigation'; // To get ID on client component
import {
  AiFillStar,
  AiFillCalendar,
  AiFillShop,
  AiFillDollarCircle,
} from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Skeleton } from "antd";
import { FaLocationDot, FaPhoneAlt, FaEnvelope } from "react-icons/fa6";
import { useRouter } from "next/navigation"; // Corrected import
import Link from "next/link";

// Mock Provider Data
const mockProviderProfiles = {
  "prov1": {
    id: "prov1",
    StoreName: "Speedy Lube Pros",
    Thumbnail: "/placeholder-store-banner.png", // Placeholder image path
    Logo: "/placeholder-logo.png", // Placeholder image path
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    contact: {
      phone: "+1-212-555-0100",
      email: "contact@speedylube.com",
    },
    businessHours: {
      Monday: { from: "08:00", to: "18:00", isOpen: true },
      Tuesday: { from: "08:00", to: "18:00", isOpen: true },
      Wednesday: { from: "08:00", to: "18:00", isOpen: true },
      Thursday: { from: "08:00", to: "18:00", isOpen: true },
      Friday: { from: "08:00", to: "18:00", isOpen: true },
      Saturday: { from: "09:00", to: "15:00", isOpen: true },
      Sunday: { from: "", to: "", isOpen: false },
    },
    Description: "Speedy Lube Pros offers fast and reliable oil changes, tire rotations, and basic diagnostic services. Our experienced technicians ensure your vehicle is performing at its best. We use only high-quality oils and parts.",
    ServiceArea: "10001, 10002, 10003",
    Tags: "Oil Change, Tire Rotation, Quick Service, Diagnostics",
    Services: [
      { id: "s1", name: "Standard Oil Change", description: "Conventional oil change up to 5 quarts.", price: "39.99", duration: "30 mins" },
      { id: "s2", name: "Synthetic Oil Change", description: "Full synthetic oil change up to 5 quarts.", price: "69.99", duration: "45 mins" },
      { id: "s3", name: "Tire Rotation", description: "Rotate all four tires.", price: "24.99", duration: "20 mins" },
      { id: "s4", name: "Basic Inspection", description: "Multi-point vehicle inspection.", price: "19.99", duration: "N/A" },
    ],
    userId: "user_prov1", // For booking link
    user: { name: "Speedy Lube Team" } // For chat widget
  },
  "prov2": {
    id: "prov2",
    StoreName: "Mobile Mech Masters",
    Thumbnail: "/placeholder-store-banner-alt.png",
    Logo: "/placeholder-logo-alt.png",
    address: {
      street: "456 Mechanic Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
    contact: {
      phone: "+1-310-555-0200",
      email: "info@mobilemech.com",
    },
    businessHours: {
      Monday: { from: "09:00", to: "17:00", isOpen: true },
      Tuesday: { from: "09:00", to: "17:00", isOpen: true },
      Wednesday: { from: "09:00", to: "17:00", isOpen: true },
      Thursday: { from: "09:00", to: "17:00", isOpen: true },
      Friday: { from: "09:00", to: "17:00", isOpen: true },
      Saturday: { from: "", to: "", isOpen: false },
      Sunday: { from: "", to: "", isOpen: false },
    },
    Description: "Mobile Mech Masters brings quality auto repair services to your doorstep. We specialize in brake repairs, battery replacements, and on-site diagnostics. Convenient and trustworthy.",
    ServiceArea: "90001, 90002, 90210",
    Tags: "Mobile Mechanic, Brake Repair, Battery, On-Site Service",
    Services: [
      { id: "s1", name: "Brake Pad Replacement (Front)", description: "Replacement of front brake pads.", price: "149.99", duration: "1.5 hours" },
      { id: "s2", name: "Car Battery Test & Replacement", description: "Test existing battery and replace if needed (battery cost extra).", price: "49.99", duration: "45 mins" },
      { id: "s3", name: "Check Engine Light Diagnostics", description: "Full diagnostic scan to identify issues.", price: "79.99", duration: "1 hour" },
    ],
    userId: "user_prov2",
    user: { name: "Mobile Mech Team" }
  },
};


export default function StoreDetailPage() {
  const params = useParams(); // For client-side components
  const storeId = params?.id;

  const [loggedInUserName, setLoggedInUserName] = useState();
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const Token = Cookies.get("token");
    if (Token) {
      try {
        const decoded = jwtDecode(Token);
        setLoggedInUserName(decoded?.name);
      } catch (e) {
        console.error("Failed to decode token:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!storeId) {
      setLoading(false);
      setError("Store ID not found.");
      return;
    }

    // New simulated fetch logic
    console.log("Fetching details for provider ID:", storeId);
    console.log(`Simulating API Call: GET /api/provider/business/${storeId}`);
    setLoading(true);
    setError(null); // Clear previous errors

    new Promise(resolve => {
      setTimeout(() => {
        const profile = mockProviderProfiles[storeId];
        if (profile) {
          resolve({ ok: true, json: () => Promise.resolve(profile) });
        } else {
          resolve({ ok: false, status: 404, json: () => Promise.resolve({ message: "Provider not found (simulated)" }) });
        }
      }, 500);
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
            console.error("Simulated API Error:", err.message);
            setError(err.message || "Failed to fetch provider details (simulated error).");
            setStoreData(null);
            // setLoading(false); // setLoading will be handled in .finally()
            return Promise.reject(err); // Propagate error to be caught by .catch if needed, or just return to stop chain
        });
      }
      return response.json();
    })
    .then(data => {
      // This block will only be executed if response.ok was true and response.json() succeeded
      if (data) {
        console.log("Simulated API Success. Provider details:", data);
        setStoreData(data);
        setError(null);
      }
    })
    .catch(error => {
      // This catches errors from the Promise structure itself or if Promise.reject was used.
      console.error("Error during simulated fetch for provider details:", error);
      // If error came from response.json().then(err => Promise.reject(err)), 'error' here will be 'err'
      if (!error.message.includes("Failed to fetch provider details")) { // Avoid double logging if already handled
          setError(error.message || "Failed to fetch provider details (simulated catch).");
      }
      setStoreData(null);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [storeId]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="mt-40 mx-4 md:mx-20 grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton avatar paragraph={{ rows: 4 }} className="mb-10" />
            <Skeleton avatar paragraph={{ rows: 8 }} />
          </div>
          <div className="md:col-span-1">
            <Skeleton avatar paragraph={{ rows: 4 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="mx-4 md:mx-20 mt-[90px] text-center py-10">
          <h1 className="text-2xl font-semibold text-red-500">{error}</h1>
          <Link href="/Routes/ServiceProviders" className="text-blue-500 hover:underline mt-4 inline-block">
              Back to search
          </Link>
        </div>
      </div>
    );
  }

  if (!storeData) {
     // This case should ideally be covered by error state if storeId was present but no data found
    return (
      <div>
        <Navbar />
        <div className="mx-4 md:mx-20 mt-[90px] text-center py-10">
             <h1 className="text-2xl font-semibold text-gray-700">Provider data not available.</h1>
        </div>
      </div>
    );
  }

  const {
    StoreName, Thumbnail, Logo, address, contact, businessHours,
    Description, ServiceArea, Tags, Services, userId, user
  } = storeData;

  const serviceAreasArray = ServiceArea?.split(",") || [];
  const tagsArray = Tags?.split(",") || [];

  return (
    <div>
      <Navbar />
      <div className="mx-4 md:mx-20 mt-[90px] max-sm:mx-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
            {Thumbnail && (
              <Image
                src={Thumbnail}
                alt={`${StoreName} banner`}
                width={800}
                height={300} // Adjusted height
                className="w-full h-60 md:h-80 object-cover" // Ensure consistent height and cover
                priority // Prioritize loading banner image
              />
            )}

            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                  {Logo && (
                    <Image
                      src={Logo}
                      alt={`${StoreName} logo`}
                      width={60}
                      height={60}
                      className="rounded-full mr-4 border border-gray-200"
                    />
                  )}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{StoreName}</h1>
                    {address && (
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <FaLocationDot className="mr-2 text-gray-500" />
                        {`${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`}
                      </p>
                    )}
                  </div>
                </div>
                {loggedInUserName ? (
                  <Link href={`/DynamicRoutes/BookingProcces/${userId}`} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 shadow-md transition-colors duration-150 w-full sm:w-auto">
                      <AiFillCalendar className="w-5 h-5" />
                      Book Now
                  </Link>
                ) : (
                  <Link href={`/Routes/CustomerLogin`} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 shadow-md transition-colors duration-150 w-full sm:w-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      Login to Book
                  </Link>
                )}
              </div>

              {/* About Store Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-3 border-b pb-2">About {StoreName}</h2>
                <article className="text-gray-600 leading-relaxed prose prose-sm max-w-none">
                  {Description || "No description available."}
                </article>
              </div>

              {/* Services Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Our Services</h2>
                {Services && Services.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Services.map((serviceItem) => (
                      <div key={serviceItem.id || serviceItem.name} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <AiFillShop className="w-5 h-5 text-blue-500" />
                          {serviceItem.name}
                        </h3>
                        <p className="text-sm text-gray-600 my-1">{serviceItem.description}</p>
                        <p className="text-sm text-gray-700 font-medium">
                          Price: <span className="text-green-600">${serviceItem.price}</span>
                        </p>
                        <p className="text-sm text-gray-700 font-medium">
                          Duration: <span className="text-gray-600">{serviceItem.duration}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No specific services listed.</p>
                )}
              </div>

              {/* Service Areas and Tags */}
              { (serviceAreasArray.length > 0 || tagsArray.length > 0) &&
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Details</h2>
                    {serviceAreasArray.length > 0 && (
                        <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Service Areas (Zip Codes)</h3>
                        <div className="flex flex-wrap gap-2">
                            {serviceAreasArray.map((area, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                                {area.trim()}
                            </span>
                            ))}
                        </div>
                        </div>
                    )}
                    {tagsArray.length > 0 && (
                        <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Specialties & Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {tagsArray.map((tag, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">
                                {tag.trim()}
                            </span>
                            ))}
                        </div>
                        </div>
                    )}
                </div>
              }
            </div>
          </div>

          {/* Sidebar Column (Contact, Hours, Chat) */}
          <div className="md:col-span-1 space-y-6">
             {/* Contact Info */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Contact Information</h2>
                {contact?.phone && (
                    <p className="text-gray-600 flex items-center mb-2">
                        <FaPhoneAlt className="mr-3 text-gray-500"/> {contact.phone}
                    </p>
                )}
                {contact?.email && (
                    <p className="text-gray-600 flex items-center">
                        <FaEnvelope className="mr-3 text-gray-500"/> {contact.email}
                    </p>
                )}
            </div>

            {/* Business Hours */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Business Hours</h2>
              {businessHours && Object.keys(businessHours).length > 0 ? (
                <ul className="space-y-1 text-sm text-gray-600">
                  {Object.entries(businessHours).map(([day, hours]) => (
                    <li key={day} className="flex justify-between py-1 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium">{day}</span>
                      {hours.isOpen ? (
                        <span className="text-green-600">{hours.from || "N/A"} - {hours.to || "N/A"}</span>
                      ) : (
                        <span className="text-red-500">Closed</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Business hours not available.</p>
              )}
            </div>

            {/* Chat Widget Placeholder */}
            {user?.name && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                 <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 text-center relative ">
                    <p className="font-medium">Hello, {loggedInUserName || "Guest"}!</p>
                    <p className="text-sm mt-1 mb-3">Have questions? Chat with {user.name || StoreName}.</p>
                    <div className="flex justify-center items-center mb-3">
                        {Logo && <Image src={Logo} alt="Provider Logo" width={60} height={60} className="rounded-full border-2 border-white shadow-md"/>}
                    </div>
                    <button className="w-full py-2 px-4 bg-white text-blue-600 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-150">
                        <BiMessageSquareDetail className="w-5 h-5" /> Start Chat (Coming Soon)
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
