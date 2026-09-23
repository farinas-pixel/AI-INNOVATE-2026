import React, { useEffect, useRef } from 'react';

export const About3DObject: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
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

    // Global mouse tracking for parallax
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mousePos.current.targetX = e.clientX - cx;
      mousePos.current.targetY = e.clientY - cy;
    };
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });

    // Icosahedron vertices definition
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices = [
      [-1, phi, 0],
      [1, phi, 0],
      [-1, -phi, 0],
      [1, -phi, 0],
      [0, -1, phi],
      [0, 1, phi],
      [0, -1, -phi],
      [0, 1, -phi],
      [phi, 0, -1],
      [phi, 0, 1],
      [-phi, 0, -1],
      [-phi, 0, 1],
    ];

    // Normalize and scale vertices
    const radius = Math.min(width, height) * 0.28;
    const vertices = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return {
        x: (x / len) * radius,
        y: (y / len) * radius,
        z: (z / len) * radius,
      };
    });

    // Edges between adjacent vertices
    const edges: [number, number][] = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dx = vertices[i].x - vertices[j].x;
        const dy = vertices[i].y - vertices[j].y;
        const dz = vertices[i].z - vertices[j].z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // Icosahedron edge length is ~1.05 * radius
        if (Math.abs(d - radius * 1.05) < radius * 0.15) {
          edges.push([i, j]);
        }
      }
    }

    let angleX = 0.2;
    let angleY = 0.4;
    const startTime = performance.now();

    const render = (time: number) => {
      const elapsed = time - startTime;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.width / dpr;
      const displayHeight = canvas.height / dpr;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Mouse parallax with strength = 0.015
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      const parallaxX = -mousePos.current.x * 0.015;
      const parallaxY = -mousePos.current.y * 0.015;

      const floatY = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.0015) * 5;
      const centerX = displayWidth / 2 + parallaxX;
      const centerY = displayHeight / 2 + floatY + parallaxY;

      if (!prefersReducedMotion) {
        angleY += 0.005;
        angleX += 0.0025;
      }

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Rotate vertices
      const rotated = vertices.map((v) => {
        // Y rotation
        const x1 = v.x * cosY - v.z * sinY;
        const z1 = v.z * cosY + v.x * sinY;
        // X rotation
        const y2 = v.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + v.y * sinX;

        const fov = 280;
        const scale = fov / (fov + z2);
        return {
          sx: centerX + x1 * scale,
          sy: centerY + y2 * scale,
          z: z2,
        };
      });

      // Subtle background core glow
      const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius * 1.2);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
      grad.addColorStop(0.5, 'rgba(124, 58, 237, 0.05)');
      grad.addColorStop(1, 'rgba(7, 17, 31, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Draw glass wireframe edges
      edges.forEach(([i, j]) => {
        const p1 = rotated[i];
        const p2 = rotated[j];
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.1, Math.min(0.65, (avgZ + radius) / (2 * radius)));

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.45})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw luminous vertices nodes
      rotated.forEach((p) => {
        const normZ = Math.max(0.2, (p.z + radius) / (2 * radius));
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 2.2 * normZ, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${normZ * 0.85})`;
        ctx.fill();
      });

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
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <div
      data-3d-object="about-polyhedron"
      className="relative w-full h-full min-h-[160px] flex items-center justify-center select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full max-w-[220px] max-h-[220px]" />
    </div>
  );
};
