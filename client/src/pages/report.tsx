import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@shared/routes";
import { useCreateReport } from "@/hooks/use-reports";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Send, ImageIcon, MapPin } from "lucide-react";

const reportSchema = api.reports.create.input;

export default function Report() {
  const { mutateAsync: createReport, isPending } = useCreateReport();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: { category: "facility", description: "", imageUrl: "" },
  });

  const onSubmit = async (data: z.infer<typeof reportSchema>) => {
    try {
      await createReport(data);
      toast({ title: "ส่งรายงานสำเร็จ", description: "ขอบคุณที่ช่วยแจ้งปัญหาให้เราทราบ" });
      form.reset();
    } catch (err: any) {
      toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: err.message });
    }
  };

  return (
    <div className="p-5 flex flex-col w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-500">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">แจ้งปัญหา</h2>
          <p className="text-sm font-medium text-slate-500">พบสิ่งผิดปกติ แจ้งเราได้ทันที</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">หมวดหมู่ปัญหา <span className="text-red-500">*</span></label>
            <select
              {...form.register("category")}
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-900 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-400/10 transition-all font-sans appearance-none"
            >
              <option value="facility">อาคารสถานที่ชำรุด</option>
              <option value="cleanliness">ความสะอาด/ขยะ</option>
              <option value="safety">ความปลอดภัย</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">รายละเอียด <span className="text-red-500">*</span></label>
            <textarea
              {...form.register("description")}
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-400/10 transition-all resize-none h-32"
              placeholder="อธิบายปัญหาที่พบเห็น สถานที่เกิดเหตุ..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">แนบรูปภาพ (ถ้ามี)</label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...form.register("imageUrl")}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-900 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-400/10 transition-all"
                placeholder="วางลิงก์รูปภาพที่นี่"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-900/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isPending ? "กำลังส่ง..." : (
              <>
                <Send className="w-5 h-5" />
                ส่งรายงาน
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
