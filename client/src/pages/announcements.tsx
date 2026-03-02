import { useAnnouncements } from "@/hooks/use-announcements";
import { format } from "date-fns";
import { Bell, Megaphone, Calendar } from "lucide-react";

export default function Announcements() {
  const { data: announcements, isLoading } = useAnnouncements();

  return (
    <div className="p-5 flex flex-col w-full min-h-screen bg-slate-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500">
          <Megaphone className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">ประกาศข่าวสาร</h2>
          <p className="text-sm font-medium text-slate-500">อัปเดตล่าสุดจากทางโรงเรียน</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 h-32 animate-pulse"></div>
          ))}
        </div>
      ) : announcements?.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-20">
          <Bell className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">ไม่มีประกาศใหม่</h3>
          <p className="text-slate-500 mt-2">ขณะนี้ยังไม่มีข่าวสารใดๆ ให้ติดตาม</p>
        </div>
      ) : (
        <div className="space-y-4 pb-10">
          {announcements?.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                  Announcement
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(item.createdAt!), "dd MMM yyyy")}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2 leading-snug">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
