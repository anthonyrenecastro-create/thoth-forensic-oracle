import type { TwinRunResponse } from '../../types/forensic';

interface Props {
  comparison: TwinRunResponse['comparison'];
}

export function TwinComparisonPanel({ comparison }: Props) {
  return (
    <section className="border border-slate-300 rounded-lg bg-white p-3 space-y-2">
      <h3 className="font-bold">Twin Comparison</h3>
      <div className="text-sm">Scenario agreement: {comparison.scenarioAgreement.toFixed(3)}</div>
      <div className="text-sm">Zone rank correlation: {comparison.zoneRankCorrelation.toFixed(3)}</div>
      <div className="text-sm">Top-zone overlap: {comparison.topZoneOverlap.join(', ') || 'none'}</div>
      <div className="text-sm">Major conflicts: {comparison.majorConflicts.join(' | ') || 'none'}</div>
      <div className="text-xs">No winner is declared automatically.</div>
    </section>
  );
}
