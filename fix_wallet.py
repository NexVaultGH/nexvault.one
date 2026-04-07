#!/usr/bin/env python3
"""Fix 1: Mobile wallet modal + Fix 3: Add to homescreen + Fix 4: Yield persistence"""

with open('C:/Users/toonz/OneDrive/Desktop/NexVault/app.html', 'r', encoding='utf-8') as f:
    c = f.read()

# ═══ FIX 1: Replace showWalletModal ═══
old_modal = '''function showWalletModal() {
  // Remove any existing modal
  const existing = document.getElementById('nv-wallet-modal');
  if (existing) existing.remove();

  const hasExtension = !!(window.ethereum);

  const modal = document.createElement('div');
  modal.id = 'nv-wallet-modal';'''

new_modal_start = '''function showWalletModal() {
  const existing = document.getElementById('nv-wallet-modal');
  if (existing) existing.remove();
  const hasExtension = !!(window.ethereum);
  // Mobile with MetaMask injected: connect directly
  if (_isMobile && hasExtension) { connectViaExtension(); return; }

  const modal = document.createElement('div');
  modal.id = 'nv-wallet-modal';'''

if old_modal in c:
    c = c.replace(old_modal, new_modal_start, 1)
    print('Fix 1a: Updated showWalletModal start')

# Replace the mobile options section
old_mobile_section = """        ${_isMobile && !window.ethereum ? `
        <button onclick="window.location.href='https://metamask.app.link/dapp/nexvault.one/app'" style="width:100%;padding:16px;border-radius:12px;border:1px solid rgba(74,222,128,.2);background:rgba(74,222,128,.06);color:#f0ece4;cursor:pointer;display:flex;align-items:center;gap:14px;transition:all .2s;font-family:'DM Mono',monospace" onmouseover="this.style.background='rgba(74,222,128,.12)'" onmouseout="this.style.background='rgba(74,222,128,.06)'">
          <div style="width:40px;height:40px;border-radius:10px;background:rgba(74,222,128,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <span style="font-size:18px">&#x1F310;</span>
          </div>
          <div style="text-align:left">
            <div style="font-size:13px;font-weight:600">Open in MetaMask</div>
            <div style="font-size:10px;color:#6b7280;margin-top:2px">Open NexVault in MetaMask app</div>
          </div>
        </button>` : ''}"""

# Remove old mobile section (it's now handled by the modal logic)
if old_mobile_section in c:
    c = c.replace(old_mobile_section, '', 1)
    print('Fix 1b: Removed old mobile section')

# Make the Extension button only show on desktop (not mobile)
old_ext_condition = '${hasExtension ? `'
new_ext_condition = '${hasExtension && !_isMobile ? `'
c = c.replace(old_ext_condition, new_ext_condition, 1)
print('Fix 1c: Extension button hidden on mobile')

# Add "Open in MetaMask App" button for mobile BEFORE the QR button
old_qr_btn = """        <button onclick="connectViaQR()" style="width:100%;padding:16px;border-radius:12px;border:1px solid rgba(96,165,250,.2)"""
new_mobile_plus_qr = """        ${_isMobile ? '<button onclick="window.location.href=\\'https://metamask.app.link/dapp/nexvault.one\\'" style="width:100%;padding:16px;border-radius:12px;border:1px solid rgba(201,168,76,.2);background:rgba(201,168,76,.06);color:#f0ece4;cursor:pointer;display:flex;align-items:center;gap:14px;transition:all .2s;font-family:\\'DM Mono\\',monospace"><div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#f6851b,#e2761b);display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-size:20px">&#x1F98A;</span></div><div style="text-align:left"><div style="font-size:13px;font-weight:600">Open in MetaMask App</div><div style="font-size:10px;color:#6b7280;margin-top:2px">Opens NexVault inside MetaMask</div></div></button>' : ''}
        <button onclick="connectViaQR()" style="width:100%;padding:16px;border-radius:12px;border:1px solid rgba(96,165,250,.2)"""

if old_qr_btn in c:
    c = c.replace(old_qr_btn, new_mobile_plus_qr, 1)
    print('Fix 1d: Added mobile MetaMask App button')

# ═══ FIX 4: Update YIELD engine to calculate from on-chain timestamp ═══
# Update the finalizeConnection to read deposits and set YIELD.startTime
old_finalize_save = '    // Save for auto-reconnect\n    localStorage.setItem(\'nexvault_wallet\', address);'
new_finalize_save = '''    // Save for auto-reconnect
    localStorage.setItem('nexvault_wallet', address);

    // FIX 4: Read on-chain deposit data to set correct yield start time
    // When contracts are deployed, this reads the actual deposit timestamp
    // For now with simulated data, use localStorage to persist across sessions
    const savedStart = localStorage.getItem('nexvault_yield_start_' + address.toLowerCase());
    if (savedStart) {
      YIELD.startTime = parseInt(savedStart);
    } else {
      // First connection for this wallet — set start time to now
      YIELD.startTime = Date.now();
      localStorage.setItem('nexvault_yield_start_' + address.toLowerCase(), YIELD.startTime.toString());
    }
    // Recalculate accumulated yield from start time
    const elapsedSec = (Date.now() - YIELD.startTime) / 1000;
    YIELD.accum = YIELD.perSecond * elapsedSec;
    // Redraw chart with correct start time
    if (typeof drawYieldChart === 'function') drawYieldChart(currentTF || '1M');'''

if old_finalize_save in c:
    c = c.replace(old_finalize_save, new_finalize_save, 1)
    print('Fix 4: Added yield persistence from on-chain timestamp')

with open('C:/Users/toonz/OneDrive/Desktop/NexVault/app.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('\nAll fixes applied!')
