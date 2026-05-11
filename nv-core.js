/* ═══════════════════════════════════════════════════════════════
   NexVault Core — Scroll reveal, chat, sidebar
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Scroll Reveal ────────────────────────────────────────── */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ── Chat ─────────────────────────────────────────────────── */
  var chatTree = {
    root: { msg: "Hey! I'm the NexVault Assistant. What would you like to know?", pills: [
      { text: "What is NexVault?", goto: "what" }, { text: "Yield tiers?", goto: "tiers" },
      { text: "How do I start?", goto: "start" }, { text: "Is it safe?", goto: "safe" }
    ]},
    what: { msg: "NexVault is a non-custodial USDX savings vault on Nexus blockchain. Deposit USDX, choose a lock period, earn up to 4.38% APY backed by U.S. Treasury yields.", pills: [
      { text: "Open Vault", goto: "lv" }, { text: "Back", goto: "root" }
    ]},
    tiers: { msg: "Three tiers:\n\u2022 1-Year \u2014 3.75% APY\n\u2022 3-Year \u2014 3.92% APY\n\u2022 5-Year \u2014 4.38% APY", pills: [
      { text: "Open Vault", goto: "lv" }, { text: "Back", goto: "root" }
    ]},
    start: { msg: "1. Install MetaMask\n2. Get USDX on Nexus\n3. Choose tier & deposit\n\nTakes about 5 minutes.", pills: [
      { text: "Open Vault", goto: "lv" }, { text: "Back", goto: "root" }
    ]},
    safe: { msg: "246 passing tests. Non-custodial. No admin keys. Open-source. On-chain yield verification.", pills: [
      { text: "View Security", goto: "ls" }, { text: "Back", goto: "root" }
    ]},
    lv: { msg: "Opening Vault...", action: "/app.html" },
    ls: { msg: "Opening Security...", action: "/security.html" }
  };

  var chatEl = null;
  function initChat() {
    var trigger = document.querySelector('.nv-chat-trigger');
    var panel = document.querySelector('.nv-chat-panel');
    var close = document.querySelector('.nv-chat-close-btn');
    chatEl = document.querySelector('.nv-chat-messages');
    if (!trigger || !panel || !chatEl) return;
    var open = false;
    trigger.addEventListener('click', function () {
      open = !open; panel.classList.toggle('open', open); trigger.classList.toggle('hidden', open);
      if (open && chatEl.children.length === 0) showNode('root');
    });
    if (close) close.addEventListener('click', function () {
      open = false; panel.classList.remove('open'); trigger.classList.remove('hidden');
    });
  }

  function showNode(key) {
    var n = chatTree[key]; if (!n) return;
    var t = document.createElement('div'); t.className = 'nv-chat-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    chatEl.appendChild(t); chatEl.scrollTop = chatEl.scrollHeight;
    setTimeout(function () {
      if (t.parentNode) t.parentNode.removeChild(t);
      var m = document.createElement('div'); m.className = 'nv-chat-msg bot'; m.textContent = n.msg;
      chatEl.appendChild(m);
      if (n.action) { setTimeout(function () { window.location.href = n.action; }, 600); return; }
      if (n.pills) {
        var w = document.createElement('div'); w.className = 'nv-chat-pills';
        n.pills.forEach(function (p) {
          var b = document.createElement('button'); b.className = 'nv-chat-pill'; b.textContent = p.text;
          b.addEventListener('click', function () {
            var u = document.createElement('div'); u.className = 'nv-chat-msg user'; u.textContent = p.text;
            chatEl.appendChild(u); if (w.parentNode) w.parentNode.removeChild(w);
            chatEl.scrollTop = chatEl.scrollHeight; showNode(p.goto);
          }); w.appendChild(b);
        }); chatEl.appendChild(w);
      }
      chatEl.scrollTop = chatEl.scrollHeight;
    }, 400);
  }

  /* ── Typed Message Handler ──────────────────────────────────── */
  var knowledgeBase = [
    { keys: ['what','nexvault','protocol','about'], answer: "NexVault is a non-custodial USDX savings vault on the Nexus blockchain. You deposit USDX stablecoins, choose a lock period (1, 3, or 5 years), and earn up to 4.38% APY backed by U.S. Treasury yields through GYDS." },
    { keys: ['apy','yield','rate','interest','earn','percent','4.38'], answer: "NexVault offers three yield tiers:\n\u2022 1-Year Lock \u2014 3.75% APY\n\u2022 3-Year Lock \u2014 3.92% APY\n\u2022 5-Year Lock \u2014 4.38% APY\n\nYield accrues every second and is backed by U.S. Treasury through GYDS." },
    { keys: ['tier','lock','1 year','3 year','5 year','commitment','duration'], answer: "Three tiers based on lock duration. 1-Year (365 days) at 3.75% APY, 3-Year (1,095 days) at 3.92% APY, and 5-Year (1,825 days) at 4.38% APY. Longer commitment = higher yield. Same rate for everyone regardless of deposit size." },
    { keys: ['deposit','how to','start','begin','get started','connect'], answer: "Getting started takes 3 steps:\n1. Install MetaMask wallet\n2. Get USDX on the Nexus network\n3. Connect to NexVault, choose a tier, and deposit\n\nThe whole process takes about 5 minutes." },
    { keys: ['safe','security','secure','trust','hack','risk','audit'], answer: "NexVault has 246 passing contract tests. It's fully non-custodial \u2014 your funds stay in the smart contract, only your wallet can withdraw. No admin withdrawal keys exist. The code is open source on GitHub. A CertiK audit is planned." },
    { keys: ['wallet','metamask','connect wallet','which wallet'], answer: "MetaMask is the only supported wallet. Install the browser extension for desktop or the MetaMask mobile app. NexVault also has a Windows desktop app available for download." },
    { keys: ['badge','genesis','nft','soulbound','early'], answer: "The first 5,000 depositors receive a non-transferable NFT Genesis Badge. Tiers: Founding Ten (#1-10), Vault Sentinel (#11-100), Vault Pioneer (#101-500), Vault Architect (#501-1000), Genesis (#1001-5000). Badges are soulbound \u2014 they cannot be transferred." },
    { keys: ['fee','cost','charge','commission','cut'], answer: "Zero deposit fees. Zero withdrawal fees. The protocol takes a 10% cut from yield earned only (not your principal). If you earn $100 in yield, $90 goes to you and $10 to the protocol." },
    { keys: ['gyds','treasury','yield source','where','backed'], answer: "Yield comes from GYDS \u2014 the Global Yield Distribution System. It channels real U.S. Treasury yield on-chain to the vault. Every distribution is recorded as a verifiable on-chain transaction." },
    { keys: ['withdraw','unlock','get money','cash out','remove'], answer: "You can withdraw your full principal plus all earned yield once your lock period ends. Withdrawals are always available \u2014 even if the protocol is paused for new deposits. No admin can block your withdrawal." },
    { keys: ['compound','auto','reinvest'], answer: "NexVault supports auto-compounding. When enabled, your earned yield is automatically added back to your principal, so you earn yield on your yield. This can be done by you or an authorized compound operator." },
    { keys: ['referral','refer','bonus','invite','friend'], answer: "NexVault has a referral system. Each referral adds +0.50% to your APY, up to 4 referrals maximum (+2.00% bonus). Referrals are registered on-chain at deposit time." },
    { keys: ['nexus','blockchain','chain','network'], answer: "NexVault runs on the Nexus blockchain, which uses zkVM v3.0 with Stwo STARK prover for zero-knowledge proof verification. It's a high-performance EVM-compatible chain." },
    { keys: ['open source','github','code','contract','verify'], answer: "All NexVault smart contracts are open source on GitHub at github.com/NexVaultGH/nexvault-contracts. 246 passing tests cover deposits, withdrawals, yield, compounding, badges, referrals, and security edge cases." },
    { keys: ['usdx','stablecoin','dollar','currency'], answer: "USDX is the stablecoin used by NexVault. It's pegged to the U.S. Dollar on the Nexus network. You deposit USDX into the vault to earn yield." },
    { keys: ['hello','hi','hey','sup','yo'], answer: "Hey! I'm the NexVault Assistant. Ask me anything about the vault, yield tiers, security, or how to get started!" }
  ];

  function findAnswer(text) {
    var lower = text.toLowerCase();
    var best = null, bestScore = 0;
    for (var i = 0; i < knowledgeBase.length; i++) {
      var score = 0;
      for (var j = 0; j < knowledgeBase[i].keys.length; j++) {
        if (lower.indexOf(knowledgeBase[i].keys[j]) >= 0) score++;
      }
      if (score > bestScore) { bestScore = score; best = knowledgeBase[i]; }
    }
    if (best && bestScore > 0) return best.answer;
    return "I'm not sure about that. Try asking about yield tiers, how to deposit, security, Genesis Badges, fees, or how to get started!";
  }

  window.nvSendChat = function () {
    var input = document.getElementById('chat-input');
    if (!input || !chatEl) return;
    var text = input.value.trim();
    if (!text) return;
    input.value = '';

    // Show user message
    var u = document.createElement('div');
    u.className = 'nv-chat-msg user';
    u.textContent = text;
    chatEl.appendChild(u);
    chatEl.scrollTop = chatEl.scrollHeight;

    // Remove any existing pills
    var oldPills = chatEl.querySelectorAll('.nv-chat-pills');
    oldPills.forEach(function(p) { p.parentNode.removeChild(p); });

    // Typing indicator
    var t = document.createElement('div');
    t.className = 'nv-chat-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    chatEl.appendChild(t);
    chatEl.scrollTop = chatEl.scrollHeight;

    // Respond after delay
    setTimeout(function () {
      if (t.parentNode) t.parentNode.removeChild(t);
      var answer = findAnswer(text);
      var m = document.createElement('div');
      m.className = 'nv-chat-msg bot';
      m.textContent = answer;
      chatEl.appendChild(m);
      chatEl.scrollTop = chatEl.scrollHeight;
    }, 500);
  };

  // Enter key to send
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'chat-input') {
      e.preventDefault();
      window.nvSendChat();
    }
  });

  /* ── Sidebar (sub-pages) ──────────────────────────────────── */
  window.nvOpenSidebar = function () {
    var s = document.querySelector('.nv-sidebar'), o = document.querySelector('.nv-sidebar-overlay');
    if (s) s.classList.add('open'); if (o) o.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.nvCloseSidebar = function () {
    var s = document.querySelector('.nv-sidebar'), o = document.querySelector('.nv-sidebar-overlay');
    if (s) s.classList.remove('open'); if (o) o.classList.remove('open');
    document.body.style.overflow = '';
  };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') window.nvCloseSidebar(); });

  /* ── Init ─────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initChat();
  });
})();
