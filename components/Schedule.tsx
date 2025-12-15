import React from 'react';
import { VideoScript } from '../types';
import { Calendar, Clock, Youtube, MoreVertical } from 'lucide-react';

interface ScheduleProps {
  plan: VideoScript[];
}

export const Schedule: React.FC<ScheduleProps> = ({ plan }) => {
  if (plan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
        <Calendar size={64} className="mb-4 opacity-20" />
        <p>لا توجد فيديوهات مجدولة. قم بتوليد خطة أولاً.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">الجدول الزمني للنشر</h2>
        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
          <Clock size={16} className="text-green-500" />
          <span className="text-sm text-slate-300">موعد النشر التلقائي: <strong>08:00 مساءً</strong> (بتوقيت القاهرة)</span>
        </div>
      </div>

      <div className="space-y-4">
        {plan.map((item, idx) => (
          <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            {/* Day Column */}
            <div className="flex-shrink-0 w-24 text-center border-l border-slate-700 pl-6 md:pl-0 md:border-l-0 md:border-l-0">
               <div className="text-blue-400 font-bold text-lg">{item.day}</div>
               <div className="text-slate-500 text-xs font-mono">20:00</div>
            </div>

            {/* Content Info */}
            <div className="flex-1 text-right">
              <h3 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h3>
              <p className="text-slate-400 text-xs mb-2 line-clamp-1">{item.hook}</p>
              <div className="flex gap-2">
                {item.hashtags.slice(0, 3).map((tag, tIdx) => (
                   <span key={tIdx} className="bg-slate-900 text-slate-500 px-2 py-0.5 rounded text-[10px]">#{tag}</span>
                ))}
              </div>
            </div>

            {/* Platform Status */}
            <div className="flex items-center gap-4 border-r border-slate-700 pr-6 mr-auto">
               <div className="flex flex-col items-center gap-1">
                 <Youtube className="text-red-500" size={20} />
                 <span className="text-[10px] text-slate-400">Shorts</span>
               </div>
               <div className="w-px h-8 bg-slate-700"></div>
               <div className="text-center">
                  <span className="block w-2 h-2 bg-amber-500 rounded-full mx-auto mb-1 animate-pulse"></span>
                  <span className="text-[10px] text-amber-500">مجدول</span>
               </div>
            </div>
            
            <button className="absolute left-2 top-2 text-slate-600 hover:text-white p-1">
              <MoreVertical size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};