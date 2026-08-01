import type { ContradictionFinding } from '../../types/forensic';

interface Props {
  contradictions: ContradictionFinding[];
}

export function ContradictionPanel({ contradictions }: Props) {
  return (
    <section className="space-y-2">
      <h3 className="font-bold">Contradictions</h3>
      {!contradictions.length && <div className="text-sm text-slate-700">No explicit contradictions were raised in this run.</div>}
      {contradictions.map((item) => (
        <article key={item.id} className="border border-rose-200 bg-rose-50 rounded-lg p-2 text-sm">
          <div className="font-semibold">{item.title} ({item.severity})</div>
          <div>{item.description}</div>
          <div className="text-xs">Evidence IDs: {item.evidenceIds.join(', ')}</div>
        </article>
      ))}
    </section>
  );
}
