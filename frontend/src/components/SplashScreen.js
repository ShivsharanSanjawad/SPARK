import { useEffect, useState, useMemo } from 'react';

/**
 * SplashScreen – Cinematic spark explosion intro
 * Phases: ignite → assemble → tagline → exit (fire burn-away)
 */
const LETTERS = ['S', 'P', 'A', 'R', 'K'];

function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('ignite'); // ignite → assemble → tagline → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('assemble'), 600);
    const t2 = setTimeout(() => setPhase('tagline'), 1800);
    const t3 = setTimeout(() => setPhase('exit'), 3000);
    const t4 = setTimeout(() => onComplete?.(), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  // Generate spark lines
  const sparkLines = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        angle: `${(360 / 10) * i}deg`,
        len: `${50 + Math.random() * 60}px`,
        delay: `${0.1 + Math.random() * 0.3}s`,
      })),
    []
  );

  const showIgnite = phase === 'ignite' || phase === 'assemble' || phase === 'tagline';
  const showLetters = phase === 'assemble' || phase === 'tagline' || phase === 'exit';
  const showTagline = phase === 'tagline' || phase === 'exit';

  return (
    <div
      className={`splash-screen ${phase === 'exit' ? 'splash-exit' : ''}`}
      aria-hidden="true"
    >
      {/* Central spark point */}
      {showIgnite && (
        <div className="spark-point" style={{ position: 'absolute' }} />
      )}

      {/* Shockwave rings */}
      {showIgnite && (
        <>
          <div className="shockwave" style={{ '--ring-delay': '0s' }} />
          <div className="shockwave" style={{ '--ring-delay': '0.2s' }} />
          <div className="shockwave" style={{ '--ring-delay': '0.4s' }} />
        </>
      )}

      {/* Radial spark lines */}
      {showIgnite &&
        sparkLines.map((s) => (
          <div
            key={s.id}
            className="spark-line"
            style={{
              '--angle': s.angle,
              '--line-len': s.len,
              '--line-delay': s.delay,
              transform: `rotate(${s.angle})`,
            }}
          />
        ))}

      {/* SPARK letter assembly */}
      {showLetters && (
        <div style={{ display: 'flex', gap: '4px', position: 'relative', zIndex: 2 }}>
          {LETTERS.map((letter, i) => (
            <span
              key={letter}
              className="splash-letter"
              style={{ '--letter-delay': `${0.6 + i * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
      )}

      {/* Tagline */}
      {showTagline && (
        <p className="splash-tagline" style={{ '--tagline-delay': '1.8s', marginTop: '16px' }}>
          Ideas that ignite.<span className="blink">_</span>
        </p>
      )}
    </div>
  );
}

export default SplashScreen;
