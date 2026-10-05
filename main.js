// ==========================================================================
// THE LAST OF US — SURVIVOR JOURNAL & ENGINE SYSTEMS SCRIPT
// Features: Web Audio FX, Flashlight Spotlight, Listen Mode, Workbench Crafting,
//           Multi-Engine Sandboxes (Netcode & PhysX), Collectibles Lore Inspector
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. PURE WEB AUDIO SYNTHESIS ENGINE (Zero External Assets, Instant Playback)
  // ==========================================================================
  let audioCtx = null;
  let soundEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const SoundFX = {
    // Heavy mechanical switch / Flashlight click
    switchClick() {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        // Fast noise burst
        const bufferSize = ctx.sampleRate * 0.03;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.Q.setValueAtTime(3, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } catch (e) {}
    },

    // Duct tape peel / paper rustle
    tapeSnap() {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } catch (e) {}
    },

    // Acoustic Guitar Pluck (Santaolalla-style low resonance)
    guitarStrum() {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const freqs = [110, 146.83, 196, 220]; // A2, D3, G3, A3
        
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(650, now);
          filter.frequency.exponentialRampToValueAtTime(120, now + 1.8);

          gain.gain.setValueAtTime(0.08, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.04);
          osc.stop(now + 2.2);
        });
      } catch (e) {}
    },

    // Deep Listen Mode Sonar Sweep & Echolocation Ping
    sonarPulse(freq = 320) {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        // Primary sub/mid acoustic pulse
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);
        osc1.frequency.exponentialRampToValueAtTime(55, now + 1.1);

        gain1.gain.setValueAtTime(0.35, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 1.15);

        // Harmonic resonance ping
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 1.5, now);
        osc2.frequency.exponentialRampToValueAtTime(90, now + 0.6);

        gain2.gain.setValueAtTime(0.12, now);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now);
        osc2.stop(now + 0.7);
      } catch (e) {}
    },

    // Listen mode target ping (when hovering over cards / secrets during listen mode)
    listenTargetPing() {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      } catch (e) {}
    },

    // Ambient Listen Mode Binaural Drone
    listenDroneNodes: null,
    startListenDrone() {
      if (!soundEnabled || this.listenDroneNodes) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(55, now); // A1
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(58, now); // subtle binaural beat

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.8);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);

        this.listenDroneNodes = { osc1, osc2, gain, filter };
      } catch (e) {}
    },

    stopListenDrone() {
      if (!this.listenDroneNodes) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        this.listenDroneNodes.gain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
        const nodes = this.listenDroneNodes;
        this.listenDroneNodes = null;
        setTimeout(() => {
          try {
            nodes.osc1.stop();
            nodes.osc2.stop();
          } catch (e) {}
        }, 450);
      } catch (e) {
        this.listenDroneNodes = null;
      }
    },

    // Crafting Workbench ratchet / success sound
    craftSuccess() {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        [280, 420, 560, 700].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);

          gain.gain.setValueAtTime(0.12, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.08);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.1);
        });
      } catch (e) {}
    },

    // Collectible found chime
    artifactChime() {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);

          gain.gain.setValueAtTime(0.2, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.9);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 1.0);
        });
      } catch (e) {}
    }
  };

  // Audio Toggle Button Setup
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high text-[#8EA870]"></i> <span class="hidden sm:inline">AUDIO: ON</span>';
        soundToggleBtn.classList.add('border-[#5E7A45]');
        SoundFX.switchClick();
        SoundFX.guitarStrum();
      } else {
        soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark text-[#7A8087]"></i> <span class="hidden sm:inline">AUDIO: OFF</span>';
        soundToggleBtn.classList.remove('border-[#5E7A45]');
      }
    });
  }

  // Play subtle guitar strum on first page interaction
  const triggerFirstAudio = () => {
    SoundFX.guitarStrum();
    window.removeEventListener('click', triggerFirstAudio);
  };
  window.addEventListener('click', triggerFirstAudio);


  // ==========================================================================
  // 2. FLASHLIGHT MODE (Mouse Cone Lighting & Secret UV Developer Notes)
  // ==========================================================================
  let isFlashlightOn = false;
  const flashlightToggleBtn = document.getElementById('flashlight-toggle-btn');
  
  function updateFlashlightPos(e) {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  }
  window.addEventListener('mousemove', updateFlashlightPos);

  function toggleFlashlight() {
    isFlashlightOn = !isFlashlightOn;
    document.body.classList.toggle('flashlight-on', isFlashlightOn);
    SoundFX.switchClick();
    if (flashlightToggleBtn) {
      if (isFlashlightOn) {
        flashlightToggleBtn.classList.add('bg-[#E0AB48]', 'text-black');
        flashlightToggleBtn.classList.remove('bg-[#232528]', 'text-[#E3DED1]');
      } else {
        flashlightToggleBtn.classList.remove('bg-[#E0AB48]', 'text-black');
        flashlightToggleBtn.classList.add('bg-[#232528]', 'text-[#E3DED1]');
      }
    }
  }

  if (flashlightToggleBtn) {
    flashlightToggleBtn.addEventListener('click', toggleFlashlight);
  }


  // ==========================================================================
  // 3. LISTEN MODE RADAR & PULSE SYSTEM (The Last of Us Echolocation)
  // ==========================================================================
  let isListenMode = false;
  const listenModeBtn = document.getElementById('listen-mode-btn');

  function triggerSonarPulse(x, y, freq = 320) {
    const ripple = document.createElement('div');
    ripple.className = 'sonar-ripple';
    ripple.style.left = `${x || window.innerWidth / 2}px`;
    ripple.style.top = `${y || window.innerHeight / 2}px`;
    document.body.appendChild(ripple);
    SoundFX.sonarPulse(freq);
    setTimeout(() => ripple.remove(), 1300);
  }

  function toggleListenMode(forceState) {
    isListenMode = typeof forceState === 'boolean' ? forceState : !isListenMode;
    document.body.classList.toggle('listen-mode-active', isListenMode);
    
    if (isListenMode) {
      triggerSonarPulse(window.innerWidth / 2, window.innerHeight / 2, 340);
      SoundFX.startListenDrone();
      if (listenModeBtn) {
        listenModeBtn.classList.add('bg-[#C69234]', 'text-black', 'border-[#E0AB48]');
        listenModeBtn.classList.remove('bg-[#232528]', 'text-[#E3DED1]', 'border-[#33363A]');
        listenModeBtn.innerHTML = '<i class="fa-solid fa-ear-listen text-black animate-pulse"></i> <span class="hidden md:inline">LISTEN MODE: ON [R]</span>';
      }
    } else {
      SoundFX.stopListenDrone();
      if (listenModeBtn) {
        listenModeBtn.classList.remove('bg-[#C69234]', 'text-black', 'border-[#E0AB48]');
        listenModeBtn.classList.add('bg-[#232528]', 'text-[#E3DED1]', 'border-[#33363A]');
        listenModeBtn.innerHTML = '<i class="fa-solid fa-ear-listen text-[#C69234]"></i> <span class="hidden md:inline">LISTEN MODE [R]</span>';
      }
    }
  }

  if (listenModeBtn) {
    listenModeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleListenMode();
    });
  }

  // Click anywhere on the screen during Listen Mode to emit an acoustic ping from cursor
  window.addEventListener('click', (e) => {
    if (!isListenMode) return;
    if (e.target.closest('button, a, input, textarea, select')) return;
    triggerSonarPulse(e.clientX, e.clientY, 280);
  });

  // Acoustic ping on hover over interactive targets in Listen Mode
  document.querySelectorAll('.field-card, .collectible-pin, .uv-secret').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (isListenMode) {
        SoundFX.listenTargetPing();
      }
    });
  });

  // Keyboard Shortcuts: [F] Flashlight, [R] Listen Mode, [M] Sound Toggle
  window.addEventListener('keydown', (e) => {
    // Ignore when typing inside input or textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'f' || e.key === 'F') {
      toggleFlashlight();
    } else if (e.key === 'r' || e.key === 'R') {
      toggleListenMode();
    } else if (e.key === 'm' || e.key === 'M') {
      if (soundToggleBtn) soundToggleBtn.click();
    }
  });


  // ==========================================================================
  // 4. AMBIENT DUST SPORES CANVAS BACKGROUND
  // ==========================================================================
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
        this.color = Math.random() > 0.6 ? '142, 168, 112' : '227, 222, 209';
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


  // ==========================================================================
  // 5. SURVIVOR WORKBENCH CRAFTING SYSTEM (Interactive Skill Combinations)
  // ==========================================================================
  const CraftingRecipes = [
    {
      combo: ['Unity Netcode (NGO)', 'Multiplayer Relay / Lobby'],
      title: 'Dossier: Client-Side Prediction & Reconciliation Architecture',
      badge: 'MULTIPLAYER BLUEPRINT',
      color: 'moss',
      desc: 'Combines authoritative NGO host state with client tick history ring buffers. Implements position interpolation at 30Hz network tick rates, mitigating jitter under 180ms latency conditions.'
    },
    {
      combo: ['PhysX 2D/3D', 'C# Systems Architecture'],
      title: 'Dossier: Dynamic Suspension & Wheel Collider Rig',
      badge: 'PHYSICS BLUEPRINT',
      color: 'rust',
      desc: 'Multi-point raycast wheel dampening model with custom anti-roll bars, slip friction curves, and deterministic collision response tuned for mobile arcade racing.'
    },
    {
      combo: ['Addressables', 'Performance Profiling & Optimization'],
      title: 'Dossier: Zero GC Frame Pacing & Dynamic Asset Bundler',
      badge: 'OPTIMIZATION BLUEPRINT',
      color: 'yellow',
      desc: 'Memory-safe async Addressables loading pipeline with custom object pools and LZ4 compressed memory catalogs, maintaining steady 60 FPS on low-spec mobile chipsets.'
    },
    {
      combo: ['DOTS / ECS', 'C# Systems Architecture'],
      title: 'Dossier: Spore Swarm & 10,000 Entity Jobs Pipeline',
      badge: 'DOTS BENCHMARK',
      color: 'moss',
      desc: 'NativeArray memory layout leveraging SIMD Burst compilation. Computes flocking, collision avoidance, and pathfinding queries across 16 worker threads concurrently.'
    }
  ];

  let selectedSlots = [null, null];
  const slot1 = document.getElementById('workbench-slot-1');
  const slot2 = document.getElementById('workbench-slot-2');
  const craftBtn = document.getElementById('workbench-craft-btn');
  const craftResult = document.getElementById('workbench-result');

  function updateCraftingUI() {
    if (slot1) {
      slot1.innerHTML = selectedSlots[0] 
        ? `<span class="stamp-ink-yellow font-typewriter text-xs">${selectedSlots[0]}</span>`
        : '<span class="text-xs font-handwriting text-[#7A8087]">[SELECT SKILL 1 BELOW]</span>';
      slot1.classList.toggle('filled', !!selectedSlots[0]);
    }
    if (slot2) {
      slot2.innerHTML = selectedSlots[1]
        ? `<span class="stamp-ink-moss font-typewriter text-xs">${selectedSlots[1]}</span>`
        : '<span class="text-xs font-handwriting text-[#7A8087]">[SELECT SKILL 2 BELOW]</span>';
      slot2.classList.toggle('filled', !!selectedSlots[1]);
    }
    if (craftBtn) {
      craftBtn.disabled = !(selectedSlots[0] && selectedSlots[1]);
      craftBtn.classList.toggle('opacity-50', !(selectedSlots[0] && selectedSlots[1]));
    }
  }

  document.querySelectorAll('.craftable-skill-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const skillName = tag.getAttribute('data-skill') || tag.innerText.trim();
      SoundFX.tapeSnap();

      if (!selectedSlots[0]) {
        selectedSlots[0] = skillName;
      } else if (!selectedSlots[1] && selectedSlots[0] !== skillName) {
        selectedSlots[1] = skillName;
      } else {
        selectedSlots[0] = skillName;
        selectedSlots[1] = null;
      }
      updateCraftingUI();
    });
  });

  if (craftBtn) {
    craftBtn.addEventListener('click', () => {
      if (!selectedSlots[0] || !selectedSlots[1]) return;
      SoundFX.craftSuccess();

      // Find matching recipe or synthesize generic custom insight
      let matched = CraftingRecipes.find(r => 
        (r.combo.includes(selectedSlots[0]) && r.combo.includes(selectedSlots[1]))
      );

      if (!matched) {
        matched = {
          title: `Custom Engineered Architecture: ${selectedSlots[0]} + ${selectedSlots[1]}`,
          badge: 'SURVIVOR ENGINEERING SPEC',
          color: 'yellow',
          desc: `Engineered integration combining ${selectedSlots[0]} with ${selectedSlots[1]}. Features memory-efficient event buses, decoupled logic interfaces, and robust runtime stability for production builds.`
        };
      }

      if (craftResult) {
        craftResult.classList.remove('hidden');
        craftResult.innerHTML = `
          <div class="field-card p-5 bg-[#151618] border border-[#5E7A45] relative">
            <div class="tape-strip tape-top-center"></div>
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span class="stamp-ink-moss text-[11px]">${matched.badge}</span>
              <span class="font-handwriting text-xs text-[#E0AB48]">Crafted at Workbench</span>
            </div>
            <h4 class="font-typewriter text-base text-[#E3DED1] font-bold mb-2">${matched.title}</h4>
            <p class="text-xs text-[#CFC8BA] font-body leading-relaxed mb-3">${matched.desc}</p>
            <div class="flex items-center gap-2 pt-2 border-t border-[#282A2D] text-[11px] font-typewriter text-[#8EA870]">
              <i class="fa-solid fa-check-double"></i> SYSTEM SPECIFICATION VERIFIED IN ENGINE
            </div>
          </div>
        `;
      }
    });
  }


  // ==========================================================================
  // 6. MULTI-ENGINE SIMULATION MODAL (Netcode, Vehicle Suspension, Merge Physics)
  // ==========================================================================
  const modal = document.getElementById('sim-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('modal-close');
  const simCanvas = document.getElementById('sim-canvas');
  let simCtx = null;
  let currentSimMode = 'netcode'; // 'netcode' | 'vehicle' | 'merge'

  // Netcode simulation state
  let netTick = 0;
  let netLatency = 80;
  let packetLoss = 5;
  let clientPos = { x: 80, y: 140 };
  let serverPos = { x: 80, y: 140 };
  let targetPos = { x: 80, y: 140 };
  let packetHistory = [];

  // Vehicle simulation state
  let vehicle = {
    x: 100,
    y: 180,
    vx: 0,
    vy: 0,
    angle: 0,
    suspensionOffset: 0,
    isDragging: false
  };

  // Merge balls state
  let simEntities = [];

  if (simCanvas) {
    simCtx = simCanvas.getContext('2d');
    
    function resizeSim() {
      simCanvas.width = simCanvas.clientWidth;
      simCanvas.height = simCanvas.clientHeight;
    }

    // Set active simulation mode
    function setSimMode(mode) {
      currentSimMode = mode;
      resizeSim();
      SoundFX.switchClick();

      document.querySelectorAll('.sim-tab-btn').forEach(b => {
        if (b.getAttribute('data-mode') === mode) {
          b.className = 'sim-tab-btn px-3 py-1 bg-[#C69234] text-black font-typewriter text-xs font-bold';
        } else {
          b.className = 'sim-tab-btn px-3 py-1 bg-[#232528] text-[#CFC8BA] font-typewriter text-xs hover:bg-[#33363A]';
        }
      });
    }

    document.querySelectorAll('.sim-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setSimMode(btn.getAttribute('data-mode'));
      });
    });

    // Netcode Simulation Loop
    function drawNetcodeSim() {
      simCtx.fillStyle = '#111213';
      simCtx.fillRect(0, 0, simCanvas.width, simCanvas.height);

      netTick++;

      // Client moves smoothly to target
      clientPos.x += (targetPos.x - clientPos.x) * 0.15;
      clientPos.y += (targetPos.y - clientPos.y) * 0.15;

      // Send packet to server with simulated delay
      if (netTick % 3 === 0) {
        if (Math.random() * 100 >= packetLoss) {
          packetHistory.push({
            x: clientPos.x,
            y: clientPos.y,
            deliverAt: Date.now() + netLatency
          });
        }
      }

      // Deliver packets to server
      const now = Date.now();
      while (packetHistory.length && packetHistory[0].deliverAt <= now) {
        const p = packetHistory.shift();
        serverPos.x = p.x;
        serverPos.y = p.y;
      }

      // Draw Connection Wire & Grid
      simCtx.strokeStyle = '#282A2D';
      simCtx.lineWidth = 1;
      for (let x = 0; x < simCanvas.width; x += 30) {
        simCtx.beginPath();
        simCtx.moveTo(x, 0);
        simCtx.lineTo(x, simCanvas.height);
        simCtx.stroke();
      }

      // Server Ghost Position (Gold Ring)
      simCtx.beginPath();
      simCtx.arc(serverPos.x, serverPos.y + 40, 22, 0, Math.PI * 2);
      simCtx.strokeStyle = 'rgba(198, 146, 52, 0.85)';
      simCtx.lineWidth = 2;
      simCtx.setLineDash([4, 4]);
      simCtx.stroke();
      simCtx.setLineDash([]);
      simCtx.fillStyle = 'rgba(198, 146, 52, 0.2)';
      simCtx.fill();

      simCtx.fillStyle = '#E0AB48';
      simCtx.font = '10px monospace';
      simCtx.fillText('HOST SERVER (AUTHORITATIVE)', serverPos.x - 70, serverPos.y + 80);

      // Client Predicted Position (Green Solid)
      simCtx.beginPath();
      simCtx.arc(clientPos.x, clientPos.y - 20, 20, 0, Math.PI * 2);
      simCtx.fillStyle = '#5E7A45';
      simCtx.fill();
      simCtx.strokeStyle = '#8EA870';
      simCtx.lineWidth = 2;
      simCtx.stroke();

      simCtx.fillStyle = '#E3DED1';
      simCtx.font = 'bold 10px monospace';
      simCtx.fillText('LOCAL CLIENT (PREDICTED)', clientPos.x - 65, clientPos.y - 48);

      // Status Overlay Text
      simCtx.fillStyle = '#CFC8BA';
      simCtx.font = '11px "Special Elite", monospace';
      simCtx.fillText(`[NGO SIM] Latency: ${netLatency}ms | Packet Loss: ${packetLoss}% | Tick: #${netTick}`, 15, 25);
      simCtx.fillText(`Click anywhere on canvas to move player and observe reconciliation.`, 15, 42);
    }

    // Vehicle Physics Suspension Loop
    function drawVehicleSim() {
      simCtx.fillStyle = '#111213';
      simCtx.fillRect(0, 0, simCanvas.width, simCanvas.height);

      // Ground Line
      const groundY = simCanvas.height - 60;
      simCtx.strokeStyle = '#42464D';
      simCtx.lineWidth = 4;
      simCtx.beginPath();
      simCtx.moveTo(0, groundY);
      for (let x = 0; x <= simCanvas.width; x += 40) {
        const bump = Math.sin(x * 0.05) * 8;
        simCtx.lineTo(x, groundY + bump);
      }
      simCtx.stroke();

      // Vehicle Physics Update
      if (!vehicle.isDragging) {
        vehicle.vy += 0.4; // gravity
        vehicle.x += vehicle.vx;
        vehicle.y += vehicle.vy;
        vehicle.vx *= 0.98;

        // Ground collision & spring damper
        const currentGround = groundY + Math.sin(vehicle.x * 0.05) * 8;
        if (vehicle.y + 20 > currentGround) {
          const compression = (vehicle.y + 20) - currentGround;
          vehicle.vy -= compression * 0.18; // spring force
          vehicle.vy *= 0.75; // damping
          vehicle.y = currentGround - 20;
        }

        // Screen bounds
        if (vehicle.x < 50) vehicle.x = 50;
        if (vehicle.x > simCanvas.width - 50) vehicle.x = simCanvas.width - 50;
      }

      // Draw Vehicle Chassis
      simCtx.save();
      simCtx.translate(vehicle.x, vehicle.y);

      // Wheels
      simCtx.fillStyle = '#232528';
      simCtx.strokeStyle = '#C69234';
      simCtx.lineWidth = 3;
      
      // Front wheel
      simCtx.beginPath();
      simCtx.arc(35, 15, 14, 0, Math.PI * 2);
      simCtx.fill();
      simCtx.stroke();

      // Rear wheel
      simCtx.beginPath();
      simCtx.arc(-35, 15, 14, 0, Math.PI * 2);
      simCtx.fill();
      simCtx.stroke();

      // Suspension Springs
      simCtx.strokeStyle = '#8EA870';
      simCtx.lineWidth = 2;
      simCtx.beginPath();
      simCtx.moveTo(-35, 0);
      simCtx.lineTo(-35, 15);
      simCtx.moveTo(35, 0);
      simCtx.lineTo(35, 15);
      simCtx.stroke();

      // Car Body
      simCtx.fillStyle = '#8B3A2B';
      simCtx.strokeStyle = '#C7523C';
      simCtx.lineWidth = 2;
      simCtx.fillRect(-50, -20, 100, 20);
      simCtx.strokeRect(-50, -20, 100, 20);

      // Cabin
      simCtx.fillStyle = '#1A1B1D';
      simCtx.fillRect(-25, -35, 50, 15);
      simCtx.strokeRect(-25, -35, 50, 15);

      simCtx.restore();

      // Onscreen Instructions
      simCtx.fillStyle = '#CFC8BA';
      simCtx.font = '11px "Special Elite", monospace';
      simCtx.fillText(`[PHYSX RIG] Click and drag car to test spring suspension & gravity.`, 15, 25);
    }

    // Merge Physics Drop Loop
    class BallEntity {
      constructor(x, y) {
        this.x = x || Math.random() * simCanvas.width;
        this.y = y || Math.random() * (simCanvas.height / 2);
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.radius = Math.random() * 12 + 10;
        this.color = Math.random() > 0.5 ? '#C69234' : '#5E7A45';
        this.label = Math.pow(2, Math.floor(Math.random() * 5) + 1);
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // gravity
        
        if (this.x - this.radius < 0) {
          this.vx *= -0.85;
          this.x = this.radius;
        } else if (this.x + this.radius > simCanvas.width) {
          this.vx *= -0.85;
          this.x = simCanvas.width - this.radius;
        }

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

        simCtx.fillStyle = '#131415';
        simCtx.font = 'bold 9px monospace';
        simCtx.textAlign = 'center';
        simCtx.textBaseline = 'middle';
        simCtx.fillText(this.label, this.x, this.y);
      }
    }

    function initMergeSim() {
      simEntities = [];
      for (let i = 0; i < 14; i++) {
        simEntities.push(new BallEntity());
      }
    }

    function drawMergeSim() {
      simCtx.fillStyle = 'rgba(19, 20, 21, 0.35)';
      simCtx.fillRect(0, 0, simCanvas.width, simCanvas.height);
      
      simEntities.forEach(e => {
        e.update();
        e.draw();
      });

      simCtx.fillStyle = '#CFC8BA';
      simCtx.font = '11px "Special Elite", monospace';
      simCtx.fillText(`[2D COLLIDERS] Click to drop dynamic physics bodies into container.`, 15, 25);
    }

    function mainSimLoop() {
      if (modal && !modal.classList.contains('hidden')) {
        if (currentSimMode === 'netcode') {
          drawNetcodeSim();
        } else if (currentSimMode === 'vehicle') {
          drawVehicleSim();
        } else if (currentSimMode === 'merge') {
          drawMergeSim();
        }
      }
      requestAnimationFrame(mainSimLoop);
    }
    mainSimLoop();

    // Canvas Interactions
    simCanvas.addEventListener('mousedown', (e) => {
      const rect = simCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (currentSimMode === 'netcode') {
        targetPos.x = x;
        targetPos.y = y;
        SoundFX.tapeSnap();
      } else if (currentSimMode === 'vehicle') {
        const dist = Math.hypot(x - vehicle.x, y - vehicle.y);
        if (dist < 60) {
          vehicle.isDragging = true;
        } else {
          vehicle.vx = (x - vehicle.x) * 0.1;
          vehicle.vy = -8;
        }
        SoundFX.tapeSnap();
      } else if (currentSimMode === 'merge') {
        simEntities.push(new BallEntity(x, y));
        if (simEntities.length > 30) simEntities.shift();
        SoundFX.tapeSnap();
      }
    });

    simCanvas.addEventListener('mousemove', (e) => {
      if (vehicle.isDragging) {
        const rect = simCanvas.getBoundingClientRect();
        vehicle.x = e.clientX - rect.left;
        vehicle.y = e.clientY - rect.top;
        vehicle.vx = 0;
        vehicle.vy = 0;
      }
    });

    window.addEventListener('mouseup', () => {
      if (vehicle.isDragging) {
        vehicle.isDragging = false;
        vehicle.vy = -3;
      }
    });

    document.getElementById('sim-reset')?.addEventListener('click', () => {
      SoundFX.switchClick();
      if (currentSimMode === 'merge') initMergeSim();
      if (currentSimMode === 'netcode') {
        clientPos = { x: 80, y: 140 };
        serverPos = { x: 80, y: 140 };
        targetPos = { x: 80, y: 140 };
      }
      if (currentSimMode === 'vehicle') {
        vehicle.x = 100;
        vehicle.y = 180;
        vehicle.vx = 0;
        vehicle.vy = 0;
      }
    });
  }

  // Open Simulator Modal from Case Files
  document.querySelectorAll('.preview-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      SoundFX.switchClick();
      const title = btn.getAttribute('data-title') || 'Game Simulation';
      const mode = btn.getAttribute('data-mode') || 'netcode';
      
      if (modalTitle) modalTitle.textContent = title + " // Field Simulation";
      if (modal) {
        modal.classList.remove('hidden');
        if (simCanvas) {
          simCanvas.width = simCanvas.clientWidth;
          simCanvas.height = simCanvas.clientHeight;
        }
        if (typeof setSimMode === 'function') setSimMode(mode);
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      SoundFX.switchClick();
      if (modal) modal.classList.add('hidden');
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
    }
  });


  // ==========================================================================
  // 7. COLLECTIBLE ARTIFACTS & LORE INSPECTOR MODAL
  // ==========================================================================
  const collectedArtifacts = new Set();
  const artifactModal = document.getElementById('artifact-modal');
  const artifactClose = document.getElementById('artifact-close');
  const artifactTitle = document.getElementById('artifact-title');
  const artifactCategory = document.getElementById('artifact-category');
  const artifactBody = document.getElementById('artifact-body');
  const artifactCounter = document.getElementById('artifact-counter');

  const ArtifactsData = {
    dogtag: {
      title: "SURVIVOR DOG TAG: SAHIL AHMED",
      category: "FIREFLY / DEFENSE SIM PENDANT #262001",
      lore: "A battered steel dog tag found pinned to a military grade VR holster. Stamped with credentials: 'Unity Systems & Gameplay Engineer - Certified Simulation Architect'. It carries scratches from years of building high-concurrency multiplayer netcode and immersive training simulators for defense forces."
    },
    cassette: {
      title: "AUDIO CASSETTE: LOG #42 — 'NETCODE RECONCILIATION'",
      category: "MAGNETIC TAPE RECORDING",
      lore: "A cassette recording recovered from the TEC VENTURES server room: 'We decoupled the physics tick rate from the render loop. Under heavy packet loss, the client buffers user input frames and smoothly lerps to authoritative snapshots. No rubber-banding. 60 FPS locked.'"
    },
    manual: {
      title: "TRAINING MANUAL: ZERO-ALLOCATION DRAW CALLS",
      category: "MILITARY ENGINEERING SURVIVAL GUIDE",
      lore: "Field notes scribbled with a black marker: 'Always pool GameObject instances. Replace standard foreach loops with indexed iterations. Use SRP Batcher and Texture Arrays to merge 80+ draw calls down to 4. Protect CPU cache locality at all costs.'"
    }
  };

  document.querySelectorAll('.collectible-pin').forEach(pin => {
    pin.addEventListener('click', () => {
      const artifactId = pin.getAttribute('data-artifact');
      const data = ArtifactsData[artifactId];
      if (!data) return;

      collectedArtifacts.add(artifactId);
      pin.classList.add('collectible-collected');
      SoundFX.artifactChime();

      if (artifactCounter) {
        artifactCounter.textContent = `${collectedArtifacts.size}/3`;
      }

      if (artifactTitle) artifactTitle.textContent = data.title;
      if (artifactCategory) artifactCategory.textContent = data.category;
      if (artifactBody) artifactBody.textContent = data.lore;

      if (artifactModal) artifactModal.classList.remove('hidden');
    });
  });

  if (artifactClose) {
    artifactClose.addEventListener('click', () => {
      SoundFX.switchClick();
      if (artifactModal) artifactModal.classList.add('hidden');
    });
  }

});
