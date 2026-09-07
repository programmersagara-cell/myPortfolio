/* ============================================================
   Sections — modal, lab, projects, ops, architecture, workflow,
   secure-by-design, timeline, certs, resume, contact
   ============================================================ */
'use strict';

/* ---------- Modal helpers ---------- */
let lastFocus = null;
function openModal(html) {
  lastFocus = document.activeElement;
  $('#modalContent').innerHTML = html;
  $('#modalOverlay').hidden = false;
  document.body.style.overflow = 'hidden';
  $('#modalClose').focus();
}
function closeModal() {
  $('#modalOverlay').hidden = true;
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
$('#modalClose').addEventListener('click', closeModal);
$('#modalOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!$('#modalOverlay').hidden) closeModal();
  if (!$('#terminalOverlay').hidden && typeof closeTerminal === 'function') closeTerminal();
});

/* ---------- Engineering Lab ---------- */
$('#labGrid').innerHTML = LAB_SKILLS.map((s, i) =>
  '<button class="lab-card" data-i="' + i + '" aria-haspopup="dialog"><h3>' + esc(s.name) + '</h3>' +
  '<span class="lab-level ' + s.level.replace(/\s+/g, '') + '">' + esc(s.level.toUpperCase()) + '</span></button>'
).join('');
$$('#labGrid .lab-card').forEach(btn => btn.addEventListener('click', () => {
  const s = LAB_SKILLS[+btn.dataset.i];
  openModal(
    '<p class="tagline">ENGINEERING LAB</p><h3 id="modalTitle">' + esc(s.name) + '</h3>' +
    '<span class="badge">' + esc(s.level) + '</span>' +
    '<section><h4>What it is</h4><p class="muted">' + esc(s.what) + '</p></section>' +
    '<section><h4>How I use it</h4><p>' + esc(s.use) + '</p></section>' +
    '<section><h4>Example project</h4><p>' + esc(s.example) + '</p></section>' +
    '<section><h4>Related technologies</h4><div class="badge-row">' + s.related.map(r => '<span class="badge">' + esc(r) + '</span>').join('') + '</div></section>'
  );
}));

