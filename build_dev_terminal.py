#!/usr/bin/env python3
"""Build the holographic dev terminal for NexVault app.html"""

with open('C:/Users/toonz/OneDrive/Desktop/NexVault/app.html', 'r', encoding='utf-8') as f:
    c = f.read()

# ═══════════════════════════════════════════
# 1. ADD HOLOGRAPHIC CSS before /* ── Responsive ── */
# ═══════════════════════════════════════════
holo_css = """
    /* ══ DEV TERMINAL — Holographic Terminal ══ */
    #dev-terminal{display:none;position:relative;min-height:100vh}
    #dev-terminal-bg{position:fixed;inset:0;z-index:0;pointer-events:none}
    .dev-scan{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.03;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,255,.15) 2px,rgba(0,255,255,.15) 4px);animation:scan-down 8s linear infinite}
    @keyframes scan-down{0%{transform:translateY(0)}100%{transform:translateY(4px)}}
    @keyframes holo-flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.7}94%{opacity:1}96%{opacity:.85}97%{opacity:1}}
    @keyframes glow-pulse{0%,100%{box-shadow:0 0 8px rgba(0,255,255,.1),inset 0 0 8px rgba(0,255,255,.03)}50%{box-shadow:0 0 16px rgba(0,255,255,.2),inset 0 0 12px rgba(0,255,255,.05)}}
    @keyframes data-scroll{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}
    .dev-content{position:relative;z-index:1;max-width:1280px;margin:0 auto;padding:20px 20px 60px}
    .dev-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding:16px 20px;background:rgba(0,255,255,.03);border:1px solid rgba(0,255,255,.1);border-radius:14px;animation:holo-flicker 4s ease-in-out infinite}
    .dev-title{font-family:'Playfair Display',serif;font-size:22px;color:#00ffff;font-weight:400;letter-spacing:.08em;display:flex;align-items:center;gap:12px}
    .dev-badge{padding:3px 10px;border-radius:4px;font-size:9px;font-weight:700;letter-spacing:.1em}
    .dev-badge-red{background:rgba(248,113,113,.12);border:1px solid rgba(248,113,113,.25);color:#f87171}
    .dev-badge-green{background:rgba(0,255,255,.08);border:1px solid rgba(0,255,255,.2);color:#00ffff;display:flex;align-items:center;gap:5px}
    .dev-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:20px}
    .holo-card{padding:18px 16px;background:rgba(0,255,255,.02);border:1px solid rgba(0,255,255,.1);border-radius:12px;position:relative;overflow:hidden;animation:glow-pulse 4s ease-in-out infinite;transition:border-color .2s}
    .holo-card:hover{border-color:rgba(0,255,255,.3)}
    .holo-card::before{content:'';position:absolute;top:0;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,rgba(0,255,255,.4),transparent)}
    .holo-label{font-size:9px;letter-spacing:.12em;color:#4a6a7a;font-weight:500;margin-bottom:6px;text-transform:uppercase}
    .holo-value{font-family:'Playfair Display',serif;font-size:22px;font-weight:300;color:#00ffff;line-height:1.1}
    .holo-sub{font-size:10px;color:#2a4a5a;margin-top:3px}
    .dev-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
    .dev-panel-card{background:rgba(0,10,20,.6);border:1px solid rgba(0,255,255,.08);border-radius:12px;overflow:hidden}
    .dev-panel-h{padding:14px 18px;border-bottom:1px solid rgba(0,255,255,.06);display:flex;align-items:center;justify-content:space-between}
    .dev-panel-t{font-size:10px;letter-spacing:.1em;color:#4a8a9a;font-weight:600;text-transform:uppercase}
    .dev-panel-b{padding:16px 18px}
    .feed-list{max-height:280px;overflow:hidden;position:relative}
    .feed-scroll{animation:data-scroll 30s linear infinite}
    .feed-item{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(0,255,255,.04);font-size:11px}
    .feed-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
    .feed-addr{color:#4a8a9a;font-family:'DM Mono',monospace}
    .feed-amt{color:#00ffff;font-weight:500;margin-left:auto}
    .feed-time{color:#2a4a5a;font-size:9px;min-width:50px;text-align:right}
    .tier-bar-wrap{margin-bottom:12px}
    .tier-bar-label{display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px}
    .tier-bar-name{color:#6aa0b0}
    .tier-bar-pct{color:#00ffff;font-weight:600}
    .tier-bar-bg{height:6px;border-radius:3px;background:rgba(0,255,255,.06);overflow:hidden}
    .tier-bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,rgba(0,255,255,.3),#00ffff);transition:width 1s ease}
    .admin-row{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:rgba(0,255,255,.02);border:1px solid rgba(0,255,255,.06);border-radius:8px;margin-bottom:8px}
    .admin-label{font-size:12px;color:#6aa0b0}
    .admin-sub{font-size:10px;color:#2a4a5a;margin-top:2px}
    .admin-btn{padding:6px 14px;border-radius:6px;font-size:10px;font-weight:600;letter-spacing:.06em;cursor:pointer;font-family:'DM Mono',monospace;border:1px solid rgba(0,255,255,.2);background:rgba(0,255,255,.06);color:#00ffff;transition:all .2s}
    .admin-btn:hover{background:rgba(0,255,255,.12);border-color:rgba(0,255,255,.4)}
    .admin-btn-red{border-color:rgba(248,113,113,.2);background:rgba(248,113,113,.06);color:#f87171}
    .admin-btn-red:hover{background:rgba(248,113,113,.12)}
    .addr-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}
    .addr-card{padding:14px;background:rgba(0,255,255,.02);border:1px solid rgba(0,255,255,.06);border-radius:8px}
    .addr-label{font-size:9px;letter-spacing:.1em;color:#4a6a7a;margin-bottom:6px;font-weight:600}
    .addr-val{font-size:10px;color:#4a8a9a;font-family:'DM Mono',monospace;word-break:break-all;cursor:pointer;transition:color .15s}
    .addr-val:hover{color:#00ffff}
    .deploy-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .deploy-card{padding:14px;text-align:center;background:rgba(0,255,255,.02);border:1px solid rgba(0,255,255,.06);border-radius:8px}
    .deploy-label{font-size:9px;letter-spacing:.1em;color:#4a6a7a;margin-bottom:6px;font-weight:600}
    .deploy-val{font-size:14px;color:#00ffff;font-weight:600}
    .deploy-sub{font-size:10px;color:#2a4a5a;margin-top:2px}
    @media(max-width:960px){.dev-stats{grid-template-columns:repeat(3,1fr)}.dev-grid{grid-template-columns:1fr}.addr-grid{grid-template-columns:1fr 1fr}}
    @media(max-width:600px){.dev-stats{grid-template-columns:1fr 1fr}.addr-grid{grid-template-columns:1fr}.deploy-grid{grid-template-columns:1fr}}
"""

