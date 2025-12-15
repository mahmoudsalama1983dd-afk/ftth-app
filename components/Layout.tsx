import React from 'react';
import { ContentTab } from '../types';
import { LayoutDashboard, Lightbulb, Video, CalendarClock } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const navItems = [
    { id: ContentTab.DASHBOARD, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: ContentTab.IDEATION, label: 'توليد الأفكار', icon: Lightbulb },
    { id: ContentTab.STUDIO, label: 'ستوديو الفيديو', icon: Video },
    { id: ContentTab.SCHEDULE, label: 'الجدولة (الساعة 8)', icon: CalendarClock },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-800 border-l border-slate-700 flex-shrink-0">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            صانع الألياف الذكية
          </h1>
          <p className="text-xs text-slate-400 mt-2">FTTH AI Automation</p>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 mt-auto">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">النظام نشط</span>
            </div>
            <p className="text-[10px] text-slate-500">
              يتم استخدام نموذج Gemini 2.5 Flash للتحليل و Veo للفيديو.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        {children}
      </main>
    </div>
  );
};