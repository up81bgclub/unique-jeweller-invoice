import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function InvoiceBuilder() {
  const [itemsMaster, setItemsMaster] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [saving, setSaving] = useState(false);

  // Form input states
  const [selectedItemName, setSelectedItemName] = useState('');
  const [pc, setPc] = useState(1);
  const [weight, setWeight] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItemsMaster(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!selectedItemName) return alert("Select an item");

    setSelectedItems([...selectedItems, {
      particular: selectedItemName,
      pc: parseInt(pc) || 1,
      weight: weight ? parseFloat(weight) : 0,
      amount: amount ? parseFloat(amount) : 0
    }]);

    setSelectedItemName('');
    setPc(1);
    setWeight('');
    setAmount('');
  };

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const grandTotal = selectedItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const handleSaveInvoice = async (statusType = 'DRAFT') => {
    if (selectedItems.length === 0) return alert("Add items first");

    setSaving(true);
    const currentUserEmail = auth.currentUser?.email || 'Admin / Unknown';

    try {
      await addDoc(collection(db, 'invoices'), {
        customerName: customerName.trim() || 'N/A',
        invoiceDate: new Date().toISOString().split('T')[0],
        items: selectedItems,
        grandTotal: grandTotal,
        status: statusType,
        createdBy: currentUserEmail,
        createdAt: serverTimestamp()
      });

      alert(`Invoice saved successfully!`);
      setCustomerName('');
      setSelectedItems([]);
    } catch (err) {
      console.error(err);
      alert("Error saving invoice");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Create Invoice</h2>

      <div className="mb-4">
        <label className="block text-xs font-bold mb-1 text-gray-700">Customer Name (Optional)</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter customer name or leave blank"
          className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4 bg-gray-50 p-3 rounded border">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-gray-600">ITEM</label>
          <select
            value={selectedItemName}
            onChange={(e) => setSelectedItemName(e.target.value)}
            className="w-full border p-1.5 rounded text-xs bg-white"
          >
            <option value="">Select Item</option>
            {itemsMaster.map((item) => (
              <option key={item.id} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-600">PC</label>
          <input type="number" min="1" value={pc} onChange={(e) => setPc(e.target.value)} className="w-full border p-1.5 rounded text-xs" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-600">WEIGHT (g)</label>
          <input type="number" step="0.001" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.000" className="w-full border p-1.5 rounded text-xs" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-600">AMOUNT (₹)</label>
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full border p-1.5 rounded text-xs" />
        </div>

        <div className="sm:col-span-5 text-right mt-1">
          <button type="submit" className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded">+ Add Row</button>
        </div>
      </form>

      <table className="w-full border-collapse border text-xs mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Particular</th>
            <th className="border p-2 w-16">PC</th>
            <th className="border p-2 w-24">Weight</th>
            <th className="border p-2 w-28 text-right">Amount</th>
            <th className="border p-2 w-12">Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.length === 0 ? (
            <tr><td colSpan="5" className="text-center p-3 text-gray-400">No items added.</td></tr>
          ) : (
            selectedItems.map((item, idx) => (
              <tr key={idx}>
                <td className="border p-2 font-semibold">{item.particular}</td>
                <td className="border p-2 text-center">{item.pc}</td>
                <td className="border p-2 text-center">{item.weight || '-'}</td>
                <td className="border p-2 text-right font-bold">₹{item.amount}</td>
                <td className="border p-2 text-center">
                  <button onClick={() => removeItem(idx)} className="text-red-600 font-bold">✕</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center border-t pt-3">
        <div className="text-lg font-black text-gray-800">Grand Total: ₹{grandTotal.toFixed(2)}</div>
        <div className="flex gap-2">
          <button disabled={saving} onClick={() => handleSaveInvoice('DRAFT')} className="bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded">💾 Save Draft</button>
          <button disabled={saving} onClick={() => handleSaveInvoice('FINAL')} className="bg-green-600 text-white font-bold text-xs px-4 py-2 rounded">✅ Save Final</button>
        </div>
      </div>
    </div>
  );
}

