(function () {
    var root = document.documentElement;
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    var icon = document.getElementById("theme-icon");

    function apply(theme) {
        root.setAttribute("data-theme", theme);
        try { localStorage.setItem("theme", theme); } catch (e) {}
        if (icon) {
            icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
        }
    }

    toggle.addEventListener("click", function (e) {
        e.preventDefault();
        apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });

    var stored = null;
    try { stored = localStorage.getItem("theme"); } catch (e) {}
    var initial = stored || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    apply(initial);
})();
