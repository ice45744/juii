import { Link, useLocation } from "wouter";
import { Home, ClipboardList, Bell, AlertTriangle, User } from "lucide-react";
import { motion } from "framer-motion";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "หน้าหลัก" },
    { href: "/activities", icon: ClipboardList, label: "กิจกรรม" },
    { href: "/announcements", icon: Bell, label: "ประกาศ" },
    { href: "/report", icon: AlertTriangle, label: "แจ้งปัญหา" },
    { href: "/profile", icon: User, label: "โปรไฟล์" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
      <nav className="w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-slate-200/50 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)] pb-safe pointer-events-auto">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center w-16 h-12 transition-colors">
                <div className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
                  <Icon className="w-6 h-6 stroke-[2.5px]" />
                  <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-3 w-12 h-1 bg-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
