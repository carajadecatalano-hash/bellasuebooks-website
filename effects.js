// ── Scroll reveal ──────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.book-card, .about-card, .newsletter-card, .section-header, .page-header')
  .forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

// ── Hero sparkles ───────────────────────────────────────────────
const hero = document.querySelector('.hero');
if (hero) {
  hero.style.position = 'relative';
  hero.style.overflow = 'hidden';

  const GLYPHS = ['✨', '⭐', '🌟', '💫', '🍬', '🌈'];

  function createSparkle() {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    s.style.left   = (5 + Math.random() * 90) + '%';
    s.style.bottom = (Math.random() * 40) + '%';
    s.style.fontSize = (0.65 + Math.random() * 0.75) + 'rem';
    const dur = 1.8 + Math.random() * 2.2;
    s.style.setProperty('--dur', dur + 's');
    s.style.animationDuration = dur + 's';
    hero.appendChild(s);
    setTimeout(() => s.remove(), dur * 1000);
  }

  setInterval(createSparkle, 380);
  // burst on load
  for (let i = 0; i < 6; i++) setTimeout(createSparkle, i * 120);
}

// ── Button ripple on click ──────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn:not(.btn-soon)');
  if (!btn) return;
  btn.classList.remove('btn-pop');
  void btn.offsetWidth; // reflow
  btn.classList.add('btn-pop');
  btn.addEventListener('animationend', () => btn.classList.remove('btn-pop'), { once: true });
});

