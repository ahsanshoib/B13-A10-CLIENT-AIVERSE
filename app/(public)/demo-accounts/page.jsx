"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Shield, User } from "lucide-react";

const accounts = [
  {
    role: "ADMIN",
    icon: <Shield className="w-10 h-10" />,
    email: "admin@aiverse.com",
    password: "123ABCabc",
  },
  {
    role: "CREATOR",
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"/>
      </svg>
    ),
    email: "creator@aiverse.com",
    password: "123ABCabc",
  },
  {
    role: "STANDARD",
    icon: <User className="w-10 h-10" />,
    email: "dihan@dd.dd",
    password: "123ABCabc",
  },
];

export default function DemoAccountsPage() {
  const router = useRouter();

  const handleLogin = (email, password) => {
    router.push(`/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-white px-4 py-20">
        <div className="max-w-5xl w-full">
        
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-black text-green-500 mb-4 uppercase tracking-tight">Demo Accounts</h1>
            <p className="text-gray-600 text-base font-medium">Explore Aiverse from different users perspective</p>
          </div>

         <div className="bg-green-50 border border-green-100 rounded-3xl p-8">
          
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {accounts.map((acc) => (
    
    <div 
      key={acc.role} 
      className="bg-white border-2 border-green-100 rounded-3xl p-2 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      
      <div className="bg-white rounded-2xl p-8 h-full border border-gray-100">
            
        <div className="flex items-center gap-4 mb-8">
          <div className="text-green-500">{acc.icon}</div>
          <h2 className="text-2xl font-black text-gray-900 uppercase">{acc.role}</h2>
        </div>
        
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-xs uppercase font-bold text-gray-400 mb-2">Email</label>
            <div className="w-full px-5 py-4 border border-gray-100 rounded-xl text-base text-gray-800 bg-gray-50 select-all font-mono font-semibold">
              {acc.email}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-gray-400 mb-2">Password</label>
            <div className="w-full px-5 py-4 border border-gray-100 rounded-xl text-base text-gray-800 bg-gray-50 select-all font-mono font-semibold">
              {acc.password}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => handleLogin(acc.email, acc.password)}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-sm uppercase hover:bg-black transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  ))}
</div>
</div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}