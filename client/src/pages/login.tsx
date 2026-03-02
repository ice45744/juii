import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@shared/routes";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, GraduationCap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = api.auth.login.input;
const registerSchema = api.auth.register.input;

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { login, register, isLoggingIn, isRegistering } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { studentId: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { studentId: "", password: "", fullName: "", councilId: "" },
  });

  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data);
      toast({ title: "เข้าสู่ระบบสำเร็จ", description: "ยินดีต้อนรับกลับ!" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: err.message });
    }
  };

  const onRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      await register(data);
      toast({ title: "ลงทะเบียนสำเร็จ", description: "ยินดีต้อนรับสู่ระบบ" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: err.message });
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="w-full max-w-sm">
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8 text-center"
        >
          <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-primary to-blue-400 rounded-3xl shadow-xl shadow-blue-500/30 flex items-center justify-center mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Goodness Bank</h1>
          <p className="text-slate-500 mt-2 font-medium">สะสมความดี แลกของรางวัล</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/80 rounded-2xl mb-8">
            <TabsTrigger value="login" className="rounded-xl font-medium text-base data-[state=active]:bg-white data-[state=active]:shadow-sm">เข้าสู่ระบบ</TabsTrigger>
            <TabsTrigger value="register" className="rounded-xl font-medium text-base data-[state=active]:bg-white data-[state=active]:shadow-sm">ลงทะเบียน</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">รหัสนักเรียน</label>
                <input
                  {...loginForm.register("studentId")}
                  className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="กรอกรหัสนักเรียน 5 หลัก"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">รหัสผ่าน</label>
                <input
                  type="password"
                  {...loginForm.register("password")}
                  className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="กรอกรหัสผ่าน"
                />
              </div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-4 bg-gradient-to-r from-primary to-blue-600 hover:to-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "เข้าสู่ระบบ"}
              </button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">รหัสนักเรียน <span className="text-red-500">*</span></label>
                <input
                  {...registerForm.register("studentId")}
                  className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="รหัสนักเรียนของคุณ"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                <input
                  {...registerForm.register("fullName")}
                  className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="นายสมชาย ใจดี"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">รหัสผ่าน <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  {...registerForm.register("password")}
                  className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="ตั้งรหัสผ่าน"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">รหัสสภานักเรียน (ถ้ามี)</label>
                <input
                  {...registerForm.register("councilId")}
                  className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="เว้นว่างได้"
                />
              </div>
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full mt-4 bg-gradient-to-r from-primary to-blue-600 hover:to-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isRegistering ? <Loader2 className="w-5 h-5 animate-spin" /> : "ลงทะเบียนใหม่"}
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
