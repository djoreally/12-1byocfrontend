"use client";
import React, { useState, useMemo } from 'react';

// Mock data for clients
const mockClients = [
  { id: 1, name: 'Alice Wonderland', email: 'alice@example.com', phone: '123-456-7890', totalBookings: 5, lastBookingDate: '2023-10-15' },
  { id: 2, name: 'Bob The Builder', email: 'bob@example.com', phone: '234-567-8901', totalBookings: 3, lastBookingDate: '2023-11-01' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012', totalBookings: 8, lastBookingDate: '2023-09-20' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: '456-789-0123', totalBookings: 2, lastBookingDate: '2023-11-10' },
  { id: 5, name: 'Edward Scissorhands', email: 'edward@example.com', phone: '567-890-1234', totalBookings: 12, lastBookingDate: '2023-10-28' },
];

export default function ClientsTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = useMemo(() => {
    if (!searchTerm) {
      return mockClients;
    }
    return mockClients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Manage Clients</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clients (by name or email)..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Phone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Bookings
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Booking Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{client.totalBookings}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.lastBookingDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
