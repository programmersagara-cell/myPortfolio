/* ============================================================
   Core interactions — theme, nav, reveal, dashboard, SOC, matrix
   ============================================================ */
'use strict';

const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Apply admin-managed content overrides ---------- */
(function applyOverrides() {
  const o = window.CONTENT_OVERRIDES || {};
  if (o.stats) Object.assign(SITE_CONFIG.stats, o.stats);
  if (o.contact) Object.assign(SITE_CONFIG.contact, o.contact);
  if (o.about && Array.isArray(o.about.paragraphs) && o.about.paragraphs.length) SITE_CONFIG.about = o.about.paragraphs;
  if (Array.isArray(o.projects) && o.projects.length) { PROJECTS.splice(0, PROJECTS.length); PROJECTS.push.apply(PROJECTS, o.projects); }
  if (Array.isArray(o.timeline) && o.timeline.length) { TIMELINE.splice(0, TIMELINE.length); TIMELINE.push.apply(TIMELINE, o.timeline); }
  if (Array.isArray(o.certifications) && o.certifications.length) { CERTIFICATIONS.splice(0, CERTIFICATIONS.length); CERTIFICATIONS.push.apply(CERTIFICATIONS, o.certifications); }
})();

/* ---------- Render About from config ---------- */
(function renderAbout() {
  const el = document.getElementById('aboutBody');
  if (el) el.innerHTML = SITE_CONFIG.about.map(p => '<p>' + esc(p) + '</p>').join('');
})();

/* ---------- Rebuild resume tabs from possibly-overridden data ---------- */
(function rebuildResumeTabs() {
  if (typeof RESUME_TABS === 'undefined') return;
  RESUME_TABS.experience = '<h3>Experience</h3>' + TIMELINE.map(function (t) { return '<p><strong>' + esc(t.title) + '</strong> — ' + esc(t.period) + '<br>' + esc(t.desc) + '</p>'; }).join('<hr>');
  RESUME_TABS.projects = '<h3>Projects</h3>' + PROJECTS.map(function (p) { return '<p><strong>' + esc(p.title) + '</strong><br>' + esc(p.solution) + '</p>'; }).join('<hr>');
  RESUME_TABS.certifications = '<h3>Certifications</h3>' + CERTIFICATIONS.map(function (c) { return '<p><strong>' + esc(c.category) + '</strong>: ' + esc(c.name) + (c.year ? ' (' + esc(c.year) + ')' : '') + '</p>'; }).join('');
})();



/* ---------- Theme ---------- */
(function initTheme() {
  const saved = localStorage.getItem('jms-theme');
  if (saved) document.documentElement.dataset.theme = saved;
  $('#themeToggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('jms-theme', next);
  });
})();

/* ---------- Navigation ---------- */
(function initNav() {
  const toggle = $('#navToggle'), links = $('#navLinks');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', e => { if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); } });
  const sections = $$('main section[id]');
  const navA = $$('.nav-links a[href^="#"]');
  const onScroll = () => {
    let current = sections[0] && sections[0].id;
    sections.forEach(sec => { if (window.scrollY + 120 >= sec.offsetTop) current = sec.id; });
    navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    const doc = document.documentElement;
    $('#scrollProgress').style.width = (window.scrollY / (doc.scrollHeight - window.innerHeight) * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- Reveal on scroll ---------- */
(function initReveal() {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));
})();

/* ---------- Stats + year + sparklines ---------- */
$('#statProjects').textContent = SITE_CONFIG.stats.projects;
$('#statTech').textContent = SITE_CONFIG.stats.technologies;
$('#year').textContent = new Date().getFullYear();
$$('.spark').forEach(cv => {
  const ctx = cv.getContext('2d');
  ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.6; ctx.beginPath();
  for (let x = 0; x <= cv.width; x += 4) {
    let y = cv.dataset.trend === 'up'
      ? cv.height - 4 - (x / cv.width) * (cv.height - 10) - Math.sin(x / 9) * 3
      : cv.height / 2 - Math.sin(x / 7) * 5 - Math.cos(x / 13) * 3;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
});
$$('.uptime-bar').forEach(bar => { for (let i = 0; i < 30; i++) bar.appendChild(document.createElement('i')); });

/* ---------- SOC panel ---------- */
function renderSoc(key) {
  const m = SOC_MODULES[key]; if (!m) return;
  $('#socPanel').innerHTML =
    '<span class="soc-status mono">● ' + esc(m.status) + '</span>' +
    '<h3>' + esc(m.title) + '</h3>' +
    '<p class="muted">' + esc(m.desc) + '</p>' +
    '<ul>' + m.points.map(p => '<li>' + esc(p) + '</li>').join('') + '</ul>' +
    '<p class="soc-demo-note mono">SIMULATED PORTFOLIO VISUALIZATION — NOT A LIVE SECURITY SYSTEM.</p>';
}
renderSoc('endpoint');
$$('.soc-item').forEach(btn => btn.addEventListener('click', () => {
  $$('.soc-item').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
  renderSoc(btn.dataset.module);
}));

/* ---------- Skills matrix ---------- */
$('#skillsMatrix').innerHTML = SKILL_CATEGORIES.map(cat =>
  '<article class="card skill-cat"><h3><span aria-hidden="true">' + cat.icon + '</span> ' + esc(cat.name) + '</h3>' +
  cat.skills.map(pair =>
    '<div class="skill-row"><div class="skill-name"><span>' + esc(pair[0]) + '</span><span class="mono muted">' + pair[1] + '%</span></div>' +
    '<div class="bar"><span data-w="' + pair[1] + '"></span></div></div>'
  ).join('') + '</article>'
).join('');
const barIO = ('IntersectionObserver' in window) && new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { $$('.bar span', e.target).forEach(s => { s.style.width = s.dataset.w + '%'; }); barIO.unobserve(e.target); }
}), { threshold: 0.3 });
$$('.skill-cat').forEach(el => { if (barIO) barIO.observe(el); else $$('.bar span', el).forEach(s => s.style.width = s.dataset.w + '%'); });
