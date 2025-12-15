import React from 'react';
import { VideoScript } from '../types';
import { Activity, Clock, UploadCloud, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardProps {
  plan: VideoScript[];
}

export const Dashboard: React.FC<DashboardProps> = ({ plan }) => {
  const data = [
    { name: 'السبت', views: 4000 },
    { name: 'الأحد', views: 3000 },
    { name: 'الاثنين', views: 2000 },
    { name: 'الثلاثاء', views: 2780 },
    { name: 'الأربعاء', views: 1890 },
    { name: 'الخميس', views: 2390 },
    { name: 'الجمعة', views: 3490 },
  ];

  const nextUpload = plan.length > 0 ? plan[0] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm mb-1">حالة الأتمتة</p>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                نشط <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </h3>
            </div>
            <Activity className="text-slate-600" />
          </div>
          <p className="text-xs text-slate-500 mt-4">جاهز للتحميل اليومي الساعة 8:00 م</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm mb-1">المحتوى المجهز</p>
              <h3 className="text-2xl font-bold text-white">{plan.length} / 7</h3>
            </div>
            <UploadCloud className="text-slate-600" />
          </div>
          <p className="text-xs text-slate-500 mt-4">فيديوهات جاهزة للجدولة</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-600"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm mb-1">القادم</p>
              <h3 className="text-xl font-bold text-white truncate w-40">
                {nextUpload ? nextUpload.title : 'لا يوجد'}
              </h3>
            </div>
            <Clock className="text-slate-600" />
          </div>
          <p className="text-xs text-amber-500 mt-4 font-mono">اليوم 20:00:00</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-6">توقعات التفاعل (AI Predicted)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status List */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-6">سجل النظام</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-slate-700/50">
              <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={18} />
              <div>
                <p className="text-sm text-white font-medium">تم تحليل النص المصدري</p>
                <p className="text-xs text-slate-500">تم استخراج النقاط الرئيسية حول الذكاء الاصطناعي في FTTH</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-slate-700/50">
              <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={18} />
              <div>
                <p className="text-sm text-white font-medium">اتصال Gemini API</p>
                <p className="text-xs text-slate-500">تم التحقق من المفتاح بنجاح</p>
              </div>
            </div>
            {plan.length === 0 && (
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-sm text-amber-500 font-medium">انتظار توليد المحتوى</p>
                  <p className="text-xs text-slate-500">انتقل لتبويب "توليد الأفكار" للبدء</p>
                </div>
              </div>
            )}
            {plan.length > 0 && (
               <div className="flex items-start gap-3">
               <CheckCircle2 className="text-blue-500 shrink-0 mt-1" size={18} />
               <div>
                 <p className="text-sm text-white font-medium">الخطة جاهزة</p>
                 <p className="text-xs text-slate-500">{plan.length} سكربت جاهز للتنفيذ</p>
               </div>
             </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};