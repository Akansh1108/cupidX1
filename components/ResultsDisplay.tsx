
import React, { useState } from 'react';
import { FullBlueprint, VibeCheckQuestion } from '../types';
import { generateVibeCheckQuestions, analyzeContext } from '../services/geminiService';
import { HeartIcon, SparklesIcon, ChatIcon, CheckIcon, FlagIcon, UploadIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import Card from './Card';

interface ResultsDisplayProps {
  blueprint: FullBlueprint;
  onReset: () => void;
}

type ActiveTab = 'blueprint' | 'partner' | 'action' | 'vibe' | 'coach';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${active ? 'bg-pink-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'}`}
  >
    {children}
  </button>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ blueprint, onReset }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('blueprint');
  const [vibeCheckResult, setVibeCheckResult] = useState<VibeCheckQuestion[] | null>(null);
  const [contextAnalysis, setContextAnalysis] = useState<string>('');
  const [contextText, setContextText] = useState('');
  const [contextImage, setContextImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState({ vibe: false, coach: false });

  const handleGenerateVibeCheck = async () => {
    setIsLoading(prev => ({ ...prev, vibe: true }));
    setVibeCheckResult(null);
    try {
      const questions = await generateVibeCheckQuestions(blueprint.emotionalBlueprint);
      setVibeCheckResult(questions);
    } catch (error) {
      console.error("Failed to generate vibe check questions", error);
      // Handle error in UI
    } finally {
      setIsLoading(prev => ({ ...prev, vibe: false }));
    }
  };

  const handleAnalyzeContext = async () => {
    if (!contextText && !contextImage) return;
    setIsLoading(prev => ({ ...prev, coach: true }));
    setContextAnalysis('');
    try {
      const analysis = await analyzeContext(contextText, contextImage || undefined);
      setContextAnalysis(analysis);
    } catch (error) {
      console.error("Failed to analyze context", error);
    } finally {
      setIsLoading(prev => ({ ...prev, coach: false }));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'blueprint':
        return <Card icon={<HeartIcon />} title="Your Emotional Blueprint">{blueprint.emotionalBlueprint}</Card>;
      case 'partner':
        return (
          <>
            <Card icon={<SparklesIcon />} title="Compatible Partner Archetypes"><ul className="list-disc pl-5 space-y-1">{(blueprint.partnerFitProfile.archetypes || []).map((item, i) => <li key={i}>{item}</li>)}</ul></Card>
            <Card icon={<CheckIcon />} title="Green Flags to Look For"><ul className="list-disc pl-5 space-y-1">{(blueprint.partnerFitProfile.greenFlags || []).map((item, i) => <li key={i}>{item}</li>)}</ul></Card>
            <Card icon={<FlagIcon />} title="Potential Friction Points"><ul className="list-disc pl-5 space-y-1">{(blueprint.partnerFitProfile.frictionPoints || []).map((item, i) => <li key={i}>{item}</li>)}</ul></Card>
            <Card icon={<ChatIcon />} title="Communication Tips"><ul className="list-disc pl-5 space-y-1">{(blueprint.partnerFitProfile.communicationTips || []).map((item, i) => <li key={i}>{item}</li>)}</ul></Card>
          </>
        );
      case 'action':
        return (
          <>
            <Card icon={<SparklesIcon />} title="Dating Bio Refresh">{blueprint.actionKit.bioRewrite}</Card>
            <Card icon={<ChatIcon />} title="Conversation Openers"><ul className="list-disc pl-5 space-y-1">{(blueprint.actionKit.conversationOpeners || []).map((item, i) => <li key={i}>{item}</li>)}</ul></Card>
            <Card icon={<HeartIcon />} title="7-Day Micro-Habits Plan">{blueprint.actionKit.microHabits}</Card>
          </>
        );
      case 'vibe':
        return (
          <Card icon={<SparklesIcon />} title="Vibe Check Module">
            <p className="mb-4 text-gray-300">Generate personalized questions to check alignment with a potential partner, based on your Blueprint.</p>
            <button onClick={handleGenerateVibeCheck} disabled={isLoading.vibe} className="w-full px-6 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100">
              {isLoading.vibe ? 'Generating...' : 'Generate Vibe Check Questions'}
            </button>
            {isLoading.vibe && <div className="mt-4 flex justify-center"><LoadingSpinner /></div>}
            {vibeCheckResult && (
              <div className="mt-6 space-y-4">
                {vibeCheckResult.map((item, i) => (
                   <div key={i} className="p-4 bg-gray-800/80 rounded-lg border border-gray-700">
                    <p className="font-semibold text-white">💬 "{item.question}"</p>
                    <div className="flex items-start gap-3 mt-3">
                      <span className="text-xl pt-0.5">✅</span>
                      <div>
                          <p className="text-sm font-semibold text-green-400">Aligned Answer</p>
                          <p className="text-sm text-gray-300">{item.alignedAnswer}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mt-2">
                      <span className="text-xl pt-0.5">🚩</span>
                       <div>
                          <p className="text-sm font-semibold text-red-400">Friction Signal</p>
                          <p className="text-sm text-gray-300">{item.frictionSignal}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      case 'coach':
        return (
          <Card icon={<ChatIcon />} title="Context Coach">
            <p className="mb-4 text-gray-300">Paste a chat screenshot or describe a date. I'll help you interpret the situation.</p>
            <textarea value={contextText} onChange={e => setContextText(e.target.value)} placeholder="Describe the date or conversation..." className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-2 mb-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <UploadIcon className="w-5 h-5 mr-2 text-gray-400" />
              <span className="text-sm text-gray-400">{contextImage ? contextImage.name : 'Upload Chat Screenshot (optional)'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files && setContextImage(e.target.files[0])} />
            </label>
            <button onClick={handleAnalyzeContext} disabled={isLoading.coach || (!contextText && !contextImage)} className="mt-4 w-full px-6 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100">
              {isLoading.coach ? 'Analyzing...' : 'Get Coaching'}
            </button>
             {isLoading.coach && <div className="mt-4 flex justify-center"><LoadingSpinner /></div>}
            {contextAnalysis && <div className="mt-6 p-4 bg-gray-800 rounded-lg whitespace-pre-wrap">{contextAnalysis}</div>}
          </Card>
        );
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-4xl p-4 sm:p-8 bg-black/20 backdrop-blur-md rounded-2xl shadow-2xl animate-fade-in-up">
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <TabButton active={activeTab === 'blueprint'} onClick={() => setActiveTab('blueprint')}>Blueprint</TabButton>
        <TabButton active={activeTab === 'partner'} onClick={() => setActiveTab('partner')}>Partner Fit</TabButton>
        <TabButton active={activeTab === 'action'} onClick={() => setActiveTab('action')}>Action Kit</TabButton>
        <TabButton active={activeTab === 'vibe'} onClick={() => setActiveTab('vibe')}>Vibe Check</TabButton>
        <TabButton active={activeTab === 'coach'} onClick={() => setActiveTab('coach')}>Context Coach</TabButton>
      </div>
      <div className="space-y-6">
        {renderContent()}
      </div>
       <div className="text-center mt-8">
        <button onClick={onReset} className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105">
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
