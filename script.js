(() => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const header = document.querySelector("[data-header]");

  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        toggle.focus();
      }
    });
  }

  // Keep the value cards visually aligned with the numbered steps in
  // “Jak to funguje”: a compact navy number tile instead of a loose label.
  const valueCardStyle = document.createElement("style");
  valueCardStyle.textContent = `
    .value-stack article {
      padding: 24px 28px;
      display: grid;
      grid-template-columns: 52px minmax(0, 1fr);
      grid-template-rows: auto auto;
      column-gap: 22px;
      align-items: start;
    }

    .value-number {
      position: static;
      grid-column: 1;
      grid-row: 1 / span 2;
      width: 52px;
      height: 52px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: var(--navy-900);
      color: var(--white);
      font-size: 13px;
      line-height: 1;
      font-weight: 700;
    }

    .value-stack h3,
    .value-stack p {
      grid-column: 2;
    }

    .value-stack h3 {
      margin-top: 2px;
    }

    @media (max-width: 640px) {
      .value-stack article {
        padding: 22px;
        grid-template-columns: 44px minmax(0, 1fr);
        column-gap: 16px;
      }

      .value-number {
        width: 44px;
        height: 44px;
        border-radius: 12px;
      }
    }
  `;
  document.head.appendChild(valueCardStyle);

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
