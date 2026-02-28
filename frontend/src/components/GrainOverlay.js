export default function GrainOverlay() {
  return (
    <svg className="grain-overlay" aria-hidden="true" width="100%" height="100%">
      <filter id="spark-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#spark-grain)" />
    </svg>
  );
}
