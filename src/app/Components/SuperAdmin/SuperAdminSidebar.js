"use client";
import React from 'react';
import Link from 'next/link';
import { FiGrid, FiUsers } from 'react-icons/fi'; // Example icon, Added FiUsers

export default function SuperAdminSidebar() {
  // In a real app, you might get user info here
  const adminName = "Super Admin";

  return (
    <div className="h-screen py-4 overflow-y-auto bg-gray-800 text-white shadow-lg">
      <div className="px-6 py-3 mb-4">
        <h2 className="text-xl font-semibold">{adminName}</h2>
        <p className="text-sm text-gray-400">Super Admin Panel</p>
      </div>
      <ul className="space-y-2 font-medium px-6">
        <li>
          <Link
            href="/Routes/SuperAdmin/Insights"
            className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700 group focus:bg-gray-600"
          >
            <FiGrid className="w-5 h-5 text-gray-400 group-hover:text-gray-200" />
            <span className="ml-3">Insights</span>
          </Link>
        </li>
        <li>
          <Link
            href="/Routes/SuperAdmin/Subscribers"
            className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700 group focus:bg-gray-600"
          >
            <FiUsers className="w-5 h-5 text-gray-400 group-hover:text-gray-200" />
            <span className="ml-3">Subscribers</span>
          </Link>
        </li>
        {/* More links can be added here later */}
      </ul>
    </div>
  );
}
