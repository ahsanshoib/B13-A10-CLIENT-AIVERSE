import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export const auth = betterAuth({
  database: mongodbAdapter(client.db("AiVerse")),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "user",
      },
      isPremium: {
        type: "boolean",
        default: false,
      },
      photoURL: {
        type: "string",
        default: "",
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          
          if (user.photoURL) {
            return { data: { ...user, image: user.photoURL } };
          }
          return { data: user };
        },
      },
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],
});