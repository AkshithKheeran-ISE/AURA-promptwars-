import React from 'react';

export default function SectionHeader({ eyebrow, title, desc, right }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-cyan-400/10 pb-4">
      <div>
        {eyebrow && (
          <div className="label flex items-center gap-2 text-cyan-300/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1 font-display text-2xl font-bold tracking-wide text-white md:text-3xl">
          {title}
        </h1>
        {desc && (
          <p className="mt-1 max-w-3xl text-sm text-slate-400">
            {desc}
          </p>
        )}
      </div>
      {right && (
        <div className="flex flex-wrap items-center gap-2">
          {right}
        </div>
      )}
    </div>
  );
}
