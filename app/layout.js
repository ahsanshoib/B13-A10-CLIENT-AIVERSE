
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "AIVERSE - AI Prompt Sharing & Marketplace",
  description:
    "Discover, share, and monetize AI prompts for ChatGPT, Gemini, Claude, Midjourney and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white text-gray-900 antialiased flex flex-col">
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#111827",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              fontSize: "14px",
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}