/* ============================================================
   Main interactions: theme toggle, typewriter, DNA helix,
   scroll progress, sticky nav, active links, reveal-on-scroll
   ============================================================ */
(function () {
    "use strict";

    /* ---------- Theme ---------- */
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
        toggle.addEventListener("click", function () {
            var root = document.documentElement;
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            try { localStorage.setItem("theme", next); } catch (e) { /* private mode */ }
        });
    }

    /* ---------- Typewriter ---------- */
    var typedEl = document.getElementById("typed");
    if (typedEl) {
        var phrases = [
            "AI for Drug Discovery",
            "Spatial Transcriptomics",
            "Single-cell Omics",
            "Multimodal Healthcare AI",
            "Deep Learning \u00d7 Biology"
        ];
        var pi = 0, ci = 0, deleting = false;

        (function typeLoop() {
            var phrase = phrases[pi];
            typedEl.textContent = phrase.slice(0, ci);

            var delay = deleting ? 36 : 74;
            if (!deleting && ci === phrase.length) { delay = 1900; deleting = true; }
            else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 420; }
            else { ci += deleting ? -1 : 1; }

            setTimeout(typeLoop, delay);
        })();
    }

    /* ---------- DNA helix ---------- */
    var svg = document.getElementById("dna-svg");
    if (svg) {
        var NS = "http://www.w3.org/2000/svg";
        var W = 260, TOP = 14, BOTTOM = 306, AMP = 40, CX = 130;
        var strands = [[], []];
        var rungs = [];
        var RUNG_STEP = 16;

        for (var y = TOP; y <= BOTTOM; y += 2) {
            var t = (y - TOP) / (BOTTOM - TOP);
            var phase = t * Math.PI * 6;
            strands[0].push([CX + AMP * Math.sin(phase), y].join(","));
            strands[1].push([CX + AMP * Math.sin(phase + Math.PI), y].join(","));
            if ((y - TOP) % RUNG_STEP === 0) {
                rungs.push({ y: y, x1: CX + AMP * Math.sin(phase), x2: CX + AMP * Math.sin(phase + Math.PI) });
            }
        }

        var g = document.createElementNS(NS, "g");

        rungs.forEach(function (r) {
            var line = document.createElementNS(NS, "line");
            line.setAttribute("x1", r.x1); line.setAttribute("y1", r.y);
            line.setAttribute("x2", r.x2); line.setAttribute("y2", r.y);
            line.setAttribute("stroke", "url(#dna-grad)");
            line.setAttribute("stroke-width", "1.6");
            line.setAttribute("opacity", "0.55");
            line.setAttribute("stroke-linecap", "round");
            g.appendChild(line);
        });

        strands.forEach(function (pts, idx) {
            var path = document.createElementNS(NS, "path");
            path.setAttribute("d", "M" + pts.join(" L"));
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "url(#dna-grad)");
            path.setAttribute("stroke-width", "3.2");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-dasharray", idx === 0 ? "260 140" : "140 260");
            g.appendChild(path);
        });

        // glow node at strand midpoint
        var mid = document.createElementNS(NS, "circle");
        mid.setAttribute("cx", CX + AMP * Math.sin(Math.PI * 3));
        mid.setAttribute("cy", (TOP + BOTTOM) / 2);
        mid.setAttribute("r", "4");
        mid.setAttribute("fill", "#3fe0a5");
        g.appendChild(mid);

        svg.appendChild(g);
    }

    /* ---------- Scroll progress + sticky nav ---------- */
    var nav = document.getElementById("nav");
    var progress = document.getElementById("scroll-progress");
    var ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            var st = window.scrollY || document.documentElement.scrollTop;
            var max = document.documentElement.scrollHeight - window.innerHeight;
            if (progress) progress.style.transform = "scaleX(" + (max > 0 ? st / max : 0) + ")";
            if (nav) nav.classList.toggle("is-scrolled", st > 24);
            ticking = false;
        });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.classList.add("is-visible");
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }

    /* ---------- Active nav link (scroll spy) ---------- */
    var sections = document.querySelectorAll("section[id]");
    var navLinks = document.querySelectorAll(".nav-link[href^='#']");
    if ("IntersectionObserver" in window && sections.length) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                navLinks.forEach(function (a) {
                    a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
                });
            });
        }, { rootMargin: "-40% 0px -55% 0px" });
        sections.forEach(function (s) { spy.observe(s); });
    }
})();
