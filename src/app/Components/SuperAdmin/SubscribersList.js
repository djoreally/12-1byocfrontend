"use client";
import React from 'react';

const mockSubscribers = [
  { id: 'user001', name: 'Alice Wonderland', email: 'alice@example.com', plan: 'Premium Monthly', status: 'Active' },
  { id: 'user002', name: 'Bob The Builder', email: 'bob@example.com', plan: 'Basic Yearly', status: 'Active' },
  { id: 'user003', name: 'Charlie Brown', email: 'charlie@example.com', plan: 'Premium Monthly', status: 'Inactive' },
];

export default function SubscribersList() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">Manage Subscribers</h1>
      <p className="text-gray-500 mb-6">
        [Subscribers List Placeholder: Manage platform subscribers, view details, and status.]
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription Plan
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockSubscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subscriber.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subscriber.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subscriber.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subscriber.plan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    subscriber.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {subscriber.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">View</button>
                  <button className="text-red-600 hover:text-red-900">Suspend</button>
                </td>
              </tr>
            ))}
            {mockSubscribers.length === 0 && (
                <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">No subscribers found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
