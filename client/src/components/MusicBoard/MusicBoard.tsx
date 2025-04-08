import './MusicBoardStyle.css';
import { useEffect, useRef } from 'react';

interface MusicBoardProps {
  isMusicPlaying?: boolean;
}

function MusicBoard({ isMusicPlaying }: MusicBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(function runWebGL() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas 2D context not available');
      return;
    }

    // === Configurações ===
    const strokeColor = '#314284';
    const colors = Array(50).fill(strokeColor);
    const arcs = colors.map((color) => ({ color }));

    const fadeDuration = 3000;
    const animationDuration = 5000;
    const totalWaveWidth = 20;
    const maxLineWidth = 5;

    let fadeStartTime = 0;
    let wavePosition = -totalWaveWidth;
    let animationProgress = 0;
    let animationTime = 0;
    let lastTime = performance.now();

    // === Funções auxiliares ===
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    };

    const waveProfile = (distance: number, totalWaveWidth: number) => {
      const normalized = Math.abs(distance) / (totalWaveWidth / 2);
      return normalized >= 1 ? 0 : Math.pow(1 - normalized, 2);
    };

    const drawArc = (
      x: number,
      y: number,
      radius: number,
      start: number,
      end: number,
      lineWidth: number,
      opacity: number,
      action: 'stroke' | 'fill' = 'stroke'
    ) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, start, end);
      ctx.globalAlpha = opacity;
      ctx.lineWidth = lineWidth;
      if (action === 'stroke') ctx.stroke();
      else ctx.fill();
    };

    // === Função principal de desenho ===
    const draw = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Resize
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const length = Math.min(canvas.width, canvas.height) * 2.5;
      const center = { x: canvas.width / 2, y: canvas.height / 2 };

      const base = {
        initialRadius: length * 0.02,
        circleRadius: length * 0.003,
        clearance: length * 0.05,
        spacing: 0,
      };

      base.spacing = (length - base.initialRadius - base.clearance) / 2 / colors.length;

      // Fade-in
      if (fadeStartTime <= 0) fadeStartTime = currentTime;
      const fadeOpacity = Math.min((currentTime - fadeStartTime) / fadeDuration, 1);

      // Atualiza animação e posição da onda
      animationProgress += deltaTime;
      animationTime += deltaTime;
      const normalizedProgress = animationProgress / animationDuration;
      wavePosition =
        easeInOutCubic(normalizedProgress) * (arcs.length + totalWaveWidth * 2) - totalWaveWidth;
      if (animationProgress > animationDuration) animationProgress = 0;

      ctx.strokeStyle = strokeColor;

      arcs.forEach((_, index) => {
        const radius = base.initialRadius + base.spacing * index;
        const offset = (base.circleRadius * (5 / 3)) / (radius * 1.5);

        const distance = index - wavePosition;
        const waveIntensity = waveProfile(distance, totalWaveWidth);
        const lineWidth = 1 + maxLineWidth * waveIntensity * waveIntensity;

        const targetOpacity = 0.4;
        const opacity = Math.min(fadeOpacity, targetOpacity) + 0.2 * waveIntensity;

        const timeRotation = (0.02 * lineWidth) / 2 + animationTime * 0.0001;

        drawArc(
          center.x,
          center.y,
          radius,
          Math.PI + offset + timeRotation,
          1.5 * Math.PI - offset + timeRotation,
          lineWidth,
          opacity
        );
        drawArc(
          center.x,
          center.y,
          radius,
          offset + timeRotation,
          Math.PI / 2 - offset + timeRotation,
          lineWidth,
          opacity
        );
        drawArc(
          center.x,
          center.y,
          radius,
          1.5 * Math.PI + offset + timeRotation,
          -offset + timeRotation,
          lineWidth,
          opacity
        );
        drawArc(
          center.x,
          center.y,
          radius,
          Math.PI / 2 + offset + timeRotation,
          Math.PI - offset + timeRotation,
          lineWidth,
          opacity
        );
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    // Cleanup da animacao / evitar memory leaks
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} id="music_board" data-is-music-playing={isMusicPlaying}></canvas>;
}

export default MusicBoard;
