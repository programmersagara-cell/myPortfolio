/* ============================================================
   PORTFOLIO DATA (1/2) — Engineering Lab skills
   EDIT THIS FILE to update content.
   ============================================================ */
'use strict';
const LAB_SKILLS = [
  { name: 'PHP', level: 'Advanced', what: 'A widely-used server-side scripting language for web development.', use: 'Building complete business web applications — forms, CRUD, authentication, file handling, and reporting.', example: 'Excel-to-Web System backend', related: ['MySQL', 'XAMPP'] },
  { name: 'JavaScript', level: 'Advanced', what: 'The programming language of the web, for interactivity and dynamic interfaces.', use: 'Interactive dashboards, form validation, AJAX-driven interfaces, and this portfolio itself.', example: 'Production Management System UI', related: ['HTML', 'CSS'] },
  { name: 'HTML & CSS', level: 'Advanced', what: 'The structure and presentation layer of every website.', use: 'Semantic, accessible, responsive layouts for internal tools and public pages.', example: 'This portfolio', related: ['Responsive design'] },
  { name: 'SQL / MySQL', level: 'Intermediate', what: 'Database design and querying for structured application data.', use: 'Schema design, prepared statements, reporting queries, spreadsheet migration.', example: 'Barcode Warehouse System database', related: ['PHP', 'phpMyAdmin'] },
  { name: 'Python', level: 'Learning', what: 'A versatile language popular for automation and scripting.', use: 'Exploring automation scripts and expanding tooling capabilities.', example: '[Add Python Project]', related: ['Scripting'] },
  { name: 'REST APIs', level: 'Intermediate', what: 'HTTP-based interfaces for systems to communicate.', use: 'Connecting front-end interfaces to back-end logic with clean JSON endpoints.', example: 'Media Uploader service layer', related: ['PHP', 'JavaScript'] },
  { name: 'Git & GitHub', level: 'Working Knowledge', what: 'Version control for tracking and collaborating on code.', use: 'Managing project history, branches, and backups for all development work.', example: 'All active projects', related: ['GitHub'] },
  { name: 'Windows Server', level: 'Working Knowledge', what: 'Microsoft\u2019s server operating system for enterprise environments.', use: 'Application hosting, file services, user access management, maintenance.', example: 'Internal application hosting', related: ['Active Directory basics'] },
  { name: 'Linux', level: 'Learning', what: 'Open-source operating system powering most of the internet.', use: 'Growing skills in shell usage, permissions, server administration.', example: '[Add Linux Project]', related: ['Shell'] }
];

