"use client";
import React from 'react';

const mockPlans = [
  {
    id: 'plan_basic',
    name: 'Basic',
    price: '$9.99/month',
    features: ['Feature A', 'Feature B', 'Limited Support'],
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    buttonColor: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    price: '$29.99/month',
    features: ['All Basic Features', 'Feature C', 'Feature D', 'Priority Support'],
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    buttonColor: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    price: 'Contact Us',
    features: ['All Pro Features', 'Dedicated Account Manager', 'Custom Integrations', '24/7 Support'],
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    buttonColor: 'bg-purple-500 hover:bg-purple-600'
  },
];

export default function ManagePlans() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">Manage Subscription Plans</h1>
      <p className="text-gray-500 mb-6">
        [Manage Plans Placeholder: Create, edit, and manage SaaS pricing tiers and features.]
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
          <div key={plan.id} className={`rounded-lg shadow-md p-6 flex flex-col ${plan.bgColor}`}>
            <h2 className={`text-xl font-bold mb-3 ${plan.textColor}`}>{plan.name}</h2>
            <p className={`text-3xl font-extrabold mb-4 ${plan.textColor}`}>{plan.price}</p>
            <ul className="space-y-2 mb-6 text-sm text-gray-600 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
                 <button className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md ${plan.buttonColor} focus:outline-none focus:ring-2 focus:ring-opacity-75`}>
                    Edit Plan
                </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75">
            + Create New Plan
        </button>
      </div>
    </div>
  );
}
