import React, { useEffect, useRef, useState } from 'react';

type CursorMode = 'default' | 'button' | 'link' | 'card' | '3d-object';

export const CustomObjectCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Position tracking using refs to avoid re-renders
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const modeRef = useRef<CursorMode>('default');
  const clickPulse = useRef(0);
  const currentScale = useRef(1);

  // Trail particles
  const trail = useRef<{ x: number; y: number; alpha: number; size: number }[]>([]);

  useEffect(() => {
    // Check if touch device / mobile
    const checkTouch = () => {
      const isTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(isTouch);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    if ('ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches) {
      return () => window.removeEventListener('resize', checkTouch);
    }

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => {
      clickPulse.current = 1.0;
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect hovered element types
    const handleMouseOver = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement | null;
      if (!targetEl) return;

      if (targetEl.closest('canvas') || targetEl.closest('[data-3d-object]')) {
        modeRef.current = '3d-object';
      } else if (
        targetEl.closest('button') ||
        targetEl.closest('[role="button"]') ||
        targetEl.closest('input[type="submit"]')
      ) {
        modeRef.current = 'button';
      } else if (targetEl.closest('a')) {
        modeRef.current = 'link';
      } else if (targetEl.closest('.p-5, .p-6, .p-7, .p-8, [data-card]')) {
        modeRef.current = 'card';
      } else {
        modeRef.current = 'default';
      }

      if (cursorRef.current) {
        cursorRef.current.setAttribute('data-cursor-mode', modeRef.current);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Canvas setup for trailing micro-particles and dynamic orbital ring
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let animId: number;

    const animate = () => {
      // Lerp mouse follow
      const lerpSpeed = prefersReducedMotion ? 1 : 0.22;
      pos.current.x += (target.current.x - pos.current.x) * lerpSpeed;
      pos.current.y += (target.current.y - pos.current.y) * lerpSpeed;

      // Dynamic scale target based on mode
      let targetScale = 1;
      if (modeRef.current === 'button') targetScale = 1.35;
      else if (modeRef.current === 'link') targetScale = 1.25;
      else if (modeRef.current === 'card') targetScale = 1.15;
      else if (modeRef.current === '3d-object') targetScale = 1.4;

      if (clickPulse.current > 0.5) targetScale *= 0.88;

      currentScale.current += (targetScale - currentScale.current) * 0.15;

      if (clickPulse.current > 0) {
        clickPulse.current = Math.max(0, clickPulse.current - 0.05);
      }

      // Update trailing micro-particles
      if (
        !prefersReducedMotion &&
        (Math.abs(target.current.x - pos.current.x) > 1 || Math.abs(target.current.y - pos.current.y) > 1)
      ) {
        if (Math.random() > 0.4) {
          trail.current.push({
            x: pos.current.x + (Math.random() - 0.5) * 6,
            y: pos.current.y + (Math.random() - 0.5) * 6,
            alpha: 0.6,
            size: Math.random() * 2 + 1,
          });
        }
      }

      // Render on full screen canvas
      if (canvas && ctx) {
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw particle trail
        for (let i = trail.current.length - 1; i >= 0; i--) {
          const pt = trail.current[i];
          pt.alpha -= 0.035;
          if (pt.alpha <= 0) {
            trail.current.splice(i, 1);
          } else {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 182, 212, ${pt.alpha * 0.5})`;
            ctx.fill();
          }
        }

        // Draw Click pulse ripple
        if (clickPulse.current > 0) {
          const rippleRadius = (1 - clickPulse.current) * 36 + 10;
          ctx.beginPath();
          ctx.arc(pos.current.x, pos.current.y, rippleRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(6, 182, 212, ${clickPulse.current * 0.65})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Update Cursor Container transform
      if (cursorRef.current) {
        const x = pos.current.x;
        const y = pos.current.y;
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${currentScale.current})`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', checkTouch);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  // Do not render anything on touch devices
  if (isTouchDevice) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-300 no-print ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 3D Glass Object Cursor container */}
      <div
        ref={cursorRef}
        data-cursor-mode="default"
        className="group/cursor absolute top-0 left-0 -ml-4 -mt-4 w-8 h-8 pointer-events-none flex items-center justify-center will-change-transform transition-colors"
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-md group-data-[cursor-mode=button]/cursor:bg-cyan-400/40 group-data-[cursor-mode=3d-object]/cursor:bg-purple-500/40 transition-colors" />

        {/* Outer 3D orbital ring */}
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-full border border-cyan-400/40 group-data-[cursor-mode=button]/cursor:border-cyan-300/80 group-data-[cursor-mode=link]/cursor:border-white/70 animate-spin [animation-duration:5s] transition-colors"
        />

        {/* Secondary tilted counter-rotating elliptical ring */}
        <div className="absolute w-7 h-4 rounded-full border border-purple-400/45 group-data-[cursor-mode=3d-object]/cursor:border-cyan-300 group-data-[cursor-mode=3d-object]/cursor:w-9 group-data-[cursor-mode=3d-object]/cursor:h-5 animate-spin [animation-duration:3s] transition-all" />

        {/* Miniature 3D Glass AI Core */}
        <div className="relative w-3.5 h-3.5 rounded-full bg-gradient-to-br from-white via-cyan-300 to-blue-600 shadow-sm shadow-cyan-400/50 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#07111F]" />
        </div>
      </div>
    </div>
  );
};
