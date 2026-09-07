<?php
/** Admin dashboard — no-code content editing for the portfolio. */
declare(strict_types=1);
require dirname(__DIR__) . '/api/common.php';
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,nofollow">
<title>Portfolio Admin</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230b0f17'/%3E%3Cpath d='M16 6l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V9z' fill='none' stroke='%2322d3ee' stroke-width='2'/%3E%3C/svg%3E">
<style>
:root{--bg:#0b0f17;--surface:#131a28;--s2:#1a2336;--border:#233047;--text:#e8edf5;--muted:#8b98ad;--cyan:#22d3ee;--green:#34d399;--danger:#f87171;--warn:#fbbf24}
*{box-sizing:border-box}body{margin:0;font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.5}
.wrap{max-width:960px;margin:2rem auto;padding:0 1rem}
h1{font-size:1.4rem}.mono{font-family:Consolas,monospace}
.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.4rem;margin-bottom:1.2rem}
label{display:block;font-size:.85rem;color:var(--muted);margin:.8rem 0 .25rem}
input[type=text],input[type=password],input[type=url],textarea,select{width:100%;background:var(--s2);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:.6rem .8rem;font-family:inherit;font-size:.95rem}
textarea{min-height:80px;resize:vertical}
.btn{display:inline-block;background:linear-gradient(120deg,#22d3ee,#3b82f6);color:#07121d;border:0;border-radius:8px;padding:.6rem 1.3rem;font-weight:700;cursor:pointer;font-size:.92rem;transition:filter .15s,transform .1s}
.btn:hover{filter:brightness(1.15)}
.btn:active{transform:scale(.97)}
.btn:disabled{opacity:.6;cursor:not-allowed}
.btn.secondary{background:var(--s2);color:var(--text);border:1px solid var(--border)}
.btn.danger{background:none;color:var(--danger);border:1px solid var(--danger)}
.btn.sm{padding:.35rem .8rem;font-size:.8rem}
.row{display:flex;gap:.6rem;align-items:center;flex-wrap:wrap}
.status{font-size:.85rem;min-height:1.3em;margin-top:.5rem}
.ok{color:var(--green)}.err{color:var(--danger)}
.banner{background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.4);color:var(--warn);padding:.8rem 1rem;border-radius:10px;font-size:.9rem;margin-bottom:1.2rem}
.tabs{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.2rem}
.tab{background:var(--surface);border:1px solid var(--border);color:var(--muted);border-radius:8px;padding:.5rem 1rem;cursor:pointer}
.tab.active{color:var(--cyan);border-color:var(--cyan)}
.item{border:1px solid var(--border);border-radius:10px;padding:1rem;margin-bottom:.9rem;background:var(--s2)}
.item .head{display:flex;justify-content:space-between;align-items:center;gap:.6rem;margin-bottom:.4rem}
.item h3{margin:0;font-size:1rem}
.shots{display:flex;flex-wrap:wrap;gap:.5rem;margin:.3rem 0 .6rem}
.shot{position:relative;width:110px;height:64px;border-radius:6px;border:1px solid var(--border);overflow:hidden}
.shot img{width:100%;height:100%;object-fit:cover;display:block}
.shot button{position:absolute;top:2px;right:2px;width:20px;height:20px;border:0;border-radius:50%;background:rgba(11,15,23,.8);color:var(--danger);cursor:pointer;font-size:.7rem;line-height:1}
.shot button:hover{background:var(--danger);color:#fff}
.hidden{display:none}
a{color:var(--cyan)}
</style>
</head>
<body>
<div class="wrap">
<h1>⚙️ Portfolio Admin <span class="mono" style="font-size:.75rem;color:var(--muted)">— no code needed</span></h1>

<!-- Login screen -->
<div class="card" id="loginCard">
  <h2>Log in</h2>
  <label>Username</label><input type="text" id="liUser" autocomplete="username">
  <label>Password</label><input type="password" id="liPass" autocomplete="current-password">
  <p class="status err mono" id="liErr"></p>
  <button class="btn" id="liBtn">Log In</button>
  <p style="font-size:.78rem;color:var(--muted)">First-time login: user <b>admin</b>, password <b>ChangeMe2026!</b> — you'll be asked to change it.</p>
</div>

<!-- Dashboard -->
<div id="dash" class="hidden">
  <div class="banner hidden" id="defaultPwBanner">⚠️ You are using the default password. Change it in the <b>Account</b> tab.</div>
  <div class="row" style="justify-content:space-between;margin-bottom:1rem">
    <div class="tabs" id="tabs">
      <button class="tab active" data-t="contact">Contact &amp; Stats</button>
      <button class="tab" data-t="about">About Me</button>
      <button class="tab" data-t="projects">Projects</button>
      <button class="tab" data-t="timeline">Experience</button>
      <button class="tab" data-t="certifications">Certifications</button>
      <button class="tab" data-t="account">Account</button>
    </div>
    <div class="row">
      <a class="btn secondary sm" href="../index.html" target="_blank">View site ↗</a>
      <button class="btn danger sm" id="logoutBtn">Log out</button>
    </div>
  </div>


  <!-- CONTACT & STATS -->
  <div class="card panel" id="p-contact">
    <h2>Contact links &amp; stats</h2>
    <p style="color:var(--muted);font-size:.85rem">Leave a field as "[Add ...]" to show an elegant placeholder on the site.</p>
    <label>Email</label><input type="text" id="c-email">
    <label>LinkedIn URL</label><input type="text" id="c-linkedin">
    <label>GitHub URL</label><input type="text" id="c-github">
    <label>Facebook URL</label><input type="text" id="c-facebook">
    <label>Other link</label><input type="text" id="c-other">
    <hr style="border-color:var(--border)">
    <label>Projects stat (hero)</label><input type="text" id="s-projects">
    <label>Technologies stat (hero)</label><input type="text" id="s-technologies">
    <p class="status mono" id="st-contact"></p>
    <button class="btn saveBtn" data-section="contact">💾 Save</button>
  </div>

  <!-- ABOUT -->
  <div class="card panel hidden" id="p-about">
    <h2>About Me paragraphs</h2>
    <textarea id="about0" rows="4"></textarea>
    <textarea id="about1" rows="4" style="margin-top:.6rem"></textarea>
    <textarea id="about2" rows="4" style="margin-top:.6rem"></textarea>
    <p class="status mono" id="st-about"></p>
    <button class="btn saveBtn" data-section="about">💾 Save</button>
  </div>

  <!-- PROJECTS -->
  <div class="card panel hidden" id="p-projects">
    <h2>Projects</h2>
    <div id="projList"></div>
    <button class="btn secondary sm" id="addProj">＋ Add project</button>
    <p class="status mono" id="st-projects"></p>
    <button class="btn saveBtn" data-section="projects" style="margin-top:.8rem">💾 Save all projects</button>
  </div>

  <!-- TIMELINE -->
  <div class="card panel hidden" id="p-timeline">
    <h2>Experience timeline</h2>
    <div id="tlList"></div>
    <button class="btn secondary sm" id="addTl">＋ Add entry</button>
    <p class="status mono" id="st-timeline"></p>
    <button class="btn saveBtn" data-section="timeline" style="margin-top:.8rem">💾 Save timeline</button>
  </div>

  <!-- CERTIFICATIONS -->
  <div class="card panel hidden" id="p-certifications">
    <h2>Certifications</h2>
    <div id="certList"></div>
    <button class="btn secondary sm" id="addCert">＋ Add certification</button>
    <p class="status mono" id="st-certifications"></p>
    <button class="btn saveBtn" data-section="certifications" style="margin-top:.8rem">💾 Save certifications</button>
  </div>

  <!-- ACCOUNT -->
  <div class="card panel hidden" id="p-account">
    <h2>Change password</h2>
    <label>Current password</label><input type="password" id="pwCur">
    <label>New password (min 10 characters)</label><input type="password" id="pwNew">
    <p class="status mono" id="st-pw"></p>
    <button class="btn" id="pwBtn">Update password</button>
    <hr style="border-color:var(--border);margin:1.4rem 0">
    <h2>Upload a project image</h2>
    <p style="color:var(--muted);font-size:.85rem">JPG / PNG / WebP, max 3 MB. Copy the returned path into a project's screenshot field.</p>
    <input type="file" id="imgFile" accept="image/jpeg,image/png,image/webp">
    <p class="status mono" id="st-img"></p>
    <button class="btn secondary" id="imgBtn">⬆ Upload image</button>
  </div>

  <p style="text-align:center;color:var(--muted);font-size:.78rem;margin-top:2rem">Portfolio Admin — Justin Marcus Santiago. All actions are audit-logged.</p>
</div>
<script src="../assets/js/config.js?v=<?= filemtime(dirname(__DIR__) . '/assets/js/config.js') ?>"></script>
<script src="../assets/js/data.js?v=<?= filemtime(dirname(__DIR__) . '/assets/js/data.js') ?>"></script>
<script src="../assets/js/data2.js?v=<?= filemtime(dirname(__DIR__) . '/assets/js/data2.js') ?>"></script>
<script src="admin-v2.js"></script>

</body>
</html>

