/* ==========================================================================
   CLAIR OBSCUR: EXPEDITION 33 // PORTFOLIO ENGINE & INTERACTIVITY
   Author: Sahil Ahmed | Senior Unity Game & XR Architect
   ========================================================================== */

// --- 1. ORCHESTRAL & CRYSTAL AUDIO ENGINE (Web Audio API) ---
class ExpeditionAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initContext = this.initContext.bind(this);
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playHover() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      // Celestial Glass Bell Chime (Ethereal Pentatonic)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.08); // E6
      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      // Resonant Gold Bell
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, this.ctx.currentTime + 0.14); // C6
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch (e) {}
  }

  playScore() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime); // E5
      osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.06); // E6
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch (e) {}
  }

  playCrash() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }
}

const expeditionAudio = new ExpeditionAudioEngine();


// --- 2. THREE.JS 3D LIVING PAINTING SCENE (Floating Monoliths & Celestial Stardust) ---
function initLivingPainting3D() {
  const container = document.getElementById('canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070e, 0.002);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 1600);
  camera.position.set(0, 130, 420);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Volumetric Lighting
  const ambientLight = new THREE.AmbientLight(0x1a2238, 1.8);
  scene.add(ambientLight);

  const goldLight = new THREE.DirectionalLight(0xd4af37, 2.2);
  goldLight.position.set(220, 320, 160);
  scene.add(goldLight);

  const cyanLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
  cyanLight.position.set(-220, 200, -100);
  scene.add(cyanLight);

  // Floating Monolith Pillars Group
  const monolithsGroup = new THREE.Group();
  scene.add(monolithsGroup);

  const pillarMat = new THREE.MeshBasicMaterial({ color: 0x0a101e });
  const goldWireMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.35 });
  const cyanWireMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25 });

  for (let i = 0; i < 60; i++) {
    const width = 22 + Math.random() * 38;
    const height = 110 + Math.random() * 360;
    const depth = 22 + Math.random() * 38;

    const geo = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geo, pillarMat);

    const x = (Math.random() - 0.5) * 1350;
    const z = (Math.random() - 0.5) * 980 - 150;
    const y = height / 2 - 20;

    mesh.position.set(x, y, z);
    monolithsGroup.add(mesh);

    const edges = new THREE.EdgesGeometry(geo);
    const lineMat = Math.random() > 0.4 ? goldWireMat : cyanWireMat;
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.copy(mesh.position);
    monolithsGroup.add(wireframe);
  }

  // Celestial Stardust Particles
  const particleCount = 450;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = [];
  const pColors = [];

  const colGold = new THREE.Color(0xd4af37);
  const colCyan = new THREE.Color(0x38bdf8);
  const colWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    pPositions.push(
      (Math.random() - 0.5) * 1400,
      Math.random() * 520,
      (Math.random() - 0.5) * 1050
    );

    const c = Math.random() > 0.5 ? colGold : (Math.random() > 0.3 ? colCyan : colWhite);
    pColors.push(c.r, c.g, c.b);
  }

  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3));
  pGeo.setAttribute('color', new THREE.Float32BufferAttribute(pColors, 3));

  const pMat = new THREE.PointsMaterial({
    size: 3.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.65
  });

  const stardust = new THREE.Points(pGeo, pMat);
  scene.add(stardust);

  // Parallax Mouse Motion
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.035;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.035;
  });

  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX;
    camera.position.y = 130 - targetY * 0.4;
    camera.lookAt(0, 80, 0);

    // Stardust drift
    const pos = pGeo.attributes.position.array;
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] -= 0.7;
      if (pos[i] < 0) pos[i] = 520;
    }
    pGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}