/* ---------- Projects ---------- */
const CAT_LABELS = { web: 'Web / Systems', infra: 'Infrastructure' };
function beforeAfterHtml(p) {
  const ba = p.beforeAfter; if (!ba) return '';
  return '<div class="ba-flow">' +
    '<div class="ba-step before"><strong>BEFORE</strong><br>' + esc(ba.before) + '</div>' +
    '<div class="ba-step"><strong>PROBLEMS</strong><br>' + ba.problems.map(esc).join('<br>') + '</div>' +
    '<div class="ba-step after"><strong>AFTER</strong><br>' + esc(ba.after) + '</div>' +
    '</div>' +
    (p.improvements ? '<p class="small muted">Measured impact: ' + esc(p.improvements) + '</p>' : '');
}
function projectModal(p) {
  return '<p class="tagline">' + esc(CAT_LABELS[p.category] || p.category).toUpperCase() + '</p>' +
    '<h3 id="modalTitle">' + esc(p.title) + '</h3>' +
    (p.screenshots.length
      ? p.screenshots.map(src => '<img src="' + esc(src) + '" alt="' + esc(p.title) + ' screenshot" loading="lazy" style="border-radius:9px;margin-bottom:1rem">').join('')
      : '<div class="screenshot-ph">SCREENSHOTS — ADD PROJECT INFORMATION</div>') +
    '<section><h4>Problem</h4><p class="muted">' + esc(p.problem) + '</p></section>' +
    '<section><h4>Solution</h4><p>' + esc(p.solution) + '</p></section>' +
    '<section><h4>My role</h4><p>' + esc(p.role) + '</p></section>' +
    '<section><h4>Key features</h4><ul class="check-list">' + p.features.map(f => '<li>' + esc(f) + '</li>').join('') + '</ul></section>' +
    '<section><h4>Security considerations</h4><ul class="check-list">' + p.security.map(f => '<li>🛡️ ' + esc(f) + '</li>').join('') + '</ul></section>' +
    '<section><h4>Technologies</h4><div class="badge-row">' + p.tech.map(t => '<span class="badge">' + esc(t) + '</span>').join('') + '</div></section>' +
    beforeAfterHtml(p) +
    ((p.github || p.demo)
      ? '<section><h4>Links</h4>' +
        (p.github ? '<a class="btn btn-sm btn-outline" href="' + esc(p.github) + '" target="_blank" rel="noopener noreferrer">GitHub ↗</a> ' : '') +
        (p.demo ? '<a class="btn btn-sm btn-outline" href="' + esc(p.demo) + '" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>' : '') + '</section>'
      : '');
}
function renderProjects(filter) {
  const list = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === filter);
  $('#projGrid').innerHTML = list.length ? list.map(p =>
    '<article class="card proj-card" tabindex="0" role="button" aria-haspopup="dialog" aria-label="Open details for ' + esc(p.title) + '" data-i="' + PROJECTS.indexOf(p) + '">' +
    '<div class="badge-row">' + p.tech.slice(0, 3).map(t => '<span class="badge">' + esc(t) + '</span>').join('') + '</div>' +
    '<h3>' + esc(p.title) + '</h3>' +
    '<p class="muted small">' + esc(p.solution) + '</p>' +
    '<span class="proj-more">View case study →</span></article>'
  ).join('') : '<p class="muted">No projects in this category yet.</p>';
  $$('#projGrid .proj-card').forEach(card => {
    card.addEventListener('click', () => openModal(projectModal(PROJECTS[+card.dataset.i])));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(projectModal(PROJECTS[+card.dataset.i])); } });
  });
}
const cats = ['all'].concat(Array.from(new Set(PROJECTS.map(p => p.category))));
$('#projectFilters').innerHTML = cats.map(c =>
  '<button class="filter-btn' + (c === 'all' ? ' active' : '') + '" data-cat="' + c + '">' + (c === 'all' ? 'All Projects (' + PROJECTS.length + ')' : esc(CAT_LABELS[c] || c)) + '</button>'
).join('');
$$('#projectFilters .filter-btn').forEach(btn => btn.addEventListener('click', () => {
  $$('#projectFilters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProjects(btn.dataset.cat);
}));

/* ---------- IT Operations ---------- */
$('#opsGrid').innerHTML = OPS_AREAS.map(a =>
  '<article class="card"><header><span class="card-icon" aria-hidden="true">' + a.icon + '</span><h3>' + esc(a.name) + '</h3></header>' +
  '<ul class="check-list">' + a.points.map(p => '<li>' + esc(p) + '</li>').join('') + '</ul></article>'
).join('');

/* ---------- Architecture diagram ---------- */
(function buildArch() {
  const node = l => '<button class="arch-node' + (/SECURITY/.test(l.label) ? ' sec' : '') + '" data-id="' + l.id + '">' + esc(l.label) + '</button>';
  $('#archDiagram').innerHTML =
    node(ARCH_LAYERS[0]) + '<span class="arch-arrow" aria-hidden="true">▼</span>' + node(ARCH_LAYERS[1]) +
    '<span class="arch-arrow" aria-hidden="true">▼</span>' +
    '<div class="arch-split">' + node(ARCH_LAYERS[2]) + '<span aria-hidden="true"></span>' + node(ARCH_LAYERS[3]) + '</div>' +
    '<div class="arch-split">' + node(ARCH_LAYERS[4]) + '<span aria-hidden="true"></span>' + node(ARCH_LAYERS[5]) + '</div>' +
    '<span class="arch-arrow" aria-hidden="true">▼</span>' + node(ARCH_LAYERS[6]) +
    '<span class="arch-arrow" aria-hidden="true">▼</span>' + node(ARCH_LAYERS[7]);
  $$('.arch-node').forEach(n => n.addEventListener('click', () => {
    $$('.arch-node').forEach(x => x.classList.remove('selected'));
    n.classList.add('selected');
    const layer = ARCH_LAYERS.find(l => l.id === n.dataset.id);
    $('#archInfo').innerHTML = '<h3>' + esc(layer.label) + '</h3><p>' + esc(layer.desc) + '</p>';
  }));
})();

/* ---------- Workflow ---------- */
$('#workflowList').innerHTML = WORKFLOW_STEPS.map(s =>
  '<li><span class="w-num">' + s[0] + '</span><strong>' + s[1] + '</strong><div class="muted small">' + esc(s[2]) + '</div></li>'
).join('');

/* ---------- Secure by Design ---------- */
$('#sbdGrid').innerHTML = SECURE_PRINCIPLES.map((pr, i) =>
  '<button class="sbd-card" data-i="' + i + '" aria-haspopup="dialog">' + esc(pr.name) + '</button>'
).join('');
$$('#sbdGrid .sbd-card').forEach(btn => btn.addEventListener('click', () => {
  const pr = SECURE_PRINCIPLES[+btn.dataset.i];
  openModal('<p class="tagline">SECURE BY DESIGN</p><h3 id="modalTitle">' + esc(pr.name) + '</h3>' +
    (pr.flow
      ? '<ol class="sbd-flow">' + pr.flow.map(f => '<li>' + esc(f) + '</li>').join('') + '</ol>'
      : '<p>' + esc(pr.detail) + '</p>'));
}));

/* ---------- Interactive resume ---------- */
(function initResume() {
  const keys = Object.keys(RESUME_TABS);
  const tabsEl = $('#resumeTabs');
  tabsEl.innerHTML = keys.map((k, i) =>
    '<button class="resume-tab' + (i === 0 ? ' active' : '') + '" role="tab" aria-selected="' + (i === 0) + '" data-k="' + k + '">' + k.toUpperCase() + '</button>'
  ).join('');
  function show(k) { $('#resumePanel').innerHTML = RESUME_TABS[k]; }
  tabsEl.addEventListener('click', e => {
    const b = e.target.closest('.resume-tab'); if (!b) return;
    $$('.resume-tab', tabsEl).forEach(x => { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
    b.classList.add('active'); b.setAttribute('aria-selected', 'true');
    show(b.dataset.k);
  });
  show(keys[0]);
  $('#resumeDownload').addEventListener('click', e => {
    if (SITE_CONFIG.resumeFile.indexOf('[') === 0) {
      e.preventDefault();
      const w = window.open('', '_blank');
      if (!w) return;
      w.document.write('<html><head><title>Justin Marcus Santiago - Resume</title>' +
        '<style>body{font-family:Segoe UI,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#16202f}h2{border-bottom:2px solid #22d3ee;padding-bottom:.2rem;margin-top:1.6rem}</style></head><body>' +
        '<h1>Justin Marcus Santiago</h1><p>IT Programmer &bull; Cybersecurity &bull; Systems &bull; Infrastructure</p>' +
        RESUME_TABS.profile.replace(/<em>\[[^\]]*\]<\/em>/g, '') +
        RESUME_TABS.experience.replace(/\[Add[^\]]*\]/g, '<em>[Add information]</em>') +
        RESUME_TABS.skills +
        '<p style="color:#888;font-size:.85rem">Set a real PDF filename in assets/js/config.js (resumeFile) to link your downloadable resume.</p>' +
        '</body></html>');
      w.document.close(); w.print();
    }
  });
})();

/* ---------- Contact links ---------- */
(function initContact() {
  const c = SITE_CONFIG.contact;
  const item = (label, val) => {
    if (!val || !val.trim()) return ''; // skip empty channels entirely
    if (val.indexOf('[') === 0)
      return '<li><span class="placeholder-box" style="padding:.45rem .9rem;display:inline-block">&#9656; ' + esc(val) + '</span></li>';
    return '<li><a href="' + esc(label === 'Email' ? 'mailto:' + val : val) + '" target="_blank" rel="noopener noreferrer">&#9656; <span>' + esc(label) + ': ' + esc(val) + '</span></a></li>';
  };
  const rows = [item('Email', c.email) + item('LinkedIn', c.linkedin) + item('GitHub', c.github) +
    item('Facebook', c.facebook) + item('Other', c.other)];
  $('#contactLinks').innerHTML = '<h3>Contact channels</h3><ul>' +
    (rows[0] || '<li><span class="placeholder-box" style="padding:.45rem .9rem;display:inline-block">&#9656; [Add contact channels]</span></li>') + '</ul>';
})();


/* ---------- Timeline & certifications ---------- */
$('#timeline').innerHTML = TIMELINE.map(t =>
  '<div class="tl-item"><span class="tl-period">' + esc(t.period) + '</span><h3>' + esc(t.title) + '</h3><p class="muted small">' + esc(t.desc) + '</p></div>'
).join('');
$('#certGrid').innerHTML = CERTIFICATIONS.map(c =>
  '<article class="cert-card cert-clickable" tabindex="0" role="button" aria-haspopup="dialog" data-ci="' + CERTIFICATIONS.indexOf(c) + '" aria-label="View details of ' + esc(c.name) + '">' +
    (c.image ? '<img class="cert-img" src="' + esc(c.image) + '" alt="Certificate: ' + esc(c.name) + '" loading="lazy">' : '') +
    '<p class="cat mono">' + esc(c.category).toUpperCase() + '</p><p>' + esc(c.name) + '</p>' +
    (c.issuer ? '<p class="muted small">' + esc(c.issuer) + '</p>' : '') +
  '</article>'
).join('');
const CERT_KEYS = [['Category', 'category'], ['Issuer', 'issuer'], ['Year', 'year']];
$('#certGrid').addEventListener('click', e => {
  const card = e.target.closest('.cert-clickable');
  if (card) openCertModal(CERTIFICATIONS[+card.dataset.ci]);
});
$('#certGrid').addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.cert-clickable');
  if (card) { e.preventDefault(); openCertModal(CERTIFICATIONS[+card.dataset.ci]); }
});
function openCertModal(c) {
  if (!c) return;
  openModal(
    '<p class="tagline">CERTIFICATION' + (c.category ? ' — ' + esc(c.category).toUpperCase() : '') + '</p>' +
    '<h3 id="modalTitle">' + esc(c.name) + '</h3>' +
    (c.image ? '<img class="cert-modal-img" src="' + esc(c.image) + '" alt="Certificate image: ' + esc(c.name) + '">' : '') +
    '<dl class="cert-details">' +
      CERT_KEYS.filter(k => c[k[1]]).map(k => '<div><dt>' + k[0] + '</dt><dd>' + esc(c[k[1]]) + '</dd></div>').join('') +
    '</dl>'
  );
}

renderProjects('all');
