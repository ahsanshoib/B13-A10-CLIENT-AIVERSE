"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Gem, CheckCircle2, FlaskConical } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!session) return router.push("/login");

    setLoading(true);
    try {
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
      });
      const data = await res.json();

      if (data.success) {
        await fetch("/api/users/premium", { method: "POST" });
        toast.success("Payment successful! You are now Premium!");
        router.push("/dashboard/user");
        router.refresh();
      } else {
        toast.error(data.error || "Payment failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    if (!session) return router.push("/login");
    setLoading(true);
    try {
      const res = await fetch("/api/payments/simulate", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetch("/api/users/premium", { method: "POST" });
        toast.success("Simulated payment successful! You are now Premium!");
        router.push("/dashboard/user");
        router.refresh();
      } else {
        toast.error("Simulation failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-lg">
      {/* Plan Card */}
      <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
              LIFETIME PLAN
            </span>
            <h2 className="text-2xl font-black text-gray-900 mt-3">Aiverse Pro</h2>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-green-600">$5.00</span>
              <span className="text-gray-400 text-sm">/ one time</span>
            </div>
          </div>
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
            <Gem className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 space-y-3">
          {[
            "Unlock All Features",
            "Get Premium Page",
            "Unlimited Copy Paste",
            "Lifetime Support",
            "Lifetime Updates",
            "Advanced AI Tools Access",
            "Priority Customer Support",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <span className="text-gray-700 text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Payment */}
      <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">💳</span>
          </div>
          <h3 className="font-black text-gray-900 text-lg">Card Information</h3>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="border border-gray-200 rounded-xl px-4 py-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1a1a1a",
                    "::placeholder": { color: "#9ca3af" },
                  },
                },
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !stripe}
            className="w-full border-2 border-green-600 text-green-600 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors disabled:opacity-60"
          >
            {loading ? "Processing..." : "Pay One Time - $5.00"}
          </button>
        </form>
      </div>

      {/* Simulate */}
      <div className="bg-green-50 rounded-2xl border border-green-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm uppercase tracking-wide">
              Stripe Testing Asset
            </p>
            <p className="text-gray-500 text-xs">
              No credit card? use our sandbox simulation
            </p>
          </div>
        </div>
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="w-full border border-green-600 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-100 transition-colors disabled:opacity-60"
        >
          {loading ? "Processing..." : "Simulate $5 Test"}
        </button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      {/* Centering container */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 pt-24 pb-10 px-4">
        <div className="w-full max-w-lg mb-8 text-center">
          <h1 className="text-3xl font-black text-green-500 uppercase">
            Upgrade Your Account
          </h1>
          <p className="text-gray-400 text-sm mt-1">___</p>
        </div>
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      </div>
      <Footer />
    </main>
  );
}