/* ---------- Projects ---------- */
const PROJECTS = [
  {
    id: 'itara', title: 'Itara — IT Asset Management System', category: 'web',
    problem: 'Organizations need a single source of truth for every IT asset — PCs, laptops, switches, servers, printers — plus who they are assigned to, where they are, warranty status, and how the network connects. Spreadsheets cannot provide accountability or an audit trail.',
    solution: 'Designed and built a complete production-ready ITAM platform from scratch: a custom PHP 8 MVC framework (zero framework dependencies), MySQL/MariaDB backend, interactive HTML5 Canvas network topology with drag-and-drop/zoom/connect modes, analytics dashboard with charts, CSV import/export, QR support, full audit trail, role-based access control, and a RESTful API.',
    tech: ['PHP 8+', 'MySQL / MariaDB', 'Vanilla JavaScript', 'HTML5 Canvas', 'Chart.js', 'PDO', 'REST API', 'MVC'],
    role: 'Architect & full-stack developer — designed the MVC core, database schema, security layer, topology engine, and all modules',
    features: [
      'Asset ledger with auto-generated tags (PC-001, SRV-001…) and rich hardware fields',
      'Interactive network topology: drag-and-drop, zoom/pan, connect/disconnect links, labels, PNG export, position persistence',
      'Analytics dashboard — type/status/department charts and monthly trend trends',
      'Role-based access control (Admin / Operator / Viewer)',
      'Full audit logging of every CRUD operation',
      'CSV import/export, backup system, mail queue worker, warranty expiry tracking',
      'Unit & integration test suite, database migrations'
    ],
    security: [
      'CSRF protection on all forms (dedicated middleware)',
      'XSS prevention via output escaping',
      'SQL injection prevention with PDO prepared statements',
      'Password hashing (bcrypt, cost factor 12)',
      'Rate limiting on login attempts',
      'Session security — HttpOnly + SameSite cookies, periodic regeneration',
      'Security headers + secure file upload validation'
    ],
    beforeAfter: {
      before: 'Manual asset tracking in spreadsheets',
      problems: ['No assignment accountability', 'No audit history', 'No network visibility', 'Warranty lapses unnoticed'],
      after: 'Centralized web platform with audit trail, live topology map, and role-based access'
    },
    improvements: '[Add measurable results]',
    github: null,
    demo: null,
    screenshots: []
  },
  {
    id: 'media-uploader', title: 'Media Uploader', category: 'web',
    problem: 'Departments needed a secure way to upload and organize media files without dumping everything into shared folders with no access control.',
    solution: 'Built a web application with department-based storage, validated uploads, role-based access, and an audit-friendly event log.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'XAMPP'], role: 'Full-stack developer & security implementer',
    features: ['Department-based storage structure', 'Validated & sanitized file uploads', 'Access control per department', 'Upload activity logging'],
    security: ['Extension + MIME type validation', 'Size limits', 'Safe filename generation', 'Files stored outside executable paths'],
    beforeAfter: null, improvements: '', github: null, demo: null,
    screenshots: [] // add screenshot paths e.g. ['assets/img/media-1.jpg']
  },
  {
    id: 'production-mgmt', title: 'Production Management System', category: 'web',
    problem: 'Production tracking relied on manual records that were slow to update and harder to report from.',
    solution: 'Developed a centralized tracking and reporting platform covering production entries, status, and summary reports.',
    tech: ['PHP', 'MySQL', 'JavaScript'], role: 'Systems developer',
    features: ['Production entry tracking', 'Status monitoring', 'Summary reporting', 'User accounts'],
    security: ['Prepared statements (SQL injection prevention)', 'Output encoding (XSS prevention)', 'Authenticated sessions'],
    beforeAfter: { before: 'Manual paper/Excel production records', problems: ['Slow consolidation', 'Duplicate records', 'Limited visibility'], after: 'Centralized web application with live tracking' },
    improvements: 'Reduced manual encoding and improved reporting consistency. [Add measurable results]',
    github: null, demo: null, screenshots: []
  },
  {
    id: 'barcode-warehouse', title: 'Barcode Warehouse System', category: 'web',
    problem: 'Tracking items across Production \u2192 Warehouse \u2192 Delivery was error-prone when done by hand.',
    solution: 'Implemented barcode-driven scanning at each stage, giving real-time item location and movement history.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'Barcode scanning'], role: 'Developer & workflow designer',
    features: ['Scan-based stage transitions', 'Item movement history', 'Warehouse inventory view', 'Delivery confirmation'],
    security: ['Server-side state validation', 'Role-based access', 'Audit trail of movements'],
    beforeAfter: { before: 'Manual logbooks per stage', problems: ['Misplaced items', 'No single source of truth'], after: 'One scan-tracked workflow from production to delivery' },
    improvements: '[Add measurable results]', github: null, demo: null, screenshots: []
  }
];
const MORE_PROJECTS = [
  {
    id: 'excel-to-web', title: 'Excel-to-Web System', category: 'web',
    problem: 'Shared Excel workbooks caused version conflicts, broken formulas, and no access control.',
    solution: 'Replaced the shared-file workflow with a proper multi-user web application backed by a relational database.',
    tech: ['PHP', 'MySQL', 'JavaScript'], role: 'Full-stack developer',
    features: ['Multi-user simultaneous editing', 'Validation at input time', 'Report generation', 'Data consistency checks'],
    security: ['Authentication & session management', 'CSRF protection', 'Input validation & output encoding'],
    beforeAfter: { before: 'Shared Excel workbook on network drive', problems: ['File locks & conflicts', 'No audit history', 'Accidental overwrites'], after: 'Centralized web application with per-user access' },
    improvements: 'Better data consistency and access control. Reduced duplicate records. [Add measurable results]',
    github: null, demo: null, screenshots: []
  },
  {
    id: 'it-infra', title: 'IT Infrastructure Projects', category: 'infra',
    problem: 'Day-to-day infrastructure needs: workstation deployments, network setup, server maintenance, endpoint protection rollout.',
    solution: 'Handled hands-on deployment and support — OS installation, LAN configuration, Trend Micro-supported endpoint/server security, backup routines.',
    tech: ['Windows Server', 'Trend Micro', 'Networking', 'Backup tools'], role: 'IT support / infrastructure',
    features: ['Workstation & OS deployment', 'LAN / IP configuration', 'Endpoint protection rollout', 'Backup scheduling'],
    security: ['Security policy enforcement via Trend Micro technologies', 'Patch management routines', 'Access management'],
    beforeAfter: null, improvements: '', github: null, demo: null, screenshots: []
  },
  {
    id: 'portfolio-site', title: 'This Portfolio', category: 'web',
    problem: 'Presenting development + security capabilities in one credible, professional place.',
    solution: 'Designed and built this site as a demonstration of both front-end craft and security-first thinking.',
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP'], role: 'Designer & developer',
    features: ['Interactive SOC simulator & terminal', 'Dark/light theme', 'Accessible, responsive design', 'Secured contact form'],
    security: ['CSP & security headers (.htaccess)', 'CSRF token + honeypot + rate limiting on form', 'Client & server input validation', 'No secrets in frontend code'],
    beforeAfter: null, improvements: '', github: null, demo: null, screenshots: []
  }
];
PROJECTS.push(...MORE_PROJECTS);
/* ---------- IT Operations ---------- */
const OPS_AREAS = [
  { icon: '🔧', name: 'Hardware', points: ['PC troubleshooting', 'Hardware diagnostics', 'Storage troubleshooting', 'OS installation', 'Peripheral configuration'] },
  { icon: '🪟', name: 'Windows', points: ['Windows deployment', 'Windows troubleshooting', 'User support', 'System administration'] },
  { icon: '🌐', name: 'Networking', points: ['LAN setup', 'IP configuration', 'Network troubleshooting', 'Shared resources', 'Connectivity diagnostics'] },
  { icon: '🗄️', name: 'Servers', points: ['Server management', 'Application hosting', 'File services', 'Backup', 'Access management'] },
  { icon: '💾', name: 'Software', points: ['Application deployment', 'Troubleshooting', 'Updates', 'Configuration', 'User support'] }
];
