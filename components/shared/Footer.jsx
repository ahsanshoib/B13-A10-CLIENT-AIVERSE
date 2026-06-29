import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-green-100 pt-20 pb-12 mt-10 w-full flex justify-center">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        
      
        <div className="flex flex-row justify-between items-center w-full gap-16 flex-wrap md:flex-nowrap">

          {/* 1. Logo Section */}
          <div className="flex-none w-auto md:w-[200px]">
            <div className="mb-0 md:mb-6">
              <div className="w-[140px] md:w-[180px] h-[50px] md:h-[60px] relative">
                <Image 
                  src="/logos/aiverselogo22.png" 
                  alt="AIVERSE" 
                  width={180}
                  height={60}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          
          <div className="hidden md:block flex-none w-[150px]">
            <h4 className="font-bold text-[#333D35] mb-6 text-[15px] uppercase tracking-wider">Platform</h4>
            <ul className="space-y-4 text-[15px] text-[#333D35] font-medium">
              <li className="flex items-center"><Link href="/login" className="hover:text-[#15803d] transition-colors">→ Login</Link></li>
              <li className="flex items-center"><Link href="/register" className="hover:text-[#15803d] transition-colors">→ Register</Link></li>
              <li className="flex items-center"><Link href="/demo-accounts" className="hover:text-[#15803d] transition-colors">→ Demo User</Link></li>
            </ul>
          </div>
        
          <div className="hidden md:block flex-none w-[150px]">
            <h4 className="font-bold text-[#333D35] mb-6 text-[15px] uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4 text-[15px] text-[#333D35] font-medium">
              <li className="flex items-center hover:text-[#15803d] cursor-pointer">→ UI Elements</li>
              <li className="flex items-center hover:text-[#15803d] cursor-pointer">→ Stripe</li>
              <li className="flex items-center hover:text-[#15803d] cursor-pointer">→ Better Auth</li>
            </ul>
          </div>

          
          <div className="flex-none w-auto md:w-[200px]">
            <h4 className="hidden md:block font-bold text-[#333D35] mb-6 text-[15px] uppercase tracking-wider">Follow Us</h4>
            <div className="flex gap-3 md:gap-4">
              <a href="#" className="w-10 h-10 md:w-11 md:h-11 bg-[#F9FBF9] border border-gray-100 rounded-full flex items-center justify-center text-[#15803d] hover:bg-[#15803d] hover:text-white transition-all"><svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 fill-current"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg></a>
              <a href="#" className="w-10 h-10 md:w-11 md:h-11 bg-[#F9FBF9] border border-gray-100 rounded-full flex items-center justify-center text-[#15803d] hover:bg-[#15803d] hover:text-white transition-all"><svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>
              <a href="#" className="w-10 h-10 md:w-11 md:h-11 bg-[#F9FBF9] border border-gray-100 rounded-full flex items-center justify-center text-[#15803d] hover:bg-[#15803d] hover:text-white transition-all"><svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 fill-current"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg></a>
              <a href="#" className="w-10 h-10 md:w-11 md:h-11 bg-[#F9FBF9] border border-gray-100 rounded-full flex items-center justify-center text-[#15803d] hover:bg-[#15803d] hover:text-white transition-all"><svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 fill-none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg></a>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-100 my-10" />

        <div className="text-center pb-4">
          <p className="text-[#333D35] text-xs font-semibold opacity-60 tracking-wider">
            2026@AiVerse All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}