"use client";
import React, { useState, useEffect } from 'react';

export default function ChecklistComponent({ items: initialItems, bookingId }) {
  const [checklistItems, setChecklistItems] = useState(initialItems);

  // Reset checklist when initialItems or bookingId changes (i.e., a new job is viewed)
  useEffect(() => {
    setChecklistItems(initialItems.map(item => ({ ...item, checked: false })));
  }, [initialItems, bookingId]);

  const handleCheckboxChange = (itemId) => {
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
    // Optional: Log change with bookingId and itemId
    // console.log(`Checklist item ${itemId} for booking ${bookingId} changed.`);
  };

  if (!checklistItems || checklistItems.length === 0) {
    return <p className="text-sm text-gray-500">No checklist items for this service.</p>;
  }

  return (
    <div className="my-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h4 className="text-md font-semibold mb-3 text-gray-700">Service Checklist</h4>
      <ul className="space-y-2">
        {checklistItems.map(item => (
          <li key={item.id} className="flex items-center">
            <input
              type="checkbox"
              id={`checklist-${bookingId}-${item.id}`} // Ensure unique ID for label linking
              checked={item.checked}
              onChange={() => handleCheckboxChange(item.id)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={`checklist-${bookingId}-${item.id}`}
              className={`ml-2 text-sm ${item.checked ? 'text-gray-500 line-through' : 'text-gray-700'}`}
            >
              {item.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