c = c.replace('    .hide-mobile{}', holo_css + '\n    .hide-mobile{}', 1)
print('1. Added holographic CSS')

# ═══════════════════════════════════════════
# 2. WRAP USER DASHBOARD in <div id="user-dashboard">
# ═══════════════════════════════════════════
c = c.replace('  <!-- Protocol Stats -->', '  <div id="user-dashboard">\n  <!-- Protocol Stats -->', 1)
c = c.replace('  </div><!-- /grid -->\n\n  <!-- ', '  </div><!-- /grid -->\n  </div><!-- /user-dashboard -->\n\n  <!-- ', 1)
print('2. Wrapped user dashboard in #user-dashboard')

# ═══════════════════════════════════════════
# 3. REPLACE DEV-PANEL with HOLOGRAPHIC TERMINAL
# ═══════════════════════════════════════════
old_dev_start = '  <div id="dev-panel" style="display:none;margin-top:24px">'
old_dev_end = '  </div><!-- /dev-panel -->'

# Find the exact block
start_idx = c.index(old_dev_start)
end_idx = c.index(old_dev_end) + len(old_dev_end)

new_terminal = """  <!-- ═══ HOLOGRAPHIC DEV TERMINAL ═══ -->
  <div id="dev-terminal" style="display:none">
    <canvas id="dev-terminal-bg"></canvas>
    <div class="dev-scan"></div>
    <div class="dev-content">

      <!-- Header -->
      <div class="dev-header">
        <div class="dev-title">
          <span style="font-size:18px;color:#00ffff">&#x25C8;</span>
          NEXVAULT MISSION CONTROL
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <div class="dev-badge dev-badge-red">DEV ONLY</div>
          <div class="dev-badge dev-badge-green"><div style="width:5px;height:5px;border-radius:50%;background:#00ffff;animation:pulse 1.5s infinite"></div>LIVE</div>
        </div>
      </div>

      <!-- Protocol Stats -->
      <div class="dev-stats">
        <div class="holo-card">
          <div class="holo-label">Total Value Locked</div>
          <div class="holo-value" id="dt-tvl">$0.00</div>
          <div class="holo-sub">All deposits</div>
        </div>
        <div class="holo-card">
          <div class="holo-label">Total Principal</div>
          <div class="holo-value" id="dt-principal" style="color:#60a5fa">$0.00</div>
          <div class="holo-sub">User deposits</div>
        </div>
        <div class="holo-card">
          <div class="holo-label">Protocol Earnings</div>
          <div class="holo-value" id="dt-earnings" style="color:#fbbf24">$0.00</div>
          <div class="holo-sub">10% dev cut</div>
        </div>
        <div class="holo-card">
          <div class="holo-label">Active Depositors</div>
          <div class="holo-value" id="dt-depositors" style="color:#a78bfa">0</div>
          <div class="holo-sub">Unique wallets</div>
        </div>
        <div class="holo-card">
          <div class="holo-label">Vault Health</div>
          <div class="holo-value" id="dt-health" style="color:#4ade80">HEALTHY</div>
          <div class="holo-sub">Balance &#x2265; principal</div>
        </div>
      </div>

      <!-- Live Feed + Tier/Yield Distribution -->
      <div class="dev-grid">
        <!-- Live Feed -->
        <div class="dev-panel-card">
          <div class="dev-panel-h">
            <span class="dev-panel-t">Live Protocol Feed</span>
            <div style="display:flex;align-items:center;gap:4px;font-size:9px;color:#00ffff"><div style="width:4px;height:4px;border-radius:50%;background:#00ffff;animation:pulse 1.5s infinite"></div>STREAMING</div>
          </div>
          <div class="dev-panel-b" style="padding:0">
            <div class="feed-list">
              <div class="feed-scroll" id="dt-feed">
                <div class="feed-item"><div class="feed-dot" style="background:#4ade80"></div><span style="color:#4ade80">DEPOSIT</span><span class="feed-addr">0x7a3f...e21b</span><span class="feed-amt">+$25,000</span><span class="feed-time">2m ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#4ade80"></div><span style="color:#4ade80">DEPOSIT</span><span class="feed-addr">0x9c1d...4f8a</span><span class="feed-amt">+$10,000</span><span class="feed-time">5m ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#fbbf24"></div><span style="color:#fbbf24">YIELD</span><span class="feed-addr">GYDS</span><span class="feed-amt">+$1,247</span><span class="feed-time">12m ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#60a5fa"></div><span style="color:#60a5fa">COMPOUND</span><span class="feed-addr">0x3b2e...71c9</span><span class="feed-amt">$42.18</span><span class="feed-time">18m ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#4ade80"></div><span style="color:#4ade80">DEPOSIT</span><span class="feed-addr">0xf1a8...2d5e</span><span class="feed-amt">+$50,000</span><span class="feed-time">24m ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#a78bfa"></div><span style="color:#a78bfa">BADGE</span><span class="feed-addr">0x2c9f...8b3a</span><span class="feed-amt">#47</span><span class="feed-time">31m ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#f87171"></div><span style="color:#f87171">WITHDRAW</span><span class="feed-addr">0x5e7d...a1c4</span><span class="feed-amt">-$8,500</span><span class="feed-time">45m ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#4ade80"></div><span style="color:#4ade80">DEPOSIT</span><span class="feed-addr">0xd4b3...6e9f</span><span class="feed-amt">+$175,000</span><span class="feed-time">1h ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#fbbf24"></div><span style="color:#fbbf24">YIELD</span><span class="feed-addr">GYDS</span><span class="feed-amt">+$892</span><span class="feed-time">1h ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#4ade80"></div><span style="color:#4ade80">DEPOSIT</span><span class="feed-addr">0x8a1c...3f7b</span><span class="feed-amt">+$5,000</span><span class="feed-time">2h ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#4ade80"></div><span style="color:#4ade80">DEPOSIT</span><span class="feed-addr">0x7a3f...e21b</span><span class="feed-amt">+$25,000</span><span class="feed-time">2m ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#fbbf24"></div><span style="color:#fbbf24">YIELD</span><span class="feed-addr">GYDS</span><span class="feed-amt">+$1,247</span><span class="feed-time">12m ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#60a5fa"></div><span style="color:#60a5fa">COMPOUND</span><span class="feed-addr">0x3b2e...71c9</span><span class="feed-amt">$42.18</span><span class="feed-time">18m ago</span></div>
                <div class="feed-item"><div class="feed-dot" style="background:#4ade80"></div><span style="color:#4ade80">DEPOSIT</span><span class="feed-addr">0xf1a8...2d5e</span><span class="feed-amt">+$50,000</span><span class="feed-time">24m ago</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Tier + Yield Distribution -->
        <div style="display:flex;flex-direction:column;gap:16px">
          <!-- Tier Distribution -->
          <div class="dev-panel-card">
            <div class="dev-panel-h">
              <span class="dev-panel-t">Tier Distribution</span>
            </div>
            <div class="dev-panel-b">
              <div class="tier-bar-wrap">
                <div class="tier-bar-label"><span class="tier-bar-name">1-Year Lock (3.75%)</span><span class="tier-bar-pct">42%</span></div>
                <div class="tier-bar-bg"><div class="tier-bar-fill" style="width:42%"></div></div>
              </div>
              <div class="tier-bar-wrap">
                <div class="tier-bar-label"><span class="tier-bar-name">3-Year Lock (3.92%)</span><span class="tier-bar-pct">35%</span></div>
                <div class="tier-bar-bg"><div class="tier-bar-fill" style="width:35%"></div></div>
              </div>
              <div class="tier-bar-wrap">
                <div class="tier-bar-label"><span class="tier-bar-name">5-Year Lock (4.38%)</span><span class="tier-bar-pct">23%</span></div>
                <div class="tier-bar-bg"><div class="tier-bar-fill" style="width:23%"></div></div>
              </div>
            </div>
          </div>

          <!-- Admin Controls -->
          <div class="dev-panel-card">
            <div class="dev-panel-h">
              <span class="dev-panel-t">Admin Controls</span>
              <div class="dev-badge dev-badge-red" style="font-size:8px">OWNER</div>
            </div>
            <div class="dev-panel-b">
              <div class="admin-row">
                <div><div class="admin-label">Emergency Pause</div><div class="admin-sub">Blocks new deposits</div></div>
                <div style="padding:4px 12px;border-radius:4px;font-size:10px;font-weight:600;background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.15);color:#4ade80">ACTIVE</div>
              </div>
              <div class="admin-row">
                <div><div class="admin-label">Claim Dev Earnings</div><div class="admin-sub">Withdraw protocol fees</div></div>
                <button class="admin-btn">CLAIM</button>
              </div>
              <div class="admin-row">
                <div><div class="admin-label">Compound All Users</div><div class="admin-sub">Batch auto-compound</div></div>
                <button class="admin-btn">RUN BATCH</button>
              </div>
              <div class="admin-row">
                <div><div class="admin-label">GYDS Address</div><div class="admin-sub" id="dt-gyds" style="font-family:'DM Mono',monospace;color:#4a8a9a">Not configured</div></div>
                <button class="admin-btn" style="font-size:9px">SET</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contract Addresses -->
      <div class="addr-grid">
        <div class="addr-card">
          <div class="addr-label">USDXVAULT</div>
          <div class="addr-val" onclick="navigator.clipboard.writeText(this.textContent);this.style.color='#4ade80';setTimeout(()=>this.style.color='',500)" id="dt-vault-addr">Pending deploy</div>
        </div>
        <div class="addr-card">
          <div class="addr-label">GENESIS BADGE</div>
          <div class="addr-val" onclick="navigator.clipboard.writeText(this.textContent);this.style.color='#4ade80';setTimeout(()=>this.style.color='',500)" id="dt-badge-addr">Pending deploy</div>
        </div>
        <div class="addr-card">
          <div class="addr-label">REFERRAL REGISTRY</div>
          <div class="addr-val" onclick="navigator.clipboard.writeText(this.textContent);this.style.color='#4ade80';setTimeout(()=>this.style.color='',500)" id="dt-ref-addr">Pending deploy</div>
        </div>
        <div class="addr-card">
          <div class="addr-label">AUTO-COMPOUNDER</div>
          <div class="addr-val" onclick="navigator.clipboard.writeText(this.textContent);this.style.color='#4ade80';setTimeout(()=>this.style.color='',500)" id="dt-comp-addr">Pending deploy</div>
        </div>
      </div>

      <!-- Deployment Status -->
      <div class="deploy-grid">
        <div class="deploy-card">
          <div class="deploy-label">CONTRACTS</div>
          <div class="deploy-val" style="color:#4ade80">175/175 TESTS</div>
          <div class="deploy-sub">All passing</div>
        </div>
        <div class="deploy-card">
          <div class="deploy-label">NETWORK</div>
          <div class="deploy-val" id="dt-network">TESTNET</div>
          <div class="deploy-sub">Nexus Blockchain</div>
        </div>
        <div class="deploy-card">
          <div class="deploy-label">ZKVM</div>
          <div class="deploy-val" style="color:#60a5fa">v3.0</div>
          <div class="deploy-sub">Stwo STARK prover</div>
        </div>
      </div>

    </div><!-- /dev-content -->
  </div><!-- /dev-terminal -->"""

