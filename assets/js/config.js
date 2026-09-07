/* ============================================================
   PORTFOLIO CONFIG — EDIT THIS FILE to update all content.
   Placeholders are marked [ ... ]. No code changes needed.
   ============================================================ */
'use strict';

const SITE_CONFIG = {
  stats: { projects: '07', technologies: '15+' }, // configurable demo figures
  contact: {
    email: '[Add Email]',
    linkedin: '[Add LinkedIn]',
    github: '[Add GitHub]',
    facebook: '[Add Facebook]',
    other: '[Add Other Professional Link]'
  },
  resumeFile: '[add-your-resume.pdf]', // place PDF in project root; rename here
  about: [ // default About paragraphs (editable in /admin)
    'I\u2019m Justin Marcus Santiago — an IT professional who builds systems and protects them. My work spans software development, IT operations, infrastructure, and cybersecurity, including hands-on experience supporting Trend Micro endpoint and server-side security technologies.',
    'I enjoy solving technical problems that matter: turning manual spreadsheet workflows into proper web applications, keeping endpoints and servers protected, troubleshooting hardware and networks, and automating repetitive work so teams can move faster.',
    'I don\u2019t treat security as an afterthought. Every system I build is designed with authentication, access control, and safe data handling from the start.'
  ]
};


/* ---------- Security Operations Center modules ---------- */
const SOC_MODULES = {
  endpoint: {
    title: 'Endpoint Security', status: 'PROTECTED',
    desc: 'Hands-on experience supporting Trend Micro endpoint security in an enterprise environment — deploying protection, managing policies, and investigating security events on user devices.',
    points: ['Endpoint protection deployment', 'Malware prevention & threat detection', 'Security policy management', 'Security event handling & investigation', 'Endpoint visibility & reporting']
  },
  server: {
    title: 'Server Security', status: 'SECURE',
    desc: 'Server-side security experience with Trend Micro technologies: protecting workloads, enforcing policies, and monitoring servers for threats.',
    points: ['Workload protection', 'Threat prevention & malware detection', 'Security policy enforcement', 'Server monitoring & event investigation', 'Infrastructure protection']
  },
  network: {
    title: 'Network Security', status: 'ONLINE',
    desc: 'Solid grounding in network fundamentals and troubleshooting — TCP/IP, LAN, VLAN, DNS, DHCP, firewall concepts, and connectivity diagnostics.',
    points: ['TCP/IP & LAN administration', 'VLAN segmentation concepts', 'DNS / DHCP management', 'Firewall concepts', 'Network troubleshooting']
  },
  appsec: {
    title: 'Application Security', status: 'HARDENED',
    desc: 'I build web applications with security designed in from the start — authentication, input validation, session security, and OWASP-informed practices.',
    points: ['Secure authentication & authorization', 'Input validation & output encoding', 'Session security', 'Secure file handling', 'OWASP principles applied in real projects']
  },
  monitoring: {
    title: 'Monitoring', status: 'ACTIVE',
    desc: 'Log analysis, alert triage, and security event investigation across endpoints and servers — turning raw events into actionable decisions.',
    points: ['Log analysis', 'Security event investigation', 'Alert review & triage', 'Reporting & documentation']
  },
  backup: {
    title: 'Backup & Recovery', status: 'READY',
    desc: 'Backup planning, execution, and recovery testing — protection is not complete without the ability to restore.',
    points: ['Backup scheduling & execution', 'Recovery procedures', 'Data protection practices', 'Restoration verification']
  },
  ir: {
    title: 'Incident Response', status: 'STANDBY',
    desc: 'Structured incident identification, containment thinking, documentation, and escalation — calm, methodical response over panic.',
    points: ['Incident identification', 'Initial containment steps', 'Evidence & log preservation', 'Documentation & escalation']
  }
};

/* ---------- Cybersecurity skills matrix ---------- */
const SKILL_CATEGORIES = [
  { name: 'Endpoint Security', icon: '🛡️', skills: [['Endpoint protection', 80], ['Malware prevention', 78], ['Threat detection', 72], ['Security monitoring', 75], ['Policy management', 70]] },
  { name: 'Server Security', icon: '🖥️', skills: [['Server hardening', 68], ['Server protection', 75], ['Security monitoring', 72], ['Access control', 74], ['Patch management', 70]] },
  { name: 'Network Security', icon: '🌐', skills: [['TCP/IP', 82], ['LAN / VLAN', 76], ['DNS / DHCP', 78], ['Firewall concepts', 65], ['Network troubleshooting', 84]] },
  { name: 'Application Security', icon: '🔒', skills: [['Secure authentication', 74], ['Authorization', 72], ['Input validation', 78], ['Session security', 70], ['OWASP principles', 68]] },
  { name: 'Security Operations', icon: '📋', skills: [['Incident identification', 72], ['Log analysis', 74], ['Troubleshooting', 85], ['Backup & recovery', 76], ['Documentation', 82]] }
];
