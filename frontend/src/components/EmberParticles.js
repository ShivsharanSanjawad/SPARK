import { useMemo } from 'react';

export default function EmberParticles({ count = 10 }) {
  const embers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        dur: `${8 + Math.random() * 12}s`,
        delay: `${Math.random() * 10}s`,
        drift: `${(Math.random() - 0.5) * 60}px`,
        peakOpacity: 0.03 + Math.random() * 0.06,
        size: 1 + Math.random() * 2,
      })),
    [count]
  );

  return (
    <div className="ember-field" aria-hidden="true">
      {embers.map((e) => (
        <div
          key={e.id}
          className="ember"
          style={{
            left: e.left,
            width: `${e.size}px`,
            height: `${e.size}px`,
            '--dur': e.dur,
            '--delay': e.delay,
            '--drift': e.drift,
            '--peak-opacity': e.peakOpacity,
          }}
        />
      ))}
    </div>
  );
}