c = c[:start_idx] + new_terminal + '\n' + c[end_idx:]
print('3. Replaced dev-panel with holographic terminal')

# ═══════════════════════════════════════════
# 4. UPDATE JS: finalizeConnection — hide user-dashboard, show dev-terminal
# ═══════════════════════════════════════════
old_dev_js = """    const isDev = DEV_WALLETS.some(w => w.toLowerCase() === address.toLowerCase());
    if (isDev) {
      const devPanel = document.getElementById('dev-panel');
      if (devPanel) devPanel.style.display = 'block';
      showNotif('Founder wallet connected — Dev Dashboard active', 'ok');
    } else {
      showNotif('Wallet connected: ' + short, 'ok');
    }
    console.log('[NexVault] Connected wallet:', address, isDev ? '(DEV)' : '(USER)');"""

new_dev_js = """    const isDev = DEV_WALLETS.some(w => w.toLowerCase() === address.toLowerCase());
    if (isDev) {
      // Hide entire user dashboard, show holographic dev terminal
      const userDash = document.getElementById('user-dashboard');
      const devTerminal = document.getElementById('dev-terminal');
      if (userDash) userDash.style.display = 'none';
      if (devTerminal) { devTerminal.style.display = 'block'; startDevStarfield(); }
      showNotif('Mission Control activated', 'ok');
    } else {
      showNotif('Wallet connected: ' + short, 'ok');
    }
    console.log('[NexVault] Connected wallet:', address, isDev ? '(DEV)' : '(USER)');"""

