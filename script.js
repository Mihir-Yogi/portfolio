(() => {
  const FRAME_COUNT = 147;
  const FOLDER_NAME = 'ezgif-750aa6558210a213-jpg';

  const canvas = document.getElementById('animation-canvas');
  const ctx = canvas.getContext('2d');
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const scrollPercentage = document.getElementById('scroll-percentage');
  const cursorGlow = document.getElementById('cursor-glow');
  const toast = document.getElementById('toast');
  const bgLayer = document.querySelector('.hero-bg-layer');
  const liveTimeBadge = document.getElementById('live-time-badge');

  // Modal elements
  const modal = document.getElementById('project-modal');
  const modalImg = document.getElementById('modal-img');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalLiveBtn = document.getElementById('modal-live-btn');
  const modalGithubBtn = document.getElementById('modal-github-btn');
  const modalClose = document.querySelector('.modal-close');
  const modalBackdrop = document.querySelector('.modal-backdrop');

  // Terminal elements
  const terminalTrigger = document.getElementById('terminal-trigger');
  const terminalModal = document.getElementById('terminal-modal');
  const terminalClose = document.querySelector('.terminal-close');
  const terminalBackdrop = document.querySelector('.terminal-backdrop');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');

  // Audio elements
  const soundToggle = document.getElementById('sound-toggle');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');
  let audioEnabled = false;
  let audioCtx = null;

  const images = new Array(FRAME_COUNT);
  let loadedCount = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  let lastDrawnFrame = -1;
  let firstFrameLoaded = false;

  // Project data
  const PROJECT_DATA = {
    cctv: {
      badge: '01 • AI FORENSICS & CV',
      title: 'CCTV INSIGHT 👁️',
      category: 'AI-POWERED FORENSIC VIDEO INVESTIGATION PLATFORM',
      img: 'assets/cctv_insight.jpg',
      liveUrl: '',
      githubUrl: 'https://github.com/Mihir-Yogi/CCTV-Insight-',
      tabs: {
        overview: `
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="background: rgba(6, 182, 212, 0.15); border: 1px solid #06b6d4; color: #22d3ee; font-size: 0.72rem; font-weight: 800; padding: 3px 10px; border-radius: 999px;">● AI SYSTEM COMPLETED</span>
            <span style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12); color: #d1d5db; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 999px;">MONOREPO ARCHITECTURE</span>
            <a href="https://github.com/Mihir-Yogi/CCTV-Insight-" target="_blank" rel="noopener" style="background: #24292f; border: 1px solid rgba(255, 255, 255, 0.25); color: #ffffff; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 999px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              github.com/Mihir-Yogi/CCTV-Insight- ↗
            </a>
          </div>
          <p style="margin-bottom: 10px; font-size: 1.05rem; color: #ffffff; line-height: 1.4;"><strong>"Find the moment. Skip the hours."</strong></p>
          <p style="margin-bottom: 14px; line-height: 1.6; color: #d1d5db;">CCTV Insight is an intelligent security operations center (SOC) web application built to eliminate the tedious hours spent reviewing long surveillance footage. By processing CCTV recordings through computer vision and temporal event aggregation, the system pinpoints critical events and plots them onto an interactive multi-track timeline for instant frame-accurate seeking.</p>
          
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: 12px; padding: 14px; margin-bottom: 14px;">
            <div style="font-size: 0.76rem; font-weight: 800; color: #22d3ee; margin-bottom: 10px; letter-spacing: 0.08em; text-transform: uppercase;">Key SOC Capabilities:</div>
            <ul style="padding-left: 18px; margin: 0; font-size: 0.86rem; line-height: 1.65; color: #d1d5db;">
              <li><strong>Interactive Multi-Track AI Timeline:</strong> Visualizes events chronologically across multi-hour footage with zoom (1x to 10x) and hover preview tooltips.</li>
              <li><strong>Frame-Accurate Video Player:</strong> Custom SOC player featuring frame-by-frame stepping, variable playback speed (0.25x - 8x), bounding box overlays, and timecode readouts (HH:MM:SS:FF).</li>
              <li><strong>Smart Event Filtering:</strong> Instant filtering by event class (Person, Vehicle, Zone Entry, Zone Exit, Multi-Person, Movement), time ranges, and confidence thresholds.</li>
              <li><strong>Custom Security Zones:</strong> Interactive polygon and rectangular zone creation on the video canvas for intrusion and perimeter surveillance.</li>
              <li><strong>SOC Executive Dashboard:</strong> Real-time activity analytics, detection breakdown charts, active queue monitors, and processing metrics.</li>
              <li><strong>Configurable Frame Sampling:</strong> Optimized analysis through configurable FPS sampling (1, 2, 5, 10 FPS).</li>
            </ul>
          </div>
        `,
        tech: `
          <p style="margin-bottom: 12px; font-size: 0.95rem; color: #ffffff;"><strong>Modern Full-Stack & Computer Vision Architecture:</strong></p>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px;">
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px;">
              <div style="color: #22d3ee; font-weight: 800; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 4px;">Frontend Layer</div>
              <div style="color: #ffffff; font-size: 0.88rem; font-weight: 600;">React 19 • TypeScript • Vite • Tailwind CSS • Lucide React • Recharts • React Router</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px;">
              <div style="color: #38bdf8; font-weight: 800; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 4px;">Backend & API Layer</div>
              <div style="color: #ffffff; font-size: 0.88rem; font-weight: 600;">Python 3.14 • FastAPI • Pydantic v2 • Uvicorn • Async Task Workers</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px;">
              <div style="color: #34d399; font-weight: 800; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 4px;">Database & Storage</div>
              <div style="color: #ffffff; font-size: 0.88rem; font-weight: 600;">MongoDB Atlas / Local MongoDB • PyMongo • Chunked Storage Engine</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px;">
              <div style="color: #f43f5e; font-weight: 800; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 4px;">Computer Vision & Neural Pipeline</div>
              <div style="color: #ffffff; font-size: 0.88rem; font-weight: 600;">OpenCV • Ultralytics YOLOv8 • DetectionEngine Abstraction • FFmpeg</div>
            </div>
          </div>
        `,
        structure: `
          <div style="margin-bottom: 12px;">
            <div style="color: #22d3ee; font-weight: 800; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 8px;">Monorepo Project Layout:</div>
            <pre style="background: #060609; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; font-family: var(--font-code); font-size: 0.75rem; color: #a5f3fc; line-height: 1.45; overflow-x: auto;">
cctv-insight/
├── frontend/                     # React + Vite SOC Investigation Interface
│   ├── src/
│   │   ├── components/           # Player, timeline, events, custom zones
│   │   ├── pages/                # Dashboard, VideoLibrary, Upload, Investigation
│   │   ├── services/             # MockData & Storage engine
│   │   ├── types/                # Strict TypeScript schemas
│   │   └── utils/                # Timecode formatters & theme tokens
├── backend/                      # FastAPI API server & CV Worker
├── storage/                      # Video uploads, processed chunks & thumbnails
├── docs/                         # Architecture & API specifications
└── README.md</pre>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px;">
            <div style="color: #ffffff; font-weight: 700; font-size: 0.8rem; margin-bottom: 4px;">⚖️ Licensing & Attribution</div>
            <p style="font-size: 0.78rem; color: #9ca3af; line-height: 1.5; margin: 0;">Developed as an educational & academic project. Ultralytics YOLO: AGPL-3.0; OpenCV: Apache 2.0; FFmpeg: LGPL 2.1+ / GPL 2+.</p>
          </div>
        `
      }
    },
    suno: {
      badge: '02 • FEATURED PLATFORM',
      title: 'SUNO CAMPUS PLATFORM',
      category: 'COLLEGE SOCIAL NETWORK & EVENT MANAGEMENT PLATFORM',
      img: 'assets/sunocampus.png',
      liveUrl: 'https://suno-campus.vercel.app',
      tabs: {
        overview: `
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
            <span style="background: var(--primary-light); border: 1px solid var(--primary-red); color: var(--primary-red); font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 999px;">● LIVE PLATFORM</span>
            <a href="https://suno-campus.vercel.app" target="_blank" rel="noopener" style="color: var(--primary-red); font-size: 0.82rem; font-weight: 700; text-decoration: none;">suno-campus.vercel.app ↗</a>
          </div>
          <p style="margin-bottom: 12px; font-size: 1rem; color: #ffffff;"><strong>A modern college social network and centralized campus platform.</strong></p>
          <p style="margin-bottom: 14px; line-height: 1.6; color: #d1d5db;">Connects students, facilitates hackathons & workshop management, and fosters community collaboration with real-time updates.</p>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 14px; margin-bottom: 14px;">
            <div style="font-size: 0.78rem; font-weight: 800; color: var(--primary-red); margin-bottom: 8px; letter-spacing: 0.08em; text-transform: uppercase;">Key Highlights:</div>
            <ul style="padding-left: 18px; margin: 0; font-size: 0.88rem; line-height: 1.6; color: #d1d5db;">
              <li><strong>Community Hub:</strong> College-wide announcements, opportunities, and discussions</li>
              <li><strong>Event System:</strong> Search, registration, calendar notifications, and wishlists</li>
              <li><strong>Role-Based Access:</strong> Multi-tier access for Students, Admins, and Contributors</li>
              <li><strong>Responsive Routing:</strong> Scalable component architecture with JWT auth</li>
            </ul>
          </div>
        `,
        tech: `
          <p style="margin-bottom: 12px; font-size: 0.95rem; color: #ffffff;"><strong>Full-Stack JavaScript Architecture:</strong></p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px;">
              <div style="color: var(--primary-red); font-weight: 800; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 4px;">Frontend Framework</div>
              <div style="color: #ffffff; font-size: 0.88rem; font-weight: 600;">React.js • React Router • Custom CSS Modules • Responsive UI</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px;">
              <div style="color: var(--primary-red); font-weight: 800; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 4px;">Backend & API</div>
              <div style="color: #ffffff; font-size: 0.88rem; font-weight: 600;">Node.js • Express.js • RESTful Endpoints • JWT Authentication • Bcrypt</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px;">
              <div style="color: var(--primary-red); font-weight: 800; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 4px;">Database</div>
              <div style="color: #ffffff; font-size: 0.88rem; font-weight: 600;">MongoDB • Mongoose ODM • Cloud Database Clustering</div>
            </div>
          </div>
        `,
        structure: `
          <p style="color: #ffffff; font-size: 0.9rem; margin-bottom: 10px;"><strong>Deployment & Monorepo:</strong></p>
          <div style="background: #060609; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; font-family: var(--font-code); font-size: 0.78rem; color: #d1d5db; line-height: 1.5; margin-bottom: 12px;">
            Deployed on Vercel with high-availability serverless routing and MongoDB Atlas cloud database.
          </div>
        `
      }
    },
    cims: {
      badge: '03 • CCTV OPERATIONS',
      title: 'CAMOPS — OPERATIONS DESK (CIMS)',
      category: 'CCTV & OPERATIONS DESK MANAGEMENT SYSTEM • ONGOING',
      img: 'assets/camops.jpg',
      liveUrl: 'https://cctvtracker.netlify.app/',
      tabs: {
        overview: `
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
            <span style="background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; color: #22c55e; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 999px;">● ONGOING PROJECT</span>
            <a href="https://cctvtracker.netlify.app/" target="_blank" rel="noopener" style="color: #22c55e; font-size: 0.82rem; font-weight: 700; text-decoration: none;">cctvtracker.netlify.app ↗</a>
          </div>
          <p style="margin-bottom: 12px; font-size: 1rem; color: #ffffff;"><strong>"Clarity when everything is moving."</strong></p>
          <p style="margin-bottom: 14px; line-height: 1.6; color: #d1d5db;">CamOps is an operations desk platform that helps teams monitor CCTV assets, track operational status, manage equipment failures, and ensure smooth field operations.</p>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 14px; margin-bottom: 14px;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #22c55e; margin-bottom: 8px; letter-spacing: 0.08em; text-transform: uppercase;">Core Modules & Features:</div>
            <ul style="padding-left: 18px; margin: 0; font-size: 0.88rem; line-height: 1.6; color: #d1d5db;">
              <li><strong>Centralized Operations:</strong> Monitor assets, locations, and teams in one place</li>
              <li><strong>Failure Management:</strong> Track, prioritize, and resolve equipment malfunctions</li>
              <li><strong>Live Insights:</strong> Real-time operational metrics, confirmations, and alert workflows</li>
              <li><strong>Role-Based Access:</strong> Secure, role-specific workspace experience with CRUD workflows</li>
            </ul>
          </div>
        `,
        tech: `
          <p style="margin-bottom: 12px; font-size: 0.95rem; color: #ffffff;"><strong>Operations Architecture:</strong></p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px;">
              <div style="color: #22c55e; font-weight: 800; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 4px;">Frontend & Charts</div>
              <div style="color: #ffffff; font-size: 0.88rem; font-weight: 600;">React.js • Chart.js • Data Visualizations • Responsive Dashboard</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px;">
              <div style="color: #22c55e; font-weight: 800; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 4px;">Backend & Database</div>
              <div style="color: #ffffff; font-size: 0.88rem; font-weight: 600;">Node.js • Express • MongoDB • CRUD Incident Workflows</div>
            </div>
          </div>
        `,
        structure: `
          <p style="color: #ffffff; font-size: 0.9rem; margin-bottom: 10px;"><strong>Deployment:</strong></p>
          <div style="background: #060609; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; font-family: var(--font-code); font-size: 0.78rem; color: #d1d5db; line-height: 1.5;">
            Deployed live on Netlify with automated continuous deployment and real-time dashboard endpoints.
          </div>
        `
      }
    }
  };

  // Frame path generator
  const getFramePath = (index) => {
    const num = String(index + 1).padStart(3, '0');
    return `${FOLDER_NAME}/ezgif-frame-${num}.jpg`;
  };

  // Canvas resize
  const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (lastDrawnFrame >= 0) {
      drawFrame(lastDrawnFrame);
    }
  };

  // Draw frame to canvas
  const drawFrame = (index) => {
    let img = images[index];

    // Fallback frame
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < FRAME_COUNT; offset++) {
        const prev = index - offset;
        const next = index + offset;
        if (prev >= 0 && images[prev]?.complete && images[prev].naturalWidth > 0) {
          img = images[prev];
          break;
        }
        if (next < FRAME_COUNT && images[next]?.complete && images[next].naturalWidth > 0) {
          img = images[next];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const isMobile = screenW <= 768;

    // Focus dimensions
    const FOCUS_W = 683;
    const FOCUS_H = 720;

    let scale;
    if (isMobile) {
      // Responsive scaling
      scale = screenW / FOCUS_W;
    } else {
      scale = Math.min(screenW / imgW, screenH / imgH);
    }

    const drawW = Math.round(imgW * scale);
    const drawH = Math.round(imgH * scale);

    const drawX = Math.round((screenW - drawW) / 2);
    // Center positioning
    const drawY = Math.round((screenH - drawH) / 2);

    ctx.clearRect(0, 0, screenW, screenH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    lastDrawnFrame = index;
  };

  // Scroll progress
  const getScrollProgress = () => {
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const maxScroll = Math.max(1, (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight);
    return Math.min(1, Math.max(0, scrollTop / maxScroll));
  };

  // Update dock state
  const updateActiveDock = () => {
    const sections = ['hero', 'projects', 'about', 'contact'];
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach((id) => {
      const el = document.getElementById(id);
      const link = document.querySelector(`.dock-item[href="#${id}"]`);
      if (el && link) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('.dock-item').forEach((d) => d.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  };

  // Animation loop
  const updateLoop = () => {
    targetProgress = getScrollProgress();

    const lerpSpeed = 0.12;
    const delta = targetProgress - currentProgress;

    if (Math.abs(delta) > 0.00001) {
      currentProgress += delta * lerpSpeed;
    } else {
      currentProgress = targetProgress;
    }

    if (scrollPercentage) {
      const pct = Math.round(currentProgress * 100);
      scrollPercentage.textContent = `${pct}%`;
    }

    // Background parallax
    if (bgLayer) {
      const heroThreshold = window.innerHeight * 0.75;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const fadeProgress = Math.min(1, Math.max(0, scrollY / heroThreshold));
      bgLayer.style.opacity = (1 - fadeProgress).toFixed(2);
      bgLayer.style.transform = `translateY(${scrollY * -0.15}px)`;
    }

    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(currentProgress * (FRAME_COUNT - 1)))
    );

    if (frameIndex !== lastDrawnFrame) {
      drawFrame(frameIndex);
    }

    requestAnimationFrame(updateLoop);
  };

  // Preload assets
  const preloadImages = () => {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFramePath(i);

      img.onload = () => {
        images[i] = img;
        loadedCount++;
        const percent = Math.floor((loadedCount / FRAME_COUNT) * 100);
        if (loaderBar) loaderBar.style.width = `${percent}%`;
        if (loaderPercent) loaderPercent.textContent = `${percent}%`;

        if (i === 0 && !firstFrameLoaded) {
          firstFrameLoaded = true;
          drawFrame(0);
        }

        if (loadedCount >= FRAME_COUNT) {
          setTimeout(() => {
            if (loader) loader.classList.add('loaded');
          }, 150);
        }
      };

      img.onerror = () => {
        loadedCount++;
      };
    }
  };

  // Audio effects
  const playSound = (type = 'click') => {
    if (!audioEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'open') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {
      console.log('Audio note error', e);
    }
  };

  const initAudioToggle = () => {
    if (!soundToggle) return;
    soundToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        soundToggle.classList.add('sound-active');
        soundIconOn.style.display = 'block';
        soundIconOff.style.display = 'none';
        playSound('success');
        showToast('🔊 Audio FX enabled');
      } else {
        soundToggle.classList.remove('sound-active');
        soundIconOn.style.display = 'none';
        soundIconOff.style.display = 'block';
        showToast('🔇 Audio FX muted');
      }
    });
  };

  // Theme switcher
  const initThemeSwitcher = () => {
    const savedTheme = localStorage.getItem('mihir_portfolio_theme') || 'crimson';
    document.documentElement.setAttribute('data-theme', savedTheme);

    document.querySelectorAll('.theme-dot').forEach((dot) => {
      if (dot.getAttribute('data-theme') === savedTheme) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }

      dot.addEventListener('click', () => {
        const theme = dot.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('mihir_portfolio_theme', theme);

        document.querySelectorAll('.theme-dot').forEach((d) => d.classList.remove('active'));
        dot.classList.add('active');
        playSound('click');
        showToast(`✨ Accent Theme: ${theme.toUpperCase()}`);
      });
    });
  };

  // Live clock
  const updateLiveTime = () => {
    if (!liveTimeBadge) return;
    const now = new Date();
    // IST formatter
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    liveTimeBadge.textContent = `GUJARAT, INDIA • ${timeString} IST`;
  };

  // 3D card tilt
  const init3DTilt = () => {
    const cards = document.querySelectorAll('.tilt-card-3d');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  };

  // Terminal CLI
  const initTerminal = () => {
    const openTerminal = () => {
      if (!terminalModal) return;
      terminalModal.classList.add('open');
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      playSound('open');
      if (terminalInput) {
        setTimeout(() => terminalInput.focus(), 100);
      }
    };

    const closeTerminal = () => {
      if (!terminalModal) return;
      terminalModal.classList.remove('open');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      playSound('click');
    };

    if (terminalTrigger) {
      terminalTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        openTerminal();
      });
      terminalTrigger.addEventListener('touchend', (e) => {
        e.preventDefault();
        openTerminal();
      });
    }

    if (terminalClose) terminalClose.addEventListener('click', closeTerminal);
    if (terminalBackdrop) terminalBackdrop.addEventListener('click', closeTerminal);

    // Global Shortcut: Ctrl+K, Cmd+K, Ctrl+` or Backquote (Quake-style)
    window.addEventListener('keydown', (e) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const isKeyK = e.key === 'k' || e.key === 'K' || e.code === 'KeyK';
      const isBackquote = e.key === '`' || e.code === 'Backquote';
      const isInputActive = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

      if ((isCmdOrCtrl && isKeyK) || (isCmdOrCtrl && isBackquote) || (!isInputActive && isBackquote)) {
        e.preventDefault();
        e.stopPropagation();
        if (terminalModal.classList.contains('open')) {
          closeTerminal();
        } else {
          openTerminal();
        }
      }

      if (e.key === 'Escape' && terminalModal.classList.contains('open')) {
        e.preventDefault();
        closeTerminal();
      }
    }, { capture: true });

    const printToTerminal = (html) => {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = html;
      terminalOutput.appendChild(line);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const executeCommand = (cmdText) => {
      const clean = cmdText.trim().toLowerCase();
      if (!clean) return;

      printToTerminal(`<span class="t-user">guest@mihir:~$</span> ${cmdText}`);
      playSound('click');

      const parts = clean.split(' ');
      const action = parts[0];

      switch (action) {
        case 'help':
          printToTerminal(`
            <div style="color:#22d3ee; margin-top:4px;">Available Commands:</div>
            • <strong style="color:#fff;">skills</strong> — View AI/CV, languages, frameworks & databases<br>
            • <strong style="color:#fff;">projects</strong> — List featured engineering projects<br>
            • <strong style="color:#fff;">cctv</strong> — View CCTV Insight AI Platform specs & poster<br>
            • <strong style="color:#fff;">education</strong> — View university & graduation status<br>
            • <strong style="color:#fff;">contact</strong> — Show email, phone & direct links<br>
            • <strong style="color:#fff;">hire</strong> — Launch pre-filled inquiry email<br>
            • <strong style="color:#fff;">theme [crimson|cyan|emerald|violet]</strong> — Change accent theme<br>
            • <strong style="color:#fff;">matrix</strong> — Run cyberpunk animation<br>
            • <strong style="color:#fff;">clear</strong> — Clear terminal screen
          `);
          break;

        case 'skills':
          printToTerminal(`
            <div style="color:#22d3ee; font-weight:700;">[AI & COMPUTER VISION]</div>
            • <strong>AI & CV:</strong> Ultralytics YOLOv8, OpenCV, FastAPI, Python 3.14, FFmpeg<br>
            <div style="color:var(--primary-red); font-weight:700; margin-top:6px;">[FULL-STACK & DATABASES]</div>
            • <strong>Frontend:</strong> React 19, TypeScript, Vite, Tailwind CSS, JavaScript (ES6+), HTML5/CSS3<br>
            • <strong>Backend & APIs:</strong> Node.js, Express.js, RESTful Endpoints, JWT Auth<br>
            • <strong>Databases:</strong> MongoDB Atlas, PyMongo, MySQL / SQL<br>
            • <strong>DevOps & Tools:</strong> Docker, Git, GitHub, Postman, Linux CLI
          `);
          break;

        case 'projects':
          printToTerminal(`
            <div style="color:#22d3ee; font-weight:700;">[FEATURED ENGINEERING PROJECTS]</div>
            1. <strong>CCTV INSIGHT 👁️</strong> (YOLOv8, OpenCV, FastAPI, React 19, MongoDB, Docker)<br>
               <em>AI-powered forensic video investigation platform for high-density CCTV footage.</em><br>
               <span style="color:#9ca3af;">Repo: <a href="https://github.com/Mihir-Yogi/CCTV-Insight-" target="_blank" style="color:#38bdf8; text-decoration:underline;">github.com/Mihir-Yogi/CCTV-Insight-</a></span><br>
            2. <strong>SUNO CAMPUS PLATFORM</strong> (React, Node, Express, MongoDB, JWT)<br>
               <em>A centralized campus event management portal with role-based access.</em><br>
               <span style="color:#9ca3af;">Live: <a href="https://suno-campus.vercel.app" target="_blank" style="color:var(--primary-red); text-decoration:underline;">suno-campus.vercel.app</a></span><br>
            3. <strong>CAMOPS — OPERATIONS DESK (CIMS)</strong> (React, Node.js, MongoDB, Chart.js)<br>
               <em>CCTV equipment tracking, inventory management, and automated alert workflow.</em><br>
               <span style="color:#9ca3af;">Live: <a href="https://cctvtracker.netlify.app/" target="_blank" style="color:#22c55e; text-decoration:underline;">cctvtracker.netlify.app</a></span>
          `);
          break;

        case 'cctv':
        case 'cctv-insight':
          printToTerminal(`
            <div style="color:#22d3ee; font-weight:700;">[CCTV INSIGHT 👁️ — AI FORENSICS PLATFORM]</div>
            • <strong>Repository:</strong> <a href="https://github.com/Mihir-Yogi/CCTV-Insight-" target="_blank" style="color:#38bdf8; text-decoration:underline;">https://github.com/Mihir-Yogi/CCTV-Insight-</a><br>
            • <strong>Stack:</strong> React 19, TypeScript, Tailwind, Python 3.14, FastAPI, OpenCV, YOLOv8, MongoDB<br>
            Opening investigation studio modal...
          `);
          setTimeout(() => {
            openModal('cctv');
          }, 400);
          break;

        case 'education':
          printToTerminal(`
            <div style="color:var(--primary-red); font-weight:700;">[ACADEMIC BACKGROUND]</div>
            • <strong>B.Tech in Computer Engineering</strong><br>
              Ganpat University – Institute of Technology (Expected: June 2027)<br>
            • <strong>Diploma in Computer Engineering</strong> (Graduated: June 2024)
          `);
          break;

        case 'contact':
          printToTerminal(`
            <div style="color:var(--primary-red); font-weight:700;">[GET IN TOUCH]</div>
            • <strong>Email:</strong> work.mihiryogi@gmail.com<br>
            • <strong>Phone:</strong> +91 7383296446<br>
            • <strong>LinkedIn:</strong> linkedin.com/in/mihiryogi<br>
            • <strong>GitHub:</strong> github.com/Mihir-Yogi<br>
            • <strong>Location:</strong> Gujarat, India
          `);
          break;

        case 'hire':
          printToTerminal(`
            <div style="color:#22c55e;">[DRAFTING INQUIRY]</div>
            Opening email client for Mihir Yogi...
          `);
          setTimeout(() => {
            window.location.href = 'mailto:work.mihiryogi@gmail.com?subject=Opportunity%20Inquiry%20-%20Mihir%20Yogi';
          }, 600);
          break;

        case 'theme':
          const targetTheme = parts[1];
          if (['crimson', 'cyan', 'emerald', 'violet'].includes(targetTheme)) {
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('mihir_portfolio_theme', targetTheme);
            document.querySelectorAll('.theme-dot').forEach((d) => {
              d.classList.toggle('active', d.getAttribute('data-theme') === targetTheme);
            });
            printToTerminal(`<span style="color:#22c55e;">✓ Switched accent theme to: ${targetTheme.toUpperCase()}</span>`);
          } else {
            printToTerminal(`<span style="color:#ef4444;">Usage: theme [crimson|cyan|emerald|violet]</span>`);
          }
          break;

        case 'matrix':
          printToTerminal(`
            <div style="color:#22c55e; font-family:monospace; line-height:1.2;">
              01001101 01001001 01001000 01001001 01010010<br>
              01011001 01001111 01000111 01001001<br>
              >>> ACCESS GRANTED: WELCOME TO THE MATRIX <<<
            </div>
          `);
          break;

        case 'clear':
          terminalOutput.innerHTML = `
            <div class="terminal-line"><span class="t-prompt">system:</span> Console cleared.</div>
            <div class="terminal-chips">
              <button class="t-chip" data-cmd="skills">skills</button>
              <button class="t-chip" data-cmd="projects">projects</button>
              <button class="t-chip" data-cmd="cctv">cctv</button>
              <button class="t-chip" data-cmd="contact">contact</button>
              <button class="t-chip" data-cmd="hire">hire</button>
              <button class="t-chip" data-cmd="help">help</button>
            </div>
          `;
          bindTerminalChips();
          break;

        default:
          printToTerminal(`<span style="color:#ef4444;">Command not recognized: '${clean}'. Type <strong style="color:#22d3ee;">help</strong> for list of commands.</span>`);
      }
    };

    const bindTerminalChips = () => {
      document.querySelectorAll('.t-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          const cmd = chip.getAttribute('data-cmd');
          if (cmd) executeCommand(cmd);
        });
      });
    };

    if (terminalForm) {
      terminalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = terminalInput.value;
        if (val) {
          executeCommand(val);
          terminalInput.value = '';
        }
      });
    }

    bindTerminalChips();
  };

  // Quick inquiry intent
  const initIntentSelector = () => {
    const buttons = document.querySelectorAll('.intent-btn');
    const emailLink = document.getElementById('email-contact-link');
    const mainCtaBtn = document.getElementById('main-cta-btn');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const subject = encodeURIComponent(btn.getAttribute('data-subject'));
        const body = encodeURIComponent(btn.getAttribute('data-body'));
        const mailUrl = `mailto:work.mihiryogi@gmail.com?subject=${subject}&body=${body}`;

        if (emailLink) emailLink.href = mailUrl;
        if (mainCtaBtn) mainCtaBtn.href = mailUrl;

        playSound('click');
        showToast(`✓ Intent set: "${btn.textContent.trim()}"`);
      });
    });
  };

  // Skill highlights
  const initSkillHighlights = () => {
    document.querySelectorAll('.skill-tag[data-tech]').forEach((tag) => {
      tag.addEventListener('click', () => {
        const tech = tag.getAttribute('data-tech');
        playSound('click');

        // Spotlight project card
        if (['yolo', 'opencv', 'fastapi', 'python', 'docker', 'ffmpeg'].includes(tech)) {
          const cctvCard = document.querySelector('[data-project="cctv"]');
          if (cctvCard) {
            cctvCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            cctvCard.style.boxShadow = '0 0 40px #06b6d4';
            setTimeout(() => {
              cctvCard.style.boxShadow = '';
            }, 1800);
            showToast(`🔥 ${tag.textContent} powers "CCTV Insight" AI Forensics!`);
          }
        } else if (['react', 'node', 'express', 'mongo', 'jwt', 'js'].includes(tech)) {
          const sunoCard = document.querySelector('[data-project="suno"]');
          if (sunoCard) {
            sunoCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            sunoCard.style.boxShadow = '0 0 35px var(--primary-red)';
            setTimeout(() => {
              sunoCard.style.boxShadow = '';
            }, 1800);
            showToast(`🔥 ${tag.textContent} is used in "Suno Campus Platform"!`);
          }
        } else if (['crud', 'chart', 'mysql', 'sql'].includes(tech)) {
          const cimsCard = document.querySelector('[data-project="cims"]');
          if (cimsCard) {
            cimsCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            cimsCard.style.boxShadow = '0 0 35px #22c55e';
            setTimeout(() => {
              cimsCard.style.boxShadow = '';
            }, 1800);
            showToast(`⚡ ${tag.textContent} powers "CamOps Operations Desk"!`);
          }
        } else {
          showToast(`⚡ Skill: ${tag.textContent}`);
        }
      });
    });
  };

  // Cursor glow
  const initCursorGlow = () => {
    if (!cursorGlow) return;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
  };

  // Scroll reveal
  const initScrollReveal = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal-item').forEach((el) => observer.observe(el));
  };

  // Toast message
  const showToast = (message = '✓ Copied to clipboard!') => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  };

  // Click to copy
  const initClickToCopy = () => {
    document.querySelectorAll('.interactive-copy').forEach((item) => {
      item.addEventListener('click', (e) => {
        const text = item.getAttribute('data-copy');
        if (text) {
          navigator.clipboard.writeText(text).then(() => {
            playSound('success');
            showToast(`✓ Copied "${text}" to clipboard!`);
          }).catch(() => {
            showToast('✓ Copied!');
          });
        }
      });
    });
  };

  // Project modal & poster zoom
  const modalMediaWrap = document.getElementById('modal-media-wrap');
  const posterZoomModal = document.getElementById('poster-zoom-modal');
  const posterZoomImg = document.getElementById('poster-zoom-img');
  const posterZoomClose = document.getElementById('poster-zoom-close');
  const posterZoomBackdrop = document.querySelector('.poster-zoom-backdrop');

  const openPosterZoom = () => {
    if (!posterZoomModal || !modalImg || !modalImg.src) return;
    posterZoomImg.src = modalImg.src;
    posterZoomModal.classList.add('open');
    playSound('open');
  };

  const closePosterZoom = () => {
    if (!posterZoomModal) return;
    posterZoomModal.classList.remove('open');
    playSound('click');
  };

  let currentModalProjectKey = 'cctv';
  let currentModalTab = 'overview';

  const setModalTab = (tabKey) => {
    currentModalTab = tabKey;
    const data = PROJECT_DATA[currentModalProjectKey];
    if (!data) return;

    document.querySelectorAll('.modal-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
    });

    if (data.tabs && data.tabs[tabKey]) {
      modalDesc.innerHTML = data.tabs[tabKey];
    } else if (data.desc) {
      modalDesc.innerHTML = data.desc;
    }
  };

  const openModal = (key) => {
    const data = PROJECT_DATA[key];
    if (!data || !modal) return;

    currentModalProjectKey = key;
    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalImg.src = data.img;

    setModalTab('overview');

    if (modalLiveBtn) {
      if (data.liveUrl) {
        modalLiveBtn.href = data.liveUrl;
        modalLiveBtn.style.display = 'inline-flex';
      } else {
        modalLiveBtn.style.display = 'none';
      }
    }

    if (modalGithubBtn) {
      if (data.githubUrl) {
        modalGithubBtn.href = data.githubUrl;
        modalGithubBtn.style.display = 'inline-flex';
      } else {
        modalGithubBtn.style.display = 'none';
      }
    }

    modal.classList.add('open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    playSound('open');
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    playSound('click');
  };

  // Category filter
  const initProjectFilter = () => {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');
        filterTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        playSound('click');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  };

  const initProjectModal = () => {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('click', () => {
        const key = card.getAttribute('data-project');
        if (key) openModal(key);
      });
    });

    document.querySelectorAll('.modal-tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tab = btn.getAttribute('data-tab');
        if (tab) {
          playSound('click');
          setModalTab(tab);
        }
      });
    });

    const mobileExpandPosterBtn = document.getElementById('mobile-expand-poster-btn');
    const modalPosterViewBtn = document.getElementById('modal-poster-view-btn');

    if (modalMediaWrap) {
      modalMediaWrap.addEventListener('click', openPosterZoom);
    }
    if (mobileExpandPosterBtn) {
      mobileExpandPosterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPosterZoom();
      });
    }
    if (modalPosterViewBtn) {
      modalPosterViewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPosterZoom();
      });
    }

    if (posterZoomClose) posterZoomClose.addEventListener('click', closePosterZoom);
    if (posterZoomBackdrop) posterZoomBackdrop.addEventListener('click', closePosterZoom);

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (posterZoomModal && posterZoomModal.classList.contains('open')) {
          closePosterZoom();
        } else if (modal && modal.classList.contains('open')) {
          closeModal();
        }
      }
    });
  };

  // Event Listeners
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', () => {
    targetProgress = getScrollProgress();
    updateActiveDock();
  }, { passive: true });

  // Initialize
  const init = () => {
    resizeCanvas();
    preloadImages();
    targetProgress = getScrollProgress();
    currentProgress = targetProgress;
    initThemeSwitcher();
    initAudioToggle();
    initTerminal();
    init3DTilt();
    initIntentSelector();
    initSkillHighlights();
    initCursorGlow();
    initScrollReveal();
    initClickToCopy();
    initProjectFilter();
    initProjectModal();
    updateLiveTime();
    setInterval(updateLiveTime, 1000);
    requestAnimationFrame(updateLoop);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
