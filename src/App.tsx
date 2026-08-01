import { useEffect, useMemo, useState } from 'react';
import { MADISON_CASE } from './data/madisonCase';
import type { ForensicCase, RunForensicTwinsRequest, TwinRunResponse } from './types/forensic';
import { CaseEvidencePanel } from './components/forensic/CaseEvidencePanel';
import { ForensicMap } from './components/forensic/ForensicMap';
import { MapLayerControls } from './components/forensic/MapLayerControls';
import { TimelinePanel } from './components/forensic/TimelinePanel';
import { TwinRunControls } from './components/forensic/TwinRunControls';
import { TwinResultPanel } from './components/forensic/TwinResultPanel';
import { UnknownRegistry } from './components/forensic/UnknownRegistry';
import { TwinComparisonPanel } from './components/forensic/TwinComparisonPanel';

export default function App() {
  const [caseRecord, setCaseRecord] = useState<ForensicCase>(MADISON_CASE);
  const [settings, setSettings] = useState<RunForensicTwinsRequest['settings']>({
    model: 'fixture-deterministic',
    temperature: 0.2,
    maxHrmRounds: 8,
    convergenceThreshold: 0.02,
    includeIllustrativeZones: false,
  });
  const [latestRun, setLatestRun] = useState<TwinRunResponse | null>(null);
  const [runInvalidated, setRunInvalidated] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>({
    twinA: true,
    twinB: true,
    overlap: true,
    conflict: true,
    fragility: true,
    temporal: true,
    vehicle: true,
    searchAdjustment: true,
    informationGain: true,
  });

  useEffect(() => {
    fetch('/api/forensic/cases/default')
      .then((response) => response.json())
      .then((payload) => {
        if (payload.caseRecord) {
          setCaseRecord(payload.caseRecord as ForensicCase);
        }
      })
      .catch(() => {
        setCaseRecord(MADISON_CASE);
      });
  }, []);

  const updateAssumption = (key: keyof ForensicCase['assumptions'], value: number) => {
    setCaseRecord((previous) => ({
      ...previous,
      assumptions: {
        ...previous.assumptions,
        [key]: value,
      },
    }));
    setRunInvalidated(true);
  };

  const updateCaseRecord = (next: ForensicCase) => {
    setCaseRecord(next);
    setRunInvalidated(true);
  };

  const onRunComplete = (run: TwinRunResponse) => {
    setLatestRun(run);
    setRunInvalidated(false);
  };

  const exportJson = () => {
    if (!latestRun) {
      return;
    }
    const blob = new Blob([JSON.stringify(latestRun, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${latestRun.runId}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const warnings = useMemo(
    () => [
      'Analytical hypotheses are not established facts.',
      'Approximate coordinates may be inaccurate.',
      'Publicly unavailable police evidence is not known to this system.',
      'Named individuals remain presumed innocent and this system cannot determine guilt.',
      'No trespassing, unauthorized searching, confrontation, or public accusation.',
      'Preserve chain of custody and notify law enforcement for suspected evidence.',
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-sky-50 to-emerald-50 text-slate-900">
      <header className="border-b border-slate-300 bg-white/80 backdrop-blur px-4 py-3">
        <h1 className="text-xl font-black tracking-tight">THOTH Forensic Twin Arena</h1>
        <p className="text-sm text-slate-700">
          Homicide spatial-reconstruction and search-prioritization simulator. Analytical prioritization only; not a legal finding.
        </p>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="space-y-4">
            <CaseEvidencePanel caseRecord={caseRecord} onCaseRecordChange={updateCaseRecord} />
            <TimelinePanel caseRecord={caseRecord} />
            <UnknownRegistry unknowns={caseRecord.unknowns} />
          </div>
          <div className="space-y-3">
            <MapLayerControls
              layers={layerVisibility}
              onToggle={(key) => setLayerVisibility((previous) => ({ ...previous, [key]: !previous[key] }))}
            />
            <ForensicMap caseRecord={caseRecord} twinA={latestRun?.twinA} twinB={latestRun?.twinB} layerVisibility={layerVisibility} />
          </div>
        </div>

        <TwinRunControls
          caseRecord={caseRecord}
          settings={settings}
          onSettingsChange={(next) => {
            setSettings(next);
            setRunInvalidated(true);
          }}
          onRunComplete={onRunComplete}
          runInvalidated={runInvalidated}
          onExport={exportJson}
          onAssumptionChange={updateAssumption}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <TwinResultPanel title="Twin A - Direct Gemini Forensic Analyst" result={latestRun?.twinA} />
          <TwinResultPanel title="Twin B - HRM-Governed Forensic Synthesis Engine" result={latestRun?.twinB} />
        </div>

        {latestRun && <TwinComparisonPanel comparison={latestRun.comparison} />}

        <section className="border border-amber-300 bg-amber-50 rounded-lg p-3">
          <h3 className="font-bold">Guardrails and Safety Warnings</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
