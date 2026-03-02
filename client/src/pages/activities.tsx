import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useActivities, useCreateActivity } from "@/hooks/use-activities";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QrCode, Plus, Award, CheckCircle2, History, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const activitySchema = api.activities.create.input;

export default function Activities() {
  const { user } = useAuth();
  const { data: activities, isLoading } = useActivities();
  const { mutateAsync: createActivity, isPending } = useCreateActivity();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
    defaultValues: { type: "other_goodness", description: "", imageUrl: "" },
  });

  const onSubmit = async (data: z.infer<typeof activitySchema>) => {
    try {
      await createActivity(data);
      toast({ title: "บันทึกกิจกรรมสำเร็จ", description: "ระบบได้รับข้อมูลของคุณแล้ว" });
      setIsDialogOpen(false);
      form.reset();
    } catch (err: any) {
      toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: err.message });
    }
  };

  if (!user) return null;

  const stampsCollected = user.garbageStamps % 10;
  const stampCards = Array.from({ length: 10 });

  return (
    <div className="p-5 flex flex-col w-full h-full">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">กิจกรรมของคุณ</h2>

      <Tabs defaultValue="goodness" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/80 rounded-2xl mb-6">
          <TabsTrigger value="goodness" className="rounded-xl font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">ความดี</TabsTrigger>
          <TabsTrigger value="garbage" className="rounded-xl font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600">ธนาคารขยะ</TabsTrigger>
        </TabsList>

        <TabsContent value="goodness" className="space-y-6">
          <div className="flex gap-3">
            <button className="flex-1 bg-slate-900 text-white p-4 rounded-2xl font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95">
              <QrCode className="w-5 h-5" />
              สแกนเช็คชื่อ
            </button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex-1 bg-primary text-white p-4 rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95">
                  <Plus className="w-5 h-5" />
                  บันทึกความดี
                </button>
              </DialogTrigger>
              <DialogContent className="w-[90%] max-w-sm rounded-3xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">บันทึกกิจกรรมความดี</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">ประเภทกิจกรรม</label>
                    <select
                      {...form.register("type")}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none font-sans"
                    >
                      <option value="other_goodness">กิจกรรมความดีทั่วไป</option>
                      <option value="morning_checkin">จิตอาสาตอนเช้า</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">รายละเอียด</label>
                    <textarea
                      {...form.register("description")}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none h-24"
                      placeholder="อธิบายสิ่งที่คุณทำ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">ลิงก์รูปภาพ (ตัวเลือก)</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        {...form.register("imageUrl")}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 disabled:opacity-50 transition-all"
                  >
                    {isPending ? "กำลังบันทึก..." : "ส่งข้อมูล"}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-slate-500" />
              ประวัติกิจกรรมล่าสุด
            </h3>
            
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-20 bg-slate-100 rounded-2xl animate-pulse"></div>
                <div className="h-20 bg-slate-100 rounded-2xl animate-pulse"></div>
              </div>
            ) : activities?.filter(a => a.type !== 'garbage_bank').length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center">
                <Award className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium">ยังไม่มีประวัติกิจกรรมความดี</p>
                <p className="text-sm text-slate-400 mt-1">เริ่มทำความดีกันเถอะ!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities?.filter(a => a.type !== 'garbage_bank').map((activity) => (
                  <div key={activity.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm line-clamp-1">{activity.description || "กิจกรรมความดี"}</p>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                          {format(new Date(activity.createdAt!), "dd MMM yyyy • HH:mm")}
                        </p>
                      </div>
                    </div>
                    {activity.pointsAwarded > 0 && (
                      <span className="font-bold text-primary bg-blue-50 px-3 py-1 rounded-full text-sm">
                        +{activity.pointsAwarded}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="garbage" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-emerald-500/10 border border-emerald-100">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">บัตรสะสมแสตมป์</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">สะสมครบ 10 ดวง รับรางวัลพิเศษ!</p>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-black text-emerald-500">{user.garbageStamps}</span>
                <span className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider">Total</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
              {stampCards.map((_, idx) => {
                const isFilled = idx < stampsCollected;
                return (
                  <div 
                    key={idx} 
                    className={`aspect-square rounded-full border-2 flex items-center justify-center transition-all ${
                      isFilled 
                        ? "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/30 scale-105" 
                        : "bg-white border-dashed border-emerald-200 text-emerald-100"
                    }`}
                  >
                    {isFilled ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <span className="font-bold">{idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-95">
              <QrCode className="w-5 h-5" />
              สแกนทิ้งขยะ
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-3 text-sm">รายการแลกของรางวัล</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                <span className="font-medium text-slate-700 text-sm">สมุดโน้ต 1 เล่ม</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">10 แสตมป์</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                <span className="font-medium text-slate-700 text-sm">ปากกา/ดินสอ 1 ด้าม</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">5 แสตมป์</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
