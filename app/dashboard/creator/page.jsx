"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import SparkleDecor from "@/components/shared/SparkleDecor";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, AreaChart, Area, ResponsiveContainer,
} from "recharts";
import { FileText, Copy, Bookmark } from "lucide-react";

export default function CreatorHomePage() {
  const { data: session } = authClient.useSession();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/creator/analytics")
        .then((r) => r.json())
        .then((data) => {
          setAnalytics(data.analytics);
          setLoading(false);
        });
    }
  }, [session]);

  if (loading) return <LoadingSpinner />;

  const barData = (analytics?.prompts || []).map((p) => ({
    name: p.title?.slice(0, 15) + "...",
    Bookmarks: p.bookmarkCount || 0,
    Copies: p.copyCount || 0,
  }));

 const rawGrowthData = (analytics?.growthData || []).map((d) => ({
  date: d._id,
  "Total Copies": d.totalCopies,
  "Total Bookmarks": d.totalBookmarks || 0,
  "Total Prompts": d.totalPrompts,
}));

const growthData = rawGrowthData.length > 0 ? rawGrowthData : [
  { date: "Start", "Total Copies": 0, "Total Bookmarks": 0, "Total Prompts": 0 },
  { date: "Now", "Total Copies": 0, "Total Bookmarks": 0, "Total Prompts": 0 },
];

  return (
    <div className="relative">
      <SparkleDecor />
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">
          Creator Analytics Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Real-time usage statistics and performance insights.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Prompts",
            value: analytics?.totalPrompts || 0,
            icon: FileText,
          },
          {
            label: "Total Copies",
            value: analytics?.totalCopies || 0,
            icon: Copy,
          },
          {
            label: "Total Bookmarks",
            value: analytics?.totalBookmarks || 0,
            icon: Bookmark,
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider">
                  {card.label}
                </p>
                <p className="text-3xl font-black text-gray-900">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Copy className="w-5 h-5 text-gray-500" />
          <h2 className="font-black text-gray-900">
            Prompt Templates Copies vs Bookmarks
          </h2>
        </div>
        {barData.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No data yet. Add some prompts!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Bookmarks" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Copies" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Area Chart */}

<div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
  <div className="flex items-center gap-2 mb-4">
    <span className="text-gray-500">↗️</span>
    <h2 className="font-black text-gray-900">
      Accumulative Growth Metrics
    </h2>
  </div>
  {growthData.length === 0 ? (
    <div className="text-center py-10 text-gray-400">
      No growth data yet.
    </div>
  ) : (
  <ResponsiveContainer width="100%" height={280}>
  <AreaChart data={growthData}>
    <defs>
      <linearGradient id="colorCopies" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="colorBookmarks" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
    <YAxis tick={{ fontSize: 11 }} domain={[0, 'auto']} />
    <Tooltip />
    <Legend />
    <Area type="linear" dataKey="Total Copies" stroke="#06b6d4" fill="url(#colorCopies)" strokeWidth={2} dot={false} />
    <Area type="linear" dataKey="Total Bookmarks" stroke="#16a34a" fill="url(#colorBookmarks)" strokeWidth={2} dot={false} />
    <Area type="linear" dataKey="Total Prompts" stroke="#7c3aed" fill="url(#colorPrompts)" strokeWidth={2} dot={false} />
  </AreaChart>
</ResponsiveContainer>)}
</div>
    </div>
  );
}