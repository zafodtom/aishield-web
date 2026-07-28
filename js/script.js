(() => {
  "use strict";

  const config = window.AISHIELD_CONFIG || {};
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && value) element.textContent = value;
  };

  setText("#contact-email", config.email);
  setText("#footer-email", config.email);
  setText("#contact-phone", config.phoneDisplay);
  setText("#footer-phone", config.phoneDisplay);
  setText("#footer-company-id", `IČO: ${config.companyId || "doplnit"}`);

  const emailLink = document.getElementById("contact-email-link");
  const phoneLink = document.getElementById("contact-phone-link");

  if (emailLink && config.email) emailLink.href = `mailto:${config.email}`;
  if (phoneLink && config.phoneLink) phoneLink.href = `tel:${config.phoneLink}`;

  document.getElementById("current-year").textContent = new Date().getFullYear();

  const closeNav = () => {
    nav?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNav));

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 12);
  }, { passive: true });

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".faq-question").forEach((other) => {
        if (other !== button) other.setAttribute("aria-expanded", "false");
      });

      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      alert("Tento odkaz je připravený jako zástupný. Před zveřejněním doplňte vlastní právní dokument.");
    });
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.className = "form-status";
    formStatus.textContent = "";

    if (!form.checkValidity()) {
      form.reportValidity();
      formStatus.classList.add("error");
      formStatus.textContent = "Zkontrolujte prosím povinná pole.";
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    if (config.formEndpoint) {
      try {
        const response = await fetch(config.formEndpoint, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(form)
        });

        if (!response.ok) throw new Error("Form submission failed");

        form.reset();
        formStatus.classList.add("success");
        formStatus.textContent = "Děkujeme za zprávu. Ozveme se vám co nejdříve.";
      } catch (error) {
        formStatus.classList.add("error");
        formStatus.textContent = "Zprávu se nepodařilo odeslat. Kontaktujte nás prosím e-mailem.";
      }
      return;
    }

    const subject = encodeURIComponent(`Nezávazná poptávka AIShield – ${data.company}`);
    const body = encodeURIComponent(
      `Jméno: ${data.name}\n` +
      `Firma: ${data.company}\n` +
      `E-mail: ${data.email}\n` +
      `Telefon: ${data.phone || "neuveden"}\n\n` +
      `Zpráva:\n${data.message}`
    );

    window.location.href = `mailto:${config.email || "kontakt@aishield.cz"}?subject=${subject}&body=${body}`;
    formStatus.classList.add("success");
    formStatus.textContent = "Otevírám váš e-mailový klient s připravenou zprávou.";
  });
})();
