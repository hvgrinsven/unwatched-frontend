interface Props {
  score: number; // 1–5, halve stappen mogelijk
}

function VolSter({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
      <polygon
        points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
        fill="#E8001C"
      />
    </svg>
  );
}

function HalfSter({ id }: { id: string }) {
  const clipId = `half-${id}`;
  return (
    <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="10" height="20" />
        </clipPath>
      </defs>
      {/* Lege achtergrond */}
      <polygon
        points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
        fill="#E0E0E0"
      />
      {/* Linker helft gevuld */}
      <polygon
        points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
        fill="#E8001C"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}

function LeegSter() {
  return (
    <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
      <polygon
        points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
        fill="#E0E0E0"
      />
    </svg>
  );
}

export default function StarRating({ score }: Props) {
  const afgerond = Math.round(score * 2) / 2; // afronden op halve stappen

  return (
    <div className="flex items-center gap-2" aria-label={`Score: ${score} van 5`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          if (afgerond >= i + 1) {
            return <VolSter key={i} id={String(i)} />;
          } else if (afgerond >= i + 0.5) {
            return <HalfSter key={i} id={String(i)} />;
          } else {
            return <LeegSter key={i} />;
          }
        })}
      </div>
      <span className="text-sm font-semibold font-sans text-text-primary">
        {score % 1 === 0 ? `${score}.0` : score} / 5
      </span>
    </div>
  );
}
