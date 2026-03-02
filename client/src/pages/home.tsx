import { useAuth } from "@/hooks/use-auth";
import { useAnnouncements } from "@/hooks/use-announcements";
import { Link } from "wouter";
import { 
  Award, 
  Trash2, 
  QrCode, 
  PlusCircle, 
  AlertOctagon, 
  BookOpen, 
  ChevronRight,
  Bell
} from "lucide-react";
import { format } from "date-fns";

export default function Home() {
  const { user } = useAuth();
  const { data: announcements, isLoading: isAnnouncementsLoading } = useAnnouncements();

  if (!user) return null;

  return (
    <div className="p-5 flex flex-col gap-6 w-full">
      {/* Header Profile Section */}
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="text-sm font-medium text-slate-500">สวัสดี,</p>
          <h2 className="text-xl font-bold text-slate-900">{user.fullName}</h2>
        </div>
        {/* avatar placeholder abstract portrait */}
        <img 
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop" 
          alt="Avatar" 
          className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
        />
      </div>

      {/* Stats Card */}
      <div className="w-full bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <p className="text-blue-100 font-medium text-sm mb-1">สถิติของคุณ</p>
        <div className="grid grid-cols-2 gap-4 mt-4 divide-x divide-blue-400/30">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <Award className="w-5 h-5 text-yellow-300" />
            </div>
            <span className="text-3xl font-bold">{user.goodnessPoints}</span>
            <span className="text-xs font-medium text-blue-100 mt-1">แต้มความดี</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <Trash2 className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="text-3xl font-bold">{user.garbageStamps}</span>
            <span className="text-xs font-medium text-blue-100 mt-1">แสตมป์ขยะ</span>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">บริการด่วน</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/activities" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all flex flex-col items-center gap-3 active:scale-95">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="font-semibold text-slate-700 text-sm">บันทึกกิจกรรม</span>
          </Link>
          
          <button className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all flex flex-col items-center gap-3 active:scale-95 text-left">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="font-semibold text-slate-700 text-sm w-full text-center">สแกน QR เช็คชื่อ</span>
          </button>

          <Link href="/report" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all flex flex-col items-center gap-3 active:scale-95">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <span className="font-semibold text-slate-700 text-sm">แจ้งปัญหา</span>
          </Link>
          
          <button className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-200 transition-all flex flex-col items-center gap-3 active:scale-95">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="font-semibold text-slate-700 text-sm">คู่มือการใช้งาน</span>
          </button>
        </div>
      </div>

      {/* Announcements Preview */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">ประกาศล่าสุด</h3>
          <Link href="/announcements" className="text-sm font-semibold text-primary flex items-center">
            ทั้งหมด <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {isAnnouncementsLoading ? (
          <div className="bg-slate-100 rounded-2xl h-24 animate-pulse"></div>
        ) : announcements && announcements.length > 0 ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 leading-tight">{announcements[0].title}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{announcements[0].content}</p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">
                {format(new Date(announcements[0].createdAt!), "dd MMM yyyy")}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-sm">
            ไม่มีประกาศในขณะนี้
          </div>
        )}
      </div>
    </div>
  );
}
