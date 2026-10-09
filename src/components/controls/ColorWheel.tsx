'use client';

import React, { useRef } from 'react';
import { useStudio } from '../../state/StudioContext';
import { mod } from '../../core/color/conversions';

export function ColorWheel() {
  const { state, derived, updateState } = useStudio();
  const wheelRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const m = derived.meta;
  const sat = Math.round(m.ps);
  const primaryHue = Math.round(state.h);

  const handlePointer = (e: React.PointerEvent) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const angle = mod(Math.round((Math.atan2(dx, -dy) * 180) / Math.PI));
    updateState({ h: angle }, `Wheel drag → ${angle}°`);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handlePointer(e);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      handlePointer(e);
    }
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  const R = 106;
  const polar = (h: number, r: number): [number, number] => [
    r * Math.sin((h * Math.PI) / 180),
    -r * Math.cos((h * Math.PI) / 180),
  ];

  const dots = [
    { h: state.h, c: derived.scales.p[500], r: 9, name: 'Primary' },
    { h: m.aH, c: derived.scales.a[500], r: 7, name: 'Accent' },
    { h: m.sH, c: derived.scales.s[500], r: 7, name: 'Secondary' },
  ];

  const pts = dots.map((x) => polar(x.h, R * 0.72).join(',')).join(' ');

  const semKeys: ('success' | 'warning' | 'danger' | 'info')[] = [
    'success',
    'warning',
    'danger',
    'info',
  ];

  const primaryHsl = `hsl(${derived.scales.p[500].h.toFixed(1)} ${derived.scales.p[500].s.toFixed(1)}% ${derived.scales.p[500].l.toFixed(1)}%)`;

  const conicGrad = `conic-gradient(${Array.from(
    { length: 13 },
    (_, i) => `hsl(${i * 30} ${sat}% 55%)`
  ).join(',')})`;

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div
        ref={wheelRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="wheel"
      >
        {/* Hollow Donut Ring with Conic Gradient */}
        <div
          className="ring"
          style={{ background: conicGrad }}
        />

        {/* SVG Marker Lines and Dots */}
        <svg viewBox="-120 -120 240 240">
          <circle
            r={R * 0.72}
            fill="none"
            stroke="var(--border-default)"
            strokeDasharray="2 4"
          />
          <polygon
            points={pts}
            fill={primaryHsl}
            fillOpacity={0.1}
            stroke={primaryHsl}
            strokeOpacity={0.6}
            strokeWidth={1.5}
          />

          {/* Semantic Status Hues along outer edge */}
          {semKeys.map((k) => {
            const h = m.semHue[k] || 0;
            const [px, py] = polar(h, 114);
            const col = derived.scales[k][500];
            return (
              <circle
                key={k}
                cx={px}
                cy={py}
                r={4}
                fill={`hsl(${col.h} ${col.s}% ${col.l}%)`}
                stroke="var(--bg-surface)"
                strokeWidth={1.5}
              >
                <title>{`${k} · ${Math.round(h)}°`}</title>
              </circle>
            );
          })}

          {/* Neutral Tint Dot */}
          {(() => {
            const [nx, ny] = polar(m.nH, 114);
            const ncol = derived.scales.n[500];
            return (
              <circle
                cx={nx}
                cy={ny}
                r={4}
                fill={`hsl(${ncol.h} ${ncol.s}% ${ncol.l}%)`}
                stroke="var(--text-primary)"
                strokeWidth={1.2}
              >
                <title>{`neutral tint · ${Math.round(m.nH)}°`}</title>
              </circle>
            );
          })()}

          {/* Primary / Accent / Secondary Dots */}
          {dots.map((x, i) => {
            const [px, py] = polar(x.h, R * 0.72);
            const [ox, oy] = polar(x.h, 92);
            const [dx, dy] = polar(x.h, 90);
            return (
              <g key={i}>
                <line
                  x1={px}
                  y1={py}
                  x2={ox}
                  y2={oy}
                  stroke="var(--text-primary)"
                  strokeOpacity={0.3}
                />
                <circle
                  cx={dx}
                  cy={dy}
                  r={x.r}
                  fill={`hsl(${x.c.h} ${x.c.s}% ${x.c.l}%)`}
                  stroke="#ffffff"
                  strokeWidth={2.5}
                  style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }}
                >
                  <title>{`${x.name} · ${Math.round(x.h)}°`}</title>
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Center Core Badge */}
        <div
          className="core"
          style={{
            background: primaryHsl,
            color: derived.scales.p[500].l > 55 ? '#0f172a' : '#ffffff',
          }}
        >
          <span>{m.hex.toUpperCase()}</span>
          <span style={{ opacity: 0.85, fontSize: '10px' }}>
            H {primaryHue}° S {sat}%
          </span>
        </div>
      </div>

      {/* Wheel Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4 w-full max-w-[240px] text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className="chip-dot"
            style={{
              background: `hsl(${derived.scales.p[500].h} ${derived.scales.p[500].s}% ${derived.scales.p[500].l}%)`,
            }}
          />
          <span className="t-secondary font-medium">Primary</span>
          <span className="ml-auto font-mono t-muted">{primaryHue}°</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="chip-dot"
            style={{
              background: `hsl(${derived.scales.a[500].h} ${derived.scales.a[500].s}% ${derived.scales.a[500].l}%)`,
            }}
          />
          <span className="t-secondary font-medium">Accent</span>
          <span className="ml-auto font-mono t-muted">{Math.round(m.aH)}°</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="chip-dot"
            style={{
              background: `hsl(${derived.scales.s[500].h} ${derived.scales.s[500].s}% ${derived.scales.s[500].l}%)`,
            }}
          />
          <span className="t-secondary font-medium">Secondary</span>
          <span className="ml-auto font-mono t-muted">{Math.round(m.sH)}°</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="chip-dot"
            style={{
              background: `hsl(${derived.scales.n[500].h} ${derived.scales.n[500].s}% ${derived.scales.n[500].l}%)`,
            }}
          />
          <span className="t-secondary font-medium">Neutral</span>
          <span className="ml-auto font-mono t-muted">{Math.round(m.nH)}°</span>
        </div>
      </div>
    </div>
  );
}
