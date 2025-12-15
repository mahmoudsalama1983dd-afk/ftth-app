import React, { useState } from 'react';
import { SOURCE_TEXT, VideoScript } from '../types';
import { generateWeeklyPlan } from '../services/geminiService';
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react';

interface IdeaGeneratorProps {
  onPlanGenerated: (plan: VideoScript[]) => void;
  existingPlan: VideoScript[];
}

export const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({ onPlanGenerated, existingPlan }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = await generateWeeklyPlan(SOURCE_TEXT);
      onPlanGenerated(plan);
    } catch (err) {
      setError("حدث خطأ أثناء توليد الخطة. يرجى المحاولة مرة أخرى.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="text-yellow-400" />
          المصدر الأساسي
        </h2>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-slate-300 text-sm leading-relaxed max-h-40 overflow-y-auto">
          {SOURCE_TEXT}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? 'جاري التحليل والتقسيم...' : 'توليد خطة الأسبوع (7 فيديوهات)'}
          </button>
        </div>
        {error && <p className="text-red-400 mt-2 text-sm text-center">{error}</p>}
      </div>

      {existingPlan.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {existingPlan.map((script, idx) => (
            <div key={idx} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-colors group">
              <div className="bg-slate-750 p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/30">
                <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-800/50">
                  {script.day}
                </span>
                <span className="text-slate-400 text-xs">{script.estimatedDuration}</span>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{script.title}</h3>
                  <div className="flex gap-2 flex-wrap">
                    {script.hashtags.map((tag, i) => (
                      <span key={i} className="text-xs text-blue-400">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-amber-900/20 p-3 rounded border-r-2 border-amber-500">
                    <p className="text-amber-200 text-sm font-medium">الخاطفة (Hook):</p>
                    <p className="text-slate-300 text-sm">{script.hook}</p>
                  </div>

                  <div className="relative bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <button 
                      onClick={() => copyToClipboard(script.scriptBody, idx)}
                      className="absolute top-2 left-2 text-slate-500 hover:text-white transition-colors"
                    >
                      {copiedIndex === idx ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                    <p className="text-xs text-slate-500 mb-1 font-mono">SCRIPT BODY</p>
                    <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap pl-6">
                      {script.scriptBody}
                    </p>
                  </div>

                  <div className="bg-violet-900/20 p-3 rounded border-r-2 border-violet-500">
                    <p className="text-violet-300 text-xs font-mono uppercase mb-1">AI Visual Prompt</p>
                    <p className="text-slate-300 text-xs font-mono" dir="ltr">{script.visualDescription}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};