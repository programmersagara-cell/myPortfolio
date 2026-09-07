/* Portfolio Admin — no-code content editor */
'use strict';
console.log('[admin] JS v2 loaded — login button wired at', new Date().toLocaleTimeString());

const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let CSRF = '';
let projData = [], timelineArr = [], certArr = [];
const addDefaults = {
  timeline: { period: '[Add Dates]', title: '', desc: '' },
  certifications: { category: '', name: '', issuer: '', year: '' }
};

async function api(path, opts = {}) {
  opts.headers = Object.assign(CSRF ? { 'X-CSRF-Token': CSRF } : {}, opts.headers || {});
  const res = await fetch(path, opts);
  let data;
  try { data = await res.json(); } catch (e) { throw new Error('Bad server response (HTTP ' + res.status + ')'); }
  if (!res.ok || data.ok === false) throw new Error(data.error || ('HTTP ' + res.status));
  return data;
}
function setStatus(id, msg, ok) { const el = $(id); el.textContent = msg; el.className = 'status mono ' + (ok ? 'ok' : 'err'); }

/* ---------- Effective content: defaults + saved overrides ---------- */
function effectiveContent() {
  const saved = window.CONTENT_OVERRIDES || {};
  return {
    stats: Object.assign({}, SITE_CONFIG.stats, saved.stats),
    contact: Object.assign({}, SITE_CONFIG.contact, saved.contact),
    about: (saved.about && Array.isArray(saved.about.paragraphs) && saved.about.paragraphs.length) ? saved.about.paragraphs
      : ['I\u2019m Justin Marcus Santiago — an IT professional who builds systems and protects them. My work spans software development, IT operations, infrastructure, and cybersecurity, including hands-on experience supporting Trend Micro endpoint and server-side security technologies.',
         'I enjoy solving technical problems that matter: turning manual spreadsheet workflows into proper web applications, keeping endpoints and servers protected, troubleshooting hardware and networks, and automating repetitive work so teams can move faster.',
         'I don\u2019t treat security as an afterthought. Every system I build is designed with authentication, access control, and safe data handling from the start.'],
    projects: (saved.projects && saved.projects.length) ? saved.projects : PROJECTS,
    timeline: (saved.timeline && saved.timeline.length) ? saved.timeline : TIMELINE,
    certifications: (saved.certifications && saved.certifications.length) ? saved.certifications : CERTIFICATIONS
  };
}

/* ---------- Auth ---------- */
async function initAuth() {
  try {
    const st = await api('../api/auth.php?action=status');
    CSRF = st.csrf_token;
    if (st.logged_in) { showDash(st.is_default_password); loadAll(); } else showLogin();
  } catch (e) {
    document.getElementById('liErr').textContent = 'Backend unreachable: ' + e.message;
  }
}
function showLogin() {
  $('#loginCard').classList.remove('hidden');
  $('#dash').classList.add('hidden');
}
function showDash(defaultPw) {
  $('#loginCard').classList.add('hidden');
  $('#dash').classList.remove('hidden');
  $('#defaultPwBanner').classList.toggle('hidden', !defaultPw);
}
async function doLogin() {
  const btn = document.querySelector('#liBtn'), err = document.querySelector('#liErr');
  err.textContent = '';
  btn.disabled = true; btn.textContent = 'Logging in...';
  try {
    const st = await api('../api/auth.php?action=status'); // fresh token each attempt
    CSRF = st.csrf_token;
    const f = new FormData();
    f.append('username', document.querySelector('#liUser').value.trim());
    f.append('password', document.querySelector('#liPass').value);
    f.append('csrf_token', CSRF);
    await api('../api/auth.php?action=login', { method: 'POST', body: f });
    btn.textContent = 'OK - opening dashboard...';
    const st2 = await api('../api/auth.php?action=status');
    showDash(st2.is_default_password); loadAll();
  } catch (e) {
    err.textContent = '[!] ' + e.message;
    btn.disabled = false; btn.textContent = 'Log In';
  }
}
async function doLogout() {
  try { await api('../api/auth.php?action=logout'); } catch (e) {}
  location.reload();
}

/* ---------- Generic saver ---------- */
async function saveSection(statusSel, payload) {
  try {
    await api('../api/content.php', { method: 'POST', body: JSON.stringify(payload) });
    setStatus(statusSel, '[OK] Saved - refresh the public site to see changes.', true);
  } catch (e) { setStatus(statusSel, '[!] ' + e.message, false); }
}

/* ---------- Contact & stats / About ---------- */
function fillContact(c) {
  ['email', 'linkedin', 'github', 'facebook', 'other'].forEach(k => { $('#c-' + k).value = c[k] || ''; });
  $('#s-projects').value = effectiveContent().stats.projects;
  $('#s-technologies').value = effectiveContent().stats.technologies;
}
function saveContact() {
  return saveSection('#st-contact', {
    section: 'contact',
    data: { email: $('#c-email').value, linkedin: $('#c-linkedin').value, github: $('#c-github').value, facebook: $('#c-facebook').value, other: $('#c-other').value }
  });
}
function saveAbout() {
  const paragraphs = [$('#about0').value, $('#about1').value, $('#about2').value].filter(p => p.trim());
  return saveSection('#st-about', { section: 'about', data: { paragraphs } });
}