// --- 3. LUMINA ODYSSEY / ASTRAL TRIAL MINI-GAME ---
class LuminaOdysseyGame {
  constructor() {
    this.canvas = document.getElementById('mini-game-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.scoreEl = document.getElementById('game-score');
    this.highScoreEl = document.getElementById('game-highscore');
    this.finalScoreEl = document.getElementById('final-score');
    this.startOverlay = document.getElementById('game-start-overlay');
    this.gameOverOverlay = document.getElementById('game-over-overlay');
    this.btnStart = document.getElementById('btn-start-game');
    this.btnRestart = document.getElementById('btn-restart-game');

    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('lumina_highscore') || '0', 10);
    if (this.highScoreEl) this.highScoreEl.textContent = this.highScore;

    this.isRunning = false;
    this.player = {
      x: 70,
      y: 210,
      width: 36,
      height: 18,
      speed: 6.5,
      targetY: 210
    };

    this.obstacles = [];
    this.gems = [];
    this.particles = [];
    this.spawnTimer = 0;
    this.gemTimer = 0;
    this.gameSpeed = 5.0;

    this.keys = { up: false, down: false };
    this.initEvents();
    this.renderInitialCanvas();
  }

  initEvents() {
    if (this.btnStart) this.btnStart.addEventListener('click', () => this.startGame());
    if (this.btnRestart) this.btnRestart.addEventListener('click', () => this.startGame());

    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) this.keys.up = true;
      if (['ArrowDown', 's', 'S'].includes(e.key)) this.keys.down = true;
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) this.keys.up = false;
      if (['ArrowDown', 's', 'S'].includes(e.key)) this.keys.down = false;
    });

    // Touch / Pointer
    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleY = this.canvas.height / rect.height;
      this.player.targetY = (e.clientY - rect.top) * scaleY;
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (e.buttons === 1) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleY = this.canvas.height / rect.height;
        this.player.targetY = (e.clientY - rect.top) * scaleY;
      }
    });

    const btnUp = document.getElementById('btn-touch-up');
    const btnDown = document.getElementById('btn-touch-down');
    if (btnUp && btnDown) {
      btnUp.addEventListener('pointerdown', () => { this.keys.up = true; });
      btnUp.addEventListener('pointerup', () => { this.keys.up = false; });
      btnDown.addEventListener('pointerdown', () => { this.keys.down = true; });
      btnDown.addEventListener('pointerup', () => { this.keys.down = false; });
    }
  }

  startGame() {
    if (this.startOverlay) this.startOverlay.classList.add('hidden');
    if (this.gameOverOverlay) this.gameOverOverlay.classList.add('hidden');
    this.score = 0;
    if (this.scoreEl) this.scoreEl.textContent = '0';
    this.gameSpeed = 5.0;
    this.player.y = 210;
    this.player.targetY = 210;
    this.obstacles = [];
    this.gems = [];
    this.particles = [];
    this.isRunning = true;
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameOver() {
    this.isRunning = false;
    expeditionAudio.playCrash();
    if (this.finalScoreEl) this.finalScoreEl.textContent = this.score;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('lumina_highscore', this.highScore);
      if (this.highScoreEl) this.highScoreEl.textContent = this.highScore;
      if (typeof confetti === 'function') {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
    }

    if (this.gameOverOverlay) this.gameOverOverlay.classList.remove('hidden');
  }

  addExplosion(x, y, color) {
    for (let i = 0; i < 16; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        radius: Math.random() * 3 + 1,
        color: color || '#d4af37',
        life: 1
      });
    }
  }

  gameLoop() {
    if (!this.isRunning) return;

    this.ctx.fillStyle = '#03050c';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Starlight Grid Floor
    this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
    this.ctx.lineWidth = 1;
    for (let y = 0; y < this.canvas.height; y += 42) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // Player Steer
    if (this.keys.up) this.player.y -= this.player.speed;
    if (this.keys.down) this.player.y += this.player.speed;
    if (!this.keys.up && !this.keys.down && Math.abs(this.player.targetY - this.player.y) > 2) {
      this.player.y += (this.player.targetY - this.player.y) * 0.18;
    }

    this.player.y = Math.max(16, Math.min(this.canvas.height - 36, this.player.y));

    // Stardust Lumina Trail
    this.particles.push({
      x: this.player.x,
      y: this.player.y + 9,
      vx: -this.gameSpeed * 0.9,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 2.5 + 1,
      color: '#d4af37',
      life: 0.6
    });

    // Draw Player (Luminary Chariot Vessel)
    this.ctx.fillStyle = '#d4af37';
    this.ctx.shadowColor = '#d4af37';
    this.ctx.shadowBlur = 14;
    this.ctx.beginPath();
    this.ctx.moveTo(this.player.x + 36, this.player.y + 9);
    this.ctx.lineTo(this.player.x, this.player.y);
    this.ctx.lineTo(this.player.x + 8, this.player.y + 9);
    this.ctx.lineTo(this.player.x, this.player.y + 18);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Obstacles (Void Tears)
    this.spawnTimer++;
    if (this.spawnTimer > 50) {
      this.spawnTimer = 0;
      const h = 45 + Math.random() * 75;
      this.obstacles.push({
        x: this.canvas.width + 20,
        y: Math.random() * (this.canvas.height - h),
        width: 18,
        height: h,
        color: '#f43f5e'
      });
    }

    // Gems (Celestial Starlight)
    this.gemTimer++;
    if (this.gemTimer > 35) {
      this.gemTimer = 0;
      this.gems.push({
        x: this.canvas.width + 20,
        y: 30 + Math.random() * (this.canvas.height - 60),
        radius: 8,
        color: '#38bdf8'
      });
    }

    // Update Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.gameSpeed;

      this.ctx.fillStyle = obs.color;
      this.ctx.shadowColor = obs.color;
      this.ctx.shadowBlur = 12;
      this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      this.ctx.shadowBlur = 0;

      // Hitbox
      if (
        this.player.x < obs.x + obs.width &&
        this.player.x + this.player.width > obs.x &&
        this.player.y < obs.y + obs.height &&
        this.player.y + this.player.height > obs.y
      ) {
        this.addExplosion(this.player.x + 18, this.player.y + 9, '#f43f5e');
        this.gameOver();
        return;
      }

      if (obs.x < -30) this.obstacles.splice(i, 1);
    }

    // Update Gems
    for (let i = this.gems.length - 1; i >= 0; i--) {
      const g = this.gems[i];
      g.x -= this.gameSpeed;

      this.ctx.fillStyle = g.color;
      this.ctx.shadowColor = g.color;
      this.ctx.shadowBlur = 12;
      this.ctx.beginPath();
      this.ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      const dx = (this.player.x + 18) - g.x;
      const dy = (this.player.y + 9) - g.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < g.radius + 18) {
        this.score += 30;
        if (this.scoreEl) this.scoreEl.textContent = this.score;
        this.gameSpeed += 0.08;
        expeditionAudio.playScore();
        this.addExplosion(g.x, g.y, '#38bdf8');
        this.gems.splice(i, 1);
        continue;
      }

      if (g.x < -20) this.gems.splice(i, 1);
    }

    // Draw Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    }

    this.score += 1;
    if (this.scoreEl) this.scoreEl.textContent = this.score;

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  renderInitialCanvas() {
    this.ctx.fillStyle = '#03050c';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}


