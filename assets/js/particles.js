/* ============================================================
   Neural-network particle background
   Nodes drift like a living graph; close nodes connect with
   fading edges; the mouse gently attracts nearby edges.
   ============================================================ */
(function () {
    "use strict";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var canvas = document.getElementById("neural-bg");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 2);

    var nodes = [];
    var W = 0, H = 0;
    var mouse = { x: -1e4, y: -1e4 };
    var running = true;

    var LINK_DIST = 120;      // max px for an edge
    var MOUSE_RANGE = 160;    // mouse influence radius
    var MAX_NODES = 80;

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * DPR;
        canvas.height = H * DPR;
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        seed();
    }

    function seed() {
        var target = Math.min(MAX_NODES, Math.floor((W * H) / 16000));
        nodes = [];
        for (var i = 0; i < target; i++) {
            nodes.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                r: 1 + Math.random() * 1.6,
                hue: Math.random() < 0.5 ? 190 : 258   // cyan-ish / violet-ish
            });
        }
    }

    function step() {
        ctx.clearRect(0, 0, W, H);

        var i, j, n, m, dx, dy, d2, d, alpha, color;

        // Edges first (behind nodes)
        ctx.lineWidth = 1;
        for (i = 0; i < nodes.length; i++) {
            n = nodes[i];
            for (j = i + 1; j < nodes.length; j++) {
                m = nodes[j];
                dx = n.x - m.x; dy = n.y - m.y;
                d2 = dx * dx + dy * dy;
                if (d2 > LINK_DIST * LINK_DIST) continue;
                alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.16;
                ctx.strokeStyle = "hsla(215, 60%, 72%, " + alpha + ")";
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(m.x, m.y);
                ctx.stroke();
            }
            // Mouse link
            dx = n.x - mouse.x; dy = n.y - mouse.y;
            d2 = dx * dx + dy * dy;
            if (d2 < MOUSE_RANGE * MOUSE_RANGE) {
                d = Math.sqrt(d2);
                alpha = (1 - d / MOUSE_RANGE) * 0.35;
                ctx.strokeStyle = "hsla(190, 100%, 68%, " + alpha + ")";
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }

        // Nodes
        for (i = 0; i < nodes.length; i++) {
            n = nodes[i];
            n.x += n.vx; n.y += n.vy;
            if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
            if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;

            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = "hsla(" + n.hue + ", 90%, 72%, 0.55)";
            ctx.fill();
        }

        if (running) requestAnimationFrame(step);
    }

    window.addEventListener("mousemove", function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener("resize", resize);

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) { running = false; }
        else if (!running) { running = true; requestAnimationFrame(step); }
    });

    resize();
    requestAnimationFrame(step);
})();
