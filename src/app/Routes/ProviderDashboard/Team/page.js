"use client";
import React from 'react';
import TeamManager from '@/app/Components/ProviderDashboard/TeamManager';
import Navbar from '../../navbar'; // Assuming navbar is in ../../ from Team/page.js

export default function TeamPage() {
  return (
    <div className="mt-10 mx-4 md:mx-20 max-sm:mt-5 max-sm:mx-5">
      <Navbar />
      <div className="mt-5">
        <TeamManager />
      </div>
    </div>
  );
}
