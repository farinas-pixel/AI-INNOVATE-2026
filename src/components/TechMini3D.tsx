import React, { useEffect, useRef } from 'react';

interface TechMini3DProps {
  type: string;
  isHovered?: boolean;
}

export const TechMini3D: React.FC<TechMini3DProps> = ({ type, isHovered = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const angleRef = useRef({ x: 0.2, y: 0.2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const size = 56;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Define 3D wireframe models for each tech type
    let vertices: [number, number, number][] = [];
    let edges: [number, number][] = [];
    let strokeColor = 'rgba(6, 182, 212, 0.7)';

    if (type === 'artificial-intelligence') {
      // Regular octahedron
      strokeColor = 'rgba(59, 130, 246, 0.8)';
      vertices = [
        [0, 16, 0],
        [0, -16, 0],
        [16, 0, 0],
        [-16, 0, 0],
        [0, 0, 16],
        [0, 0, -16],
      ];
      edges = [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [4, 3], [3, 5], [5, 2],
      ];
    } else if (type === 'generative-ai') {
      // 3D Double ring / Mobius cross
      strokeColor = 'rgba(168, 85, 247, 0.8)';
      const pts = 8;
      for (let i = 0; i < pts; i++) {
        const theta = (i / pts) * Math.PI * 2;
        vertices.push([Math.cos(theta) * 16, Math.sin(theta) * 16, 0]);
        vertices.push([0, Math.sin(theta) * 16, Math.cos(theta) * 16]);
      }
      for (let i = 0; i < pts; i++) {
        edges.push([i * 2, ((i + 1) % pts) * 2]);
        edges.push([i * 2 + 1, ((i + 1) % pts) * 2 + 1]);
        if (i % 2 === 0) edges.push([i * 2, i * 2 + 1]);
      }
    } else if (type === 'computer-vision') {
      // 3D Vision Frustum
      strokeColor = 'rgba(6, 182, 212, 0.8)';
      vertices = [
        [0, 0, -14], // apex camera center
        [-13, -10, 14], // bottom-left
        [13, -10, 14],  // bottom-right
        [13, 10, 14],   // top-right
        [-13, 10, 14],  // top-left
      ];
      edges = [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [1, 2], [2, 3], [3, 4], [4, 1],
      ];
    } else if (type === 'robotics') {
      // 3D Gimbal rings / joint
      strokeColor = 'rgba(99, 102, 241, 0.8)';
      const pts = 6;
      for (let i = 0; i < pts; i++) {
        const th = (i / pts) * Math.PI * 2;
        vertices.push([Math.cos(th) * 16, Math.sin(th) * 16, 0]);
        vertices.push([Math.cos(th) * 11, 0, Math.sin(th) * 11]);
      }
      for (let i = 0; i < pts; i++) {
        edges.push([i * 2, ((i + 1) % pts) * 2]);
        edges.push([i * 2 + 1, ((i + 1) % pts) * 2 + 1]);
      }
    } else if (type === 'edge-ai') {
      // 3D Micro-Cube
      strokeColor = 'rgba(20, 184, 166, 0.8)';
      const s = 11;
      vertices = [
        [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
        [-s, -s, s],  [s, -s, s],  [s, s, s],  [-s, s, s],
      ];
      edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];
    } else {
      // Responsible AI: Prism / Diamond
      strokeColor = 'rgba(16, 185, 129, 0.8)';
      vertices = [
        [0, -16, 0],
        [-13, 0, -13],
        [13, 0, -13],
        [13, 0, 13],
        [-13, 0, 13],
        [0, 16, 0],
      ];
      edges = [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [1, 2], [2, 3], [3, 4], [4, 1],
        [5, 1], [5, 2], [5, 3], [5, 4],
      ];
    }

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      if (!prefersReducedMotion) {
        const speed = isHovered ? 0.03 : 0.012;
        angleRef.current.y += speed;
        angleRef.current.x += speed * 0.6;
      }

      const cosY = Math.cos(angleRef.current.y);
      const sinY = Math.sin(angleRef.current.y);
      const cosX = Math.cos(angleRef.current.x);
      const sinX = Math.sin(angleRef.current.x);

      const cx = size / 2;
      const cy = size / 2;

      // Project vertices
      const projected = vertices.map(([x, y, z]) => {
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        const fov = 80;
        const scale = fov / (fov + z2);
        return {
          sx: cx + x1 * scale,
          sy: cy + y2 * scale,
          z: z2,
        };
      });

      // Draw edges
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        if (!p1 || !p2) return;

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isHovered ? 1.5 : 1.1;
        ctx.stroke();
      });

      // Draw small glowing vertices
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    if (prefersReducedMotion) {
      render();
    } else {
      animFrameId.current = requestAnimationFrame(render);
    }

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [type, isHovered]);

  return (
    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center pointer-events-none shrink-0 group-hover:border-cyan-500/40 transition-colors">
      <canvas ref={canvasRef} className="w-12 h-12" />
    </div>
  );
};
