"use client";
import React, { useState } from 'react';

const initialTeamMembers = [
  { id: 'tm1', name: 'Jane Doe', role: 'Lead Technician', email: 'jane@example.com' },
  { id: 'tm2', name: 'John Smith', role: 'Technician', email: 'john@example.com' },
  { id: 'tm3', name: 'Alice Johnson', role: 'Service Advisor', email: 'alice.j@example.com' },
];

export default function TeamManager() {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName || !newMemberRole || !newMemberEmail) {
      alert('Please fill in all fields for the new team member.');
      return;
    }
    const newMember = {
      id: `tm${teamMembers.length + 1}-${Date.now()}`, // Simple unique ID
      name: newMemberName,
      role: newMemberRole,
      email: newMemberEmail,
    };
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberEmail('');
    setShowAddForm(false);
  };

  const handleRemoveMember = (memberId) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Team Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {showAddForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddMember} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Add New Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="memberName" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="memberName"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="memberRole" className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                id="memberRole"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Technician"
              />
            </div>
            <div>
              <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="memberEmail"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email Address"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Save Member
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamMembers.length > 0 ? teamMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No team members added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
