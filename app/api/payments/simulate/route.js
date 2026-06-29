import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const transactionId = "sim_" + Date.now();

    await Payment.create({
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      transactionId,
      amount: 5,
    });

    // Update user to premium
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("AiVerse");
    await db.collection("user").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { isPremium: true } }
    );
    await client.close();

    return Response.json({
      success: true,
      message: "Simulated payment successful",
      transactionId,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}