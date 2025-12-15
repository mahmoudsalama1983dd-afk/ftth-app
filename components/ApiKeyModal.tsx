import React, { useState } from 'react';
import { Key, Lock, ArrowRight, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  onKeySelected: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onKeySelected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectKey = async () => {
    setLoading(true);
    setError(null);
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        // Assume success if no error thrown immediately, proceed.
        // In real app, might want to check hasSelectedApiKey again, 
        // but instructions say "Assume key selection was successful".
        onKeySelected();
      } else {
        throw new Error("AI Studio environment not detected.");
      }
    } catch (err: any) {
      if (err.message && err.message.includes("Requested entity was not found")) {
        setError("لم يتم العثور على المفتاح. يرجى المحاولة مرة أخرى واختيار مشروع صالح.");
      } else {
        setError("حدث خطأ أثناء اختيار المفتاح.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700 shadow-lg">
            <Key className="text-blue-400" size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">مطلوب مفتاح API</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            للاستفادة من ميزات <strong>Veo Video Generation</strong> و <strong>Gemini 2.5</strong>، 
            يجب اختيار مفتاح API مدفوع من مشروع Google Cloud الخاص بك.
          </p>

          <button
            onClick={handleSelectKey}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/30"
          >
            {loading ? 'جاري الاتصال...' : 'اختيار مفتاح API'}
            {!loading && <ArrowRight size={18} />}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-xs w-full">
              {error}
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-500">
             <Lock size={10} />
             <span>يتم التعامل مع مفتاحك بأمان داخل جلسة المتصفح فقط.</span>
          </div>

          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            معلومات عن الفوترة <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </div>
  );
};