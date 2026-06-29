import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const payments = await Payment.find().sort({ createdAt: -1 });
    return Response.json({ success: true, payments });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { paymentMethodId } = await request.json();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    if (paymentIntent.status === "succeeded") {
      await Payment.create({
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
        transactionId: paymentIntent.id,
        amount: 5,
      });

      return Response.json({
        success: true,
        message: "Payment successful",
        transactionId: paymentIntent.id,
      });
    }

    return Response.json({ success: false, error: "Payment failed" }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}