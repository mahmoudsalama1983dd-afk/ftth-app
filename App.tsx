import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { IdeaGenerator } from './components/IdeaGenerator';
import { VideoStudio } from './components/VideoStudio';
import { Schedule } from './components/Schedule';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ContentTab, VideoScript } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentTab>(ContentTab.DASHBOARD);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [plan, setPlan] = useState<VideoScript[]>([]);
  const [checkingKey, setCheckingKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      // Priority 1: Check for AI Studio Environment (Project IDX)
      if (window.aistudio) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (hasKey) {
            setHasApiKey(true);
            setCheckingKey(false);
            return;
          }
        } catch (e) {
          console.warn("AI Studio check failed", e);
        }
      }

      // Priority 2: Check for Local .env variable (Dev Mode)
      // Note: In Vite config we map process.env.API_KEY to the actual value
      if (process.env.API_KEY && process.env.API_KEY.length > 0) {
        setHasApiKey(true);
      }

      setCheckingKey(false);
    };
    checkKey();
  }, []);

  const handleKeySelected = () => {
    setHasApiKey(true);
  };

  const updateScript = (index: number, updates: Partial<VideoScript>) => {
    setPlan(prev => {
      const newPlan = [...prev];
      newPlan[index] = { ...newPlan[index], ...updates };
      return newPlan;
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case ContentTab.DASHBOARD:
        return <Dashboard plan={plan} />;
      case ContentTab.IDEATION:
        return <IdeaGenerator onPlanGenerated={setPlan} existingPlan={plan} />;
      case ContentTab.STUDIO:
        return <VideoStudio plan={plan} onUpdateScript={updateScript} />;
      case ContentTab.SCHEDULE:
        return <Schedule plan={plan} />;
      default:
        return <Dashboard plan={plan} />;
    }
  };

  if (checkingKey) {
    return <div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-slate-500">جاري التحميل...</div>;
  }

  return (
    <>
      {!hasApiKey && <ApiKeyModal onKeySelected={handleKeySelected} />}
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;