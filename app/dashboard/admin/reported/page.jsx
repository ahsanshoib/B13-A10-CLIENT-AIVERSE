"use client";
import { useEffect, useState } from "react";
import SparkleDecor from "@/components/shared/SparkleDecor";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminReportedPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await fetch("/api/reports");
    const data = await res.json();
    setReports(data.reports || []);
    setLoading(false);
  };

const handleAction = async (id, action, status) => {
  const res = await fetch(`/api/reports/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, status }),
  });
  const data = await res.json();
  if (data.success) {
    if (action === "remove") toast.success("Prompt removed!");
    else if (action === "warn") toast.success("Creator warned!");
    else if (status === "dismissed") toast.success("Report dismissed!");
    else toast.success("Action taken!");
    setReports(prev => prev.filter(r => r._id !== id));
  } else {
    toast.error(data.error || "Action failed");
  }
};

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative">
      <SparkleDecor />
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">
          Reported Prompts Moderation Queue
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Review community warnings, warn creators, dismiss complaints, or
          remove posts.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-green-100 p-16 text-center">
          <p className="font-bold text-gray-700">No reported prompts</p>
          <p className="text-gray-400 text-sm mt-1">
            The community is clean!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden"
            >
              <div className="bg-green-50 px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
                📅 Reported on{" "}
                {new Date(report.createdAt).toLocaleDateString()}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center gap-1">
                    ⚠️ REASON: {report.reason?.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    on{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-3">
                  Prompt: {report.promptTitle}
                </h3>

                {report.description && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-4">
                    <p className="text-sm text-gray-600">
                      Report Details: "{report.description}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    👤 Reported by: {report.reportedBy} (
                    {report.reporterEmail})
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        router.push(`/prompts/${report.promptId}`)
                      }
                      className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-green-400 transition-colors"
                    >
                      👁️ Inspect
                    </button>
                    <button
                      onClick={() =>
                        handleAction(report._id, null, "dismissed")
                      }
                      className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-green-400 transition-colors"
                    >
                      ✓ Dismiss
                    </button>
                    <button
                     onClick={() => handleAction(report._id, "warn", "warned")}
                      className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-white rounded-xl text-sm font-semibold hover:bg-yellow-600 transition-colors"
                    >
                      ⚠️ Warn Creator
                      
                    </button>
                    <button
                      onClick={() =>
                        handleAction(report._id, "remove", "removed")
                      }
                      className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
                    >
                      🗑️ Remove Prompt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}