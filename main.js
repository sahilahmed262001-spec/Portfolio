// ==========================================================================
// DECAY & RECLAMATION — SURVIVOR JOURNAL SCRIPT
// Handles Ambient Spores Canvas, Case File Filters & Interactive Simulation
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Ambient Floating Dust Spores Canvas
  const canvas = document.getElementById('spores-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Spore {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.48) * 0.3;
        this.speedY = -Math.random() * 0.4 - 0.1;
        this.alpha = Math.random() * 0.5 + 0.15;
        this.color = Math.random() > 0.6 ? '140, 166, 114' : '230, 223, 211'; // earthy moss / dust beige
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < -5 || this.x < -5 || this.x > canvas.width + 5) {
          this.reset();
          this.y = canvas.height + 5;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 35; i++) {
      particles.push(new Spore());
    }

    function animateSpores() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateSpores);
    }
    animateSpores();
  }

  // 2. Interactive Physics Simulator Modal
  const modal = document.getElementById('sim-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('modal-close');
  const simCanvas = document.getElementById('sim-canvas');
  let simCtx = null;
  let simEntities = [];

  if (simCanvas) {
    simCtx = simCanvas.getContext('2d');
    
    function resizeSim() {
      simCanvas.width = simCanvas.clientWidth;
      simCanvas.height = simCanvas.clientHeight;
    }

    class BallEntity {
      constructor(x, y) {
        this.x = x || Math.random() * simCanvas.width;
        this.y = y || Math.random() * (simCanvas.height / 2);
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.radius = Math.random() * 12 + 8;
        this.color = Math.random() > 0.5 ? '#d6a842' : '#8ca672';
        this.label = Math.pow(2, Math.floor(Math.random() * 5) + 1);
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.16; // gravity
        
        // Bounce X
        if (this.x - this.radius < 0) {
          this.vx *= -0.85;
          this.x = this.radius;
        } else if (this.x + this.radius > simCanvas.width) {
          this.vx *= -0.85;
          this.x = simCanvas.width - this.radius;
        }

        // Bounce Floor
        if (this.y + this.radius > simCanvas.height) {
          this.vy *= -0.72;
          this.y = simCanvas.height - this.radius;
        }
      }
      draw() {
        simCtx.beginPath();
        simCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        simCtx.fillStyle = this.color;
        simCtx.fill();

        // Handwritten number inside
        simCtx.fillStyle = '#121314';
        simCtx.font = 'bold 9px monospace';
        simCtx.textAlign = 'center';
        simCtx.textBaseline = 'middle';
        simCtx.fillText(this.label, this.x, this.y);
      }
    }

    function initSim() {
      resizeSim();
      simEntities = [];
      for (let i = 0; i < 12; i++) {
        simEntities.push(new BallEntity());
      }
    }

    function runSimLoop() {
      if (modal && !modal.classList.contains('hidden')) {
        simCtx.fillStyle = 'rgba(18, 19, 20, 0.3)';
        simCtx.fillRect(0, 0, simCanvas.width, simCanvas.height);
        
        simEntities.forEach(e => {
          e.update();
          e.draw();
        });
      }
      requestAnimationFrame(runSimLoop);
    }
    runSimLoop();

    simCanvas.addEventListener('mousedown', (e) => {
      const rect = simCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      simEntities.push(new BallEntity(x, y));
      if (simEntities.length > 25) simEntities.shift();
    });

    document.getElementById('sim-reset')?.addEventListener('click', () => {
      initSim();
    });
  }

  document.querySelectorAll('.preview-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || 'Game Simulation';
      if (modalTitle) modalTitle.textContent = title + " // Field Simulation";
      if (modal) {
        modal.classList.remove('hidden');
        if (simCanvas) {
          simCanvas.width = simCanvas.clientWidth;
          simCanvas.height = simCanvas.clientHeight;
        }
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (modal) modal.classList.add('hidden');
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
    }
  });

});
