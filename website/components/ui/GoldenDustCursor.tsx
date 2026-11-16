"use client";

import { useEffect, useRef } from "react";

type DustParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  age: number;
  lifetime: number;
  color: string;
  opacity: number;
};

const MAX_PARTICLES = 96;
const COLORS = ["#8a641f", "#9b762e", "#a88338", "#b9913e"];

/** A subtle, desktop-only champagne dust trail rendered on one shared canvas. */
export function GoldenDustCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const wideScreen = window.matchMedia("(min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const particles: DustParticle[] = [];
    let previousPoint: { x: number; y: number } | null = null;
    let frameId = 0;
    let lastFrameTime = 0;
    let enabled = false;

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const clearCanvas = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const drawFrame = (time: number) => {
      frameId = 0;
      if (!enabled || document.hidden) return;

      const delta = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.05) : 1 / 60;
      lastFrameTime = time;
      clearCanvas();

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.age += delta;
        if (particle.age >= particle.lifetime) {
          particles.splice(index, 1);
          continue;
        }

        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.vx *= 1 - delta * 0.7;
        particle.vy -= 2.2 * delta;

        const remaining = 1 - particle.age / particle.lifetime;
        context.globalAlpha = particle.opacity * remaining * remaining;
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      if (particles.length > 0) frameId = window.requestAnimationFrame(drawFrame);
      else lastFrameTime = 0;
    };

    const ensureFrame = () => {
      if (!frameId && enabled && !document.hidden && particles.length > 0) {
        frameId = window.requestAnimationFrame(drawFrame);
      }
    };

    const addParticle = (x: number, y: number) => {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 12,
        vy: -4 - Math.random() * 12,
        size: 1.4 + Math.random() * 1.8,
        age: 0,
        lifetime: 0.65 + Math.random() * 0.7,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 0.34 + Math.random() * 0.3,
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !enabled) return;

      const point = { x: event.clientX, y: event.clientY };
      if (!previousPoint) {
        addParticle(point.x, point.y);
      } else {
        const dx = point.x - previousPoint.x;
        const dy = point.y - previousPoint.y;
        const distance = Math.hypot(dx, dy);
        const count = Math.min(6, Math.max(1, Math.floor(distance / 18) + 1));
        for (let index = 1; index <= count; index += 1) {
          const progress = index / count;
          addParticle(previousPoint.x + dx * progress, previousPoint.y + dy * progress);
        }
      }

      previousPoint = point;
      ensureFrame();
    };

    const handlePointerLeave = () => {
      previousPoint = null;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
        particles.length = 0;
        previousPoint = null;
        lastFrameTime = 0;
        clearCanvas();
      }
    };

    const syncEnabled = () => {
      const shouldEnable = finePointer.matches && wideScreen.matches && !reducedMotion.matches;
      if (shouldEnable === enabled) return;
      enabled = shouldEnable;

      if (enabled) {
        resizeCanvas();
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerleave", handlePointerLeave);
        window.addEventListener("resize", resizeCanvas, { passive: true });
        document.addEventListener("visibilitychange", handleVisibilityChange);
      } else {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerleave", handlePointerLeave);
        window.removeEventListener("resize", resizeCanvas);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
        particles.length = 0;
        previousPoint = null;
        lastFrameTime = 0;
        clearCanvas();
      }
    };

    finePointer.addEventListener("change", syncEnabled);
    wideScreen.addEventListener("change", syncEnabled);
    reducedMotion.addEventListener("change", syncEnabled);
    syncEnabled();

    return () => {
      enabled = false;
      finePointer.removeEventListener("change", syncEnabled);
      wideScreen.removeEventListener("change", syncEnabled);
      reducedMotion.removeEventListener("change", syncEnabled);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (frameId) window.cancelAnimationFrame(frameId);
      particles.length = 0;
      clearCanvas();
    };
  }, []);

  return <canvas ref={canvasRef} className="wf-golden-dust-canvas" aria-hidden="true" />;
}
