/* ============================================================
   PORTFOLIO DATA (2/2) — Architecture, Workflow, Secure by Design,
   Timeline, Certifications. EDIT THIS FILE.
   ============================================================ */
'use strict';

/* ---------- Architecture diagram layers ---------- */
const ARCH_LAYERS = [
  { id: 'internet', label: 'INTERNET', desc: 'External traffic enters through controlled boundaries. I think about exposure first: only what must be public is public.' },
  { id: 'network', label: 'NETWORK LAYER', desc: 'Segmentation, VLANs, firewall rules, and DNS/DHCP hygiene keep traffic predictable and limit blast radius.' },
  { id: 'endpoints', label: 'ENDPOINTS', desc: 'User devices managed with consistent policies, patching, and Trend Micro-supported endpoint protection.' },
  { id: 'servers', label: 'SERVERS', desc: 'Hardened servers hosting business applications — least privilege, monitored, backed up.' },
  { id: 'epsec', label: 'ENDPOINT SECURITY', desc: 'Trend Micro-supported protection: malware defense, policy enforcement, and event visibility on every device.' },
  { id: 'srvsec', label: 'SERVER SECURITY', desc: 'Workload protection, intrusion prevention concepts, and server-side threat monitoring.' },
  { id: 'monitoring', label: 'MONITORING', desc: 'Logs are collected and reviewed. You can\u2019t respond to what you never see.' },
  { id: 'ir', label: 'INCIDENT RESPONSE', desc: 'When something happens: identify, contain, document, learn, improve.' }
];

/* ---------- Workflow steps ---------- */
const WORKFLOW_STEPS = [
  ['01', 'DISCOVER', 'Understand the actual problem, the people affected, and the constraints — before touching any technology.'],
  ['02', 'ANALYZE', 'Map current workflows, risks, and data flows. Identify what security means for this specific system.'],
  ['03', 'DESIGN', 'Architect the solution with security built into the design, not bolted on afterwards.'],
  ['04', 'DEVELOP', 'Write clean, maintainable code with validation and safe defaults from the first line.'],
  ['05', 'SECURE', 'Apply authentication, authorization, input handling, and hardening as deliberate steps.'],
  ['06', 'TEST', 'Functional testing plus abuse-case thinking: how would this break or be misused?'],
  ['07', 'DEPLOY', 'Controlled rollout with rollback plans and configuration discipline.'],
  ['08', 'MONITOR', 'Watch logs, performance, and security events after launch — launch is not the finish line.'],
  ['09', 'IMPROVE', 'Feed findings back into the next iteration. Build. Secure. Improve.']
];

/* ---------- Secure by Design principles ---------- */
const SECURE_PRINCIPLES = [
  { name: 'Least Privilege', detail: 'Users and processes get only the access they need — nothing more.' },
  { name: 'Authentication & Authorization', detail: 'Verify identity, then verify permission — on the server, every request.' },
  { name: 'Input Validation', detail: 'Never trust client input. Validate type, length, format, and range server-side.' },
  { name: 'Secure File Uploads', flow: ['Validate extension', 'Validate MIME type', 'Validate file size', 'Generate safe filename', 'Store outside executable directory', 'Apply access control', 'Log upload event'] },
  { name: 'Password Hashing', detail: 'Passwords stored using modern one-way hashing (e.g., password_hash in PHP) — never plaintext, never reversible.' },
  { name: 'Session Security', detail: 'Secure cookie flags, session regeneration on login, and proper timeouts.' },
  { name: 'SQL Injection Prevention', detail: 'Prepared statements everywhere. User input is data, never query code.' },
  { name: 'XSS Prevention', detail: 'Context-aware output encoding so user content can never become script.' },
  { name: 'CSRF Protection', detail: 'Per-session tokens on state-changing requests — like the contact form on this very page.' },
  { name: 'Access Logging', detail: 'Security-relevant events are logged for review and investigation.' },
  { name: 'Error Handling', detail: 'Fail safely: friendly messages for users, detailed logs for admins, no stack traces leaked.' },
  { name: 'Backup Strategy', detail: 'Regular backups with tested restores — a backup you haven\u2019t restored is a rumor.' },
  { name: 'Data Protection', detail: 'Sensitive data minimized, protected in transit and at rest where applicable.' },
  { name: 'Patch Management', detail: 'Keep systems and dependencies updated on a routine, not after an incident.' }
];

/* ---------- Experience timeline (replace with real history) ---------- */
const TIMELINE = [
  { period: '[Add Dates]', title: 'IT Support', desc: '[Add professional experience details]' },
  { period: '[Add Dates]', title: 'System Development', desc: '[Add professional experience details]' },
  { period: '[Add Dates]', title: 'Cybersecurity Staff', desc: '[Add professional experience details]' },
  { period: '[Add Dates]', title: 'Infrastructure', desc: '[Add professional experience details]' },
  { period: 'Current', title: 'IT Programmer • Cybersecurity • Systems', desc: 'Combining software development, security operations, and IT infrastructure support.' }
];

/* ---------- Certifications (never fabricate) ---------- */
const CERTIFICATIONS = [
  { category: 'Cybersecurity', name: '[Certification Name]', issuer: '', year: '' },
  { category: 'Trend Micro', name: '[Certification Name]', issuer: '', year: '' },
  { category: 'Networking', name: '[Certification Name]', issuer: '', year: '' },
  { category: 'Microsoft', name: '[Certification Name]', issuer: '', year: '' },
  { category: 'Linux', name: '[Certification Name]', issuer: '', year: '' },
  { category: 'Programming', name: '[Certification Name]', issuer: '', year: '' }
];

/* ---------- Interactive resume tabs (built from other data) ---------- */
const RESUME_TABS = {
  profile: '<h3>Profile</h3><p>IT Programmer, Cybersecurity Staff, Systems Developer, and IT Infrastructure Professional with practical enterprise experience supporting <strong>Trend Micro</strong> endpoint and server-side security technologies.</p><p><em>[Add full profile text]</em></p>',
  experience: '<h3>Experience</h3>' + TIMELINE.map(function (t) { return '<p><strong>' + t.title + '</strong> — ' + t.period + '<br>' + t.desc + '</p>'; }).join('<hr>'),
  skills: '<h3>Skills</h3>' + SKILL_CATEGORIES.map(function (c) { return '<p><strong>' + c.name + ':</strong> ' + c.skills.map(function (s) { return s[0]; }).join(', ') + '</p>'; }).join('') + '<p><strong>Development:</strong> ' + LAB_SKILLS.map(function (s) { return s.name; }).join(', ') + '</p>',
  projects: '<h3>Projects</h3>' + PROJECTS.map(function (p) { return '<p><strong>' + p.title + '</strong><br>' + p.solution + '</p>'; }).join('<hr>'),
  education: '<h3>Education</h3><div class="placeholder-box">EDUCATION<br>Add education information</div>',
  certifications: '<h3>Certifications</h3>' + CERTIFICATIONS.map(function (c) { return '<p><strong>' + c.category + '</strong>: ' + c.name + (c.year ? ' (' + c.year + ')' : '') + '</p>'; }).join(''),
  achievements: '<h3>Achievements</h3><div class="placeholder-box">ACHIEVEMENTS<br>Add achievements information</div>'
};


