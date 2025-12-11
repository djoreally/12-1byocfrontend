"use client";
import React, { useState } from 'react';
import Navbar from '@/app/Components/Navbar';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast'; // Added for error notifications

// Updated Mock data for initial display or after a mock search
const mockProviders = [
  {
    id: 'prov1',
    name: 'Speedy Lube Pros',
    address: { city: 'New York', state: 'NY', zipCode: '10001' },
    services: [
      { name: 'Standard Oil Change', price: '39.99', duration: '30 mins' },
      { name: 'Synthetic Oil Change', price: '69.99', duration: '45 mins' },
      { name: 'Tire Rotation', price: '24.99', duration: '20 mins' },
    ],
    tags: ['Oil Change', 'Quick Service', 'Tire Rotation'],
    description: 'Fast and reliable auto services for all your needs. We specialize in quick oil changes and tire services.'
  },
  {
    id: 'prov2',
    name: 'Mobile Mech Masters',
    address: { city: 'Los Angeles', state: 'CA', zipCode: '90001' },
    services: [
      { name: 'Brake Pad Replacement', price: '149.99', duration: '1.5 hours' },
      { name: 'Car Battery Test & Replacement', price: '49.99', duration: '45 mins' },
      { name: 'Check Engine Light Diagnostics', price: '79.99', duration: '1 hour' },
    ],
    tags: ['Mobile Mechanic', 'Brakes', 'Battery', 'Diagnostics'],
    description: 'We come to you! Quality repairs at your convenience with certified mobile mechanics.'
  },
  {
    id: 'prov3',
    name: 'Quick Oil Changers',
    address: { city: 'Chicago', state: 'IL', zipCode: '60606' },
    services: [
      { name: 'Express Oil Change', price: '45.00', duration: '25 mins' },
      { name: 'Fluid Top-Up Service', price: '15.00', duration: '10 mins' },
    ],
    tags: ['Oil Change', 'Express Service', 'Fluids'],
    description: 'In and out in 30 minutes or less! Your go-to for quick oil changes.'
  },
  {
    id: 'prov4',
    name: 'Eco Car Care',
    address: { city: 'Houston', state: 'TX', zipCode: '77001' },
    services: [
      { name: 'Eco-Friendly Car Wash', price: '25.00', duration: '45 mins' },
      { name: 'Interior Detailing (Eco)', price: '99.00', duration: '2 hours' },
    ],
    tags: ['Car Wash', 'Detailing', 'Eco-Friendly'],
    description: 'Green solutions for a clean car. We use only environmentally friendly products.'
  },
];

export default function ServiceProvidersPage() {
  const [locationFilter, setLocationFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState(''); // Can be service name or tag
  const [businessNameFilter, setBusinessNameFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    const filters = {
      location: locationFilter.trim(),
      serviceType: serviceTypeFilter.trim().toLowerCase(),
      businessName: businessNameFilter.trim().toLowerCase(),
    };

    console.log("Initiating search with filters:", filters);
    const queryParams = new URLSearchParams();
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.serviceType) queryParams.append('serviceType', filters.serviceType);
    if (filters.businessName) queryParams.append('businessName', filters.businessName);

    console.log(`Simulating API Call: GET /api/providers/search?${queryParams.toString()}`);

    new Promise(resolve => {
      setTimeout(() => {
        const filteredResults = mockProviders.filter(provider => {
          let matches = true;
          // Location filter (checks city or zip)
          if (filters.location) {
            const locationLower = filters.location.toLowerCase();
            const matchesLocation =
              provider.address.city.toLowerCase().includes(locationLower) ||
              provider.address.zipCode.includes(locationLower);
            if (!matchesLocation) matches = false;
          }
          // Service Type / Tag filter
          if (matches && filters.serviceType) {
            const matchesServiceOrTag =
              provider.services.some(service => service.name.toLowerCase().includes(filters.serviceType)) ||
              (provider.tags && provider.tags.some(tag => tag.toLowerCase().includes(filters.serviceType)));
            if (!matchesServiceOrTag) matches = false;
          }
          // Business Name filter
          if (matches && filters.businessName) {
            if (!provider.name.toLowerCase().includes(filters.businessName)) {
              matches = false;
            }
          }
          return matches;
        });
        resolve({ ok: true, json: () => Promise.resolve(filteredResults) });
      }, 500);
    })
    .then(response => {
      if (!response.ok) {
         return response.json().then(err => {
            console.error("Simulated API Error:", err.message);
            toast.error(err.message || "Search failed (simulated error).");
            setSearchResults([]);
            setNoResults(true);
            return; // Important to stop further processing
         });
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        console.log("Simulated API Success. Search results:", data);
        setSearchResults(data);
        setNoResults(data.length === 0);
      }
    })
    .catch(error => {
      console.error("Error during simulated search:", error);
      toast.error("Failed to fetch search results (simulated catch).");
      setSearchResults([]);
      setNoResults(true);
    });
  };

  return (
    <div>
      <Navbar />
      <Toaster position="top-center" /> {/* Added Toaster for notifications */}
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Find Service Providers</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (City/Zip)</label>
              <input
                type="text"
                id="location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="e.g., New York or 10001"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Service Type</label>
              <input
                type="text"
                id="serviceType"
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                placeholder="e.g., oil change, brakes"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                id="businessName"
                value={businessNameFilter}
                onChange={(e) => setBusinessNameFilter(e.target.value)}
                placeholder="e.g., Auto Shop Pro"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Search Providers
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div>
          {noResults && searchResults.length === 0 && (
            <p className="text-center text-gray-500">No providers found matching your criteria.</p>
          )}
          {searchResults.length > 0 && (
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Search Results</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map(provider => (
              <div key={provider.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{provider.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Location:</strong> {provider.address.city}, {provider.address.state} {provider.address.zipCode}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Services:</strong> {(provider.services.map(s => s.name).slice(0, 2).join(', ') + (provider.services.length > 2 ? '...' : '')) || (provider.tags && provider.tags.slice(0,3).join(', ') + (provider.tags.length > 3 ? '...' : ''))}
                  </p>
                  <p className="text-sm text-gray-500 mb-4 flex-grow h-20 overflow-hidden text-ellipsis">
                    {provider.description}
                  </p>
                </div>
                <div className="p-6 bg-gray-50 border-t">
                  <Link href={`/DynamicRoutes/Store/${provider.id}`} legacyBehavior>
                    <a className="block w-full text-center px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition-colors">
                      View Details
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
