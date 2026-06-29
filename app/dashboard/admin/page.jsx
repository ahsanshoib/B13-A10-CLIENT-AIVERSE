"use client";
import { useEffect, useState } from "react";
import SparkleDecor from "@/components/shared/SparkleDecor";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell,
  ResponsiveContainer,
} from "recharts";
import { Users, FileText, MessageSquare, Copy, DollarSign } from "lucide-react";

const COLORS = ["#06b6d4", "#f59e0b", "#10b981", "#7c3aed", "#ef4444"];

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((data) => {
        setAnalytics(data.analytics);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  const barData = (analytics?.engineDistribution || []).map((e) => ({
    name: e._id,
    Copies: e.totalCopies,
    Prompts: e.count,
  }));

  const pieData = (analytics?.engineDistribution || []).map((e) => ({
    name: e._id,
    value: e.count,
  }));

  return (
    <div className="relative">
      <SparkleDecor />
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">
          Administrative System Analytics
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Aggregate metrics and engine distribution breakdowns.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          {
            label: "Total Users",
            value: analytics?.totalUsers || 0,
            icon: Users,
          },
          {
            label: "Total Prompts",
            value: analytics?.totalPrompts || 0,
            icon: FileText,
          },
          {
            label: "Total Reviews",
            value: analytics?.totalReviews || 0,
            icon: MessageSquare,
          },
          {
            label: "Total Copies",
            value: analytics?.totalCopies || 0,
            icon: Copy,
          },
          {
            label: "Total Revenue",
            value: `$${analytics?.totalRevenue || 0}.00`,
            icon: DollarSign,
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider">
                  {card.label}
                </p>
                <p className="text-2xl font-black text-gray-900">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-500" />
            <h2 className="font-black text-gray-900">
              Engine Prompts Density vs Total Copies
            </h2>
          </div>
          {barData.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Copies" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Prompts" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Copy className="w-5 h-5 text-gray-500" />
            <h2 className="font-black text-gray-900">
              Prompt Distribution Share
            </h2>
          </div>
          {pieData.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}