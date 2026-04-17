/* ================================================
   ドラゴンフェスティバル  Main JS — Festival Fantasy
   統合版: Proposal Three のアニメーション強化
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  setupNav();
  setupFAQ();
  setupScrollFade();
  setupFireworks();
  setupMagicParticles();
  setupPhotoModal();
});

/* ---- Navigation ---- */
function setupNav() {
  const header     = document.querySelector('.site-header');
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  if (!hamburger || !mobileMenu) return;

  // ─────────────────────────────────────────────────────────────
  // Critical fix: move .mobile-menu to <body> direct child.
  // .site-header has backdrop-filter which creates a new containing
  // block for position:fixed descendants, trapping the menu inside
  // the 70px header. Moving to <body> restores viewport sizing.
  // ─────────────────────────────────────────────────────────────
  document.body.appendChild(mobileMenu);

  // Build overlay + drawer structure.
  // Wrap all existing children in .mm-drawer (the slide-in panel).
  const drawer = document.createElement('div');
  drawer.className = 'mm-drawer';
  while (mobileMenu.firstChild) drawer.appendChild(mobileMenu.firstChild);
  mobileMenu.appendChild(drawer);

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function openMobileMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.scrollTop = 0;
  }

  hamburger.addEventListener('click', () => {
    if (hamburger.classList.contains('open')) { closeMobileMenu(); } else { openMobileMenu(); }
  });

  // Close on any link click inside drawer
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Backdrop click: clicking the overlay area outside the drawer closes the menu
  mobileMenu.addEventListener('click', e => {
    if (!drawer.contains(e.target)) closeMobileMenu();
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
  });
}

/* ---- FAQ accordion ---- */
function setupFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-q');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ---- Scroll fade-in ---- */
function setupScrollFade() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.10 });

  els.forEach(el => io.observe(el));
}

