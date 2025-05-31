"use client";
import React from 'react';

export default function InsightsDashboard() {
  return (
    <div
      className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white text-center shadow"
      style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">Insights Dashboard</h1>
      <p className="text-gray-500">
        [Insights Dashboard Placeholder: Key Performance Indicators, Charts, and Platform Analytics will be displayed here.]
      </p>
      <div className="mt-6 space-y-2">
        <div className="p-4 bg-gray-100 rounded-md w-full max-w-md mx-auto">
          <p className="text-sm text-gray-600">Total Users: [Placeholder Value]</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-md w-full max-w-md mx-auto">
          <p className="text-sm text-gray-600">Total Providers: [Placeholder Value]</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-md w-full max-w-md mx-auto">
          <p className="text-sm text-gray-600">Total Bookings Today: [Placeholder Value]</p>
        </div>
      </div>
    </div>
  );
}
