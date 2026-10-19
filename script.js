// ─── LOADER ───
const loaderTexts = ['initializing...','loading assets...','almost there...','ready!'];
let lt = 0;
const fill = document.getElementById('loaderFill');
const loaderEl = document.getElementById('loader');
const loaderTxt = document.getElementById('loaderText');
let pct = 0;
const iv = setInterval(() => {
  pct += Math.random() * 15 + 3;
  if (pct >= 100) { pct = 100; clearInterval(iv);
    loaderTxt.textContent = 'ready!';
    setTimeout(() => {
      loaderEl.classList.add('hide');
      animCounters();
    }, 400);
  }
  fill.style.width = pct + '%';
  const ti = Math.floor(pct / 34);
  if (loaderTexts[ti]) loaderTxt.textContent = loaderTexts[ti];
}, 70);

// ─── CURSOR ───
const cur = document.getElementById('cur');
const cur2 = document.getElementById('cur2');
let mx = window.innerWidth/2, my = window.innerHeight/2;
let rx = mx, ry = my;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function anim() {
  cur.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  cur2.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(anim);
})();
document.querySelectorAll('a,button,.skill-block,.pcard,.soc-btn,.filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ─── NAV SCROLL + ACTIVE ───
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const sections = ['skills','projects','about','contact'];
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backTop').classList.toggle('show', window.scrollY > 400);
  // active nav
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 200) current = id;
  });
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));
});

// ─── MOBILE MENU ───
function toggleMobile() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMobile() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileMenu').classList.remove('open');
}

// ─── THEME TOGGLE ───
let lightMode = false;
function toggleTheme() {
  lightMode = !lightMode;
  document.body.classList.toggle('light-mode', lightMode);
  document.querySelector('.theme-toggle').textContent = lightMode ? '🌙' : '☀️';
}

// ─── SCROLL REVEAL ───
const revObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.style.transitionDelay) || 0;
      setTimeout(() => {
        e.target.classList.add('vis');
        e.target.querySelectorAll('.sbar-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
      }, i * 60);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => revObs.observe(el));

// ─── COUNTER ANIMATION ───
function animCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let cur = 0;
    const step = target / 45;
    const iv2 = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(iv2); }
      el.textContent = Math.floor(cur) + suffix;
    }, 28);
  });
}

// ─── TYPEWRITER ───
const twPhrases = [
  'fast interfaces.',
  'scalable backends.',
  'beautiful UIs.',
  'real-world apps.',
  'clean, readable code.'
];
let twI = 0, twC = 0, twDel = false;
const twEl = document.getElementById('twText');
function tw() {
  const phrase = twPhrases[twI];
  if (!twDel) {
    twEl.textContent = phrase.slice(0, ++twC);
    if (twC === phrase.length) { twDel = true; setTimeout(tw, 1800); return; }
  } else {
    twEl.textContent = phrase.slice(0, --twC);
    if (twC === 0) { twDel = false; twI = (twI + 1) % twPhrases.length; setTimeout(tw, 350); return; }
  }
  setTimeout(tw, twDel ? 42 : 88);
}
setTimeout(tw, 1200);

// ─── PROJECT FILTER ───
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.pcard').forEach(card => {
      const cat = card.dataset.cat;
      const show = filter === 'all' || cat === filter;
      card.style.transition = 'opacity .3s, transform .3s';
      card.style.opacity = show ? '1' : '0';
      card.style.transform = show ? '' : 'scale(.96)';
      setTimeout(() => card.classList.toggle('hidden', !show), show ? 0 : 300);
      if (show) setTimeout(() => { card.style.opacity=''; card.style.transform=''; }, 10);
    });
  });
});

// ─── CONTACT FORM ───
function handleSend() {
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const msg = document.getElementById('fmessage').value.trim();
  const msgEl = document.getElementById('formMsg');
  const btn = document.getElementById('sendBtn');
  if (!name || !email || !msg) {
    msgEl.className = 'form-msg error show';
    msgEl.textContent = '⚠ Please fill in all required fields.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msgEl.className = 'form-msg error show';
    msgEl.textContent = '⚠ Please enter a valid email address.';
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(90deg,var(--a3),#80cc00)';
    msgEl.className = 'form-msg success show';
    msgEl.textContent = '✓ Thanks! I\'ll get back to you within 24 hours.';
    document.getElementById('fname').value='';
    document.getElementById('femail').value='';
    document.getElementById('fsubject').value='';
    document.getElementById('fmessage').value='';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Send Message →';
      btn.style.background = '';
    }, 4000);
  }, 1200);
}

// ─── BG CANVAS — PARTICLE NETWORK ───
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * .35; this.vy = (Math.random() - .5) * .35;
    this.r = Math.random() * 1.4 + .4;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
}
for (let i = 0; i < 70; i++) particles.push(new Particle());

// Mouse attraction
let pmx = W/2, pmy = H/2;
document.addEventListener('mousemove', e => { pmx = e.clientX; pmy = e.clientY; });

function draw() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    // subtle mouse attraction
    const dx2 = pmx - p.x, dy2 = pmy - p.y;
    const d2 = Math.sqrt(dx2*dx2+dy2*dy2);
    if (d2 < 200) { p.vx += dx2/d2*0.008; p.vy += dy2/d2*0.008; }
    // speed limit
    const spd = Math.sqrt(p.vx*p.vx+p.vy*p.vy);
    if (spd > 1.2) { p.vx *= 1.2/spd; p.vy *= 1.2/spd; }
    p.update();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,229,255,.35)';
    ctx.fill();
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,229,255,${.14*(1-dist/130)})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();