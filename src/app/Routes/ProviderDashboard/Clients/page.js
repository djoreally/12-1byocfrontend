"use client";
import React from 'react';
import ClientsTable from '@/app/Components/ProviderDashboard/ClientsTable';
import Navbar from '../../navbar'; // Assuming navbar is in ../../ from Clients/page.js
// import Sidebar from '../sidebar/page'; // Assuming sidebar is in ../sidebar/ from Clients/page.js - Adjust if needed.
// We need to ensure the main dashboard layout (sidebar + navbar) is correctly applied.
// For now, focusing on rendering ClientsTable with Navbar. Sidebar integration will be part of the overall layout.

export default function ClientsPage() {
  return (
    <div className="mt-10 mx-4 md:mx-20 max-sm:mt-5 max-sm:mx-5">
      <Navbar />
      <div className="mt-5">
        <ClientsTable />
      </div>
    </div>
  );
}