/* ---------- Projects editor ---------- */
function fillProjects(list) {
  projData = JSON.parse(JSON.stringify(list));
  renderProjects();
}
/* ---------- Project image manager ---------- */
function renderShots(div, i) {
  const wrap = div.querySelector('[data-shots]');
  const shots = projData[i].screenshots || [];
  wrap.innerHTML = shots.length
    ? shots.map((src, si) =>
        '<div class="shot"><img src="' + esc(src) + '" alt="screenshot ' + (si + 1) + '">' +
        '<button type="button" title="Remove" data-rmshot="' + si + '">✕</button></div>').join('')
    : '<span style="color:var(--muted);font-size:.8rem">No images yet — click "Add images".</span>';
  wrap.querySelectorAll('[data-rmshot]').forEach(b => b.addEventListener('click', () => {
    projData[i].screenshots.splice(Number(b.dataset.rmshot), 1);
    renderShots(div, i);
  }));
}
async function addProjectImages(div, i, files) {
  const st = div.querySelector('[data-shotstatus]');
  for (const file of files) {
    try {
      st.textContent = 'Uploading ' + file.name + '...';
      const fd = new FormData(); fd.append('image', file);
      const r = await api('../api/upload.php', { method: 'POST', body: fd });
      (projData[i].screenshots = projData[i].screenshots || []).push(r.url);
      renderShots(div, i);
    } catch (e) { st.textContent = '[!] ' + file.name + ': ' + e.message; return; }
  }
  st.textContent = '[OK] ' + files.length + ' image(s) added — remember to Save all projects.';
}
function renderProjects() {
  const wrap = $('#projList'); wrap.innerHTML = '';
  projData.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML =
      '<div class="head"><h3>' + esc(p.title || '(untitled)') + '</h3>' +
      '<button type="button" class="btn danger sm" data-del="' + i + '">Remove</button></div>' +
      '<label>Title</label><input type="text" data-f="title" value="' + esc(p.title) + '">' +
      '<label>Problem</label><textarea data-f="problem">' + esc(p.problem) + '</textarea>' +
      '<label>Solution</label><textarea data-f="solution">' + esc(p.solution) + '</textarea>' +
      '<label>My role</label><input type="text" data-f="role" value="' + esc(p.role || '') + '">' +
      '<label>Technologies (comma-separated)</label><input type="text" data-f="tech" value="' + esc((p.tech || []).join(', ')) + '">' +
      '<label>Features (one per line)</label><textarea data-f="features">' + esc((p.features || []).join('\n')) + '</textarea>' +
      '<label>Security considerations (one per line)</label><textarea data-f="security">' + esc((p.security || []).join('\n')) + '</textarea>' +
      '<label>Improvements / results</label><input type="text" data-f="improvements" value="' + esc(p.improvements || '') + '">' +
      '<div class="row"><div style="flex:1;min-width:140px"><label>GitHub URL</label><input type="url" data-f="github" value="' + esc(p.github || '') + '"></div>' +
      '<div style="flex:1;min-width:140px"><label>Demo URL</label><input type="url" data-f="demo" value="' + esc(p.demo || '') + '"></div>' +
      '<div style="flex:1;min-width:180px"><label>Demo URL</label><input type="url" data-f="demo" value="' + esc(p.demo || '') + '"></div>' +
    '</div>' +
    '<label>Project images</label><div class="shots" data-shots></div>' +
    '<div class="row"><button type="button" class="btn secondary sm" data-addimg>🖼️ Add images</button>' +
    '<input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden data-imgfile>' +
    '<span class="status mono" data-shotstatus style="margin:0"></span></div>';
    renderShots(div, i);
    div.querySelector('[data-del]').addEventListener('click', () => { projData.splice(i, 1); renderProjects(); });
    div.querySelectorAll('[data-f]').forEach(inp => inp.addEventListener('input', () => {
      const f = inp.dataset.f;
      if (f === 'tech') projData[i][f] = inp.value.split(',').map(s => s.trim()).filter(Boolean);
      else if (f === 'features' || f === 'security') projData[i][f] = inp.value.split('\n').map(s => s.trim()).filter(Boolean);
      else projData[i][f] = inp.value;
      if (f === 'title') div.querySelector('h3').textContent = inp.value || '(untitled)';
    }));
    div.querySelector('[data-addimg]').addEventListener('click', () => div.querySelector('[data-imgfile]').click());
    div.querySelector('[data-imgfile]').addEventListener('change', e => {
      if (e.target.files.length) addProjectImages(div, i, Array.from(e.target.files));
      e.target.value = '';
    });
    wrap.appendChild(div);
  });
}
function saveProjects() {
  return saveSection('#st-projects', { section: 'projects', data: projData });
}

