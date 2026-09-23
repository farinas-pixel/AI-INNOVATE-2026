import React, { useEffect, useRef, useState } from 'react';

interface Point3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  pulsePhase: number;
  isCore: boolean;
}

interface PulseArc {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export const AiGlassOrb: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isNear, setIsNear] = useState(false);

  // Mouse & Parallax tracking
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const orbitTilt = useRef({ x: 0.25, y: 0.35, targetX: 0.25, targetY: 0.35 });
  const scrollOffset = useRef(0);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Scroll listener for 3D elevation
    const handleScroll = () => {
      scrollOffset.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Fibonacci sphere nodes
    const nodeCount = 48;
    const radius = Math.min(width, height) * 0.34;
    const points: Point3D[] = [];

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < nodeCount; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      points.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 1.5 + 1.8,
        pulsePhase: Math.random() * Math.PI * 2,
        isCore: false,
      });
    }

    // Inner core neural nucleus (14 nodes)
    const coreCount = 14;
    const coreRadius = radius * 0.42;
    for (let i = 0; i < coreCount; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / coreCount);
      const x = coreRadius * Math.cos(theta) * Math.sin(phi);
      const y = coreRadius * Math.sin(theta) * Math.sin(phi);
      const z = coreRadius * Math.cos(phi);

      points.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 1.6 + 2.4,
        pulsePhase: Math.random() * Math.PI * 2,
        isCore: true,
      });
    }

    // Dynamic pulses traveling along connections
    const pulses: PulseArc[] = [
      { fromIndex: 0, toIndex: 6, progress: 0.1, speed: 0.012, color: '#06B6D4' },
      { fromIndex: 12, toIndex: 22, progress: 0.4, speed: 0.014, color: '#7C3AED' },
      { fromIndex: 18, toIndex: 28, progress: 0.7, speed: 0.011, color: '#2563EB' },
      { fromIndex: 48, toIndex: 56, progress: 0.2, speed: 0.016, color: '#06B6D4' },
    ];

    // Ambient floating satellites on orbital rings
    const satellites = [
      { angle: 0, speed: 0.014, ring: 1, size: 2.5, color: '#06B6D4' },
      { angle: Math.PI, speed: 0.014, ring: 1, size: 2, color: '#FFFFFF' },
      { angle: Math.PI * 0.5, speed: -0.011, ring: 2, size: 2.2, color: '#7C3AED' },
      { angle: Math.PI * 1.5, speed: -0.011, ring: 2, size: 1.8, color: '#38BDF8' },
    ];

    let baseAngle = 0;
    const startTime = performance.now();

    const render = (time: number) => {
      const elapsed = time - startTime;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.width / dpr;
      const displayHeight = canvas.height / dpr;

      // Parallax offset: Opposite to cursor movement
      const parallaxX = -mousePos.current.x * 0.04;
      const parallaxY = -mousePos.current.y * 0.04;

      // Scroll offset translation: moves upward & fades naturally on scroll
      const scrollY = scrollOffset.current * 0.15;
      const scrollFade = Math.max(0.2, 1 - scrollOffset.current / 900);

      const centerX = displayWidth / 2 + parallaxX;
      const floatY = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.0012) * 6;
      const centerY = displayHeight / 2 + floatY + parallaxY - scrollY;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Smooth damping for mouse & orbit tilt
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.06;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.06;

      orbitTilt.current.x += (orbitTilt.current.targetX - orbitTilt.current.x) * 0.05;
      orbitTilt.current.y += (orbitTilt.current.targetY - orbitTilt.current.y) * 0.05;

      baseAngle += prefersReducedMotion ? 0 : 0.0035;

      const rotY = baseAngle + mousePos.current.x * 0.0006;
      const rotX = orbitTilt.current.x + mousePos.current.y * 0.0006;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // 1. Soft atmospheric glow behind orb
      const ambientGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius * 1.55
      );
      ambientGlow.addColorStop(0, `rgba(37, 99, 235, ${0.18 * scrollFade})`);
      ambientGlow.addColorStop(0.45, `rgba(124, 58, 237, ${0.08 * scrollFade})`);
      ambientGlow.addColorStop(0.75, `rgba(6, 182, 212, ${0.03 * scrollFade})`);
      ambientGlow.addColorStop(1, 'rgba(7, 17, 31, 0)');

      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.55, 0, Math.PI * 2);
      ctx.fill();

      // 2. Tilted 3D Orbital Rings (thin, semi-transparent glass rings)
      const ringTilt1 = rotX * 0.7;
      const ringTilt2 = -rotX * 0.5 + 0.8;

      ctx.save();
      // Orbit Ring 1
      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY,
        radius * 1.45,
        radius * 0.55 * Math.abs(Math.cos(ringTilt1)),
        ringTilt1,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = `rgba(6, 182, 212, ${0.22 * scrollFade})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Orbit Ring 2
      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY,
        radius * 1.35,
        radius * 0.45 * Math.abs(Math.cos(ringTilt2)),
        ringTilt2,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = `rgba(124, 58, 237, ${0.18 * scrollFade})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Satellites orbiting along rings
      satellites.forEach((sat) => {
        sat.angle += sat.speed;
        const currentRingRadius = sat.ring === 1 ? radius * 1.45 : radius * 1.35;
        const currentTilt = sat.ring === 1 ? ringTilt1 : ringTilt2;
        const semiMinor = sat.ring === 1 ? radius * 0.55 * Math.abs(Math.cos(ringTilt1)) : radius * 0.45 * Math.abs(Math.cos(ringTilt2));

        const ex = Math.cos(sat.angle) * currentRingRadius;
        const ey = Math.sin(sat.angle) * semiMinor;

        const satX = centerX + ex * Math.cos(currentTilt) - ey * Math.sin(currentTilt);
        const satY = centerY + ex * Math.sin(currentTilt) + ey * Math.cos(currentTilt);

        ctx.beginPath();
        ctx.arc(satX, satY, sat.size, 0, Math.PI * 2);
        ctx.fillStyle = sat.color;
        ctx.shadowColor = sat.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.restore();

      // 3. Rotate 3D Points for Neural Core
      const rotatedPoints: { p: Point3D; screenX: number; screenY: number; depth: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];

        // Rotate around Y
        const x1 = pt.baseX * cosY - pt.baseZ * sinY;
        const z1 = pt.baseZ * cosY + pt.baseX * sinY;

        // Rotate around X
        const y2 = pt.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + pt.baseY * sinX;

        // Perspective projection
        const fov = radius * 3.5;
        const scale = fov / (fov + z2);
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;

        rotatedPoints.push({
          p: pt,
          screenX,
          screenY,
          depth: z2,
        });
      }

      // Depth Sort
      rotatedPoints.sort((a, b) => a.depth - b.depth);

      // 4. Back glass sphere shadow/base
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(11, 23, 42, ${0.4 * scrollFade})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * scrollFade})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 5. Fine synaptic connections
      const maxDistance = radius * 0.65;
      const count = rotatedPoints.length;

      for (let i = 0; i < count; i++) {
        const ptA = rotatedPoints[i];
        for (let j = i + 1; j < count; j++) {
          const ptB = rotatedPoints[j];
          const dx = ptA.screenX - ptB.screenX;
          const dy = ptA.screenY - ptB.screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const avgDepth = (ptA.depth + ptB.depth) / 2;
            const depthAlpha = Math.max(0.06, Math.min(0.55, (avgDepth + radius) / (2 * radius)));
            const distanceFactor = 1 - dist / maxDistance;
            const alpha = depthAlpha * distanceFactor * 0.38 * scrollFade;

            ctx.beginPath();
            ctx.moveTo(ptA.screenX, ptA.screenY);
            ctx.lineTo(ptB.screenX, ptB.screenY);

            if (ptA.p.isCore || ptB.p.isCore) {
              ctx.strokeStyle = `rgba(124, 58, 237, ${alpha * 1.3})`;
              ctx.lineWidth = 1;
            } else {
              ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
              ctx.lineWidth = 0.75;
            }
            ctx.stroke();
          }
        }
      }

      // 6. Synaptic Pulses
      if (!prefersReducedMotion) {
        for (const pulse of pulses) {
          pulse.progress += pulse.speed;
          if (pulse.progress > 1) {
            pulse.progress = 0;
            pulse.fromIndex = Math.floor(Math.random() * points.length);
            pulse.toIndex = (pulse.fromIndex + 5 + Math.floor(Math.random() * 6)) % points.length;
          }

          const nodeA = rotatedPoints.find((rp) => rp.p === points[pulse.fromIndex]);
          const nodeB = rotatedPoints.find((rp) => rp.p === points[pulse.toIndex]);

          if (nodeA && nodeB) {
            const px = nodeA.screenX + (nodeB.screenX - nodeA.screenX) * pulse.progress;
            const py = nodeA.screenY + (nodeB.screenY - nodeA.screenY) * pulse.progress;

            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = pulse.color;
            ctx.fill();
          }
        }
      }

      // 7. Neural Nodes
      for (let i = 0; i < count; i++) {
        const item = rotatedPoints[i];
        const depthNorm = Math.max(0.2, (item.depth + radius) / (2 * radius));
        const pulse = prefersReducedMotion
          ? 0.5
          : Math.sin(elapsed * 0.0025 + item.p.pulsePhase) * 0.5 + 0.5;
        const currentSize = item.p.size * (0.85 + pulse * 0.25) * depthNorm;

        if (item.p.isCore) {
          ctx.beginPath();
          ctx.arc(item.screenX, item.screenY, currentSize * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(124, 58, 237, ${depthNorm * 0.25 * scrollFade})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(item.screenX, item.screenY, Math.max(1, currentSize), 0, Math.PI * 2);
        if (item.p.isCore) {
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.8 + depthNorm * 0.2) * scrollFade})`;
        } else {
          ctx.fillStyle = depthNorm > 0.6 ? '#06B6D4' : `rgba(148, 163, 184, ${0.75 * scrollFade})`;
        }
        ctx.fill();
      }

      // 8. Glass Sphere Rim & Specular Curvature Highlight
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

      // Light source reactive angle
      const lightAngleX = (mousePos.current.x / displayWidth) * 0.3;
      const lightAngleY = (mousePos.current.y / displayHeight) * 0.3;

      const rimGradient = ctx.createLinearGradient(
        centerX - radius * (0.7 - lightAngleX),
        centerY - radius * (0.7 - lightAngleY),
        centerX + radius * (0.7 + lightAngleX),
        centerY + radius * (0.7 + lightAngleY)
      );
      rimGradient.addColorStop(0, `rgba(255, 255, 255, ${0.4 * scrollFade})`);
      rimGradient.addColorStop(0.3, `rgba(6, 182, 212, ${0.15 * scrollFade})`);
      rimGradient.addColorStop(0.7, `rgba(37, 99, 235, ${0.1 * scrollFade})`);
      rimGradient.addColorStop(1, `rgba(124, 58, 237, ${0.25 * scrollFade})`);

      ctx.strokeStyle = rimGradient;
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // Top-left curved optical reflection highlight
      ctx.beginPath();
      ctx.arc(
        centerX - radius * (0.12 - lightAngleX * 0.2),
        centerY - radius * (0.12 - lightAngleY * 0.2),
        radius * 0.82,
        Math.PI * 1.15,
        Math.PI * 1.62
      );
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.22 * scrollFade})`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Internal nucleus glow
      const nucleus = ctx.createRadialGradient(
        centerX,
        centerY,
        1,
        centerX,
        centerY,
        radius * 0.45
      );
      nucleus.addColorStop(0, `rgba(255, 255, 255, ${0.35 * scrollFade})`);
      nucleus.addColorStop(0.35, `rgba(6, 182, 212, ${0.14 * scrollFade})`);
      nucleus.addColorStop(0.7, `rgba(124, 58, 237, ${0.08 * scrollFade})`);
      nucleus.addColorStop(1, 'rgba(7, 17, 31, 0)');

      ctx.fillStyle = nucleus;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      if (!prefersReducedMotion) {
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    if (prefersReducedMotion) {
      render(0);
    } else {
      animFrameId.current = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  // Spatial mouse tracking relative to hero container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mousePos.current.targetX = x;
    mousePos.current.targetY = y;
    orbitTilt.current.targetX = 0.25 + (y / rect.height) * 0.4;
    orbitTilt.current.targetY = 0.35 + (x / rect.width) * 0.4;
  };

  const handleMouseEnter = () => {
    setIsNear(true);
  };

  const handleMouseLeave = () => {
    mousePos.current.targetX = 0;
    mousePos.current.targetY = 0;
    orbitTilt.current.targetX = 0.25;
    orbitTilt.current.targetY = 0.35;
    setIsNear(false);
  };

  return (
    <div
      ref={containerRef}
      data-3d-object="hero-orb"
      className="relative w-full h-full min-h-[350px] sm:min-h-[420px] lg:min-h-[480px] flex items-center justify-center select-none overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label="3D Glass AI Neural Visualization"
    >
      {/* Background ambient lighting */}
      <div
        className={`absolute w-72 h-72 rounded-full bg-blue-600/12 blur-3xl pointer-events-none transition-all duration-700 ${
          isNear ? 'scale-110 opacity-80' : 'scale-100 opacity-40'
        }`}
      />
      <div className="absolute w-56 h-56 rounded-full bg-purple-600/10 blur-2xl pointer-events-none -translate-x-8 translate-y-8" />

      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full max-w-[480px] max-h-[480px]"
      />
    </div>
  );
};
