"use client";
import { useEffect, useState } from "react";
import SparkleDecor from "@/components/shared/SparkleDecor";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments")
      .then((r) => r.json())
      .then((data) => {
        setPayments(data.payments || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative">
      <SparkleDecor />
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">
          Stripe Premium Payments Log
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Comprehensive database of customer subscription transactions.
        </p>
      </div>

  
      <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-2 overflow-x-auto">
        {payments.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <p className="font-bold text-gray-700">No payments yet</p>
          </div>
        ) : (
          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr>
                {[
                  "...Transaction ID",
                  "Purchaser Details",
                  "Billing Email",
                  "Amount Charged",
                  "Payment Date",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-green-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-[11px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                      {payment.transactionId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {payment.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {payment.userName}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          ID: {payment.userId?.slice(0, 12)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {payment.userEmail}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-green-700 text-sm">
                      $ {payment.amount}.00
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}