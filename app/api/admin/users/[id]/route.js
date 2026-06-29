import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";

export async function PUT(request, { params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    await db.collection("user").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { role } }
    );
    await client.close();

    return Response.json({ success: true, message: "Role updated" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    await db.collection("user").deleteOne({ _id: new ObjectId(params.id) });
    await client.close();

    return Response.json({ success: true, message: "User deleted" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}