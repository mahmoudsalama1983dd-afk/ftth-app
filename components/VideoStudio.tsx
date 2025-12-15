import React, { useState } from 'react';
import { VideoScript } from '../types';
import { generateVeoVideo } from '../services/geminiService';
import { Video, Play, Loader2, AlertCircle, Eye, Check, X, Maximize2, RotateCw } from 'lucide-react';

interface VideoStudioProps {
  plan: VideoScript[];
  onUpdateScript: (index: number, updates: Partial<VideoScript>) => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({ plan, onUpdateScript }) => {
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const handleGenerateVideo = async (index: number, prompt: string) => {
    setGeneratingId(index);
    try {
      const uri = await generateVeoVideo(prompt);
      onUpdateScript(index, { videoUri: uri, isFinalized: false });
    } catch (error) {
      console.error(error);
      // Optional: Handle error state more explicitly in UI if desired
    } finally {
      setGeneratingId(null);
    }
  };

  const handleFinalize = () => {
    if (previewIndex !== null) {
      onUpdateScript(previewIndex, { isFinalized: true });
      setPreviewIndex(null);
    }
  };

  const handleDiscard = () => {
    if (previewIndex !== null) {
      // Keep prompt but remove video
      onUpdateScript(previewIndex, { videoUri: undefined, isFinalized: false });
      setPreviewIndex(null);
    }
  };

  if (plan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <Video size={64} className="mb-4 opacity-20" />
        <p>يرجى توليد الأفكار أولاً للبدء في إنشاء الفيديوهات.</p>
      </div>
    );
  }

  const currentPreviewItem = previewIndex !== null ? plan[previewIndex] : null;

  return (
    <div className="max-w-6xl mx-auto relative">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
        <Video className="text-cyan-500" />
        استوديو Veo الذكي
        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full font-normal">
          توليد لقطات 9:16
        </span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {plan.map((item, idx) => {
          const isGenerating = generatingId === idx;
          const hasVideo = !!item.videoUri;
          const isFinalized = !!item.isFinalized;

          return (
            <div key={idx} className={`bg-slate-800 rounded-2xl border transition-colors overflow-hidden flex flex-col ${isFinalized ? 'border-green-500/50' : 'border-slate-700'}`}>
              <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-start">
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-lg truncate ml-2">{item.title}</h3>
                      {isFinalized && <Check size={16} className="text-green-500" />}
                   </div>
                   <span className="bg-slate-700 text-xs px-2 py-1 rounded text-slate-300">{item.day}</span>
                </div>
              </div>

              <div className="flex-1 bg-black min-h-[350px] relative flex items-center justify-center group">
                {isGenerating ? (
                  <div className="flex flex-col items-center text-cyan-400">
                    <Loader2 size={40} className="animate-spin mb-4" />
                    <p className="animate-pulse font-mono text-sm">جاري التوليد باستخدام Veo...</p>
                  </div>
                ) : hasVideo ? (
                  <>
                    <video 
                      src={item.videoUri} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setPreviewIndex(idx)}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-full flex items-center gap-2 transition-all transform hover:scale-105"
                      >
                        <Eye size={20} />
                        معاينة
                      </button>
                    </div>
                    {isFinalized && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Check size={12} />
                        معتمد
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-8 max-w-xs">
                    <p className="text-xs text-slate-500 mb-4 line-clamp-3 italic">"{item.visualDescription}"</p>
                    <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-4 border border-slate-700 group-hover:border-cyan-500 transition-colors">
                      <Play className="ml-1 text-slate-500 group-hover:text-cyan-500" />
                    </div>
                    <p className="text-slate-500 text-sm">جاهز للتوليد</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-900 border-t border-slate-700 flex gap-2">
                {!hasVideo || !isFinalized ? (
                  <button
                    onClick={() => handleGenerateVideo(idx, item.visualDescription)}
                    disabled={isGenerating}
                    className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                      isGenerating
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/50'
                    }`}
                  >
                     {isGenerating ? 'جاري العمل...' : (hasVideo ? 'إعادة التوليد' : 'إنشاء الفيديو')}
                  </button>
                ) : (
                   <button
                    onClick={() => setPreviewIndex(idx)}
                    className="flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white transition-all"
                  >
                     <Eye size={18} />
                     مشاهدة
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewIndex !== null && currentPreviewItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-white truncate">{currentPreviewItem.title}</h3>
              <button onClick={() => setPreviewIndex(null)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
               <video 
                 src={currentPreviewItem.videoUri} 
                 controls 
                 autoPlay 
                 className="max-h-full max-w-full w-full h-auto aspect-[9/16] object-contain"
               />
            </div>

            <div className="p-6 border-t border-slate-700 bg-slate-800">
              <div className="flex gap-4">
                <button
                  onClick={handleDiscard}
                  className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCw size={18} />
                  رفض وإعادة
                </button>
                <button
                  onClick={handleFinalize}
                  className="flex-[2] py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-900/30 transition-all"
                >
                  <Check size={18} />
                  اعتماد الفيديو
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};