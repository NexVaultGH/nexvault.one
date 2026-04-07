/* ═══════════════════════════════════════════════════════════════
   NexVault Scene v4 — Immersive Vault Chamber
   Hexagonal grid world + floating vault door + particle storm
   Interactive mouse-driven camera movement
   ═══════════════════════════════════════════════════════════════ */

var NVScene = (function () {
  'use strict';

  function createScene(canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return { stop: function(){} };
    var ctx = canvas.getContext('2d');
    var W, H, cx, cy, running = true, time = 0;
    var mouseX = 0.5, mouseY = 0.5;
    var targetMX = 0.5, targetMY = 0.5;

    // Hex grid floor
    var hexes = [];
    var HEX_COLS = 24, HEX_ROWS = 14;

    // Floating debris particles
    var debris = [];
    var DEBRIS_COUNT = 200;

    // Energy beams
    var beams = [];
    var BEAM_COUNT = 6;

    // Floating data fragments
    var fragments = [];
    var FRAG_COUNT = 15;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cx = W / 2; cy = H / 2;
      buildHexGrid();
    }

    function buildHexGrid() {
      hexes = [];
      var hexW = W / (HEX_COLS - 2);
      var hexH = hexW * 0.6;
      for (var r = 0; r < HEX_ROWS; r++) {
        for (var c = 0; c < HEX_COLS; c++) {
          var x = c * hexW + (r % 2 ? hexW * 0.5 : 0);
          var y = H * 0.55 + r * hexH * 0.75;
          var distFromCenter = Math.abs(x - cx) / W + Math.abs(y - H * 0.7) / H;
          hexes.push({
            x: x, y: y, size: hexW * 0.48,
            brightness: Math.max(0, 0.15 - distFromCenter * 0.08),
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.01 + Math.random() * 0.02
          });
        }
      }
    }

    function initDebris() {
      debris = [];
      for (var i = 0; i < DEBRIS_COUNT; i++) {
        debris.push({
          x: Math.random() * W * 1.4 - W * 0.2,
          y: Math.random() * H,
          z: Math.random(),
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.1 - Math.random() * 0.5,
          size: 0.3 + Math.random() * 2.5,
          alpha: Math.random() * 0.6 + 0.2,
          color: Math.random() > 0.8 ? 'gold' : (Math.random() > 0.5 ? 'white' : 'warm')
        });
      }
    }

    function initBeams() {
      beams = [];
      for (var i = 0; i < BEAM_COUNT; i++) {
        beams.push({
          x: cx + (Math.random() - 0.5) * W * 0.6,
          width: 1 + Math.random() * 3,
          alpha: 0.03 + Math.random() * 0.06,
          speed: 0.5 + Math.random() * 1,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function initFragments() {
      fragments = [];
      for (var i = 0; i < FRAG_COUNT; i++) {
        fragments.push({
          x: Math.random() * W,
          y: H * 0.2 + Math.random() * H * 0.5,
          w: 40 + Math.random() * 80,
          h: 25 + Math.random() * 40,
          rot: (Math.random() - 0.5) * 0.3,
          drift: Math.random() * Math.PI * 2,
          driftSpeed: 0.003 + Math.random() * 0.005,
          alpha: 0.05 + Math.random() * 0.07
        });
      }
    }

    resize(); initDebris(); initBeams(); initFragments();

    canvas.addEventListener('mousemove', function (e) {
      targetMX = e.clientX / W;
      targetMY = e.clientY / H;
    });

    function drawHex(x, y, size, alpha) {
      ctx.beginPath();
      for (var i = 0; i < 6; i++) {
        var angle = Math.PI / 3 * i - Math.PI / 6;
        var px = x + size * Math.cos(angle);
        var py = y + size * Math.sin(angle) * 0.5; // perspective squash
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(201,168,76,' + alpha.toFixed(4) + ')';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    function frame() {
      if (!running) return;
      time += 0.005;

      // Smooth mouse follow
      mouseX += (targetMX - mouseX) * 0.03;
      mouseY += (targetMY - mouseY) * 0.03;

      var mx = (mouseX - 0.5) * 100;
      var my = (mouseY - 0.5) * 60;

      // Clear
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);

      // ── AMBIENT ATMOSPHERE ──
      var atm = ctx.createRadialGradient(cx + mx * 0.3, cy * 0.5 + my * 0.2, 0, cx, cy * 0.6, Math.max(W, H) * 0.7);
      atm.addColorStop(0, 'rgba(60,40,15,0.35)');
      atm.addColorStop(0.2, 'rgba(45,30,10,0.2)');
      atm.addColorStop(0.4, 'rgba(30,18,5,0.12)');
      atm.addColorStop(0.7, 'rgba(15,8,2,0.06)');
      atm.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = atm;
      ctx.fillRect(0, 0, W, H);

      // Secondary warm atmosphere right
      var atm2 = ctx.createRadialGradient(cx * 1.3 + mx, cy * 0.4, 0, cx * 1.3, cy * 0.4, W * 0.5);
      atm2.addColorStop(0, 'rgba(80,50,15,0.08)');
      atm2.addColorStop(0.5, 'rgba(40,20,5,0.04)');
      atm2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = atm2;
      ctx.fillRect(0, 0, W, H);

      // Third atmosphere left
      var atm3 = ctx.createRadialGradient(cx * 0.4 + mx * 0.5, cy * 0.5, 0, cx * 0.4, cy * 0.5, W * 0.4);
      atm3.addColorStop(0, 'rgba(50,30,10,0.06)');
      atm3.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = atm3;
      ctx.fillRect(0, 0, W, H);

      // ── VERTICAL BEAMS ──
      for (var i = 0; i < beams.length; i++) {
        var b = beams[i];
        var bx = b.x + Math.sin(time * b.speed + b.phase) * 40 + mx * 0.5;
        var grad = ctx.createLinearGradient(bx, 0, bx, H);
        grad.addColorStop(0, 'rgba(201,168,76,0)');
        grad.addColorStop(0.3, 'rgba(201,168,76,' + b.alpha.toFixed(3) + ')');
        grad.addColorStop(0.7, 'rgba(201,168,76,' + (b.alpha * 0.5).toFixed(3) + ')');
        grad.addColorStop(1, 'rgba(201,168,76,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(bx - b.width, 0, b.width * 2, H);
      }

      // ── FLOATING DATA FRAGMENTS (glass panels) ──
      for (var i = 0; i < fragments.length; i++) {
        var f = fragments[i];
        f.drift += f.driftSpeed;
        var fx = f.x + Math.sin(f.drift) * 20 + mx * f.alpha * 200;
        var fy = f.y + Math.cos(f.drift * 0.7) * 15 + my * f.alpha * 150;

        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(f.rot + Math.sin(f.drift * 0.5) * 0.05);

        // Glass panel
        ctx.fillStyle = 'rgba(201,168,76,' + (f.alpha * 0.3).toFixed(3) + ')';
        ctx.strokeStyle = 'rgba(201,168,76,' + f.alpha.toFixed(3) + ')';
        ctx.lineWidth = 0.5;

        // Rounded rect
        var r = 4;
        ctx.beginPath();
        ctx.moveTo(-f.w/2 + r, -f.h/2);
        ctx.lineTo(f.w/2 - r, -f.h/2);
        ctx.quadraticCurveTo(f.w/2, -f.h/2, f.w/2, -f.h/2 + r);
        ctx.lineTo(f.w/2, f.h/2 - r);
        ctx.quadraticCurveTo(f.w/2, f.h/2, f.w/2 - r, f.h/2);
        ctx.lineTo(-f.w/2 + r, f.h/2);
        ctx.quadraticCurveTo(-f.w/2, f.h/2, -f.w/2, f.h/2 - r);
        ctx.lineTo(-f.w/2, -f.h/2 + r);
        ctx.quadraticCurveTo(-f.w/2, -f.h/2, -f.w/2 + r, -f.h/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Scan line inside fragment
        var scanY = ((time * 30 + i * 10) % f.h) - f.h/2;
        ctx.beginPath();
        ctx.moveTo(-f.w/2 + 4, scanY);
        ctx.lineTo(f.w/2 - 4, scanY);
        ctx.strokeStyle = 'rgba(240,192,64,' + (f.alpha * 0.4).toFixed(3) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Tiny data lines
        for (var d = 0; d < 3; d++) {
          var dy = -f.h/2 + 6 + d * (f.h / 4);
          var lineW = (Math.sin(time * 3 + d + i) * 0.5 + 0.5) * f.w * 0.6;
          ctx.beginPath();
          ctx.moveTo(-f.w/2 + 6, dy);
          ctx.lineTo(-f.w/2 + 6 + lineW, dy);
          ctx.strokeStyle = 'rgba(255,255,255,' + (f.alpha * 0.2).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();
      }

      // ── HEXAGONAL FLOOR ──
      for (var i = 0; i < hexes.length; i++) {
        var h = hexes[i];
        h.pulse += h.pulseSpeed;
        var pulseBright = Math.sin(h.pulse) * 0.02;
        var distToMouse = Math.sqrt(Math.pow((h.x - (cx + mx)) / W, 2) + Math.pow((h.y - (cy * 1.2 + my)) / H, 2));
        var mouseBright = distToMouse < 0.2 ? (0.2 - distToMouse) * 0.8 : 0;
        var alpha = Math.max(0, h.brightness + pulseBright + mouseBright);
        if (alpha > 0.003) {
          drawHex(h.x + mx * 0.15, h.y + my * 0.08, h.size, alpha);
        }
      }

      // ── CENTRAL VAULT STRUCTURE ──
      var vaultY = H * 0.82 + my * 0.1;
      var vaultX = cx + mx * 0.15;
      var vaultR = Math.min(W, H) * 0.2;

      // Outer vault ring glow
      var vg = ctx.createRadialGradient(vaultX, vaultY, vaultR * 0.2, vaultX, vaultY, vaultR * 3);
      vg.addColorStop(0, 'rgba(201,168,76,0.35)');
      vg.addColorStop(0.2, 'rgba(201,168,76,0.15)');
      vg.addColorStop(0.5, 'rgba(201,168,76,0.06)');
      vg.addColorStop(1, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // Vault door hexagon
      var breathe = 1 + Math.sin(time * 1.2) * 0.04;
      ctx.save();
      ctx.translate(vaultX, vaultY);

      // Multiple hex rings
      for (var ring = 0; ring < 3; ring++) {
        var rr = vaultR * (0.7 + ring * 0.2) * breathe;
        var ra = 0.45 - ring * 0.08 + Math.sin(time + ring) * 0.05;
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
          var angle = Math.PI / 3 * i - Math.PI / 6 + time * 0.1 * (ring % 2 ? 1 : -1);
          var px = rr * Math.cos(angle);
          var py = rr * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(201,168,76,' + ra.toFixed(3) + ')';
        ctx.lineWidth = 2 + ring;
        ctx.shadowColor = 'rgba(201,168,76,' + (ra * 0.5).toFixed(3) + ')';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Inner V logo
      ctx.font = '600 ' + (vaultR * 0.5) + 'px "Playfair Display", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // V with double glow
      ctx.shadowColor = 'rgba(201,168,76,0.6)';
      ctx.shadowBlur = 60;
      ctx.fillStyle = 'rgba(201,168,76,' + (0.8 + Math.sin(time * 0.8) * 0.1).toFixed(3) + ')';
      ctx.fillText('V', 0, 0);
      ctx.fillText('V', 0, 0); // double pass for brightness
      ctx.shadowBlur = 0;

      // Spinning accent arc
      ctx.beginPath();
      var arcR = vaultR * 0.85 * breathe;
      ctx.arc(0, 0, arcR, time * 0.5, time * 0.5 + 1.2);
      ctx.strokeStyle = 'rgba(240,192,64,0.5)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(240,192,64,0.3)';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(0, 0, arcR * 0.95, -time * 0.35, -time * 0.35 + 0.8);
      ctx.strokeStyle = 'rgba(201,168,76,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // ── DEBRIS PARTICLES ──
      for (var i = 0; i < debris.length; i++) {
        var p = debris[i];
        p.x += p.vx + mx * p.z * 0.01;
        p.y += p.vy;

        // Wrap
        if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W * 1.4 - W * 0.2; }
        if (p.x < -50) p.x = W + 50;
        if (p.x > W + 50) p.x = -50;

        var col = p.color === 'gold' ? '201,168,76' : (p.color === 'warm' ? '240,192,64' : '200,200,210');
        var a = p.alpha * (0.5 + Math.sin(time * 3 + i) * 0.5);

        // Different shapes based on size
        if (p.size > 1.5) {
          // Larger particles get glow
          var pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          pg.addColorStop(0, 'rgba(' + col + ',' + (a * 0.15).toFixed(3) + ')');
          pg.addColorStop(1, 'rgba(' + col + ',0)');
          ctx.fillStyle = pg;
          ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.3 + p.z * 0.7), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + col + ',' + a.toFixed(3) + ')';
        ctx.fill();
      }

      // ── TOP MIST (light) ──
      var mist = ctx.createLinearGradient(0, 0, 0, H * 0.15);
      mist.addColorStop(0, 'rgba(0,0,0,0.2)');
      mist.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, 0, W, H * 0.15);

      requestAnimationFrame(frame);
    }

    frame();
    window.addEventListener('resize', function () { resize(); initDebris(); initBeams(); initFragments(); });
    return { stop: function () { running = false; } };
  }

  function ambientOrb(canvas, color) {
    var ctx = canvas.getContext('2d'); var W, H, phase = Math.random() * 10;
    function resize() { W = canvas.width = (canvas.parentElement || document.body).offsetWidth; H = canvas.height = (canvas.parentElement || document.body).offsetHeight; }
    resize();
    function draw() {
      ctx.clearRect(0, 0, W, H); phase += 0.005;
      var s = 0.8 + Math.sin(phase) * 0.2, r = Math.min(W, H) * 0.35 * s;
      var g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, r);
      g.addColorStop(0, 'rgba(' + color + ',0.04)'); g.addColorStop(1, 'rgba(' + color + ',0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      requestAnimationFrame(draw);
    }
    draw(); window.addEventListener('resize', resize);
  }

  function shieldWireframe(canvas) {
    var ctx = canvas.getContext('2d'); var W, H, p = 0;
    function resize() { W = canvas.width = (canvas.parentElement || document.body).offsetWidth; H = canvas.height = (canvas.parentElement || document.body).offsetHeight; }
    resize();
    function draw() {
      ctx.clearRect(0,0,W,H); p += 0.008;
      var c=W/2, y=H/2, s=Math.min(W,H)*0.25;
      for (var l=0;l<3;l++){var sz=s*(1+l*0.12),a=(0.04-l*0.01+Math.sin(p+l)*0.015).toFixed(3);ctx.beginPath();ctx.moveTo(c,y-sz);ctx.bezierCurveTo(c+sz*0.8,y-sz*0.6,c+sz*0.7,y+sz*0.3,c,y+sz*0.8);ctx.bezierCurveTo(c-sz*0.7,y+sz*0.3,c-sz*0.8,y-sz*0.6,c,y-sz);ctx.strokeStyle='rgba(201,168,76,'+a+')';ctx.lineWidth=0.8;ctx.stroke();}
      requestAnimationFrame(draw);
    }
    draw(); window.addEventListener('resize',resize);
  }

  function dataStream(canvas) {
    var ctx = canvas.getContext('2d'); var W, H;
    function resize() { W = canvas.width = (canvas.parentElement || document.body).offsetWidth; H = canvas.height = (canvas.parentElement || document.body).offsetHeight; }
    resize();
    var cols=Math.floor(2000/18),drops=new Array(cols).fill(0).map(function(){return Math.random()*2000;}),chars='0123456789ABCDEF$%.'.split('');
    function draw(){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,W,H);ctx.font='11px "DM Mono",monospace';for(var i=0;i<Math.min(cols,Math.floor(W/18));i++){if(Math.random()>0.97){ctx.fillStyle='rgba(201,168,76,'+(0.02+Math.random()*0.04).toFixed(3)+')';ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*18,drops[i]);drops[i]+=18;if(drops[i]>H)drops[i]=0;}}requestAnimationFrame(draw);}
    draw(); window.addEventListener('resize',resize);
  }

  return { createScene: createScene, ambientOrb: ambientOrb, shieldWireframe: shieldWireframe, dataStream: dataStream };
})();
