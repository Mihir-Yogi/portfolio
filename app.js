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

  // Modal elements
  const modal = document.getElementById('project-modal');
  const modalImg = document.getElementById('modal-img');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.querySelector('.modal-close');
  const modalBackdrop = document.querySelector('.modal-backdrop');

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

    // Smooth inertia interpolation (lerp)
    const lerpSpeed = 0.12;
    const delta = targetProgress - currentProgress;

    if (Math.abs(delta) > 0.00001) {
      currentProgress += delta * lerpSpeed;
    } else {
      currentProgress = targetProgress;
    }

    // Update scroll percentage indicator
    if (scrollPercentage) {
      const pct = Math.round(currentProgress * 100);
      scrollPercentage.textContent = `${pct}%`;
    }

    // Smooth dissolve and subtle parallax for the background PORTFOLIO typography
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
        if (loaderBar) {
          loaderBar.style.width = `${percent}%`;
        }
        if (loaderPercent) {
          loaderPercent.textContent = `${percent}%`;
        }

        // Draw first frame right away without waiting
        if (i === 0 && !firstFrameLoaded) {
          firstFrameLoaded = true;
          drawFrame(0);
        }

        // Hide preloader quickly when loaded
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
    modalDesc.textContent = data.desc;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
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
    initCursorGlow();
    initScrollReveal();
    initClickToCopy();
    initProjectModal();
    requestAnimationFrame(updateLoop);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
