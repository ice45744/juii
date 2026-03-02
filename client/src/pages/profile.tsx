import { useAuth } from "@/hooks/use-auth";
import { LogOut, Settings, ChevronRight, HelpCircle, Shield, Award } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="p-5 flex flex-col w-full bg-slate-50 min-h-screen">
      <div className="text-center mt-6 mb-8">
        <div className="relative inline-block">
          {/* avatar placeholder abstract art */}
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" 
            alt="Profile" 
            className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover mx-auto"
          />
          {user.councilId && (
            <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-2 border-white shadow-md">
              <Shield className="w-4 h-4" />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-4">{user.fullName}</h2>
        <p className="text-slate-500 font-medium font-sans">รหัสนักเรียน: {user.studentId}</p>
        {user.councilId && (
          <p className="text-primary font-bold text-sm mt-1">สภานักเรียน</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-5 flex flex-col items-center text-center shadow-sm border border-slate-100">
          <span className="text-3xl font-black text-primary">{user.goodnessPoints}</span>
          <span className="text-xs font-bold text-slate-400 mt-1 uppercase">คะแนนความดี</span>
        </div>
        <div className="bg-white rounded-3xl p-5 flex flex-col items-center text-center shadow-sm border border-slate-100">
          <span className="text-3xl font-black text-emerald-500">{user.garbageStamps}</span>
          <span className="text-xs font-bold text-slate-400 mt-1 uppercase">แสตมป์ขยะ</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <button className="w-full flex items-center justify-between p-5 border-b border-slate-100 hover:bg-slate-50 transition-colors active:bg-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-700">ตั้งค่าบัญชี</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
        <button className="w-full flex items-center justify-between p-5 border-b border-slate-100 hover:bg-slate-50 transition-colors active:bg-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-700">เกียรติบัตรของฉัน</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
        <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors active:bg-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-700">ช่วยเหลือ & ติดต่อ</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <button 
        onClick={() => logout()}
        className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2 active:scale-95 mb-6"
      >
        <LogOut className="w-5 h-5" />
        ออกจากระบบ
      </button>
      
      <p className="text-center text-xs text-slate-400 font-medium pb-8">Goodness Bank App v1.0.0</p>
    </div>
  );
}
