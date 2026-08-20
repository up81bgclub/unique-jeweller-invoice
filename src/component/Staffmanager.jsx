import React, { useState, useEffect } from 'react';
import { db, firebaseConfig } from '../firebase';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  collection, 
  setDoc, 
  doc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';

export default function StaffManager() {
  const [staffList, setStaffList] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. Fetch only 'staff' role users from Firestore
  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'staff'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setStaffList(users);
      setFetching(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Create Staff Account without logging out Admin
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Email aur Password dono bharo!');
    if (password.length < 6) return alert('Password kam se kam 6 characters ka hona chahiye!');

    setLoading(true);
    try {
      // Create secondary Firebase app instance to avoid logging out current admin session
      const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
      const secondaryAuth = getAuth(secondaryApp);

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const newStaffUid = userCredential.user.uid;

      // Create document in Firestore 'users' collection with UID as Document ID
      await setDoc(doc(db, 'users', newStaffUid), {
        email: email,
        role: 'staff',
        createdAt: new Date().toISOString()
      });

      alert('Naya Staff Account kamyabi se create ho gaya!');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Error creating staff:', err);
      alert('Account Creation Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Staff record from Firestore
  const handleDeleteStaff = async (staffId, staffEmail) => {
    if (window.confirm(`Kya aap ${staffEmail} ko staff list se hatana chahte hain?`)) {
      try {
        await deleteDoc(doc(db, 'users', staffId));
        alert('Staff record delete kar diya gaya hai!');
      } catch (err) {
        console.error('Error deleting staff:', err);
        alert('Delete error: ' + err.message);
      }
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Staff Account Management</h2>

      {/* Create Staff Form */}
      <form onSubmit={handleCreateStaff} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-gray-50 p-4 rounded-md border">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Staff Email</label>
          <input
            type="email"
            placeholder="staff@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Password</label>
          <input
            type="password"
            placeholder="Minimum 6 chars"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm disabled:opacity-50"
          >
            {loading ? 'Creating...' : '+ Add New Staff'}
          </button>
        </div>
      </form>

      {/* Staff Accounts List */}
      <h3 className="text-lg font-bold mb-2 text-gray-700">Active Staff Members</h3>
      {fetching ? (
        <p className="text-sm text-gray-500">Loading staff list...</p>
      ) : staffList.length === 0 ? (
        <p className="text-sm text-gray-500">Koi active staff account nahi mila.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-2">Staff Email</th>
                <th className="border p-2">Role</th>
                <th className="border p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id} className="border-b hover:bg-gray-50">
                  <td className="border p-2 font-medium">{staff.email}</td>
                  <td className="border p-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-bold uppercase">
                      {staff.role}
                    </span>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDeleteStaff(staff.id, staff.email)}
                      className="text-red-600 hover:underline text-xs font-bold"
                    >
                      Delete Access
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}