"use client";
import React, { useState } from 'react';

const initialInventory = [
  { id: 'oil1', name: 'Synthetic Oil 5W-30 5L', stock: 10, unit: 'bottles' },
  { id: 'oil2', name: 'Conventional Oil 10W-40 5L', stock: 15, unit: 'bottles' },
  { id: 'filter1', name: 'Oil Filter Bosch 0451103314', stock: 25, unit: 'pieces' },
  { id: 'filter2', name: 'Oil Filter Mann W712/75', stock: 30, unit: 'pieces' },
  { id: 'airfilter1', name: 'Air Filter Fram CA8755A', stock: 12, unit: 'pieces' },
  { id: 'wiper1', name: 'Wiper Blades 22"', stock: 20, unit: 'pairs' },
];

export default function InventoryTracker() {
  const [inventory, setInventory] = useState(initialInventory);
  const [updateValues, setUpdateValues] = useState({}); // To store input values for each item

  const handleStockChange = (itemId, amount) => {
    setInventory(prevInventory =>
      prevInventory.map(item =>
        item.id === itemId ? { ...item, stock: Math.max(0, item.stock + amount) } : item
      )
    );
  };

  const handleInputChange = (itemId, value) => {
    setUpdateValues(prev => ({ ...prev, [itemId]: value }));
  };

  const applyStockUpdate = (itemId, action) => {
    const value = parseInt(updateValues[itemId], 10);
    if (!isNaN(value) && value > 0) {
      handleStockChange(itemId, action === 'add' ? value : -value);
      setUpdateValues(prev => ({ ...prev, [itemId]: '' })); // Clear input after update
    } else if (!isNaN(value) && value <= 0) {
        alert("Please enter a positive value for stock update.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Inventory Tracker</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
                  <input
                    type="number"
                    min="1"
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                    placeholder="Qty"
                    value={updateValues[item.id] || ''}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                  />
                  <button
                    onClick={() => applyStockUpdate(item.id, 'add')}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => applyStockUpdate(item.id, 'reduce')}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                  >
                    Reduce
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
