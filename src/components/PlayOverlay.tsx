"use client";

import { useEffect, useRef, useState } from "react";

type Star = {
  id: number;
  ra: number;   // hours
  dec: number;  // degrees
  mag: number;
};

type Constellation = {
  name: string;
  stars: Star[];
  lines: [number, number][];
};

type ConstellationData = {
  constellations: Constellation[];
};

interface PlayOverlayProps {
  open: boolean;
  onClose: () => void;
}

type Point = { x: number; y: number; visible: boolean };

const deg2rad = (d: number) => (d * Math.PI) / 180;
const hour2rad = (h: number) => (h * Math.PI) / 12;

// simplified GMST in radians
function gmst(date: Date): number {
  const JD = date.getTime() / 86400000 + 2440587.5;
  const d = JD - 2451545.0;
  const gmstDeg = 280.46061837 + 360.98564736629 * d;
  const wrapped = ((gmstDeg % 360) + 360) % 360;
  return (wrapped * Math.PI) / 180;
}

// project RA/Dec to screen using simple alt-az style projection
function projectStar(
  star: Star,
  when: Date,
  lat: number,
  lon: number,
  w: number,
  h: number
): Point {
  const ra = hour2rad(star.ra);
  const dec = deg2rad(star.dec);
  const phi = deg2rad(lat);
  const lambda = deg2rad(lon);

  const lst = gmst(when) + lambda;
  const ha = lst - ra;

  const sinAlt =
    Math.sin(dec) * Math.sin(phi) +
    Math.cos(dec) * Math.cos(phi) * Math.cos(ha);
  const alt = Math.asin(sinAlt);

  if (alt <= 0) return { x: 0, y: 0, visible: false }; // below horizon

  const cosAz =
    (Math.sin(dec) - Math.sin(alt) * Math.sin(phi)) /
    (Math.cos(alt) * Math.cos(phi));
  const clamped = Math.min(1, Math.max(-1, cosAz));
  let az = Math.acos(clamped);
  if (Math.sin(ha) > 0) az = 2 * Math.PI - az;

  const x = (az / (2 * Math.PI)) * w;
  const y = (1 - alt / (Math.PI / 2)) * h;

  return { x, y, visible: true };
}

export function PlayOverlay({ open, onClose }: PlayOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const [data, setData] = useState<ConstellationData | null>(null);

  // location: default mid-latitude; geolocation if allowed
  const [lat, setLat] = useState(40); // can be tuned
  const [lon, setLon] = useState(0);

  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const lastInteractionRef = useRef<number>(Date.now());
  const linksRef = useRef<[number, number][]>([]); // indices into flattened star list

  // load constellations once
  useEffect(() => {
    if (!open) return;
    if (data) return;

    fetch("/data/constellations.json")
      .then((res) => res.json())
      .then((json: ConstellationData) => setData(json))
      .catch(() => {
        setData(null);
      });
  }, [open, data]);

  // optional geolocation
  useEffect(() => {
    if (!open) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
      },
      () => {
        // ignore; defaults are fine
      },
      { enableHighAccuracy: false, maximumAge: 600000, timeout: 2500 }
    );
  }, [open]);

  // close on Esc
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open, onClose]);

  // pointer tracking
  useEffect(() => {
    if (!open) return;

    const move = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      pointerRef.current = { x: e.clientX / w, y: e.clientY / h };
      lastInteractionRef.current = Date.now();
    };

    const leave = () => {
      pointerRef.current = null;
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [open]);

  // animation loop
  useEffect(() => {
    if (!open) {
      stop();
      return;
    }
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data, lat, lon]);

  const start = () => {
    if (rafRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      // background: deep, minimal
      ctx.fillStyle = "#02010a";
      ctx.fillRect(0, 0, w, h);

      const now = new Date();
      const idleMs = Date.now() - lastInteractionRef.current;
      const idleT = Math.min(idleMs / 20000, 1); // 0 → 1 over 20s

      const pointer = pointerRef.current;
      const starsFlat: { x: number; y: number; mag: number }[] = [];

      // project constellations
      if (data) {
        for (const c of data.constellations) {
          for (const s of c.stars) {
            const p = projectStar(s, now, lat, lon, w, h);
            if (!p.visible) continue;

            let x = p.x;
            let y = p.y;

            // pointer gravity: subtle pull
            if (pointer) {
              const dx = pointer.x * w - x;
              const dy = pointer.y * h - y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const strength = Math.min(40 / dist, 0.08); // small, elegant
              x += dx * strength;
              y += dy * strength;
            }

            starsFlat.push({ x, y, mag: s.mag });
          }
        }
      }

      // base stars
      for (const star of starsFlat) {
        const baseSize = Math.max(0.6, 3 - star.mag * 0.4);
        const pulse =
          0.6 + 0.4 * Math.sin(now.getTime() * 0.004 + star.x * 0.01);
        const size = baseSize * pulse;

        // color shifts slowly with idle time: from cool white → subtle teal
        const hue = 220 - idleT * 40; // 220 → 180
        const sat = 12 + idleT * 35;  // 12% → 47%
        const light = 80 - idleT * 18; // 80% → 62%

        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
        ctx.fill();
      }

      // draw links (generated by click handler)
      if (linksRef.current.length && starsFlat.length) {
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = `hsla(185, 70%, 60%, ${0.25 + 0.35 * idleT})`;
        ctx.beginPath();
        for (const [a, b] of linksRef.current) {
          const s1 = starsFlat[a];
          const s2 = starsFlat[b];
          if (!s1 || !s2) continue;
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(s2.x, s2.y);
        }
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const stop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !data) {
      onClose();
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    lastInteractionRef.current = Date.now();

    // find nearest projected star
    const now = new Date();
    const w = rect.width;
    const h = rect.height;

    const projected: { x: number; y: number }[] = [];

    for (const c of data.constellations) {
      for (const s of c.stars) {
        const p = projectStar(s, now, lat, lon, w, h);
        if (!p.visible) {
          projected.push({ x: -9999, y: -9999 });
          continue;
        }
        projected.push({ x: p.x, y: p.y });
      }
    }

    let nearestIndex = -1;
    let nearestDist = 22; // px threshold

    projected.forEach((p, idx) => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIndex = idx;
      }
    });

    // click on empty → exit
    if (nearestIndex === -1) {
      onClose();
      return;
    }

    // click near star → toggle or create links around it
    const links = linksRef.current;

    if (links.length) {
      // if already have links, clear them for a clean new pattern
      linksRef.current = [];
      return;
    }

    // build local pattern with neighbors
    const neighbors: number[] = [];
    projected.forEach((p, idx) => {
      if (idx === nearestIndex) return;
      const dx = p.x - projected[nearestIndex].x;
      const dy = p.y - projected[nearestIndex].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 0 && d < 140) neighbors.push(idx);
    });

    linksRef.current = neighbors.slice(0, 6).map((n) => [nearestIndex, n]);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/96"
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.24em] text-slate-500 pointer-events-none">
        Sky layer
      </div>
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[7px] text-slate-500 pointer-events-none">
        Click near light to weave. Click empty space or press Esc to return.
      </div>
    </div>
  );
}
