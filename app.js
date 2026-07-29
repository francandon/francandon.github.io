(() => {
  const views = [...document.querySelectorAll("[data-view]")];
  const viewLinks = [...document.querySelectorAll("[data-view-link]")];
  const knownViews = new Set(views.map((view) => view.dataset.view));
  const title = "Francisco R. Candón — Astroparticle Physics";
  const titles = {
    bio: `Bio & CV — ${title}`,
    research: `Research — ${title}`,
    talks: `Talks — ${title}`,
    outreach: `Outreach — ${title}`,
  };

  function currentRoute() {
    const hash = window.location.hash.slice(1);

    if (knownViews.has(hash)) {
      return { view: hash, anchor: null };
    }

    if (hash === "notes" || hash === "contact" || hash === "about") {
      return { view: "home", anchor: hash };
    }

    return { view: "home", anchor: null };
  }

  function showRoute({ view, anchor }, options = {}) {
    const { focus = false } = options;

    for (const panel of views) {
      panel.hidden = panel.dataset.view !== view;
    }

    for (const link of viewLinks) {
      const isCurrent = link.dataset.viewLink === view;

      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    }

    document.title = titles[view] || title;

    requestAnimationFrame(() => {
      if (anchor) {
        document.getElementById(anchor)?.scrollIntoView();
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }

      if (focus) {
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }
    });
  }

  window.addEventListener("hashchange", () => showRoute(currentRoute(), { focus: true }));

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute("href").slice(1);

    if (!hash) return;

    if (window.location.hash.slice(1) === hash) {
      event.preventDefault();
      showRoute(currentRoute(), { focus: Boolean(link.dataset.viewLink) });
    }
  });

  showRoute(currentRoute());
})();
