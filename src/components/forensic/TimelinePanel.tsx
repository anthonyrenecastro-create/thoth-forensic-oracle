import type { ForensicCase } from '../../types/forensic';
import { timelineWindowMinutes } from '../../engine/forensicMath';

interface Props {
  caseRecord: ForensicCase;
}

export function TimelinePanel({ caseRecord }: Props) {
  const a = caseRecord.assumptions;
  const available = timelineWindowMinutes({
    earliestPickupMinutes: 7 * 60 + 30 - a.timestampUncertaintyMinutes,
    latestBoundaryMinutes: 10 * 60 + 30 + a.timestampUncertaintyMinutes,
    estimatedActivityMinutes: a.estimatedActivityMinutes,
    requiredReturnBufferMinutes: a.requiredReturnBufferMinutes,
  });

  return (
    <section className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
      <h3 className="font-bold">Timeline Window</h3>
      <div className="text-sm">Reported pickup boundary: approximately 07:30 (+/- uncertainty)</div>
      <div className="text-sm">Approximate transaction boundary: approximately 10:30 (+/- uncertainty)</div>
      <div className="text-sm">
        Deterministic approximation: availableMinutes = latestBoundaryMinutes - earliestPickupMinutes - estimatedActivityMinutes -
        requiredReturnBufferMinutes
      </div>
      <div className="font-semibold">Available minutes estimate: {available}</div>
      <div className="text-xs text-amber-900">Warning: real routing data is not integrated; this is a bounded local approximation.</div>
    </section>
  );
}
