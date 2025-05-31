"use client";
import React, { useState } from 'react';

export default function PlatformSettings() {
  // Mock state for settings - in a real app, this would come from a backend/store
  const [settings, setSettings] = useState({
    siteName: 'BookYourOilChange Platform',
    adminEmail: 'admin@bookyouroilchange.com',
    paymentGatewayKey: 'pk_test_xxxxxxxxxxxxxx_mock',
    mappingServiceKey: 'map_key_xxxxxxxxxxxx_mock',
    emailService: 'Active (SendGrid)',
    analyticsIntegration: 'Active (Google Analytics)',
    maintenanceMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveChanges = (section) => {
    alert(`${section} settings saved! (Placeholder action)`);
    // Here you would typically make an API call to save the settings
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">Platform Settings</h1>
      <p className="text-gray-500 mb-6">
        [Platform Settings Placeholder: Manage global platform configurations, API keys, and integrations.]
      </p>

      {/* General Settings Section */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-medium text-gray-800 mb-3">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Site Name</label>
            <input
              type="text"
              name="siteName"
              id="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">Admin Contact Email</label>
            <input
              type="email"
              name="adminEmail"
              id="adminEmail"
              value={settings.adminEmail}
              onChange={handleChange}
              className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="maintenanceMode"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">Enable Maintenance Mode</label>
          </div>
        </div>
        <button
            onClick={() => handleSaveChanges('General')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600"
        >
            Save General Settings
        </button>
      </div>

      {/* API Keys Section */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-medium text-gray-800 mb-3">API Keys & Integrations</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="paymentGatewayKey" className="block text-sm font-medium text-gray-700">Payment Gateway Key (e.g., Stripe)</label>
            <input
              type="text"
              name="paymentGatewayKey"
              id="paymentGatewayKey"
              value={settings.paymentGatewayKey}
              onChange={handleChange}
              className="mt-1 block w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="mappingServiceKey" className="block text-sm font-medium text-gray-700">Mapping Service Key (e.g., Google Maps)</label>
            <input
              type="text"
              name="mappingServiceKey"
              id="mappingServiceKey"
              value={settings.mappingServiceKey}
              onChange={handleChange}
              className="mt-1 block w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
           <div>
            <p className="text-sm font-medium text-gray-700">Email Service Status</p>
            <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded-md mt-1 md:w-1/2">{settings.emailService}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Analytics Integration Status</p>
            <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded-md mt-1 md:w-1/2">{settings.analyticsIntegration}</p>
          </div>
        </div>
         <button
            onClick={() => handleSaveChanges('API/Integrations')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600"
        >
            Save API Settings
        </button>
      </div>

    </div>
  );
}
