import React, { useState, useEffect } from 'react';
import InvoicePrintModal from './invoicePrintModal';
import { db } from '../firebase'; 
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const makeFinal = async (id) => {
    try {
      await updateDoc(doc(db, 'invoices', id), { status: 'FINAL' });
    } catch (err) {
      alert("Status update failed!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this invoice?")) {
      try {
        await deleteDoc(doc(db, 'invoices', id));
      } catch (err) {
        alert("Delete failed!");
      }
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (activeTab === 'final') return inv.status?.toUpperCase() === 'FINAL';
    if (activeTab === 'draft') return inv.status?.toUpperCase() === 'DRAFT';
    return true;
  });

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Invoice History & Drafts</h2>

      <div className="flex gap-2 mb-4 border-b pb-2">
        <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 rounded text-xs font-bold ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>All ({invoices.length})</button>
        <button onClick={() => setActiveTab('draft')} className={`px-4 py-1.5 rounded text-xs font-bold ${activeTab === 'draft' ? 'bg-amber-500 text-white' : 'bg-gray-100'}`}>Drafts ({invoices.filter(i => i.status?.toUpperCase() === 'DRAFT').length})</button>
        <button onClick={() => setActiveTab('final')} className={`px-4 py-1.5 rounded text-xs font-bold ${activeTab === 'final' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Final ({invoices.filter(i => i.status?.toUpperCase() === 'FINAL').length})</button>
      </div>

      <div className="space-y-3">
        {filteredInvoices.length === 0 ? (
          <p className="text-center py-6 text-xs text-gray-400 border rounded">No invoices found.</p>
        ) : (
          filteredInvoices.map((inv) => (
            <div key={inv.id} className="p-3 border rounded-lg flex justify-between items-center bg-white shadow-sm">
              <div>
                <p className="font-bold text-gray-800 text-sm">Customer: {inv.customerName || 'N/A'}</p>
                <p className="text-xs text-gray-500">
                  Date: {inv.invoiceDate} | Status:{' '}
                  <span className={`font-bold ${inv.status?.toUpperCase() === 'FINAL' ? 'text-green-600' : 'text-amber-600'}`}>
                    {inv.status || 'DRAFT'}
                  </span>
                </p>
                {/* STAFF / CREATED BY DISPLAY */}
                <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                  👤 Created By: <span className="underline">{inv.createdBy || 'N/A'}</span>
                </p>
                <p className="text-sm font-black mt-1">Total: ₹{inv.grandTotal}</p>
              </div>

              <div className="flex gap-2">
                {inv.status?.toUpperCase() === 'DRAFT' && (
                  <button onClick={() => makeFinal(inv.id)} className="bg-green-600 text-white text-xs font-bold px-2.5 py-1.5 rounded">Mark Final</button>
                )}
                <button onClick={() => setSelectedInvoiceForPrint(inv)} className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded">🖨️ Print Bill</button>
                <button onClick={() => handleDelete(inv.id)} className="bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded">🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedInvoiceForPrint && (
        <InvoicePrintModal invoice={selectedInvoiceForPrint} onClose={() => setSelectedInvoiceForPrint(null)} />
      )}
    </div>
  );
}

