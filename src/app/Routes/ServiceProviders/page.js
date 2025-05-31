"use client";
import React, { useState } from 'react';
import Navbar from '@/app/Components/Navbar'; // Assuming Navbar is in this path
import Link from 'next/link'; // For "View Details" button

// Mock data for initial display or after a mock search
const mockProviders = [
  { id: 'prov1', name: 'Speedy Lube Pros', location: 'New York, NY', servicesSnippet: 'Oil changes, tire rotation, basic diagnostics.', description: 'Fast and reliable auto services.' },
  { id: 'prov2', name: 'Mobile Mech Masters', location: 'Los Angeles, CA', servicesSnippet: 'Mobile mechanic, brake repair, battery replacement.', description: 'We come to you! Quality repairs at your convenience.' },
  { id: 'prov3', name: 'Quick Oil Changers', location: 'Chicago, IL', servicesSnippet: 'Specializing in quick oil changes and fluid checks.', description: 'In and out in 30 minutes or less!' },
  { id: 'prov4', name: 'Eco Car Care', location: 'Houston, TX', servicesSnippet: 'Eco-friendly car washes and detailing services.', description: 'Green solutions for a clean car.' },
];

export default function ServiceProvidersPage() {
  const [locationFilter, setLocationFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [businessNameFilter, setBusinessNameFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Initially empty, or could show all/featured
  const [searched, setSearched] = useState(false); // To know if a search has been performed

  const handleSearch = () => {
    const filters = {
      location: locationFilter,
      service: serviceTypeFilter,
      name: businessNameFilter,
    };

    // Simulate API call
    console.log("Searching providers with filters:", filters);
    const queryParams = new URLSearchParams(filters).toString();
    console.log(`Simulated API Endpoint: /api/providers/search?${queryParams}`);

    // Simulate API response by filtering mockProviders (in a real app, this comes from backend)
    const filteredResults = mockProviders.filter(provider =>
        (filters.location ? provider.location.toLowerCase().includes(filters.location.toLowerCase()) : true) &&
        (filters.service ? provider.servicesSnippet.toLowerCase().includes(filters.service.toLowerCase()) : true) &&
        (filters.name ? provider.name.toLowerCase().includes(filters.name.toLowerCase()) : true)
    );

    console.log("Mock API Response:", filteredResults);
    setSearchResults(filteredResults);
    setSearched(true);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24"> {/* Added pt-24 for navbar offset */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Find Service Providers</h1>

          {/* Search Filters */}
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
          {searched && searchResults.length === 0 && (
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
                  <p className="text-sm text-gray-600 mb-1"><strong>Location:</strong> {provider.location}</p>
                  <p className="text-sm text-gray-600 mb-3"><strong>Services:</strong> {provider.servicesSnippet}</p>
                  <p className="text-sm text-gray-500 mb-4 flex-grow">{provider.description}</p>
                </div>
                <div className="p-6 bg-gray-50">
                  {/* In a real app, this would link to /Routes/DynamicRoutes/Store/[id]/page.js or similar */}
                  <Link href={`/DynamicRoutes/Store/${provider.id}`}>
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
