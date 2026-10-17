'use strict';

// Geometría basada en la esfera de la identidad; proyección 3D sin dependencias.
(() => {
  const container = document.querySelector('[data-logo-sphere]');
  if (!container) return;
  const canvas = container.querySelector('canvas');
  const fallback = container.querySelector('img');
  const toggle = container.querySelector('button');
  const context = canvas.getContext('2d');
  if (!context) return;

  const points = [
    [67, 10], [37, 16], [21, 34], [12, 63], [20, 92], [37, 112],
    [70, 118], [95, 109], [113, 88], [117, 63], [115, 44], [95, 20],
    [36, 42], [62, 32], [90, 35], [62, 63], [96, 65], [70, 94], [36, 83]
  ];
  const nodeSizes = [2.5, 3.2, 2.3, 2.5, 2.6, 2.4, 3.5, 2.8, 2.4, 2.8, 2.5, 3, 3.5, 2.4, 2.4, 4.4, 3.5, 3.7, 2.6];
  const vertices = points.map(([px, py], index) => {
    let x = (px - 64) / 54;
    let y = (py - 64) / 54;
    if (index < 12) {
      const length = Math.hypot(x, y);
      x /= length; y /= length;
    }
    return { x, y, z: index < 12 ? 0 : Math.sqrt(Math.max(0, 1 - x * x - y * y)), size: nodeSizes[index] };
  });
  const frontEdges = [
    ...Array.from({ length: 12 }, (_, i) => [i, (i + 1) % 12]),
    [0, 13], [1, 12], [1, 13], [2, 12], [2, 13], [3, 12], [3, 18],
    [4, 18], [5, 18], [5, 17], [6, 17], [7, 17], [7, 16], [8, 16],
    [8, 17], [9, 16], [10, 14], [10, 16], [11, 13], [11, 14],
    [12, 13], [13, 14], [12, 15], [13, 15], [14, 15], [14, 16],
    [15, 16], [15, 17], [15, 18], [12, 18], [18, 17], [17, 16]
  ];
  const backIndices = new Map();
  for (let i = 12; i < points.length; i += 1) {
    backIndices.set(i, vertices.length);
    vertices.push({ ...vertices[i], z: -vertices[i].z });
  }
  const edges = [...frontEdges, ...frontEdges.filter(([a, b]) => a >= 12 || b >= 12)
    .map(([a, b]) => [backIndices.get(a) ?? a, backIndices.get(b) ?? b])];

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let explicitMotion = false;
  let inView = !('IntersectionObserver' in window);
  let frameId = null;
  let previousTime = null;
  let lastPaint = null;
  let angle = 0;
  let size = 260;
  let pixelRatio = 1;

  function draw() {
    context.clearRect(0, 0, size, size);
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const projected = vertices.map((point) => {
      const x = point.x * cosine + point.z * sine;
      const z = -point.x * sine + point.z * cosine;
      // Perspectiva discreta: el símbolo permanece centrado y reconocible.
      const perspective = 3.8 / (3.8 - z * 0.32);
      return { x: size / 2 + x * size * 0.405 * perspective,
        y: size / 2 + point.y * size * 0.405 * perspective, z,
        radius: point.size * (size / 260) * perspective };
    });
    const lines = edges.map(([a, b]) => ({ a: projected[a], b: projected[b] }))
      .sort((left, right) => left.a.z + left.b.z - right.a.z - right.b.z);
    context.lineCap = 'round';
    for (const { a, b } of lines) {
      const depth = (a.z + b.z) / 2;
      const opacity = depth < -0.05 ? 0.12 + (depth + 1) * 0.12 : 0.64 + depth * 0.25;
      context.strokeStyle = `rgba(12, 17, 25, ${opacity})`;
      context.lineWidth = Math.max(0.85, size / 215) * (depth < -0.05 ? 0.8 : 1);
      context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
    }
    projected.sort((a, b) => a.z - b.z).forEach((point) => {
      context.fillStyle = `rgba(5, 9, 15, ${point.z < -0.05 ? 0.2 : 0.95})`;
      context.beginPath(); context.arc(point.x, point.y, point.radius, 0, Math.PI * 2); context.fill();
    });
  }

  function resize() {
    size = canvas.parentElement.getBoundingClientRect().width || 260;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * pixelRatio);
    canvas.height = Math.round(size * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw();
  }

  function tick(time) {
    frameId = null;
    if (paused || !inView || document.hidden) { previousTime = null; return; }
    if (previousTime !== null) angle = (angle + Math.min(time - previousTime, 50) * Math.PI * 2 / 36000) % (Math.PI * 2);
    previousTime = time;
    if (lastPaint === null || time - lastPaint >= 30) { draw(); lastPaint = time; }
    frameId = requestAnimationFrame(tick);
  }

  function sync() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null; previousTime = null; lastPaint = null;
    const staticLogo = reducedMotion.matches && !explicitMotion;
    fallback.hidden = !staticLogo;
    canvas.hidden = staticLogo;
    toggle.hidden = false;
    toggle.textContent = paused ? 'Activar giro' : 'Pausar giro';
    toggle.setAttribute('aria-label', paused ? 'Activar giro de la esfera' : 'Pausar giro de la esfera');
    toggle.setAttribute('aria-pressed', String(!paused));
    if (!staticLogo) draw();
    if (!paused && inView && !document.hidden) frameId = requestAnimationFrame(tick);
  }

  toggle.addEventListener('click', () => { explicitMotion = true; paused = !paused; sync(); });
  const onMotionChange = () => { explicitMotion = false; paused = reducedMotion.matches; sync(); };
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionChange);
  else reducedMotion.addListener(onMotionChange);
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0.05 }).observe(container);
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas.parentElement);
  else window.addEventListener('resize', resize, { passive: true });
  resize(); sync();
})();
