"use client";
import React from 'react';
import Link from 'next/link';
import { FiGrid, FiUsers, FiCreditCard, FiMessageSquare, FiUserCheck, FiSettings } from 'react-icons/fi'; // Added FiSettings

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
        <li>
          <Link
            href="/Routes/SuperAdmin/Plans"
            className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700 group focus:bg-gray-600"
          >
            <FiCreditCard className="w-5 h-5 text-gray-400 group-hover:text-gray-200" />
            <span className="ml-3">Manage Plans</span>
          </Link>
        </li>
        <li>
          <Link
            href="/Routes/SuperAdmin/Messaging"
            className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700 group focus:bg-gray-600"
          >
            <FiMessageSquare className="w-5 h-5 text-gray-400 group-hover:text-gray-200" />
            <span className="ml-3">Messaging Hub</span>
          </Link>
        </li>
        <li>
          <Link
            href="/Routes/SuperAdmin/Providers"
            className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700 group focus:bg-gray-600"
          >
            <FiUserCheck className="w-5 h-5 text-gray-400 group-hover:text-gray-200" />
            <span className="ml-3">Moderate Providers</span>
          </Link>
        </li>
        <li>
          <Link
            href="/Routes/SuperAdmin/Settings"
            className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700 group focus:bg-gray-600"
          >
            <FiSettings className="w-5 h-5 text-gray-400 group-hover:text-gray-200" />
            <span className="ml-3">Platform Settings</span>
          </Link>
        </li>
        {/* More links can be added here later */}
      </ul>
    </div>
  );
}
