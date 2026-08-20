import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export default function ItemManager() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Items from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const itemList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemList);
    });

    return () => unsubscribe();
  }, []);

  // Add Item to Master List
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) return alert("Item Name daalna zaroori hai!");

    setLoading(true);
    try {
      await addDoc(collection(db, 'items'), {
        name: itemName.trim()
      });
      setItemName('');
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Error adding item: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Item
  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`Kya aap "${name}" ko list se hatana chahte hain?`)) {
      try {
        await deleteDoc(doc(db, 'items', id));
      } catch (err) {
        console.error("Error deleting item:", err);
        alert("Delete error: " + err.message);
      }
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Item Master List</h2>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="flex gap-2 mb-6 bg-gray-50 p-3 rounded-md border">
        <input
          type="text"
          placeholder="Enter Item Name (e.g. Ring, Chain, Payal)"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="flex-1 p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          {loading ? 'Adding...' : '+ Add Item'}
        </button>
      </form>

      {/* Items List */}
      <h3 className="text-sm font-bold text-gray-600 mb-2">Saved Items</h3>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400">Koi item saved nahi hai.</p>
      ) : (
        <div className="divide-y border rounded-md">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-2.5 hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-800">{item.name}</span>
              <button
                onClick={() => handleDeleteItem(item.id, item.name)}
                className="text-red-500 hover:text-red-700 text-xs font-bold"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