// ── Book card tilt on mousemove ─────────────────────────────────
document.querySelectorAll('.book-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
    card.style.transform = `translateY(-4px) rotateY(${x}deg) rotateX(${y}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Scroll progress bar ─────────────────────────────────────────
const scrollBar = document.createElement('div');
scrollBar.id = 'scroll-bar';
document.body.appendChild(scrollBar);
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

// ── Cursor sparkle trail (hero only) ───────────────────────────
const TRAIL_COLORS = ['#FF69B4', '#FF6B35', '#00C8E8', '#FFD700', '#FF1493'];
let trailCount = 0;
document.addEventListener('mousemove', e => {
  if (++trailCount % 3 !== 0) return;
  if (!hero) return;
  const hr = hero.getBoundingClientRect();
  if (e.clientX < hr.left || e.clientX > hr.right || e.clientY < hr.top || e.clientY > hr.bottom) return;
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.style.left = e.clientX + 'px';
  dot.style.top  = e.clientY + 'px';
  dot.style.background = TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
  document.body.appendChild(dot);
  setTimeout(() => dot.remove(), 700);
});

// ── Section header underline sweep (reveal-triggered) ──────────
const hdrObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('hdr-visible'); });
}, { threshold: 0.3 });
document.querySelectorAll('.section-header').forEach(el => hdrObserver.observe(el));

// ── Series badge count-up ───────────────────────────────────────
function countUp(el) {
  const match = el.textContent.match(/^(\d+)/);
  if (!match) return;
  const target = parseInt(match[1]);
  let current = 0;
  el.textContent = el.textContent.replace(/^\d+/, '0');
  const step = () => {
    current++;
    el.textContent = el.textContent.replace(/^\d+/, current);
    if (current < target) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const badgeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); badgeObserver.unobserve(e.target); } });
}, { threshold: 1.0 });
document.querySelectorAll('.series-badge').forEach(el => badgeObserver.observe(el));

// ── Hero headline word-by-word reveal + "magical" sparkles ─────
const heroH1 = document.querySelector('.hero-text h1');
if (heroH1) {
  // Walk DOM nodes — wrap text words in spans without touching element nodes
  const children = Array.from(heroH1.childNodes);
  heroH1.innerHTML = '';
  children.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          heroH1.appendChild(document.createTextNode(part));
        } else {
          const s = document.createElement('span');
          s.className = 'word-reveal';
          s.textContent = part;
          heroH1.appendChild(s);
        }
      });
    } else {
      heroH1.appendChild(node);
    }
  });

  heroH1.querySelectorAll('.word-reveal').forEach((span, i) => {
    span.style.animationDelay = (0.15 + i * 0.12) + 's';
  });

  // Sparkles off "magical"
  const magical = heroH1.querySelector('em');
  if (magical && hero) {
    setInterval(() => {
      const rect     = magical.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = ['✨','⭐','💫','🌟'][Math.floor(Math.random() * 4)];
      s.style.left     = (rect.left - heroRect.left + Math.random() * rect.width) + 'px';
      s.style.top      = (rect.top  - heroRect.top  + Math.random() * rect.height) + 'px';
      s.style.fontSize = '0.7rem';
      const dur = 1 + Math.random();
      s.style.setProperty('--dur', dur + 's');
      hero.appendChild(s);
      setTimeout(() => s.remove(), dur * 1000);
    }, 300);
  }
}

// ── Free-flying butterfly (desktop only) ───────────────────────
if (hero && window.matchMedia('(min-width: 701px)').matches) {
  const bf2 = document.createElement('div');
  bf2.className = 'hero-butterfly-free';
  bf2.innerHTML = `<svg viewBox="0 0 100 72" xmlns="http://www.w3.org/2000/svg">
    <g class="bf2-left">
      <ellipse cx="29" cy="26" rx="25" ry="19" fill="#00C8E8"/>
      <ellipse cx="24" cy="49" rx="14" ry="10" fill="#4169E1"/>
      <ellipse cx="24" cy="23" rx="11" ry="9"  fill="#FFD700" opacity="0.55"/>
      <ellipse cx="21" cy="48" rx="6"  ry="5"  fill="#00AACC" opacity="0.55"/>
      <circle cx="16" cy="17" r="3.5" fill="#fff" opacity="0.75"/>
      <circle cx="9"  cy="30" r="2.5" fill="#fff" opacity="0.55"/>
      <circle cx="28" cy="13" r="2"   fill="#fff" opacity="0.65"/>
      <circle cx="15" cy="47" r="2.5" fill="#FFD700" opacity="0.85"/>
      <circle cx="25" cy="55" r="1.5" fill="#fff" opacity="0.6"/>
    </g>
    <g class="bf2-right">
      <ellipse cx="71" cy="26" rx="25" ry="19" fill="#4AE0A0"/>
      <ellipse cx="76" cy="49" rx="14" ry="10" fill="#00C8E8"/>
      <ellipse cx="76" cy="23" rx="11" ry="9"  fill="#FFD700" opacity="0.55"/>
      <ellipse cx="79" cy="48" rx="6"  ry="5"  fill="#4AE0A0" opacity="0.55"/>
      <circle cx="84" cy="17" r="3.5" fill="#fff" opacity="0.75"/>
      <circle cx="91" cy="30" r="2.5" fill="#fff" opacity="0.55"/>
      <circle cx="72" cy="13" r="2"   fill="#fff" opacity="0.65"/>
      <circle cx="85" cy="47" r="2.5" fill="#FFD700" opacity="0.85"/>
      <circle cx="75" cy="55" r="1.5" fill="#fff" opacity="0.6"/>
    </g>
    <ellipse cx="50" cy="37" rx="3" ry="15" fill="#1a2c1a"/>
    <path d="M48 22 C44 13 37 9 34 6" stroke="#1a2c1a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="34" cy="6" r="2.5" fill="#FFD700"/>
    <path d="M52 22 C56 13 63 9 66 6" stroke="#1a2c1a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="66" cy="6" r="2.5" fill="#FFD700"/>
  </svg>`;
  hero.appendChild(bf2);

  let bfX = 80, bfY = 40;
  bf2.style.left      = bfX + 'px';
  bf2.style.top       = bfY + 'px';
  bf2.style.transform = 'rotate(0deg)';

  function bfFlyNext() {
    const w   = hero.offsetWidth;
    const h   = hero.offsetHeight;
    const tx  = 12 + Math.random() * (w - 70);
    const ty  = 8  + Math.random() * (h - 55);
    const dur = 1800 + Math.random() * 2600;

    // Always use positive tilt — scaleX(-1) flip inverts visual rotation,
    // so +angle looks like banking-right when facing right, banking-left when facing left.
    const tilt    = 8 + Math.random() * 18 + (Math.random() * 12 - 6);
    const flipStr = tx < bfX ? 'scaleX(-1)' : 'scaleX(1)';

    bf2.style.transition = `left ${dur}ms cubic-bezier(0.45,0.05,0.55,0.95), top ${dur}ms cubic-bezier(0.25,0.46,0.45,0.94), transform ${dur * 0.6}ms ease-in-out`;
    bf2.style.transform  = `${flipStr} rotate(${tilt}deg)`;
    bf2.style.left = tx + 'px';
    bf2.style.top  = ty + 'px';
    bfX = tx; bfY = ty;

    setTimeout(bfFlyNext, dur + 200 + Math.random() * 700);
  }

  setTimeout(bfFlyNext, 1200);
}

// ── Lightbox ────────────────────────────────────────────────────
const lb = document.createElement('div');
lb.id = 'lightbox';
lb.innerHTML = `
  <div class="lb-backdrop"></div>
  <div class="lb-content">
    <button class="lb-close" aria-label="Close">✕</button>
    <img class="lb-img" src="" alt="">
  </div>`;
document.body.appendChild(lb);

function openLightbox(src, alt) {
  lb.querySelector('.lb-img').src = src;
  lb.querySelector('.lb-img').alt = alt || '';
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.book-card img.cover, .hero-book img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    openLightbox(img.src, img.alt);
  });
});

lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ── Page fade-in on load ────────────────────────────────────────
document.body.classList.add('page-loading');
window.addEventListener('load', () => {
  document.body.classList.remove('page-loading');
  document.body.classList.add('page-loaded');
});

// ── Cherry blossom flying petals ───────────────────────────────
(function blossomPetals() {
  const container = document.querySelector('.blossom-petals');
  if (!container) return;

  const COLORS = ['#FFB7C5','#FF69B4','#FF8FAB','#FFD1DC','#fff'];

  // Spawn zones match the tripled blossom clusters across all branches
  const SPAWN_ZONES = [
    { x: [20,  110], y: [40,  130] }, // left branches
    { x: [120, 245], y: [2,   80]  }, // center branches
    { x: [240, 290], y: [78,  160] }, // right branches
    { x: [130, 220], y: [138, 180] }, // trunk junction + far-right mid
  ];

  function spawnPetal() {
    const p  = document.createElement('div');
    const sz = 6 + Math.random() * 11;
    const zone = SPAWN_ZONES[Math.floor(Math.random() * SPAWN_ZONES.length)];
    const startX = zone.x[0] + Math.random() * (zone.x[1] - zone.x[0]);
    const startY = zone.y[0] + Math.random() * (zone.y[1] - zone.y[0]);

    // Alternate petal shapes for variety
    const shapes = ['50% 0 50% 0', '60% 40% 60% 40%', '50% 50% 0 50%', '40% 60% 40% 60%'];
    p.style.cssText = `
      position:absolute;
      width:${sz}px; height:${sz * 0.65}px;
      left:${startX}px; top:${startY}px;
      background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
      border-radius:${shapes[Math.floor(Math.random() * shapes.length)]};
      pointer-events:none;
      opacity:0;
      filter: drop-shadow(0 1px 2px rgba(255,105,180,0.3));
    `;
    container.appendChild(p);

    // Petals drift outward from their zone — wider horizontal spread
    const driftX = (Math.random() - 0.4) * 200;
    const driftY = 140 + Math.random() * 220;
    const rot    = 200 + Math.random() * 400;
    const dur    = 2500 + Math.random() * 3500;
    // Mid-flight sway for a floating feel
    const swayX  = driftX * 0.5 + (Math.random() - 0.5) * 60;

    p.animate([
      { opacity: 0,   transform: `translate(0,0) rotate(0deg) scale(1)` },
      { opacity: 0.95, transform: `translate(${swayX}px,${driftY * 0.35}px) rotate(${rot * 0.4}deg) scale(0.9)`, offset: 0.3 },
      { opacity: 0.7, transform: `translate(${driftX}px,${driftY * 0.7}px) rotate(${rot * 0.75}deg) scale(0.7)`, offset: 0.72 },
      { opacity: 0,   transform: `translate(${driftX * 1.1}px,${driftY}px) rotate(${rot}deg) scale(0.4)` }
    ], { duration: dur, easing: 'ease-in', fill: 'forwards' })
      .finished.then(() => p.remove());
  }

  // Sparkle flash on blossom clusters
  const treeSvg = document.querySelector('.blossom-tree-svg');
  function spawnBlossomSparkle() {
    if (!treeSvg) return;
    const zone = SPAWN_ZONES[Math.floor(Math.random() * SPAWN_ZONES.length)];
    const s = document.createElement('span');
    s.style.cssText = `
      position:absolute;
      font-size:${0.45 + Math.random() * 0.7}rem;
      left:${zone.x[0] + Math.random() * (zone.x[1] - zone.x[0])}px;
      top:${zone.y[0] + Math.random() * (zone.y[1] - zone.y[0])}px;
      pointer-events:none;
      opacity:0;
    `;
    s.textContent = ['✨','💫','🌸','⭐','🌸','🌸'][Math.floor(Math.random() * 6)];
    container.appendChild(s);
    s.animate([
      { opacity:0, transform:'scale(0.4) rotate(-15deg)' },
      { opacity:1, transform:'scale(1.3) rotate(5deg)',  offset:0.35 },
      { opacity:0, transform:'scale(0.7) rotate(10deg)' }
    ], { duration: 1000 + Math.random() * 900, easing:'ease-in-out', fill:'forwards' })
      .finished.then(() => s.remove());
  }

  // Spawn 2 petals per tick for a dense shower, staggered
  setInterval(() => { spawnPetal(); if (Math.random() > 0.4) spawnPetal(); }, 160);
  setInterval(spawnBlossomSparkle, 500);
  // Initial burst of petals from all zones
  for (let i = 0; i < 16; i++) setTimeout(spawnPetal, i * 80);
})();


// ── Logo bounce on load ─────────────────────────────────────────
const logoName = document.querySelector('.logo-name');
if (logoName) {
  logoName.classList.add('logo-bounce');
  logoName.addEventListener('animationend', () => logoName.classList.remove('logo-bounce'), { once: true });
}

// ── Scroll-to-top button ────────────────────────────────────────
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scroll-top';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
scrollTopBtn.textContent = '↑';
document.body.appendChild(scrollTopBtn);
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) scrollTopBtn.classList.add('visible');
  else scrollTopBtn.classList.remove('visible');
}, { passive: true });
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