/* ---- Firework bursts (Proposal Three 実装) ---- */
function setupFireworks() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
  document.body.appendChild(overlay);

  // 昼間の花火カラーパレット（明るく鮮やか）
  const colors = [
    '#FFD040','#FFE880','#E88800',   // gold family
    '#FF4488','#FF90BB',              // ruby/pink family
    '#40E8A0','#88FFD0',              // emerald family
    '#60B8FF','#B0D8FF',              // sky family
    '#C880FF','#E0B8FF',              // purple family
    '#FFFFFF','#FFF8D0'               // white / warm white
  ];

  function burst() {
    const x = window.innerWidth  * (0.07 + Math.random() * 0.86);
    const y = window.innerHeight * (0.08 + Math.random() * 0.54);
    const n = 16 + Math.floor(Math.random() * 12);
    const baseColor = colors[Math.floor(Math.random() * colors.length)];

    // Center flash
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:absolute;left:${x}px;top:${y}px;
      width:18px;height:18px;border-radius:50%;
      background:white;
      box-shadow:0 0 24px 10px ${baseColor}, 0 0 50px 20px ${baseColor}55;
      pointer-events:none;
    `;
    overlay.appendChild(flash);
    flash.animate([
      { transform:'translate(-50%,-50%) scale(0)',  opacity:1 },
      { transform:'translate(-50%,-50%) scale(2.5)',opacity:.92, offset:.18 },
      { transform:'translate(-50%,-50%) scale(0)',  opacity:0 }
    ], { duration:550, easing:'ease-out', fill:'forwards' })
    .finished.then(() => flash.remove());

    // Radial particles
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist  = 72 + Math.random() * 110;
      const size  = 4 + Math.random() * 7;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const dot   = document.createElement('div');
      dot.style.cssText = `
        position:absolute;left:${x}px;top:${y}px;
        width:${size}px;height:${size}px;border-radius:50%;
        background:${color};
        box-shadow:0 0 ${size * 1.6}px ${color}, 0 0 ${size * 3}px ${color}66;
        pointer-events:none;
      `;
      overlay.appendChild(dot);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      dot.animate([
        { transform:`translate(-50%,-50%) scale(1.4)`, opacity:.94 },
        { transform:`translate(calc(-50% + ${tx}px),calc(-50% + ${ty * 0.6}px)) scale(.8)`, opacity:.7, offset:.35 },
        { transform:`translate(calc(-50% + ${tx * 1.1}px),calc(-50% + ${ty + 40}px)) scale(0)`, opacity:0 }
      ], { duration: 1000 + Math.random() * 800, easing:'ease-in', fill:'forwards' })
      .finished.then(() => dot.remove());
    }

    // Trail streaks (縦方向の流れ)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const dist  = 40 + Math.random() * 60;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const streak = document.createElement('div');
      const len = 12 + Math.random() * 18;
      streak.style.cssText = `
        position:absolute;left:${x}px;top:${y}px;
        width:2px;height:${len}px;
        background:linear-gradient(to bottom,${color},transparent);
        border-radius:2px;
        pointer-events:none;
        transform-origin: top center;
      `;
      overlay.appendChild(streak);
      const tx2 = Math.cos(angle) * dist;
      const ty2 = Math.sin(angle) * dist;
      streak.animate([
        { transform:`translate(-50%,-50%) rotate(${angle * 180/Math.PI + 90}deg) scale(1)`, opacity:.85 },
        { transform:`translate(calc(-50% + ${tx2}px),calc(-50% + ${ty2}px)) rotate(${angle * 180/Math.PI + 90}deg) scale(0)`, opacity:0 }
      ], { duration:700 + Math.random()*400, easing:'ease-out', fill:'forwards' })
      .finished.then(() => streak.remove());
    }

    // Next burst 3–6 s（頻度を落とす）
    setTimeout(burst, 3000 + Math.random() * 3000);
  }

  setTimeout(burst, 1200);
  setTimeout(burst, 2800 + Math.random() * 500);
}

/* ---- Magic floating particles: glowing diamonds + rune symbols ---- */
function setupMagicParticles() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
  document.body.appendChild(overlay);

  const colors = ['#FFD040','#80C8FF','#D090FF','#50E8A8','#FF9050','#FFEE80'];
  const runes  = ['✦','✧','✶','✴','⟡','✷','◈','⬡'];

  /* Type A: glowing rotating diamond */
  function spawnDiamond() {
    const size  = 8 + Math.random() * 14;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const el    = document.createElement('div');
    el.style.cssText = `
      position:absolute;
      left:${Math.random()*100}%;
      top:${8 + Math.random()*75}%;
      width:${size}px;height:${size}px;
      transform:translate(-50%,-50%) rotate(45deg);
      background:${color};
      box-shadow:0 0 ${size*1.6}px ${color},0 0 ${size*3}px ${color}66;
      pointer-events:none;
    `;
    overlay.appendChild(el);
    const rise     = 72 + Math.random() * 88;
    const drift    = (Math.random() - .5) * 44;
    const startRot = Math.random() * 360;
    el.animate([
      { transform:`translate(-50%,-50%) rotate(${startRot}deg) scale(0)`,    opacity:0 },
      { transform:`translate(-50%,-50%) rotate(${startRot+90}deg) scale(1)`, opacity:.90, offset:.18 },
      { transform:`translate(calc(-50% + ${drift}px),calc(-50% - ${rise}px)) rotate(${startRot+300}deg) scale(.08)`, opacity:0 }
    ], { duration: 2800 + Math.random()*2800, easing:'ease-out', fill:'forwards' })
    .finished.then(() => el.remove());
  }

  /* Type B: glowing rune symbol */
  function spawnRune() {
    const size  = 14 + Math.random() * 16;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const el    = document.createElement('div');
    el.textContent = runes[Math.floor(Math.random() * runes.length)];
    el.style.cssText = `
      position:absolute;
      left:${Math.random()*100}%;
      top:${8 + Math.random()*75}%;
      font-size:${size}px;line-height:1;
      color:${color};
      text-shadow:0 0 8px ${color},0 0 22px ${color}AA,0 0 40px ${color}55;
      pointer-events:none;user-select:none;
    `;
    overlay.appendChild(el);
    const rise  = 68 + Math.random() * 80;
    const drift = (Math.random() - .5) * 38;
    const rot   = 150 + Math.random() * 260;
    el.animate([
      { transform:`translate(-50%,-50%) scale(.2) rotate(0deg)`,             opacity:0 },
      { transform:`translate(-50%,-50%) scale(1.1) rotate(${rot*.3}deg)`,    opacity:.92, offset:.20 },
      { transform:`translate(calc(-50% + ${drift}px),calc(-50% - ${rise}px)) scale(.06) rotate(${rot}deg)`, opacity:0 }
    ], { duration: 3100 + Math.random()*3000, easing:'ease-out', fill:'forwards' })
    .finished.then(() => el.remove());
  }

  /* Type C: small glowing orbs (Proposal One スタイルの浮遊ドット) */
  function spawnOrb() {
    const size  = 5 + Math.random() * 8;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const el    = document.createElement('div');
    el.style.cssText = `
      position:absolute;
      left:${Math.random()*95}%;
      top:${15 + Math.random()*70}%;
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};
      box-shadow:0 0 ${size*2}px ${color}BB, 0 0 ${size*4}px ${color}44;
      pointer-events:none;
    `;
    overlay.appendChild(el);
    const rise  = 55 + Math.random() * 65;
    const drift = (Math.random() - .5) * 30;
    el.animate([
      { transform:'translate(-50%,-50%) scale(0)', opacity:0 },
      { transform:'translate(-50%,-50%) scale(1)', opacity:.8, offset:.15 },
      { transform:`translate(calc(-50% + ${drift}px),calc(-50% - ${rise}px)) scale(.3)`, opacity:0 }
    ], { duration: 2200 + Math.random()*2000, easing:'ease-out', fill:'forwards' })
    .finished.then(() => el.remove());
  }

  // 頻度を落とす: 480ms ごと、パターンも少なめ
  let tick = 0;
  setInterval(() => {
    const t = tick++ % 4;
    if      (t === 1) spawnRune();
    else if (t === 3) spawnOrb();
    else              spawnDiamond();
  }, 480);
}

/* ---- Photo Modal ---- */
function setupPhotoModal() {
  const modal = document.getElementById('photo-modal');
  if (!modal) return;

  const modalImg = document.getElementById('photo-modal-img');
  const closeBtn = modal.querySelector('.photo-modal-close');
  const bg       = modal.querySelector('.photo-modal-bg');

  document.querySelectorAll('.history-photo img').forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (bg)       bg.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
