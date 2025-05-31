"use client";
import React, { useState } from 'react';

const mockProvidersData = [
  { id: 'prov001', businessName: 'Speedy Lube Pros', contactEmail: 'contact@speedylube.com', status: 'Pending Approval' },
  { id: 'prov002', businessName: 'Mobile Mech Masters', contactEmail: 'info@mobilemech.com', status: 'Active' },
  { id: 'prov003', businessName: 'Quick Oil Changers', contactEmail: 'support@quickoil.com', status: 'Suspended' },
  { id: 'prov004', businessName: 'Eco Car Care', contactEmail: 'eco@carcare.com', status: 'Active' },
];

export default function ModerateProviders() {
  const [providers, setProviders] = useState(mockProvidersData);

  const handleApprove = (providerId) => {
    alert(`Provider ${providerId} approved! (Placeholder action)`);
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, status: 'Active' } : p));
  };

  const handleSuspend = (providerId) => {
    alert(`Provider ${providerId} suspended! (Placeholder action)`);
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, status: 'Suspended' } : p));
  };

  const handleReactivate = (providerId) => {
    alert(`Provider ${providerId} reactivated! (Placeholder action)`);
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, status: 'Active' } : p));
  };


  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">Moderate Service Providers</h1>
      <p className="text-gray-500 mb-6">
        [Moderate Providers Placeholder: Approve new provider applications, manage statuses (suspend/reactivate accounts).]
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {providers.map((provider) => (
              <tr key={provider.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{provider.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.businessName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.contactEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    provider.status === 'Active' ? 'bg-green-100 text-green-800' :
                    provider.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {provider.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">Details</button>
                  {provider.status === 'Pending Approval' && (
                    <button onClick={() => handleApprove(provider.id)} className="text-green-600 hover:text-green-900">Approve</button>
                  )}
                  {provider.status === 'Active' && (
                    <button onClick={() => handleSuspend(provider.id)} className="text-red-600 hover:text-red-900">Suspend</button>
                  )}
                  {provider.status === 'Suspended' && (
                    <button onClick={() => handleReactivate(provider.id)} className="text-yellow-600 hover:text-yellow-900">Reactivate</button>
                  )}
                </td>
              </tr>
            ))}
            {providers.length === 0 && (
                <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No providers found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