if old_dev_js in c:
    c = c.replace(old_dev_js, new_dev_js, 1)
    print('4. Updated finalizeConnection JS')
else:
    print('4. WARNING: Could not find finalizeConnection dev JS block')

# ═══════════════════════════════════════════
# 5. UPDATE disconnectWallet — hide dev-terminal, show user-dashboard
# ═══════════════════════════════════════════
old_disconnect = """  // Hide dev panel
  const devPanel = document.getElementById('dev-panel');
  if (devPanel) devPanel.style.display = 'none';"""

new_disconnect = """  // Hide dev terminal, show user dashboard
  const devTerminal = document.getElementById('dev-terminal');
  if (devTerminal) devTerminal.style.display = 'none';
  const userDash = document.getElementById('user-dashboard');
  if (userDash) userDash.style.display = 'block';
  stopDevStarfield();"""

if old_disconnect in c:
    c = c.replace(old_disconnect, new_disconnect, 1)
    print('5. Updated disconnectWallet JS')
else:
    print('5. WARNING: Could not find disconnectWallet dev panel block')

# ═══════════════════════════════════════════
# 6. ADD STARFIELD ANIMATION before </script>
# ═══════════════════════════════════════════
starfield_js = """
// ── Dev Terminal Starfield Animation ──
let devStarfieldRunning = false;
let devStarfieldRAF = null;
function startDevStarfield() {
  const c = document.getElementById('dev-terminal-bg');
  if (!c) return;
  const cx = c.getContext('2d');
  const stars = [];
  devStarfieldRunning = true;

  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  // Create stars with parallax layers
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 1.2 + 0.1,
      speed: Math.random() * 0.3 + 0.05,
      o: Math.random() * 0.6 + 0.1,
    });
  }

  // Data rain characters
  const rainCols = Math.floor(c.width / 14);
  const rainY = new Array(rainCols).fill(0).map(() => Math.random() * c.height);
  const chars = '0123456789ABCDEF$%'.split('');

  function draw() {
    if (!devStarfieldRunning) return;
    cx.fillStyle = 'rgba(10,14,26,0.15)';
    cx.fillRect(0, 0, c.width, c.height);

    // Stars
    stars.forEach(s => {
      s.y -= s.speed;
      if (s.y < 0) { s.y = c.height; s.x = Math.random() * c.width; }
      cx.beginPath();
      cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      cx.fillStyle = 'rgba(0,255,255,' + s.o + ')';
      cx.fill();
    });

    // Data rain (subtle)
    cx.font = '10px "DM Mono"';
    for (let i = 0; i < rainCols; i++) {
      if (Math.random() > 0.97) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        cx.fillStyle = 'rgba(0,255,255,0.06)';
        cx.fillText(char, i * 14, rainY[i]);
        rainY[i] += 14;
        if (rainY[i] > c.height) rainY[i] = 0;
      }
    }

    devStarfieldRAF = requestAnimationFrame(draw);
  }
  draw();
}

function stopDevStarfield() {
  devStarfieldRunning = false;
  if (devStarfieldRAF) cancelAnimationFrame(devStarfieldRAF);
}
"""

c = c.replace('</script>\n</body>', starfield_js + '</script>\n</body>', 1)
print('6. Added starfield animation JS')

with open('C:/Users/toonz/OneDrive/Desktop/NexVault/app.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('\nAll holographic terminal changes applied!')