// --- 4. PROJECT DATA & MODAL SPECS VIEWER ---
const projectData = {
  museum: {
    title: "VR Centenary Museum",
    subtitle: "Indian Military Nursing Service (IMNS) Centennial Tribute",
    role: "Lead VR Developer",
    client: "Indian Military Nursing Service",
    img: "./assets/vr_museum.jpg",
    tech: ["Unity Engine", "VR Hardware Deployment", "Oculus / SteamVR", "Spatial Audio", "C# Architecture", "Kiosk Lock Mode"],
    overview: "Built and deployed an immersive VR museum experience commemorating the 100 Glorious Years of IMNS. The project was officially inaugurated by the Chief of Defence Staff, General Anil Chauhan, serving as a prestigious interactive tribute to the armed forces.",
    highlights: [
      "Engineered real-time VR kiosk hardware deployment with custom kiosk locking software to prevent public tampering.",
      "Optimized historical artifacts, architectural 3D scans, and lighting to sustain rock-solid 90 FPS on VR headsets without motion sickness.",
      "Crafted spatial 3D positional audio and interactive touch/grab mechanics for virtual military medals, archives, and timeline exhibits.",
      "Recognized and praised by top military officials and General Anil Chauhan at the national centenary inauguration ceremony."
    ]
  },
  mystic: {
    title: "Mystic Motors",
    subtitle: "High-Octane Competitive Multiplayer Spell-Racing",
    role: "Lead Developer",
    client: "TEC VENTURES | Australia",
    img: "./assets/expedition_chariot.jpg",
    tech: ["Unity Netcode for GameObjects (NGO)", "Custom Vehicle Physics", "C# Server Sync", "Google Play Console", "Shader Graph"],
    overview: "Competitive multiplayer racing game incorporating customizable vehicles, dynamic tracks, and spell-casting mechanisms for fast-paced mobile matches.",
    highlights: [
      "Spearheaded the complete development lifecycle, multiplayer architecture, and deployment on Google Play Store.",
      "Architected and optimized multiplayer networking using Unity Netcode for GameObjects (NGO) for low-latency player synchronization and deterministic prediction.",
      "Engineered real-time vehicle suspension, drift dynamics, tyre friction models, and custom spell-casting projectile hitboxes.",
      "Implemented comprehensive mobile optimizations ensuring high framerate across diverse Android devices."
    ]
  },
  metaverse: {
    title: "Educational VR Metaverse",
    subtitle: "Semi-Open World Academic & Astral Citadel",
    role: "VR Developer",
    client: "Abhiwan Technology Pvt Ltd",
    img: "./assets/metaverse.jpg",
    tech: ["Unity", "VR Interactive Systems", "3D Level Design", "Mini-Games Physics", "C#", "Blender"],
    overview: "Created a semi-open world educational metaverse featuring virtual libraries, TED Talk auditoriums, and interactive exploration side-worlds with mini-games (boating, shooting, skating) tailored for active student learning.",
    highlights: [
      "Built multi-room networked auditoriums capable of streaming synchronized video lectures and interactive quiz boards.",
      "Engineered full physics-driven mini-game modules including boat rowing water physics, laser target shooting, and hover skating.",
      "Streamlined 3D world streaming and occlusion culling to handle expansive academic campuses on standalone VR headsets."
    ]
  },
  merge: {
    title: "Merge Balls",
    subtitle: "Cascading Physics-Driven Number Puzzle Hit",
    role: "Unity Developer",
    client: "DevKraken",
    img: "./assets/casual_puzzle.jpg",
    tech: ["Unity 2D/3D Physics", "Cascade Mechanics", "Power-Up Systems", "Mobile Performance", "Google Play"],
    overview: "A physics-based number puzzle game featuring dynamic ball dropping, cascading merge reactions, power-up items, and combo systems.",
    highlights: [
      "Crafted hyper-satisfying physics simulations using tuned 2D/3D rigidbodies, restitution curves, and elasticity.",
      "Designed an ultra-responsive combo chain multiplier system with haptic feedback and particle burst rewards.",
      "Maintained zero garbage collection spikes during high-frequency cascade merging."
    ]
  },
  tile: {
    title: "Tile Pop",
    subtitle: "Vibrant Block-Clearing Puzzle Architecture",
    role: "Unity Developer",
    client: "DevKraken",
    img: "./assets/casual_puzzle.jpg",
    tech: ["Deterministic Grid Logic", "Mobile UI/UX", "Score Multipliers", "Board State Optimization", "Google Play"],
    overview: "A vibrant block-clearing puzzle game featuring multiple game modes, score multipliers, and optimized board state logic.",
    highlights: [
      "Engineered a lightweight, deterministic grid board solver handling instant tile clearing and flood-fill cluster detection.",
      "Designed dynamic visual effects, streak animations, and smooth UI transitions across varying phone aspect ratios.",
      "Shipped and maintained on Google Play with stellar gameplay stability."
    ]
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const titleWrap = document.getElementById('modal-title-wrap');
  const modalBody = document.getElementById('modal-body-content');
  const closeBtn = document.getElementById('modal-close-btn');

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      const p = projectData[key];
      if (!p) return;

      titleWrap.innerHTML = `
        <h3 style="font-family:var(--font-serif); font-size:1.4rem; font-weight:800; color:#fff;">${p.title}</h3>
        <p style="font-size:0.85rem; color:var(--gold-main); margin-top:2px;">${p.subtitle}</p>
      `;

      let techBadges = p.tech.map(t => `<span class="tech-pill">${t}</span>`).join(' ');
      let bulletItems = p.highlights.map(h => `<li style="display:flex; gap:8px; align-items:flex-start;"><i class="fa-solid fa-sparkles" style="color:var(--gold-main); margin-top:4px;"></i> <span>${h}</span></li>`).join('');

      modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:18px;">
          <img src="${p.img}" alt="${p.title}" style="width:100%; height:220px; object-fit:cover; border-radius:12px; border:1px solid rgba(212,175,55,0.25);" />
          
          <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.82rem; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:8px;">
            <span style="color:var(--anima-green);"><i class="fa-solid fa-user-gear"></i> ${p.role}</span>
            <span style="color:var(--text-muted);"><i class="fa-solid fa-building"></i> ${p.client}</span>
          </div>

          <p style="color:var(--text-main); font-size:0.95rem; line-height:1.6;">${p.overview}</p>
          
          <div>
            <h4 style="font-family:var(--font-serif); font-size:1.05rem; font-weight:700; color:var(--gold-main); margin-bottom:10px;">
              <i class="fa-solid fa-scroll"></i> ARCHITECTURE & KEY HIGHLIGHTS:
            </h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.9rem; color:var(--text-muted);">
              ${bulletItems}
            </ul>
          </div>

          <div>
            <h4 style="font-family:var(--font-serif); font-size:1.05rem; font-weight:700; color:var(--gold-main); margin-bottom:10px;">
              <i class="fa-solid fa-gem"></i> TECH STACK:
            </h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${techBadges}
            </div>
          </div>
        </div>
      `;

      modal.classList.remove('hidden');
    });
  });

  const closeModal = () => modal.classList.add('hidden');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}


// --- 5. FILTERING LOGIC ---
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.pill-btn');
  const projectCards = document.querySelectorAll('.relic-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}


// --- 6. TOAST NOTIFICATIONS & COPY BUTTONS ---
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'cyber-toast';
  toast.innerHTML = `<i class="fa-solid fa-sparkles" style="color:var(--gold-main)"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`DISPATCH COPIED: ${text}`);
        });
      }
    });
  });
}


