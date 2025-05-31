"use client";
import React from 'react';
import InventoryTracker from '@/app/Components/ProviderDashboard/InventoryTracker';
import Navbar from '../../navbar'; // Assuming navbar is in ../../ from Inventory/page.js
// Sidebar would typically be part of a shared layout for the dashboard routes.
// For now, this page will render Navbar and InventoryTracker.

export default function InventoryPage() {
  return (
    <div className="mt-10 mx-4 md:mx-20 max-sm:mt-5 max-sm:mx-5">
      <Navbar />
      <div className="mt-5">
        <InventoryTracker />
      </div>
    </div>
  );
}
