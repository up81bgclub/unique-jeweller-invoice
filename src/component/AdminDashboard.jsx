import React, { useState } from 'react';
import InvoiceBuilder from './InvoiceBuilder';
import InvoiceList from './InvoiceList';
import ItemManager from './ItemManager';
import StaffManager from './Staffmanager';

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('builder');

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Tabs Header */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex-1 min-w-[120px] py-2 px-4 text-sm font-bold rounded-md transition-colors ${
              activeTab === 'builder'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Invoice Builder
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex-1 min-w-[120px] py-2 px-4 text-sm font-bold rounded-md transition-colors ${
              activeTab === 'invoices'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Invoice History / Drafts
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 min-w-[120px] py-2 px-4 text-sm font-bold rounded-md transition-colors ${
              activeTab === 'items'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Items Master
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex-1 min-w-[120px] py-2 px-4 text-sm font-bold rounded-md transition-colors ${
              activeTab === 'staff'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manage Staff
          </button>
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === 'builder' && <InvoiceBuilder user={user} userRole="admin" />}
          {activeTab === 'invoices' && <InvoiceList user={user} userRole="admin" />}
          {activeTab === 'items' && <ItemManager />}
          {activeTab === 'staff' && <StaffManager />}
        </div>
      </div>
    </div>
  );
}