/* ---------- Simple list editors (timeline & certifications) ---------- */
function simpleEditor(listSel, fields, arr) {
  const wrap = $(listSel); wrap.innerHTML = '';
  if (!arr.length) wrap.innerHTML = '<p style="color:var(--muted)">Empty - click "Add entry".</p>';
  arr.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = '<div class="head"><h3>#' + (i + 1) + '</h3><button type="button" class="btn danger sm">Remove</button></div>' +
      fields.map(f => '<label>' + f[0] + '</label><input type="text" data-k="' + f[1] + '" value="' + esc(item[f[1]] || '') + '">').join('');
    div.querySelector('.btn.danger').addEventListener('click', () => { arr.splice(i, 1); simpleEditor(listSel, fields, arr); });
    div.querySelectorAll('[data-k]').forEach(inp => inp.addEventListener('input', () => { arr[i][inp.dataset.k] = inp.value; }));
    wrap.appendChild(div);
  });
}

/* ---------- Password change & image upload ---------- */
async function changePassword() {
  try {
    const f = new FormData();
    f.append('current', $('#pwCur').value); f.append('new', $('#pwNew').value);
    await api('../api/auth.php?action=change_password', { method: 'POST', body: f });
    setStatus('#st-pw', '[OK] Password updated.', true);
    $('#defaultPwBanner').classList.add('hidden');
    $('#pwCur').value = ''; $('#pwNew').value = '';
  } catch (e) { setStatus('#st-pw', '[!] ' + e.message, false); }
}
async function uploadImage() {
  const file = $('#imgFile').files[0];
  if (!file) { setStatus('#st-img', '[!] Choose a file first.', false); return; }
  const fd = new FormData(); fd.append('image', file);
  try {
    const r = await api('../api/upload.php', { method: 'POST', body: fd });
    setStatus('#st-img', '[OK] Uploaded -> ' + r.url + ' (paste into a project Screenshots field)', true);
  } catch (e) { setStatus('#st-img', '[!] ' + e.message, false); }
}


/* ---------- Load all content into forms ---------- */
function loadAll() {
  fetch('../api/content.php?format=json', { headers: { 'Cache-Control': 'no-store' } })
    .then(r => r.json())
    .then(saved => {
      window.CONTENT_OVERRIDES = saved.content || {};
      const c = effectiveContent();
      fillContact(c);
      for (let i = 0; i < 3; i++) $('#about' + i).value = c.about[i] || '';
      fillProjects(c.projects);
      timelineArr = JSON.parse(JSON.stringify(c.timeline));
      simpleEditor('#tlList', [['Period', 'period'], ['Title', 'title'], ['Description', 'desc']], timelineArr);
      certArr = JSON.parse(JSON.stringify(c.certifications));
      simpleEditor('#certList', [['Category', 'category'], ['Certification name', 'name'], ['Issuer', 'issuer'], ['Year', 'year']], certArr);
    })
    .catch(e => setStatus('#st-contact', '[!] Load failed: ' + e.message, false));
}

/* ---------- Tabs ---------- */
function wireTabs() {
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
    document.getElementById('p-' + t.dataset.t).classList.remove('hidden');
  }));
}

/* ---------- Wire up (single entry point) ---------- */
(function wireUp() {
  wireTabs();
  initAuth();
  document.getElementById('liBtn').addEventListener('click', doLogin);
  document.getElementById('liPass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  document.getElementById('logoutBtn').addEventListener('click', doLogout);
  document.getElementById('addProj').addEventListener('click', () => {
    projData.push({ id: 'p' + Date.now(), title: '', category: 'web', problem: '', solution: '', tech: [], role: '', features: [], security: [], improvements: '', github: '', demo: '', screenshots: [] });
    renderProjects();
  });
  document.getElementById('addTl').addEventListener('click', () => {
    timelineArr.push(Object.assign({}, addDefaults.timeline));
    simpleEditor('#tlList', [['Period', 'period'], ['Title', 'title'], ['Description', 'desc']], timelineArr);
  });
  document.getElementById('addCert').addEventListener('click', () => {
    certArr.push(Object.assign({}, addDefaults.certifications));
    simpleEditor('#certList', [['Category', 'category'], ['Certification name', 'name'], ['Issuer', 'issuer'], ['Year', 'year']], certArr);
  });
  document.querySelectorAll('.saveBtn').forEach(b => b.addEventListener('click', () => {
    const s = b.dataset.section;
    if (s === 'contact') {
      saveSection('#st-contact', {
        section: 'contact',
        data: { email: $('#c-email').value, linkedin: $('#c-linkedin').value, github: $('#c-github').value, facebook: $('#c-facebook').value, other: $('#c-other').value }
      });
      saveSection('#st-contact', { section: 'stats', data: { projects: $('#s-projects').value, technologies: $('#s-technologies').value } });
    }
    else if (s === 'about') saveAbout();
    else if (s === 'projects') saveProjects();
    else if (s === 'timeline') saveSection('#st-timeline', { section: 'timeline', data: timelineArr });
    else if (s === 'certifications') saveSection('#st-certifications', { section: 'certifications', data: certArr });
  }));
  document.getElementById('pwBtn').addEventListener('click', changePassword);
  document.getElementById('imgBtn').addEventListener('click', uploadImage);
})();
