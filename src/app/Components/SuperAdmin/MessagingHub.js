"use client";
import React, { useState } from 'react';

const mockThreads = [
  { id: 'thread1', subject: 'Platform Maintenance Announcement', lastReply: 'Admin', date: '2023-11-15', unread: true },
  { id: 'thread2', subject: 'Support Ticket #12345 - Billing Issue', lastReply: 'UserX', date: '2023-11-14', unread: false },
  { id: 'thread3', subject: 'Feedback on New Feature', lastReply: 'UserY', date: '2023-11-12', unread: false },
];

export default function MessagingHub() {
  const [showCompose, setShowCompose] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [recipientSegment, setRecipientSegment] = useState('all_users');

  const handleSendMessage = (e) => {
    e.preventDefault();
    alert(`Message Sent!\nTo: ${recipientSegment}\nSubject: ${composeSubject}\nMessage: ${composeMessage}`);
    // Reset form
    setComposeSubject('');
    setComposeMessage('');
    setShowCompose(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-700">Messaging Hub</h1>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {showCompose ? 'Cancel' : 'Compose Message'}
        </button>
      </div>
      <p className="text-gray-500 mb-6">
        [Messaging Hub Placeholder: Send announcements, manage support tickets, or communicate with user segments.]
      </p>

      {showCompose && (
        <form onSubmit={handleSendMessage} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-3 text-gray-700">New Message/Announcement</h3>
          <div className="mb-3">
            <label htmlFor="recipientSegment" className="block text-sm font-medium text-gray-700">Recipient Segment</label>
            <select
              id="recipientSegment"
              value={recipientSegment}
              onChange={(e) => setRecipientSegment(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all_users">All Users</option>
              <option value="all_providers">All Providers</option>
              <option value="all_customers">All Customers</option>
              <option value="specific_user">Specific User/Segment (not implemented)</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="composeSubject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              id="composeSubject"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Announcement Title or Subject"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="composeMessage" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="composeMessage"
              rows="4"
              value={composeMessage}
              onChange={(e) => setComposeMessage(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Type your message here..."
              required
            ></textarea>
          </div>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Send Message
          </button>
        </form>
      )}

      <h3 className="text-xl font-semibold text-gray-700 mb-3">Message Threads</h3>
      <div className="space-y-3">
        {mockThreads.map(thread => (
          <div key={thread.id} className={`p-3 border rounded-lg ${thread.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-800">{thread.subject}</h4>
              <span className="text-xs text-gray-500">{thread.date}</span>
            </div>
            <p className="text-sm text-gray-600">Last reply by: {thread.lastReply}</p>
            {thread.unread && <span className="text-xs font-semibold text-blue-600">New</span>}
          </div>
        ))}
         {mockThreads.length === 0 && (
            <p className="text-sm text-gray-500">No message threads to display.</p>
        )}
      </div>
    </div>
  );
}
