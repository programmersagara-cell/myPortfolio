/* ============================================================
   Playful interactions — security scanner, terminal, contact form
   ============================================================ */
'use strict';

/* ---------- Portfolio Security Scanner (simulated demo) ---------- */
(function initScanner() {
  const btn = $('#scanBtn'), out = $('#scanOut');
  const steps = [
    'Scanning profile............ OK',
    'Checking projects........... OK',
    'Checking architecture....... OK',
    'Checking security practices. OK',
    'Validating input handling... OK',
    'Verifying no secrets in code  OK',
    '',
    'RESULT',
    '─────────────────────────────',
    'PROFILE STATUS : SECURE',
    'THREATS FOUND  : 0',
    '',
    '// This is a portfolio animation/demo — not a real scanner.'
  ];
  btn.addEventListener('click', () => {
    btn.disabled = true;
    out.hidden = false; out.textContent = '';
    let i = 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      out.textContent = steps.join('\n'); btn.disabled = false; return;
    }
    const t = setInterval(() => {
      out.textContent += steps[i] + '\n';
      out.scrollTop = out.scrollHeight;
      if (++i >= steps.length) { clearInterval(t); btn.disabled = false; }
    }, 320);
  });
})();

/* ---------- Terminal Easter Egg ---------- */
let closeTerminal = function () {};
(function initTerminal() {
  const overlay = $('#terminalOverlay'), body = $('#termBody'), input = $('#termInput');
  const print = (text, cls) => {
    const div = document.createElement('div');
    if (cls) div.className = cls;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  };
  const banner = () => {
    print('Justin Marcus Santiago — Portfolio Terminal', 'cmd');
    print("Type 'help' for available commands.", 'sys');
  };
  const commands = {
    help: () => print('Commands: help, about, skills, projects, security, contact, theme, whoami, clear', 'sys'),
    about: () => print('IT Programmer, Cybersecurity Staff, Systems Developer, and IT Infrastructure Professional. Hands-on with Trend Micro endpoint and server-side security. Build. Secure. Improve.'),
    skills: () => SKILL_CATEGORIES.forEach(c => print(c.name + ': ' + c.skills.map(s => s[0]).join(', '))),
    projects: () => PROJECTS.forEach(p => print('- ' + p.title + ' [' + (CAT_LABELS[p.category] || p.category) + ']')),
    security: () => { print('Security modules:'); Object.keys(SOC_MODULES).forEach(k => print('  - ' + SOC_MODULES[k].title + ' [' + SOC_MODULES[k].status + ']')); print('Simulated demo data only.', 'sys'); },
    contact: () => { const c = SITE_CONFIG.contact; print('Email: ' + c.email); print('LinkedIn: ' + c.linkedin); print('GitHub: ' + c.github); },
    theme: () => { document.getElementById('themeToggle').click(); print('Theme toggled.'); },
    whoami: () => print('visitor@portfolio — nice to meet you.'),
    clear: () => { body.innerHTML = ''; banner(); }
  };
  function open() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    if (!body.childElementCount) banner();
    input.focus();
  }
  closeTerminal = function () { overlay.hidden = true; document.body.style.overflow = ''; $('#termBtn').focus(); };
  $('#termBtn').addEventListener('click', open);
  $('#termClose').addEventListener('click', closeTerminal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeTerminal(); });
  $('#termForm').addEventListener('submit', e => {
    e.preventDefault();
    const raw = input.value.trim();
    if (!raw) return;
    print('$ ' + raw, 'cmd');
    input.value = '';
    const cmd = raw.toLowerCase().split(/\s+/)[0];
    if (commands[cmd]) commands[cmd]();
    else print("Unknown command: '" + raw + "'. Type 'help'.", 'sys');
  });
})();


/* ---------- Contact form ---------- */
(function initContactForm() {
  const form = $('#contactForm'), status = $('#formStatus');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validate() {
    let ok = true;
    const name = $('#cfName'), email = $('#cfEmail'), msg = $('#cfMsg');
    const setErr = (el, id, msgText) => { $(id).textContent = msgText || ''; if (msgText) ok = false; };
    setErr(name, '#errName', name.value.trim().length < 2 ? 'Please enter your name (min 2 characters).' : '');
    setErr(email, '#errEmail', !emailRe.test(email.value.trim()) ? 'Please enter a valid email address.' : '');
    setErr(msg, '#errMsg', msg.value.trim().length < 10 ? 'Message must be at least 10 characters.' : '');
    return ok;
  }
  ['#cfName', '#cfEmail', '#cfMsg'].forEach(sel => $(sel).addEventListener('blur', validate));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.className = 'form-status mono'; status.textContent = '';
    if (!validate()) { status.classList.add('err'); status.textContent = '[!] Fix the errors above.'; return; }
    if ($('#hpField').value) return; // honeypot: silently drop bots
    $('#cfSubmit').disabled = true;
    status.textContent = 'Sending…';
    try {
      const endpoint = (window.SITE_CONFIG && SITE_CONFIG.contact && SITE_CONFIG.contact.formEndpoint) || '';
      if (endpoint) {
        // Static hosting (e.g. GitHub Pages): submit via a form service such as Formspree.
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        const data = res.ok ? await res.json() : {};
        if (res.ok) {
          status.classList.add('ok'); status.textContent = '[OK] Message sent successfully.';
          form.reset();
        } else {
          status.classList.add('err');
          status.textContent = '[!] ' + (data.error || 'Sending failed (HTTP ' + res.status + ').');
        }
      } else {
        // No form backend configured: open the visitor's email app as a fallback.
        const name = encodeURIComponent($('#cfName').value.trim());
        const email = encodeURIComponent($('#cfEmail').value.trim());
        const body = encodeURIComponent($('#cfMsg').value.trim() + '\n\n— ' + decodeURIComponent(name) + ' <' + decodeURIComponent(email) + '>');
        const to = (window.SITE_CONFIG && SITE_CONFIG.contact && SITE_CONFIG.contact.email) || '';
        const subject = encodeURIComponent('Portfolio contact from ' + decodeURIComponent(name));
        if (!to || to.startsWith('[')) throw new Error('No contact email configured.');
        window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
        status.classList.add('ok');
        status.textContent = '[OK] Opening your email app to send the message.';
      }
    } catch (err) {
      status.classList.add('err');
      status.textContent = '[!] ' + (err && err.message ? err.message : 'Sending failed on this host.');
    } finally {
      $('#cfSubmit').disabled = false;
    }
  });
  // No CSRF token needed on static hosting (no PHP backend).
})();
