"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import SparkleDecor from "@/components/shared/SparkleDecor";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Star, Eye } from "lucide-react";

export default function MyReviewsPage() {
  const { data: session } = authClient.useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetch(`/api/reviews?userId=${session.user.id}`)
        .then((r) => r.json())
        .then((data) => {
          setReviews(data.reviews || []);
          setLoading(false);
        });
    }
  }, [session]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative">
      <SparkleDecor />
      <div className="mb-6">
        <h1 className="text-3xl font-black uppercase text-green-500">
          My Product Reviews
        </h1>
        <p className="text-gray-500 text-sm mt-1">Feedback and ratings</p>
      </div>

      <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-bold text-gray-700">No reviews yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Your submitted reviews will appear here
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">
                  Title
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">
                  Engine
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">
                  Rating
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">
                  Comment
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="border-b border-gray-50 hover:bg-green-50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900 text-sm uppercase">
                    {review.promptId?.slice(0, 12)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 uppercase">
                    —
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-bold text-gray-700 ml-1">
                        {review.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    '{review.comment}'
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        router.push(`/prompts/${review.promptId}`)
                      }
                      className="flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-xl text-sm font-medium hover:border-green-400 transition-colors"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
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