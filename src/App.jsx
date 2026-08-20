import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import AdminDashboard from './component/AdminDashboard';
import InvoiceBuilder from './component/InvoiceBuilder'; // Staff ke liye direct builder

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Auth & Role State Change Handling
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().role) {
            setRole(userDoc.data().role); // 'admin' ya 'staff' fetch hoga
          } else {
            setRole('staff');
          }
        } catch (err) {
          console.error("Role fetch error:", err);
          setRole('staff');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Login Failed: " + err.message);
    }
  };

  // 3. Logout Handler
  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return <div className="p-10 text-center font-bold">Loading Unique Jeweller System...</div>;
  }

  // LOGIN SCREEN (Agar user logged in nahi hai)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-4 uppercase tracking-wide">Unique Jeweller</h2>
          <div className="mb-3">
            <label className="block text-xs font-bold mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded text-sm hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    );
  }

  // DASHBOARD SCREEN (Login hone ke baad)
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header Bar */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center no-print">
        <div>
          <h1 className="font-bold text-lg">Unique Jeweller System</h1>
          <p className="text-xs text-gray-300">
            User: {user.email} | <span className="font-bold uppercase text-yellow-400">Role: {role}</span>
          </p>
        </div>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs font-bold">
          Logout
        </button>
      </header>

      {/* Role Based Navigation Routing */}
      <main className="p-2 sm:p-4">
        {role === 'admin' ? (
          <AdminDashboard user={user} />
        ) : (
          <InvoiceBuilder user={user} userRole="staff" />
        )}
      </main>
    </div>
  );
}

