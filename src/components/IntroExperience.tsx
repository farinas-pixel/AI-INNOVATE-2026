import React, { useEffect, useRef, useState } from 'react';

interface IntroExperienceProps {
  onComplete: () => void;
}

interface CorePoint3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  color: string;
  isCore: boolean;
  pulsePhase: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number; // depth layer: -120 to +120 (negative = background, positive = foreground)
  size: number;
  speed: number;
  alpha: number;
}

export const IntroExperience: React.FC<IntroExperienceProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Precision choreographic phases:
  // 0: 0.0 - 0.6s  -> Point light + atmospheric haze develops
  // 1: 0.6 - 1.3s  -> 3D AI Core emergence (nucleus, nodes, orbital geometry)
  // 2: 1.3 - 2.0s  -> "STUDENT TECHNOLOGY SYMPOSIUM" + "AI INNOVATE" emerges
  // 3: 2.0 - 2.6s  -> "2026" illuminates + "Explore AI. Build the Future." + metadata
  // 4: 2.6 - 3.4s  -> Single diagonal glass light sweep across title + orbital expansion + pull-back camera into hero
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isSweepActive, setIsSweepActive] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Time tracking
  const startTimeRef = useRef<number>(performance.now());
  const cameraScaleRef = useRef<number>(0.65);
  const coreAlphaRef = useRef<number>(0);

  // Sequence orchestration timers
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsReducedMotion(true);
      const t1 = setTimeout(() => setPhase(2), 250);
      const t2 = setTimeout(() => setPhase(3), 750);
      const t3 = setTimeout(() => setIsFadingOut(true), 1500);
      const t4 = setTimeout(() => onComplete(), 1900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    startTimeRef.current = performance.now();

    // Suggested rhythm:
    // 0.0 - 0.6s: Point light + atmosphere
    // 0.6 - 1.3s: 3D core emergence
    // 1.3 - 2.0s: Label + AI INNOVATE
    // 2.0 - 2.6s: 2026 + tagline + metadata
    // 2.6 - 3.4s: Light sweep + orbital expansion + smooth transition into website
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1300),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => {
        setPhase(4);
        setIsSweepActive(true);
      }, 2600),
      setTimeout(() => {
        setIsFadingOut(true);
      }, 3050),
      setTimeout(() => {
        onComplete();
      }, 3450),
    ];

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  // Integrated 3D Core, Depth Particles, and Volumetric Light Canvas
  useEffect(() => {
    if (isReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 640;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Depth-based particles:
    // Foreground: z > 40 (slightly larger, gentle blur)
    // Midground: -40 <= z <= 40 (crisp, standard size)
    // Background: z < -40 (smaller, lower opacity, passes behind elements)
    const particleCount = isMobile ? 14 : 24;
    const particles: Particle3D[] = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * (width * 0.75),
      y: (Math.random() - 0.5) * (height * 0.75),
      z: Math.random() * 240 - 120, // -120 to +120
      size: Math.random() * 1.3 + 0.8,
      speed: (Math.random() * 0.0006 + 0.0003) * (Math.random() > 0.5 ? 1 : -1),
      alpha: Math.random() * 0.4 + 0.15,
    }));

    // Fibonacci sphere geometry for AI Core
    const outerNodeCount = isMobile ? 22 : 32;
    const coreRadius = Math.min(width, height) * (isMobile ? 0.18 : 0.15);
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const coreNodes: CorePoint3D[] = [];

    // Outer shell nodes
    for (let i = 0; i < outerNodeCount; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / outerNodeCount);
      coreNodes.push({
        baseX: coreRadius * Math.cos(theta) * Math.sin(phi),
        baseY: coreRadius * Math.sin(theta) * Math.sin(phi),
        baseZ: coreRadius * Math.cos(phi),
        size: Math.random() * 1.1 + 1.1,
        color: i % 4 === 0 ? '#06B6D4' : i % 6 === 0 ? '#7C3AED' : '#FFFFFF',
        isCore: false,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Inner nucleus nodes (8 nodes) - moves at slightly different rate for engineered depth
    const innerNodeCount = 8;
    const innerRadius = coreRadius * 0.38;
    for (let i = 0; i < innerNodeCount; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / innerNodeCount);
      coreNodes.push({
        baseX: innerRadius * Math.cos(theta) * Math.sin(phi),
        baseY: innerRadius * Math.sin(theta) * Math.sin(phi),
        baseZ: innerRadius * Math.cos(phi),
        size: Math.random() * 1.4 + 1.8,
        color: '#FFFFFF',
        isCore: true,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let angleY = 0.2;
    let angleX = 0.14;
    let innerAngleY = 0.2;
    const renderStartTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - renderStartTime;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Mathematical, engineered rotation speeds:
      // Outer shell: steady 0.0035
      // Inner nucleus: slightly differentiated 0.0048 for rich 3D parallax
      // Outer orbital rings: slower 0.002
      angleY += 0.0035;
      angleX += 0.0016;
      innerAngleY += 0.0048;

      // 1. Camera Push & Transition Interpolation:
      // 0 - 2.0s: slow cinematic camera push-in (0.65 -> 1.05)
      // 2.6 - 3.4s: camera slowly pulls backward into the hero position (1.05 -> 0.95), orbital rings expand
      let currentScale = 0.65;
      if (elapsed <= 2000) {
        const pushT = Math.min(1, Math.max(0, (elapsed - 500) / 1500));
        const easedPush = 1 - Math.pow(1 - pushT, 3);
        currentScale = 0.65 + easedPush * 0.4;
      } else if (elapsed <= 2600) {
        currentScale = 1.05;
      } else {
        // Pull-backward transition (2.6s - 3.4s)
        const pullT = Math.min(1, (elapsed - 2600) / 800);
        const easedPull = pullT * pullT;
        currentScale = 1.05 - easedPull * 0.12;
      }
      cameraScaleRef.current = currentScale;

      // Core appearance / brightness curve
      // 0 - 600ms: only pinpoint light
      // 600 - 1300ms: core emerges
      // 2600 - 3400ms: core gently softens as website reveals
      let coreReveal = 0;
      if (elapsed > 550 && elapsed <= 2600) {
        coreReveal = Math.min(1, (elapsed - 550) / 750);
      } else if (elapsed > 2600) {
        const dissolveT = Math.min(1, (elapsed - 2600) / 800);
        coreReveal = Math.max(0.2, 1 - dissolveT * 0.65);
      }
      coreAlphaRef.current = coreReveal;

      // Rings reveal slightly trailing the core
      const ringsReveal = Math.min(1, Math.max(0, (elapsed - 850) / 700));

      // Orbital expansion progress during phase 4 (2.6s - 3.4s)
      const expansionT = elapsed > 2600 ? Math.min(1, (elapsed - 2600) / 750) : 0;
      const orbitalMultiplier = 1 + expansionT * 0.5;

      // -------------------------------------------------------------
      // Lighting Reaction: Central 3D light illuminates entire scene
      // -------------------------------------------------------------
      const ambientRadius = coreRadius * (2.0 + currentScale * 0.6);
      const ambientGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, ambientRadius);
      const ambientBrightness = Math.min(0.24, 0.04 + coreReveal * 0.18);

      ambientGrad.addColorStop(0, `rgba(37, 99, 235, ${ambientBrightness})`);
      ambientGrad.addColorStop(0.35, `rgba(6, 182, 212, ${ambientBrightness * 0.45})`);
      ambientGrad.addColorStop(0.7, `rgba(124, 58, 237, ${ambientBrightness * 0.2})`);
      ambientGrad.addColorStop(1, 'rgba(5, 11, 20, 0)');

      ctx.fillStyle = ambientGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, ambientRadius, 0, Math.PI * 2);
      ctx.fill();

      // -------------------------------------------------------------
      // Phase 0: Central point of light development (0 - 800ms)
      // -------------------------------------------------------------
      if (elapsed < 900) {
        const pointAlpha = Math.min(1, elapsed / 350) * (elapsed > 700 ? 1 - (elapsed - 700) / 200 : 1);
        const pointPulse = Math.sin(elapsed * 0.009) * 0.15 + 0.85;

        // Volumetric halo
        const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18 * pointPulse);
        halo.addColorStop(0, `rgba(255, 255, 255, ${pointAlpha * 0.95})`);
        halo.addColorStop(0.35, `rgba(6, 182, 212, ${pointAlpha * 0.55})`);
        halo.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(cx, cy, 18 * pointPulse, 0, Math.PI * 2);
        ctx.fill();

        // Pinpoint nucleus
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(cx, cy, 1.8 * pointPulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // -------------------------------------------------------------
      // Background Depth Particles (z < -30) - Render behind core & title
      // -------------------------------------------------------------
      if (coreReveal > 0.08) {
        ctx.save();
        particles.forEach((p) => {
          if (p.z >= -30) return; // Only background layer
          p.z += p.speed * 30;
          if (p.z > 120) p.z = -120;

          const fov = 350;
          const scale = (fov / (fov + p.z + 180)) * currentScale;
          const sx = cx + p.x * scale;
          const sy = cy + p.y * scale;
          const sz = Math.max(0.5, p.size * scale * 0.7);

          ctx.beginPath();
          ctx.arc(sx, sy, sz, 0, Math.PI * 2);
          ctx.fillStyle = '#06B6D4';
          ctx.globalAlpha = Math.min(0.22, p.alpha * coreReveal * 0.5);
          ctx.fill();
        });
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 3D AI Core Emergence (transparent shell, nucleus, orbital rings)
      // -------------------------------------------------------------
      if (coreReveal > 0.04) {
        const renderRadius = coreRadius * currentScale;

        ctx.save();
        // Transparent glass sphere shadow base
        ctx.beginPath();
        ctx.arc(cx, cy, renderRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(11, 23, 42, ${0.45 * coreReveal})`;
        ctx.fill();

        // Orbital Geometry with slower subtle movement
        if (ringsReveal > 0.05) {
          const ringAlpha = ringsReveal * coreReveal * (1 - expansionT * 0.25);

          // Primary Ring 1
          ctx.beginPath();
          ctx.ellipse(
            cx,
            cy,
            renderRadius * 1.55 * orbitalMultiplier,
            renderRadius * 0.52 * orbitalMultiplier,
            angleX * 0.8,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.32 * ringAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Secondary Counter-Tilted Ring 2
          ctx.beginPath();
          ctx.ellipse(
            cx,
            cy,
            renderRadius * 1.38 * orbitalMultiplier,
            renderRadius * 0.44 * orbitalMultiplier,
            -angleX * 0.7 + 1.15,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.25 * ringAlpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }

        // Project Core Nodes (Inner and Outer with differentiated angles)
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);

        const innerCosY = Math.cos(innerAngleY);
        const innerSinY = Math.sin(innerAngleY);

        const projected: {
          x: number;
          y: number;
          z: number;
          size: number;
          color: string;
          isCore: boolean;
        }[] = [];

        coreNodes.forEach((node) => {
          const cyVal = node.isCore ? innerCosY : cosY;
          const syVal = node.isCore ? innerSinY : sinY;

          // Rotate Y
          const x1 = node.baseX * cyVal - node.baseZ * syVal;
          const z1 = node.baseZ * cyVal + node.baseX * syVal;

          // Rotate X
          const y2 = node.baseY * cosX - z1 * sinX;
          const z2 = z1 * cosX + node.baseY * sinX;

          const fov = coreRadius * 3.8;
          const scale = (fov / (fov + z2)) * currentScale;

          projected.push({
            x: cx + x1 * scale,
            y: cy + y2 * scale,
            z: z2,
            size: node.size * scale,
            color: node.color,
            isCore: node.isCore,
          });
        });

        // Depth Sort
        projected.sort((a, b) => a.z - b.z);

        // Subtle geometric synaptic connections
        const maxDist = renderRadius * 0.62;
        const pLen = projected.length;

        for (let i = 0; i < pLen; i++) {
          const na = projected[i];
          for (let j = i + 1; j < pLen; j++) {
            const nb = projected[j];
            const dx = na.x - nb.x;
            const dy = na.y - nb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              const avgZ = (na.z + nb.z) / 2;
              const depthFactor = Math.max(0.1, (avgZ + coreRadius) / (2 * coreRadius));
              const connAlpha =
                (1 - dist / maxDist) * depthFactor * 0.28 * coreReveal * (na.isCore || nb.isCore ? 1.4 : 0.85);

              ctx.beginPath();
              ctx.moveTo(na.x, na.y);
              ctx.lineTo(nb.x, nb.y);
              ctx.strokeStyle =
                na.isCore || nb.isCore
                  ? `rgba(124, 58, 237, ${connAlpha})`
                  : `rgba(6, 182, 212, ${connAlpha * 0.9})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }

        // Render Projected Nodes
        projected.forEach((node) => {
          const depthNorm = Math.max(0.2, (node.z + coreRadius) / (2 * coreRadius));
          const nodeAlpha = depthNorm * coreReveal;

          if (node.isCore) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 58, 237, ${nodeAlpha * 0.35})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(node.x, node.y, Math.max(0.8, node.size * depthNorm), 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = nodeAlpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        // Transparent Glass Rim with dynamic lighting response
        ctx.beginPath();
        ctx.arc(cx, cy, renderRadius, 0, Math.PI * 2);
        const rimGrad = ctx.createLinearGradient(
          cx - renderRadius * 0.7,
          cy - renderRadius * 0.7,
          cx + renderRadius * 0.7,
          cy + renderRadius * 0.7
        );
        rimGrad.addColorStop(0, `rgba(255, 255, 255, ${0.46 * coreReveal})`);
        rimGrad.addColorStop(0.3, `rgba(6, 182, 212, ${0.22 * coreReveal})`);
        rimGrad.addColorStop(0.7, `rgba(37, 99, 235, ${0.12 * coreReveal})`);
        rimGrad.addColorStop(1, `rgba(124, 58, 237, ${0.26 * coreReveal})`);

        ctx.strokeStyle = rimGrad;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Upper Specular Highlight
        ctx.beginPath();
        ctx.arc(cx - renderRadius * 0.1, cy - renderRadius * 0.1, renderRadius * 0.84, Math.PI * 1.15, Math.PI * 1.6);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.28 * coreReveal})`;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Internal Nucleus Glow (visually stable)
        const nucleus = ctx.createRadialGradient(cx, cy, 0, cx, cy, renderRadius * 0.5);
        nucleus.addColorStop(0, `rgba(255, 255, 255, ${0.34 * coreReveal})`);
        nucleus.addColorStop(0.35, `rgba(6, 182, 212, ${0.16 * coreReveal})`);
        nucleus.addColorStop(0.7, `rgba(124, 58, 237, ${0.08 * coreReveal})`);
        nucleus.addColorStop(1, 'rgba(5, 11, 20, 0)');

        ctx.fillStyle = nucleus;
        ctx.beginPath();
        ctx.arc(cx, cy, renderRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // -------------------------------------------------------------
      // Midground & Foreground Depth Particles (-30 <= z <= 120)
      // Passes around/in front of the 3D core, soft and non-intrusive
      // -------------------------------------------------------------
      if (coreReveal > 0.08) {
        ctx.save();
        particles.forEach((p) => {
          if (p.z < -30) return; // Background particles rendered earlier
          p.z += p.speed * 30;
          if (p.z > 120) p.z = -120;

          const fov = 350;
          const scale = (fov / (fov + p.z + 180)) * currentScale;
          const sx = cx + p.x * scale;
          const sy = cy + p.y * scale;

          const isForeground = p.z > 40;
          const sz = isForeground ? p.size * scale * 1.3 : p.size * scale;

          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(0.7, sz), 0, Math.PI * 2);
          ctx.fillStyle = isForeground ? '#FFFFFF' : '#06B6D4';
          ctx.globalAlpha = Math.min(
            0.45,
            p.alpha * coreReveal * (isForeground ? 0.75 : 0.6)
          );
          ctx.fill();
        });
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isReducedMotion]);

  // Clean, seamless skip to website
  const handleSkip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFadingOut(true);
    setTimeout(onComplete, 160);
  };

  return (
    <div
      role="dialog"
      aria-label="Symposium Intro"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050B14] text-white overflow-hidden transition-all duration-700 ease-out select-none ${
        isFadingOut ? 'opacity-0 scale-[1.02] pointer-events-none blur-[2px]' : 'opacity-100 scale-100'
      }`}
      onClick={() => handleSkip()}
    >
      {/* 3D Atmospheric & Volumetric Canvas */}
      {!isReducedMotion && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      )}

      {/* Subtle fine geometric horizon line appearing when title emerges */}
      <div
        className={`absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent transition-all duration-1000 pointer-events-none ${
          phase >= 2 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
        }`}
      />

      {/* Cinematic Typography Stage: Synchronized with 3D Space */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center pointer-events-none">
        
        {/* Secondary Label: "STUDENT TECHNOLOGY SYMPOSIUM" */}
        <div
          className={`font-medium tracking-[0.28em] text-cyan-400/90 text-xs sm:text-sm uppercase mb-3 transition-all duration-700 ease-out ${
            phase >= 2
              ? 'opacity-100 blur-0 translate-y-0 scale-100'
              : 'opacity-0 blur-md translate-y-4 scale-95'
          }`}
        >
          STUDENT TECHNOLOGY SYMPOSIUM
        </div>

        {/* Primary Editorial Title Container */}
        <div className="relative overflow-hidden py-1 px-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white flex flex-wrap items-baseline justify-center gap-x-3.5 gap-y-1">
            {/* "AI INNOVATE" - Dominant Element */}
            <span
              className={`transition-all duration-700 ease-out text-white drop-shadow-sm ${
                phase >= 2
                  ? 'opacity-100 blur-0 translate-y-0'
                  : 'opacity-0 blur-md translate-y-5'
              }`}
            >
              AI INNOVATE
            </span>

            {/* "2026" - Supporting Element with Light Cyan Accent */}
            <span
              className={`font-light text-cyan-400 tracking-wider text-3xl sm:text-5xl md:text-6xl transition-all duration-700 delay-150 ease-out ${
                phase >= 3
                  ? 'opacity-100 blur-0 translate-y-0'
                  : 'opacity-0 blur-md translate-y-4'
              }`}
            >
              2026
            </span>
          </h1>

          {/* Single Precision Light Sweep across Typography: Initiates in Phase 4 (duration ~850ms) */}
          <div
            className={`absolute inset-y-0 w-36 -skew-x-25 bg-gradient-to-r from-transparent via-white/22 to-transparent pointer-events-none transition-all duration-850 ease-in-out ${
              isSweepActive ? 'left-[130%] opacity-0' : '-left-48 opacity-100'
            }`}
          />
        </div>

        {/* Emotional Finish Tagline: "Explore AI. Build the Future." */}
        <p
          className={`mt-4 text-xs sm:text-sm md:text-base text-slate-300 font-light tracking-[0.2em] uppercase transition-all duration-700 delay-100 ease-out ${
            phase >= 3
              ? 'opacity-100 blur-0 translate-y-0'
              : 'opacity-0 blur-sm translate-y-3'
          }`}
        >
          “Explore AI. Build the Future.”
        </p>

        {/* Minimal Event Metadata */}
        <div
          className={`mt-6 inline-flex items-center gap-2.5 text-[11px] sm:text-xs font-normal text-slate-400 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm transition-all duration-700 delay-200 ease-out ${
            phase >= 3
              ? 'opacity-100 blur-0 translate-y-0'
              : 'opacity-0 blur-sm translate-y-2'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>18 OCTOBER 2026</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300 font-medium">INNOVATION AUDITORIUM</span>
        </div>
      </div>

      {/* Subtle "Skip Intro" Action */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute bottom-6 right-6 px-3 py-1.5 text-[11px] uppercase tracking-widest text-slate-400 hover:text-white bg-transparent hover:bg-white/[0.05] border border-white/10 hover:border-white/25 rounded-md transition-all duration-200 cursor-pointer pointer-events-auto z-20"
        aria-label="Skip symposium intro"
      >
        Skip Intro &rarr;
      </button>
    </div>
  );
};