// --- 7. AUDIO CONTROLS ---
function initAudioControls() {
  const btnAudio = document.getElementById('btn-audio');
  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      expeditionAudio.enabled = !expeditionAudio.enabled;
      btnAudio.innerHTML = expeditionAudio.enabled
        ? `<i class="fa-solid fa-volume-high"></i> <span class="btn-text">SYMPHONY: ON</span>`
        : `<i class="fa-solid fa-volume-xmark"></i> <span class="btn-text">SYMPHONY: OFF</span>`;
      showToast(`AUDIO SYMPHONY: ${expeditionAudio.enabled ? 'ENABLED' : 'MUTED'}`);
    });
  }

  document.querySelectorAll('[data-sound="hover"]').forEach(el => {
    el.addEventListener('mouseenter', () => expeditionAudio.playHover());
  });
  document.querySelectorAll('[data-sound="click"], .ornate-btn, .pill-btn, .audio-toggle-btn').forEach(el => {
    el.addEventListener('click', () => expeditionAudio.playClick());
  });
}


// --- 8. CONTACT FORM SUBMISSION ---
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', () => {
    feedback.classList.remove('hidden');
    feedback.classList.add('success');
    feedback.innerHTML = `<i class="fa-solid fa-feather-pointed"></i> TRANSMITTING SCROLL TO SAHIL AHMED...`;
    showToast('SCROLL TRANSMITTED SUCCESSFULLY!');
  });
}


// --- 9. SCROLLSPY NAVIGATION ---
function initScrollspy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.expedition-nav .nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 180;
      if (window.pageYOffset >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}


// --- BOOTSTRAP ALL SYSTEMS ---
window.addEventListener('DOMContentLoaded', () => {
  initLivingPainting3D();
  new LuminaOdysseyGame();
  initProjectModal();
  initProjectFilters();
  initCopyButtons();
  initAudioControls();
  initContactForm();
  initScrollspy();
});
