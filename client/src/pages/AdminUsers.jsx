import { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xl text-gray-400">Loading Users...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">User Management</h2>
        </div>
        
        <div className="bg-industrial-800 rounded-lg overflow-hidden border border-industrial-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-industrial-900">
              <tr>
                <th className="p-4 border-b border-industrial-700">ID</th>
                <th className="p-4 border-b border-industrial-700">Name</th>
                <th className="p-4 border-b border-industrial-700">Email</th>
                <th className="p-4 border-b border-industrial-700">Role</th>
                <th className="p-4 border-b border-industrial-700">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b border-industrial-700 hover:bg-industrial-700/50">
                  <td className="p-4 font-mono">{user._id.substring(0, 8)}...</td>
                  <td className="p-4 font-bold">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      user.role === 'Admin' ? 'bg-industrial-orange text-white' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
