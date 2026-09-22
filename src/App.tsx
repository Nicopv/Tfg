import React, { useState } from 'react';
import { Header } from './components/Header';
import { D3GraphView } from './components/D3GraphView';
import { ComparativeMatrixView } from './components/ComparativeMatrixView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('grafo_d3');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [activeSimulationCaseId, setActiveSimulationCaseId] = useState<string | null>(null);

  const handleInspectCase = (_caseId: string) => {
    setActiveTab('matriz');
  };

  const handlePlayCaseInGraph = (caseId: string) => {
    setActiveSimulationCaseId(caseId);
    setActiveTab('grafo_d3');
  };

  const handleGoToMatrix = (_caseId?: string) => {
    setActiveTab('matriz');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'grafo_d3' && (
          <D3GraphView
            initialZoneId={selectedZoneId}
            initialSimulationCaseId={activeSimulationCaseId}
            onSimulationCaseChange={setActiveSimulationCaseId}
            onInspectCase={handleInspectCase}
            onGoToMatrix={handleGoToMatrix}
          />
        )}

        {activeTab === 'matriz' && (
          <ComparativeMatrixView
            onSelectCase={handleInspectCase}
            onPlayCaseInGraph={handlePlayCaseInGraph}
          />
        )}
      </main>
    </div>
  );
}
