"use client";
import { useEffect, useState } from "react";
import SparkleDecor from "@/components/shared/SparkleDecor";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const roles = ["user", "creator", "admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  const handleRoleChange = async (userId, role) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Role updated!");
      fetchUsers();
    } else {
      toast.error(data.error || "Failed to update role");
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      toast.success("User deleted!");
      fetchUsers();
    } else {
      toast.error(data.error || "Failed to delete");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative">
      <SparkleDecor />
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">
          User Role & Accounts Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Review accounts, modify role scopes, and delete users.
        </p>
      </div>

      
      <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-8">
        <table className="w-full border-separate border-spacing-y-1">
          <thead>
            <tr>
              <th className="text-left px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Profile Details</th>
              <th className="text-left px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</th>
              <th className="text-left px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Subscription</th>
              <th className="text-left px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Role Level</th>
              <th className="text-left px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Registered Date</th>
              <th className="text-left px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-green-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                    ) : (
                      <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-bold text-gray-800 text-sm">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    style={{ padding: "6px 18px" }}
                    className={`text-[10px] font-black uppercase tracking-widest rounded-full ${
                      user.isPremium ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.isPremium ? "PREMIUM" : "FREE"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role || "user"}
                    onChange={(e) => handleRoleChange(user._id.toString(), e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-gray-50 cursor-pointer"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(user._id.toString())}
                    className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-gray-500"
                  >
                    <Trash2 className="w-4 h-4" />
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