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

  // Project data for modal lightbox
  const PROJECT_DATA = {
    suno: {
      badge: '01',
      title: 'SUNO CAMPUS PLATFORM',
      category: 'EVENT MANAGEMENT PLATFORM',
      img: 'assets/technexa.jpg',
      desc: `<p style="margin-bottom: 12px;"><strong>A centralized campus platform</strong> for managing hackathons, workshops, announcements, and opportunities.</p>
             <p style="margin-bottom: 10px;"><strong>Key Highlights:</strong><br>
             • Role-based access for Students, Admins, and Contributors<br>
             • Event search, registration, notifications, and wishlists<br>
             • Responsive user interfaces and routing<br>
             • REST API and JWT authentication integration</p>
             <p style="margin-bottom: 8px;"><strong>My Role:</strong> Frontend Developer</p>
             <p><strong>Tech Stack:</strong> React, Node.js, Express.js, MongoDB, JWT Authentication, REST APIs</p>`
    },
    cims: {
      badge: '02',
      title: 'CIMS — CCTV INFORMATION MANAGEMENT SYSTEM',
      category: 'CCTV INFORMATION MANAGEMENT SYSTEM',
      img: 'assets/creative_studio.jpg',
      desc: `<p style="margin-bottom: 12px;"><strong>An online system</strong> designed to track CCTV equipment inventory, status, and service history.</p>
             <p style="margin-bottom: 10px;"><strong>Key Highlights:</strong><br>
             • Multi-user access and status tracking<br>
             • Notifications for equipment malfunction<br>
             • Dashboard-based monitoring<br>
             • CRUD and database management<br>
             • Alert workflow for easier equipment monitoring</p>
             <p><strong>Technologies:</strong> Web Application, Database Management, CRUD, Multi-user Access, Alert Workflow, Dashboard</p>`
    }
  };

  // Generate file path for frame (1-based: ezgif-frame-001.jpg to ezgif-frame-147.jpg)
  const getFramePath = (index) => {
    const num = String(index + 1).padStart(3, '0');
    return `${FOLDER_NAME}/ezgif-frame-${num}.jpg`;
  };

  // High-DPI canvas resize with crisp rendering
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

  // Draw image frame centered preserving natural aspect ratio
  const drawFrame = (index) => {
    let img = images[index];

    // Fallback to nearest loaded frame if specific frame is not ready
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

    const imgRatio = imgW / imgH;
    const screenRatio = screenW / screenH;

    let drawW, drawH, drawX, drawY;

    if (screenRatio > imgRatio) {
      drawH = screenH;
      drawW = screenH * imgRatio;
    } else {
      drawW = screenW;
      drawH = screenW / imgRatio;
    }

    drawX = (screenW - drawW) / 2;
    drawY = (screenH - drawH) / 2;

    ctx.clearRect(0, 0, screenW, screenH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    lastDrawnFrame = index;
  };

  // Compute scroll fraction (0.0 to 1.0)
  const getScrollProgress = () => {
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const maxScroll = Math.max(1, (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight);
    return Math.min(1, Math.max(0, scrollTop / maxScroll));
  };

  // Update floating dock active state based on scroll position
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

  // Smooth inertial animation loop
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

    // Smooth dissolve and parallax for background DEVELOPER text
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

  // Instant parallel image preloading
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

  // Web Audio Synthesizer Engine (Zero external audio files)
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

  // Theme Accent Palette Switcher
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

  // Real-Time Local IST Clock for Gujarat, India
  const updateLiveTime = () => {
    if (!liveTimeBadge) return;
    const now = new Date();
    // Format to Indian Standard Time (IST)
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

  // 3D Tilt Physics for Cards
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

  // Interactive Developer Terminal Modal & CLI Engine
  const initTerminal = () => {
    const openTerminal = () => {
      if (!terminalModal) return;
      terminalModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      playSound('open');
      if (terminalInput) {
        setTimeout(() => terminalInput.focus(), 100);
      }
    };

    const closeTerminal = () => {
      if (!terminalModal) return;
      terminalModal.classList.remove('open');
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
            • <strong style="color:#fff;">skills</strong> — View programming languages, frameworks & databases<br>
            • <strong style="color:#fff;">projects</strong> — List featured engineering projects<br>
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
            <div style="color:var(--primary-red); font-weight:700;">[TECHNICAL CAPABILITIES]</div>
            • <strong>Languages:</strong> Python, JavaScript (ES6+), SQL, HTML5, CSS3<br>
            • <strong>Frameworks & Libs:</strong> React.js, Node.js, Express.js, RESTful APIs<br>
            • <strong>Databases:</strong> MongoDB, MySQL<br>
            • <strong>Developer Tools:</strong> Git, GitHub, JWT Auth, Postman, Linux CLI
          `);
          break;

        case 'projects':
          printToTerminal(`
            <div style="color:var(--primary-red); font-weight:700;">[FEATURED ENGINEERING PROJECTS]</div>
            1. <strong>SUNO CAMPUS PLATFORM</strong> (React, Node, Express, MongoDB, JWT)<br>
               <em>A centralized campus event management portal with role-based access.</em><br>
            2. <strong>CIMS</strong> (CCTV Information Management System)<br>
               <em>Equipment tracking, CRUD inventory management, and automated alert workflow.</em>
          `);
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

  // Interactive Quick Inquiry Intent Selector (Contact Section)
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

  // Interactive Skill Tag Highlight Feature
  const initSkillHighlights = () => {
    document.querySelectorAll('.skill-tag[data-tech]').forEach((tag) => {
      tag.addEventListener('click', () => {
        const tech = tag.getAttribute('data-tech');
        playSound('click');

        // Flash related project card
        if (['react', 'node', 'express', 'mongo', 'js'].includes(tech)) {
          const sunoCard = document.querySelector('[data-project="suno"]');
          if (sunoCard) {
            sunoCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            sunoCard.style.boxShadow = '0 0 35px var(--primary-red)';
            setTimeout(() => {
              sunoCard.style.boxShadow = '';
            }, 1800);
            showToast(`🔥 ${tag.textContent} is used in "Suno Campus Platform"!`);
          }
        } else {
          showToast(`⚡ Skill: ${tag.textContent}`);
        }
      });
    });
  };

  // Interactive Cursor Glow Tracker
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

  // Scroll Reveal Observer
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

  // Toast Notification Helper
  const showToast = (message = '✓ Copied to clipboard!') => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  };

  // Click to Copy Feature
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

  // Project Modal Lightbox
  const openModal = (key) => {
    const data = PROJECT_DATA[key];
    if (!data || !modal) return;

    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalImg.src = data.img;
    modalDesc.innerHTML = data.desc;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    playSound('open');
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    playSound('click');
  };

  const initProjectModal = () => {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('click', () => {
        const key = card.getAttribute('data-project');
        if (key) openModal(key);
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
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
