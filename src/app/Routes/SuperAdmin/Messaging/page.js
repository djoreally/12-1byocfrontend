"use client";
import React from 'react';
import Navbar from '@/app/Components/Navbar';
import SuperAdminSidebar from '@/app/Components/SuperAdmin/SuperAdminSidebar';
import MessagingHub from '@/app/Components/SuperAdmin/MessagingHub';

export default function MessagingPage() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16"> {/* pt-16 assumes navbar height, adjust if needed */}
        <div className="w-64 fixed top-16 left-0 h-full"> {/* Fixed sidebar */}
          <SuperAdminSidebar />
        </div>
        <main className="flex-1 ml-64 p-6 bg-gray-100 overflow-y-auto"> {/* Main content with margin for sidebar */}
          <MessagingHub />
        </main>
      </div>
    </div>
  );
}
