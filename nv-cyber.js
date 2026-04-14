/* ═══════════════════════════════════════════════════════════
   NEXVAULT CYBERPUNK ANIMATION ENGINE
   Grid, particles, neon effects
   ═══════════════════════════════════════════════════════════ */

// ── Perspective Grid Background ──
(function(){
  const c = document.getElementById('cyber-grid');
  if (!c) return;
  const gl = c.getContext('2d');
  let W, H, t = 0, mx = 0.5, my = 0.5;
  const particles = [];
  const PARTICLE_COUNT = 60;

  function resize(){
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
  }

  function initParticles(){
    particles.length = 0;
    for(let i = 0; i < PARTICLE_COUNT; i++){
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? 'cyan' : 'magenta'
      });
    }
  }

  function drawGrid(){
    const horizon = H * 0.55;
    const gridLines = 30;
    const gridSpacing = 60;
    const speed = t * 30;

    // Horizontal lines (going into distance)
    gl.strokeStyle = 'rgba(0,240,255,0.04)';
    gl.lineWidth = 0.5;
    for(let i = 0; i < 20; i++){
      const yRatio = i / 20;
      const y = horizon + (H - horizon) * Math.pow(yRatio, 1.5);
      const alpha = 0.02 + yRatio * 0.04;
      gl.strokeStyle = `rgba(0,240,255,${alpha})`;
      gl.beginPath();
      gl.moveTo(0, y);
      gl.lineTo(W, y);
      gl.stroke();
    }

    // Vertical lines (converging to vanishing point)
    const vx = W * 0.5 + Math.sin(t * 0.3) * 30;
    for(let i = -gridLines; i <= gridLines; i++){
      const x = vx + i * gridSpacing;
      const alpha = Math.max(0.01, 0.04 - Math.abs(i) * 0.001);
      gl.strokeStyle = `rgba(0,240,255,${alpha})`;
      gl.beginPath();
      gl.moveTo(vx + (x - vx) * 0.01, horizon);
      gl.lineTo(x, H);
      gl.stroke();
    }

    // Horizon glow
    const hGrd = gl.createLinearGradient(0, horizon - 40, 0, horizon + 40);
    hGrd.addColorStop(0, 'transparent');
    hGrd.addColorStop(0.5, 'rgba(0,240,255,0.03)');
    hGrd.addColorStop(1, 'transparent');
    gl.fillStyle = hGrd;
    gl.fillRect(0, horizon - 40, W, 80);
  }

  function drawParticles(){
    for(let i = 0; i < particles.length; i++){
      const p = particles[i];
      p.x += p.vx + Math.sin(t + p.phase) * 0.1;
      p.y += p.vy + Math.cos(t * 0.7 + p.phase) * 0.1;

      if(p.x < -10) p.x = W + 10;
      if(p.x > W + 10) p.x = -10;
      if(p.y < -10) p.y = H + 10;
      if(p.y > H + 10) p.y = -10;

      const alpha = 0.3 + Math.sin(t * 2 + p.phase) * 0.2;
      const color = p.color === 'cyan' ? `rgba(0,240,255,${alpha})` : `rgba(255,0,255,${alpha * 0.7})`;

      // Glow
      gl.beginPath();
      gl.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      const grd = gl.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grd.addColorStop(0, color);
      grd.addColorStop(1, 'transparent');
      gl.fillStyle = grd;
      gl.fill();

      // Core
      gl.beginPath();
      gl.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      gl.fillStyle = color;
      gl.fill();

      // Connections
      for(let j = i + 1; j < particles.length; j++){
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if(d < 150){
          gl.beginPath();
          gl.moveTo(p.x, p.y);
          gl.lineTo(q.x, q.y);
          gl.strokeStyle = `rgba(0,240,255,${(1 - d / 150) * 0.06})`;
          gl.lineWidth = 0.5;
          gl.stroke();
        }
      }
    }
  }

  function drawMouseGlow(){
    const grd = gl.createRadialGradient(mx * W, my * H, 0, mx * W, my * H, 300);
    grd.addColorStop(0, 'rgba(0,240,255,0.03)');
    grd.addColorStop(0.5, 'rgba(255,0,255,0.01)');
    grd.addColorStop(1, 'transparent');
    gl.fillStyle = grd;
    gl.fillRect(0, 0, W, H);
  }

  function frame(){
    t += 0.005;
    gl.clearRect(0, 0, W, H);
    drawGrid();
    drawMouseGlow();
    drawParticles();
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  document.addEventListener('mousemove', e => { mx = e.clientX / W; my = e.clientY / H; });

  resize();
  initParticles();
  frame();
})();

// ── Scroll Reveal ──
const rvObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

// ── Animated Counters ──
const ctrObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(!e.isIntersecting || e.target.dataset.done) return;
    e.target.dataset.done = '1';
    const target = parseFloat(e.target.dataset.target);
    const isFloat = target % 1 !== 0;
    const dur = 1800;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = target * ease;
      e.target.textContent = isFloat ? val.toFixed(2) : Math.floor(val).toLocaleString();
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => ctrObs.observe(el));

// ── Loader ──
(function(){
  const loader = document.getElementById('cyber-loader');
  if(!loader) return;
  const fill = loader.querySelector('.cl-fill');
  const pct = loader.querySelector('.cl-pct');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 18 + 5;
    if(p > 100) p = 100;
    if(fill) fill.style.width = p + '%';
    if(pct) pct.textContent = Math.floor(p) + '%';
    if(p >= 100){
      clearInterval(iv);
      setTimeout(() => loader.classList.add('done'), 400);
    }
  }, 80);
})();
