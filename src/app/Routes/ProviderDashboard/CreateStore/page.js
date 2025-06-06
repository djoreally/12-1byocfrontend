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
  // Address fields
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("USA"); // Default or could be selectable

  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Business Hours - simplified for now, ideally a more complex component
  // Using an object to store hours for each day
  const [businessHours, setBusinessHours] = useState({
    Monday: { from: "", to: "", isOpen: true },
    Tuesday: { from: "", to: "", isOpen: true },
    Wednesday: { from: "", to: "", isOpen: true },
    Thursday: { from: "", to: "", isOpen: true },
    Friday: { from: "", to: "", isOpen: true },
    Saturday: { from: "", to: "", isOpen: false },
    Sunday: { from: "", to: "", isOpen: false },
  });

  const [description, setDescription] = useState(""); // Business Description/About Us
  const [serviceArea, setServiceArea] = useState(""); // Service Area Zip Codes
  const [tags, setTags] = useState(""); // Service Categories/Tags

  const [logo, setLogo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewLogo, setPreviewLogo] = useState("");
  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const [resData, setResData] = useState(""); // Seems to be user ID for store retrieval
  const [Services, setServices] = useState([]);
  // States for individual service form
  const [currentServiceId, setCurrentServiceId] = useState(null); // For editing
  const [currentServiceName, setCurrentServiceName] = useState("");
  const [currentServiceDescription, setCurrentServiceDescription] = useState("");
  const [currentServicePrice, setCurrentServicePrice] = useState("");
  const [currentServiceDuration, setCurrentServiceDuration] = useState("");
  const [serviceErrors, setServiceErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // State for validation errors (for Step 0)
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?([0-9]{1,3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone); // Basic international phone regex
  const validateZipCode = (zip) => /^[0-9]{5}(?:-[0-9]{4})?$/.test(zip);


  const validateStep0 = () => {
    const newErrors = {};
    if (!storename.trim()) newErrors.storename = "Store name is required.";
    if (!streetAddress.trim()) newErrors.streetAddress = "Street address is required.";
    if (!city.trim()) newErrors.city = "City is required.";
    if (!state.trim()) newErrors.state = "State is required.";
    if (!zipCode.trim()) newErrors.zipCode = "Zip code is required.";
    else if (!validateZipCode(zipCode)) newErrors.zipCode = "Invalid zip code format (e.g., 12345 or 12345-6789).";
    if (!country.trim()) newErrors.country = "Country is required.";
    if (!contactPhone.trim()) newErrors.contactPhone = "Contact phone is required.";
    else if (!validatePhone(contactPhone)) newErrors.contactPhone = "Invalid phone number format.";
    if (!contactEmail.trim()) newErrors.contactEmail = "Contact email is required.";
    else if (!validateEmail(contactEmail)) newErrors.contactEmail = "Invalid email format.";
    if (!description.trim()) newErrors.description = "Business description is required.";
    if (!tags.trim()) newErrors.tags = "Service tags/categories are required.";
    // Basic check for business hours (at least one day should have hours if open)
    const anOpenDayHasHours = Object.values(businessHours).some(day => day.isOpen && day.from && day.to);
    if (!anOpenDayHasHours) newErrors.businessHours = "Please specify opening hours for at least one open day.";


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const toggleDayOpen = (day) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
        // Optionally clear times if closing the day
        from: !prev[day].isOpen ? "" : prev[day].from,
        to: !prev[day].isOpen ? "" : prev[day].to,
      }
    }));
  };


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

  const validateServiceFields = () => {
    const newErrors = {};
    if (!currentServiceName.trim()) newErrors.name = "Service name is required.";
    if (!currentServicePrice.trim()) newErrors.price = "Price is required.";
    else if (isNaN(parseFloat(currentServicePrice)) || parseFloat(currentServicePrice) <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    // Duration is optional, but if provided, could have format validation
    if (currentServiceDuration.trim() && !/^\d+\s+(mins|hour|hours)$/i.test(currentServiceDuration) && currentServiceDuration.toUpperCase() !== 'N/A') {
        newErrors.duration = "Format like '30 mins', '1 hour', or 'N/A'.";
    }
    setServiceErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrUpdateService = () => {
    if (!validateServiceFields()) return;

    const serviceData = {
      id: currentServiceId || `service_${Date.now()}`, // Use existing ID for update, new for add
      name: currentServiceName,
      description: currentServiceDescription, // This is auto-filled by handleSelectServiceDescription
      price: parseFloat(currentServicePrice).toFixed(2),
      duration: currentServiceDuration || "N/A",
    };

    if (currentServiceId) { // Update existing service
      setServices(Services.map(s => s.id === currentServiceId ? serviceData : s));
      console.log("Updating service (UI state):", serviceData);
      console.log(`Simulated API Call: PUT /api/provider/business/{businessId}/services/${currentServiceId}`, JSON.stringify(serviceData));
      toast.success("Service updated locally!");
    } else { // Add new service
      setServices([...Services, serviceData]);
      console.log("Adding service (UI state):", serviceData);
      console.log("Simulated API Call: POST /api/provider/business/{businessId}/services", JSON.stringify(serviceData));
      toast.success("Service added locally!");
    }
    resetServiceForm();
  };

  const handleEditService = (serviceToEdit) => {
    setCurrentServiceId(serviceToEdit.id);
    setCurrentServiceName(serviceToEdit.name);
    // setCurrentServiceDescription(serviceToEdit.description); // Description is auto-set by Data.Services
    // Find description from Data.Services based on serviceToEdit.name to ensure consistency
    const selectedServiceData = Data.Services.find(s => s.ServiceName === serviceToEdit.name);
    setCurrentServiceDescription(selectedServiceData ? selectedServiceData.Description : serviceToEdit.description);

    setCurrentServicePrice(serviceToEdit.price);
    setCurrentServiceDuration(serviceToEdit.duration === "N/A" ? "" : serviceToEdit.duration); // Clear if N/A to allow typing
    setServiceErrors({});
    window.scrollTo({ top: document.getElementById('service-form-section').offsetTop, behavior: 'smooth' });
  };

  const resetServiceForm = () => {
    setCurrentServiceId(null);
    setCurrentServiceName("");
    setCurrentServiceDescription("");
    setCurrentServicePrice("");
    setCurrentServiceDuration("");
    setServiceErrors({});
     // Reset the select dropdown for service name if it's tied to currentServiceName
    const serviceSelectElement = document.getElementById("serviceNameSelect");
    if (serviceSelectElement) serviceSelectElement.value = "";
  };

  const handleDeleteService = (serviceIdToDelete) => {
    setServices(Services.filter(s => s.id !== serviceIdToDelete));
    console.log(`Deleting service (UI state): ${serviceIdToDelete}`);
    console.log(`Simulated API Call: DELETE /api/provider/business/{businessId}/services/${serviceIdToDelete}`);
    toast.success("Service deleted locally!");
    if (currentServiceId === serviceIdToDelete) { // If deleting the service currently being edited
        resetServiceForm();
    }
  };

  // This function is called when a service is selected from the dropdown
  // It updates the currentServiceName and currentServiceDescription
  const handleSelectServiceDescription = (selectedServiceName) => {
    setCurrentServiceName(selectedServiceName); // Update the service name state
    const selectedServiceData = Data.Services.find(
      (s_data) => s_data.ServiceName === selectedServiceName
    );
    if (selectedServiceData) {
      setCurrentServiceDescription(selectedServiceData.Description);
    } else {
      setCurrentServiceDescription(""); // Clear if no matching service found in Data.json
    }
  };


  // This is the main form submission for the entire store profile
  const handleFormSubmit = async (e) => {
    const formData = new FormData();
    formData.append("StoreName", storename);
    formData.append("Description", description);
    formData.append("ServiceArea", serviceArea);
    // Construct businessData object for logging and potential non-FormData submission
    const businessData = {
      storeName: storename,
      address: {
        street: streetAddress,
        city: city,
        state: state,
        zipCode: zipCode,
        country: country,
      },
      contact: {
        phone: contactPhone,
        email: contactEmail,
      },
      businessHours: businessHours,
      description: description,
      serviceAreaZipCodes: serviceArea, // Assuming serviceArea is for zip codes
      serviceTags: tags.split(',').map(tag => tag.trim()), // Assuming tags are comma separated
      servicesOffered: Services, // This is from step 1, but might be part of the overall store profile
      // logo and thumbnail are handled as files in FormData
    };

    console.log("Submitting business details (collected data):", businessData);
    console.log("Expected API Endpoint: /api/provider/business (POST or PUT for update)");
    console.log("Expected JSON structure for request body (if not FormData):", JSON.stringify(businessData, null, 2));


    // Existing FormData logic
    const formData = new FormData();
    formData.append("StoreName", storename);
    formData.append("streetAddress", streetAddress);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("zipCode", zipCode);
    formData.append("country", country);
    formData.append("contactPhone", contactPhone);
    formData.append("contactEmail", contactEmail);
    formData.append("businessHours", JSON.stringify(businessHours)); // Send as JSON string
    formData.append("Description", description);
    formData.append("ServiceArea", serviceArea); // Zip codes for service area
    formData.append("Tags", tags); // Comma-separated service tags
    if (logo) formData.append("Logo", logo);
    if (thumbnail) formData.append("Thumbnail", thumbnail);
    formData.append("Services", JSON.stringify(Services)); // Services from step 1

    setLoading(true);
    // Simulate API call result
    const simulateAPICall = async () => {
      return new Promise(resolve => {
        setTimeout(() => {
          // Simulate success or error
          const success = Math.random() > 0.3; // 70% chance of success
          if (success) {
            resolve({ data: { message: "Store updated successfully (mock)", businessId: 'mock_store_123' } });
          } else {
            // Simulate different types of errors
            const errorTypes = [
              { response: { data: { message: "Validation Error: Store name already exists (mock)" } } },
              { response: { data: { message: "Server Error: Could not process request (mock)" } } },
            ];
            resolve(Promise.reject(errorTypes[Math.floor(Math.random() * errorTypes.length)]));
          }
        }, 1000);
      });
    };

    try {
      // const response = await api.post("/store/CreateStore", formData, { headers: { "Content-Type": "multipart/form-data" } });
      // Using simulated call for now as per instructions for this step
      const response = await simulateAPICall();

      toast.success(response.data.message);
      console.log("Mock API Response:", { success: true, data: response.data });
      setLoading(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred (mock).";
      toast.error(errorMessage);
      console.error("Mock API Error Response:", { success: false, message: errorMessage, errorDetails: error.response?.data });
      setLoading(false);
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
          // console.log(data.Services);
          setPreviewThumbnail(data?.Thumbnail);
          setPreviewLogo(data?.Logo);
          setResData(data?.user); // Assuming this is the user ID
          setStorename(data?.StoreName || "");
          setDescription(data?.Description || "");
          setServiceArea(data?.ServiceArea || "");
          setTags(data?.Tags || "");
          // Assuming address was stored as a single string, or needs parsing if it was structured
          // For now, if data.address is a string, it won't directly map to new structured fields.
          // This part would need adjustment based on how address is actually stored and retrieved.
          // If address is an object:
          setStreetAddress(data?.address?.street || data?.address || ""); // Fallback for old string format
          setCity(data?.address?.city || "");
          setState(data?.address?.state || "");
          setZipCode(data?.address?.zipCode || "");
          setCountry(data?.address?.country || "USA");

          setContactPhone(data?.contact?.phone || data?.contactPhone || ""); // Added contactPhone
          setContactEmail(data?.contact?.email || data?.contactEmail || ""); // Added contactEmail

          if (data?.businessHours && typeof data.businessHours === 'object') {
            setBusinessHours(data.businessHours);
          } else if (typeof data.businessHours === 'string') {
            try {
              const parsedHours = JSON.parse(data.businessHours);
              setBusinessHours(parsedHours);
            } catch (e) {
              console.error("Error parsing business hours from string:", e);
              // Keep default hours if parsing fails
            }
          }
          // else keep default hours

          // Convert services from backend to include a unique 'id' if not present, for local state keying
          const servicesWithId = data?.Services?.map((s, index) => ({
            id: s.id || s._id || `service_loaded_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
            name: s.service || s.name,
            description: s.serviceDescription || s.description,
            price: s.price,
            duration: s.duration || "N/A"
          })) || [];
          setServices(servicesWithId);
        }
      } catch (error) {
        console.log(error.message);
        // toast.error("Failed to fetch existing store data."); // Optional: notify user
      }
    };

    fetchData();
  }, []);
  return (
    <div className="mx-40 my-20 max-sm:m-5 max-sm:mx-5">
      <Toaster />
      {loading ? (
        <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div role="status" className="loader">
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
              title: "Business Details", // Renamed Step 0
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
            // For "Save and Preview", we might want to ensure data is valid and submitted
            if (steps === 0 && !validateStep0()) {
                toast.error("Please correct the errors in Business Details before proceeding.");
                return;
            }
            handleFormSubmit(); // This now includes console logs and mock API call
            // The navigation should ideally happen after successful submission confirmation
            // For now, keeping it as is, but in a real app, this would be in a .then() or async/await success block
            if (resData) { // resData might be the user ID or similar identifier for the store
                 router.push(`/DynamicRoutes/Store/${resData}`);
            } else {
                // Handle case where resData is not available (e.g., new store not yet having an ID from backend)
                // toast.info("Store data logged. Preview might not be available for new stores until saved.");
            }
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
            // Similar logic for "Back to dashboard" - ensure data is saved if changes were made
             if (steps === 0 && !validateStep0()) { // Example for step 0
                // Optionally, prompt user if they want to save changes or discard
                // For now, just saving if valid, then navigating
                handleFormSubmit();
             } else if (steps === 1) {
                // Handle saving for step 1 if necessary, or just navigate
                handleFormSubmit(); // Assuming services are also part of the main form submit
             }
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
        <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 border-b pb-3">Business Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Basic Info & Contact */}
            <div>
              {/* Store Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Your store name"
                  className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${errors.storename ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                  value={storename}
                  onChange={(e) => setStorename(e.target.value)}
                  required
                />
                {errors.storename && <p className="text-xs text-red-500 mt-1">{errors.storename}</p>}
              </div>

              {/* Contact Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  placeholder="e.g., contact@yourstore.com"
                  className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
                {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>}
              </div>

              {/* Contact Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  placeholder="e.g., +1-555-123-4567"
                  className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
                {errors.contactPhone && <p className="text-xs text-red-500 mt-1">{errors.contactPhone}</p>}
              </div>

              {/* Business Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Description / About Us <span className="text-red-500">*</span></label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your business..."
                  className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Column 2: Address & Operational Details */}
            <div>
              {/* Street Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g., 123 Main St"
                  className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${errors.streetAddress ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  required
                />
                {errors.streetAddress && <p className="text-xs text-red-500 mt-1">{errors.streetAddress}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="City" className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`} value={city} onChange={(e) => setCity(e.target.value)} required />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State / Province <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="State / Province" className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${errors.state ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`} value={state} onChange={(e) => setState(e.target.value)} required />
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip / Postal Code <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Zip / Postal Code" className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`} value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                  {errors.zipCode && <p className="text-xs text-red-500 mt-1">{errors.zipCode}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Country" className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${errors.country ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`} value={country} onChange={(e) => setCountry(e.target.value)} required />
                  {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                </div>
              </div>

              {/* Service Area Zip Codes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Area Zip Codes (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., 90210, 10001, 60606"
                  className="my-1 w-full outline-0 py-2 px-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                />
              </div>

              {/* Service Categories/Tags */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Categories/Tags (comma-separated) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g., Oil Change, Tire Rotation, Brakes"
                  className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${errors.tags ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  required
                />
                {errors.tags && <p className="text-xs text-red-500 mt-1">{errors.tags}</p>}
              </div>
            </div>
          </div>

          {/* Business Hours Section */}
          <h3 className="text-xl font-semibold mb-4 mt-8 border-b pb-3">Business Hours</h3>
          {errors.businessHours && <p className="text-xs text-red-500 mb-2">{errors.businessHours}</p>}
          <div className="space-y-3">
            {Object.keys(businessHours).map((day) => (
              <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center p-2 border rounded-md bg-gray-50">
                <label className="font-medium text-gray-700 col-span-1 md:col-span-1">{day}</label>
                <div className="col-span-1 md:col-span-1 flex items-center">
                   <input
                    type="checkbox"
                    checked={businessHours[day].isOpen}
                    onChange={() => toggleDayOpen(day)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded mr-2"
                  />
                  <span className="text-sm">{businessHours[day].isOpen ? 'Open' : 'Closed'}</span>
                </div>
                {businessHours[day].isOpen && (
                  <>
                    <input
                      type="time"
                      value={businessHours[day].from}
                      onChange={(e) => handleBusinessHoursChange(day, 'from', e.target.value)}
                      className="w-full outline-0 py-1 px-2 rounded-lg border border-gray-300 text-sm col-span-1 md:col-span-1"
                    />
                    <input
                      type="time"
                      value={businessHours[day].to}
                      onChange={(e) => handleBusinessHoursChange(day, 'to', e.target.value)}
                      className="w-full outline-0 py-1 px-2 rounded-lg border border-gray-300 text-sm col-span-1 md:col-span-1"
                    />
                  </>
                )}
                {!businessHours[day].isOpen && <div className="col-span-1 md:col-span-2"></div>} {/* Placeholder for alignment */}
              </div>
            ))}
          </div>

          {/* Image Uploads Section */}
          <h3 className="text-xl font-semibold mb-4 mt-8 border-b pb-3">Store Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Logo</label>
              <label
                htmlFor="dropzone-file-logo"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                {previewLogo ? (
                  <Image src={previewLogo} alt="Logo Preview" width={100} height={100} className="rounded-lg object-contain h-full" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" viewBox="0 0 20 16" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                    <p className="text-xs text-gray-500"><span className="font-semibold">Click to upload</span> or drag & drop</p>
                  </div>
                )}
                <input id="dropzone-file-logo" type="file" className="hidden" onChange={handleLogo} accept="image/*" />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Thumbnail/Banner</label>
               <label
                htmlFor="dropzone-file-thumbnail"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                {previewThumbnail ? (
                  <Image src={previewThumbnail} alt="Thumbnail Preview" width={200} height={100} className="rounded-lg object-contain h-full"/>
                ) : (
                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" viewBox="0 0 20 16" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                    <p className="text-xs text-gray-500"><span className="font-semibold">Click to upload</span> or drag & drop</p>
                  </div>
                )}
                <input id="dropzone-file-thumbnail" type="file" className="hidden" onChange={handleThumbnail} accept="image/*" />
              </label>
            </div>
          </div>

        </div>
      ) : (
        <div> {/* Placeholder for Steps 1 and 2 content */}
          {steps == 1 ? (
            <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
               <h3 className="text-xl font-semibold mb-6 border-b pb-3">Define Your Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-1">
                    <div id="service-form-section" className="bg-gray-50 p-6 rounded-lg border">
                      <h4 className="text-lg font-semibold mb-3">{currentServiceId ? "Edit Service" : "Add New Service"}</h4>

                      {/* Service Name (from dropdown) */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Name <span className="text-red-500">*</span></label>
                        <select
                          id="serviceNameSelect"
                          className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${serviceErrors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                          value={currentServiceName} // Controlled component
                          onChange={(e) => handleSelectServiceDescription(e.target.value)}
                        >
                          <option value="">-- Select a service --</option>
                          {Data?.Services?.map((s_data, index) => (
                            <option key={index} value={s_data?.ServiceName} className="bg-white">
                              {s_data?.ServiceName}
                            </option>
                          ))}
                        </select>
                        {serviceErrors.name && <p className="text-xs text-red-500 mt-1">{serviceErrors.name}</p>}
                      </div>

                      {/* Service Description (auto-filled) */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Description</label>
                        <textarea
                          className="my-1 w-full text-gray-600 outline-0 py-2 px-3 rounded-lg border border-gray-300 bg-gray-100"
                          rows="3"
                          value={currentServiceDescription} // Controlled component
                          readOnly
                        />
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${serviceErrors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                          placeholder="Enter price"
                          value={currentServicePrice} // Controlled component
                          onChange={(e) => setCurrentServicePrice(e.target.value)}
                        />
                        {serviceErrors.price && <p className="text-xs text-red-500 mt-1">{serviceErrors.price}</p>}
                      </div>

                      {/* Duration */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g., 30 mins, 1 hour, N/A)</label>
                        <input
                          type="text"
                          className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${serviceErrors.duration ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                          placeholder="e.g., 45 mins or N/A"
                          value={currentServiceDuration} // Controlled component
                          onChange={(e) => setCurrentServiceDuration(e.target.value)}
                        />
                        {serviceErrors.duration && <p className="text-xs text-red-500 mt-1">{serviceErrors.duration}</p>}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={handleAddOrUpdateService}
                          className="text-sm bg-blue-500 hover:bg-blue-600 flex-1 text-white px-3 py-2 rounded-lg shadow"
                        >
                          {currentServiceId ? "Update Service" : "Add Service to List"}
                        </button>
                        {currentServiceId && (
                          <button
                            onClick={resetServiceForm}
                            type="button"
                            className="text-sm bg-gray-300 hover:bg-gray-400 flex-1 text-gray-800 px-3 py-2 rounded-lg shadow"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[500px] p-2 bg-gray-50 rounded-lg border">
                  {Services.length === 0 && <p className="text-gray-500 text-center col-span-full py-10">No services added yet.</p>}
                  {Services.map((s_item) => (
                    <div key={s_item.id} className="bg-white p-4 rounded-lg shadow border flex flex-col justify-between">
                      <div>
                        <p className="text-md font-semibold flex items-center gap-2 text-gray-800">
                          <AiFillShop className="w-5 h-5 text-blue-500" />
                          {s_item.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 mb-2 h-16 overflow-y-auto">
                          {s_item.description}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                          Duration: {s_item.duration}
                        </p>
                        <p className="text-md font-semibold flex items-center gap-1 text-gray-800 mt-1">
                          <AiFillDollarCircle className="w-5 h-5 text-green-500" />
                          {s_item.price}$
                        </p>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button
                          className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md shadow flex-1"
                          onClick={() => handleEditService(s_item)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow flex-1"
                          onClick={() => handleDeleteService(s_item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : ( // Step 2: Review and Submit
            <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 border-b pb-3">Review Your Store Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Business Info */}
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-gray-700">Business Information:</h4>
                  <p><strong>Store Name:</strong> {storename}</p>
                  <p><strong>Address:</strong> {`${streetAddress}, ${city}, ${state} ${zipCode}, ${country}`}</p>
                  <p><strong>Contact Email:</strong> {contactEmail}</p>
                  <p><strong>Contact Phone:</strong> {contactPhone}</p>
                  <p className="mt-2"><strong>Description:</strong> {description}</p>
                  <p className="mt-2"><strong>Service Area ZIPs:</strong> {serviceArea}</p>
                  <p><strong>Service Tags:</strong> {tags}</p>

                  <h4 className="font-semibold text-lg mt-4 mb-2 text-gray-700">Business Hours:</h4>
                  <ul className="list-disc list-inside pl-2 text-sm">
                  {Object.entries(businessHours).map(([day, hours]) => (
                    <li key={day}>
                      <strong>{day}:</strong> {hours.isOpen ? `${hours.from || 'N/A'} - ${hours.to || 'N/A'}` : 'Closed'}
                    </li>
                  ))}
                  </ul>

                  <div className="mt-4">
                    <h4 className="font-semibold text-lg mb-2 text-gray-700">Logo:</h4>
                    {previewLogo ? <Image src={previewLogo} alt="Logo Preview" width={100} height={100} className="rounded border"/> : <p>No logo uploaded.</p>}
                  </div>
                   <div className="mt-2">
                    <h4 className="font-semibold text-lg mb-2 text-gray-700">Thumbnail:</h4>
                    {previewThumbnail ? <Image src={previewThumbnail} alt="Thumbnail Preview" width={150} height={100} className="rounded border"/> : <p>No thumbnail uploaded.</p>}
                  </div>
                </div>

                {/* Column 2: Services */}
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-gray-700">Services Offered:</h4>
                  {Services.length > 0 ? (
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                      {Services.map((s, index) => (
                        <li key={index} className="p-3 border rounded-md bg-gray-50">
                          <p className="font-semibold text-gray-800">{s.service} - ${s.price}</p>
                          <p className="text-xs text-gray-600">{s.serviceDescription}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No services added yet.</p>
                  )}
                </div>
              </div>
              <div className="mt-8 text-center">
                 <button
                    onClick={handleFormSubmit} // Final submission
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md text-lg"
                  >
                    Submit and Create Store
                  </button>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-center mt-6 space-x-4">
        {steps > 0 && (
          <button
            onClick={() => setSteps((prev) => prev - 1)}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-white font-semibold shadow"
          >
            Previous
          </button>
        )}

        {steps < 2 && (
          <button
            onClick={() => {
              if (steps === 0) { // Business Details Step
                if (validateStep0()) {
                  // Optionally save Step 0 data here via handleFormSubmit if your API supports partial saves,
                  // or just proceed to next step and save all at the end.
                  // For now, just logging as per simulated API call, actual save is on final submit.
                  console.log("Step 0 (Business Details) validated. Proceeding to Step 1 (Services).");
                  setSteps((prev) => prev + 1);
                } else {
                  toast.error("Please correct the errors before proceeding.");
                }
              } else if (steps === 1) { // Services Step
                // Add any validation for services if needed, e.g., at least one service.
                if (Services.length === 0) {
                    toast.error("Please add at least one service before proceeding to review.");
                    return;
                }
                console.log("Step 1 (Services) completed. Proceeding to Step 2 (Review).");
                setSteps((prev) => prev + 1);
              }
            }}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold shadow"
          >
            Continue Next
          </button>
        )}
      </div>
    </div>
  );
}
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
          // Assuming address was stored as a single string, or needs parsing if it was structured
          // For now, if data.address is a string, it won't directly map to new structured fields.
          // This part would need adjustment based on how address is actually stored and retrieved.
          // If address is an object:
          setStreetAddress(data?.address?.street || data?.address || ""); // Fallback for old string format
          setCity(data?.address?.city || "");
          setState(data?.address?.state || "");
          setZipCode(data?.address?.zipCode || "");
          setCountry(data?.address?.country || "USA");

          setContactPhone(data?.contact?.phone || data?.contactPhone || ""); // Added contactPhone
          setContactEmail(data?.contact?.email || data?.contactEmail || ""); // Added contactEmail

          if (data?.businessHours && typeof data.businessHours === 'object') {
            setBusinessHours(data.businessHours);
          } else if (typeof data.businessHours === 'string') {
            try {
              const parsedHours = JSON.parse(data.businessHours);
              setBusinessHours(parsedHours);
            } catch (e) {
              console.error("Error parsing business hours from string:", e);
              // Keep default hours if parsing fails
            }
          }
          // else keep default hours

          // Convert services from backend to include a unique 'id' if not present, for local state keying
          const servicesWithId = data?.Services?.map((s, index) => ({
            ...s,
            id: s.id || `service_loaded_${index}_${Date.now()}`, // Ensure unique ID for local list management
            name: s.service, // Map 'service' to 'name' for consistency with new form fields
            // description: s.serviceDescription - this will be auto-filled from Data.json based on name
            price: s.price,
            duration: s.duration || "N/A"
          })) || [];
          setServices(servicesWithId);
        }
      } catch (error) {
        console.log(error.message);
        // toast.error("Failed to fetch existing store data."); // Optional: notify user
      }
    };

    fetchData();
  }, []);
  return (
    <div className="mx-40 my-20 max-sm:m-5 max-sm:mx-5">
      <Toaster />
      {loading ? (
        <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div role="status" className="loader">
            <svg
              aria-hidden="true"
              className="w-[100px] h-[100px] mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
            <span className="sr-only">Loading...</span>
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
                    <div id="service-form-section" className="bg-gray-50 p-6 rounded-lg border">
                      <h4 className="text-lg font-semibold mb-3">{currentServiceId ? "Edit Service" : "Add New Service"}</h4>

                      {/* Service Name (from dropdown) */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Name <span className="text-red-500">*</span></label>
                        <select
                          id="serviceNameSelect"
                          className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${serviceErrors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                          value={currentServiceName}
                          onChange={(e) => handleSelectServiceDescription(e.target.value)}
                        >
                          <option value="">-- Select a service --</option>
                          {Data?.Services?.map((s_data, index) => (
                            <option key={index} value={s_data?.ServiceName} className="bg-white">
                              {s_data?.ServiceName}
                            </option>
                          ))}
                        </select>
                        {serviceErrors.name && <p className="text-xs text-red-500 mt-1">{serviceErrors.name}</p>}
                      </div>

                      {/* Service Description (auto-filled) */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Description</label>
                        <textarea
                          className="my-1 w-full text-gray-600 outline-0 py-2 px-3 rounded-lg border border-gray-300 bg-gray-100"
                          rows="3"
                          value={currentServiceDescription}
                          readOnly
                        />
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${serviceErrors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                          placeholder="Enter price"
                          value={currentServicePrice}
                          onChange={(e) => setCurrentServicePrice(e.target.value)}
                        />
                        {serviceErrors.price && <p className="text-xs text-red-500 mt-1">{serviceErrors.price}</p>}
                      </div>

                      {/* Duration */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g., 30 mins, 1 hour, N/A)</label>
                        <input
                          type="text"
                          className={`my-1 w-full outline-0 py-2 px-3 rounded-lg border ${serviceErrors.duration ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`}
                          placeholder="e.g., 45 mins or N/A"
                          value={currentServiceDuration}
                          onChange={(e) => setCurrentServiceDuration(e.target.value)}
                        />
                        {serviceErrors.duration && <p className="text-xs text-red-500 mt-1">{serviceErrors.duration}</p>}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={handleAddOrUpdateService}
                          className="text-sm bg-blue-500 hover:bg-blue-600 flex-1 text-white px-3 py-2 rounded-lg shadow"
                        >
                          {currentServiceId ? "Update Service" : "Add Service to List"}
                        </button>
                        {currentServiceId && (
                          <button
                            onClick={resetServiceForm}
                            type="button"
                            className="text-sm bg-gray-300 hover:bg-gray-400 flex-1 text-gray-800 px-3 py-2 rounded-lg shadow"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[500px] p-2 bg-gray-50 rounded-lg border">
                    {Services.length === 0 && <p className="text-gray-500 text-center col-span-full py-10">No services added yet.</p>}
                    {Services.map((s_item) => ( // Renamed data to s_item to avoid conflict
                      <div key={s_item.id} className="bg-white p-4 rounded-lg shadow border flex flex-col justify-between">
                        <div>
                          <p className="text-md font-semibold flex items-center gap-2 text-gray-800">
                            <AiFillShop className="w-5 h-5 text-blue-500" />
                            {s_item.name} {/* Changed from data.service */}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 mb-2 h-16 overflow-y-auto">
                            {s_item.description} {/* Changed from data.serviceDescription */}
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            Duration: {s_item.duration}
                          </p>
                          <p className="text-md font-semibold flex items-center gap-1 text-gray-800 mt-1">
                            <AiFillDollarCircle className="w-5 h-5 text-green-500" />
                            {s_item.price}$
                          </p>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <button
                            className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md shadow flex-1"
                            onClick={() => handleEditService(s_item)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow flex-1"
                            onClick={() => handleDeleteService(s_item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[500px] p-2 bg-gray-50 rounded-lg border">
                    {Services.length === 0 && <p className="text-gray-500 text-center col-span-full py-10">No services added yet.</p>}
                    {Services.map((s_item) => (
                      <div key={s_item.id} className="bg-white p-4 rounded-lg shadow border flex flex-col justify-between">
                        <div>
                          <p className="text-md font-semibold flex items-center gap-2 text-gray-800">
                            <AiFillShop className="w-5 h-5 text-blue-500" />
                            {s_item.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 mb-2 h-16 overflow-y-auto">
                            {s_item.description}
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            Duration: {s_item.duration}
                          </p>
                          <p className="text-md font-semibold flex items-center gap-1 text-gray-800 mt-1">
                            <AiFillDollarCircle className="w-5 h-5 text-green-500" />
                            {s_item.price}$
                          </p>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <button
                            className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md shadow flex-1"
                            onClick={() => handleEditService(s_item)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow flex-1"
                            onClick={() => handleDeleteService(s_item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
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
