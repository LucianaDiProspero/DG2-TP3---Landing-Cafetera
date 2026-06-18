// Animaciones suaves al hacer scroll. Agrega la clase .reveal a cualquier bloque nuevo.
const revealElements = document.querySelectorAll(".reveal");
const header = document.querySelector(".site-header");
const brandLink = document.querySelector(".brand");
const menuToggle = document.querySelector(".menu-toggle");
const headerMenu = document.querySelector("#header-menu");
const heroScroll = document.querySelector(".hero-scroll");
const heroSlides = document.querySelectorAll("[data-hero-slide]");
const heroProductLink = document.querySelector("[data-hero-product-link]");
const heroTransition = document.querySelector(".hero-transition");
const emotionalTransition = document.querySelector(".emotional-transition");
const emotionalSection = document.querySelector(".full-bleed-image");
const emotionalLineOne = document.querySelector(".window-line-1");
const emotionalLineTwo = document.querySelector(".window-line-2");
const headerSectionLinks = document.querySelectorAll(".header-links a");
const howSection = document.querySelector(".how");
const benefitTabs = document.querySelectorAll("[data-benefit-index]");
const benefitItems = document.querySelectorAll(".benefit-item");
const benefitImagePanels = document.querySelectorAll("[data-benefit-image]");
const accessoryPanels = document.querySelectorAll("[data-accessory-panel]");
const accessoryLinks = document.querySelectorAll("[data-accessory-link]");
const accessoryProductUrl = "https://www.wacaco.com/products/minipresso-gr?srsltid=AfmBOorDPvngNIDBVf-H_lahJGFi0SnJkaCjnxM6dGQv4oc2yuUH7y0q";
const newsletterForm = document.querySelector("[data-newsletter-form]");
const newsletterStatus = document.querySelector("[data-newsletter-status]");

const benefits = [
  {
    description: "Compacta para mochila, valija o kit de ruta.",
    image: "assets/benefit-portable.jpg",
    alt: "Minipresso GR lista para llevar durante un viaje",
  },
  {
    description: "Sistema manual: no requiere batería ni electricidad.",
    image: "assets/benefit-independent.jpg",
    alt: "Minipresso GR funcionando de manera manual al aire libre",
  },
  {
    description: "Compatible con café molido para ajustar origen, molienda e intensidad.",
    image: "assets/benefit-customizable.jpg",
    alt: "Café molido preparado para personalizar una extracción",
  },
  {
    description: "Hasta 8 bares de presión para una extracción intensa y crema natural.",
    image: "assets/benefit-espresso.jpeg",
    alt: "Espresso intenso preparado con Minipresso GR",
  },
  {
    description: "El café deja de depender del lugar y vuelve a depender de vos.",
    image: "assets/benefit-pause.jpg",
    alt: "Una pausa de café con Minipresso GR durante el viaje",
  },
];

let activeBenefit = 0;
let benefitChangeTimer;
let howAnimationTimer;
let headerRevealTimer;
let headerReady = window.scrollY >= (howSection?.offsetTop ?? Infinity);

const setActiveBenefit = (nextIndex, direction = 1) => {
  if (benefitImagePanels.length === 0 || nextIndex === activeBenefit) {
    return;
  }

  window.clearTimeout(benefitChangeTimer);
  activeBenefit = (nextIndex + benefits.length) % benefits.length;
  benefitTabs.forEach((tab, index) => {
    const isActive = index === activeBenefit;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("aria-expanded", String(isActive));
    benefitItems[index]?.classList.toggle("is-active", isActive);
  });

  benefitImagePanels.forEach((panel, index) => {
    panel.classList.toggle("is-active", index === activeBenefit);
  });
};

benefitTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const nextIndex = Number(tab.dataset.benefitIndex);
    setActiveBenefit(nextIndex, nextIndex > activeBenefit ? 1 : -1);
  });
});

benefitImagePanels.forEach((panel) => {
  panel.addEventListener("click", () => {
    const nextIndex = Number(panel.dataset.benefitImage);
    setActiveBenefit(nextIndex, nextIndex > activeBenefit ? 1 : -1);
  });
});

accessoryPanels.forEach((panel) => {
  panel.querySelector(".accessory-panel-trigger")?.addEventListener("click", () => {
    accessoryPanels.forEach((item) => {
      const isActive = item === panel;
      item.classList.toggle("is-active", isActive);
      item.querySelector(".accessory-panel-trigger")?.setAttribute("aria-expanded", String(isActive));
    });
  });
});

accessoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.stopPropagation();
    window.location.href = accessoryProductUrl;
  });
});

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterForm.reset();

  if (newsletterStatus) {
    newsletterStatus.textContent = "Gracias por sumarte. Pronto vas a recibir novedades.";
  }
});

const closeMobileMenu = () => {
  menuToggle?.classList.remove("is-open");
  headerMenu?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Abrir men\u00fa");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = !menuToggle.classList.contains("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  headerMenu?.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar men\u00fa" : "Abrir men\u00fa");
});

headerSectionLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 575.98) {
    closeMobileMenu();
  }
});

heroProductLink?.addEventListener("click", (event) => {
  if (!heroScroll) {
    return;
  }

  event.preventDefault();
  const scrollDistance = heroScroll.offsetHeight - window.innerHeight;
  const productPosition = heroScroll.offsetTop + scrollDistance * 0.82;

  window.scrollTo({
    top: productPosition,
    behavior: "smooth",
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const transitionObserver = heroTransition
  ? new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-animated");
          window.clearTimeout(headerRevealTimer);
          headerRevealTimer = window.setTimeout(() => {
            headerReady = true;
            header.classList.add("is-visible", "is-scrolled");
          }, 0);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px 32% 0px",
      }
    )
  : null;

if (heroTransition && transitionObserver) {
  transitionObserver.observe(heroTransition);
}

const emotionalTransitionObserver = emotionalTransition
  ? new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-animated");
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px 8% 0px",
      }
    )
  : null;

if (emotionalTransition && emotionalTransitionObserver) {
  emotionalTransitionObserver.observe(emotionalTransition);
}

const updateEmotionalWindow = () => {
  if (!emotionalSection) {
    return;
  }

  const rect = emotionalSection.getBoundingClientRect();
  const transitionRect = emotionalTransition?.getBoundingClientRect();
  const isVisible =
    (rect.bottom > 0 && rect.top < window.innerHeight) ||
    Boolean(transitionRect && transitionRect.bottom > 0 && transitionRect.top < window.innerHeight);
  const progress = Math.min(
    1,
    Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height))
  );

  document.body.classList.toggle("emotional-active", isVisible);
  emotionalLineOne?.classList.toggle("is-visible", progress > 0.15);
  emotionalLineTwo?.classList.toggle("is-visible", progress > 0.4);
};

const howObserver = howSection
  ? new IntersectionObserver(
    ([entry], observer) => {
      if (entry.isIntersecting) {
        howAnimationTimer = window.setTimeout(() => {
          entry.target.classList.add("is-animated");
        }, 500);
        observer.unobserve(entry.target);
      }
    },
    {
      threshold: 0.01,
      rootMargin: "0px 0px 24% 0px",
    }
  )
  : null;

if (howSection && howObserver) {
  howObserver.observe(howSection);
}

brandLink?.addEventListener("click", (event) => {
  event.preventDefault();
  window.clearTimeout(howAnimationTimer);
  window.clearTimeout(headerRevealTimer);
  headerReady = false;

  revealElements.forEach((element) => {
    element.classList.remove("is-visible");
    revealObserver.unobserve(element);
  });

  if (howSection && howObserver) {
    howSection.classList.remove("is-animated");
    howObserver.unobserve(howSection);
  }

  if (heroTransition && transitionObserver) {
    heroTransition.classList.remove("is-animated");
    transitionObserver.unobserve(heroTransition);
  }

  if (emotionalTransition && emotionalTransitionObserver) {
    emotionalTransition.classList.remove("is-animated");
    emotionalTransitionObserver.unobserve(emotionalTransition);
  }

  emotionalLineOne?.classList.remove("is-visible");
  emotionalLineTwo?.classList.remove("is-visible");
  document.body.classList.remove("emotional-active");

  let animationsRearmed = false;
  const rearmAnimations = () => {
    if (animationsRearmed) {
      return;
    }

    animationsRearmed = true;
    revealElements.forEach((element) => revealObserver.observe(element));

    if (howSection && howObserver) {
      howObserver.observe(howSection);
    }

    if (heroTransition && transitionObserver) {
      transitionObserver.observe(heroTransition);
    }

    if (emotionalTransition && emotionalTransitionObserver) {
      emotionalTransitionObserver.observe(emotionalTransition);
    }

  };

  window.addEventListener("scrollend", rearmAnimations, { once: true });
  window.setTimeout(rearmAnimations, 1800);

  window.scrollTo({
    top: heroScroll?.offsetTop ?? 0,
    behavior: "smooth",
  });
});

const setActiveHeroSlide = (activeIndex) => {
  heroSlides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === activeIndex);
  });

  const headerTriggerPoint = heroTransition
    ? heroTransition.offsetTop - window.innerHeight * 0.32
    : Infinity;

  if (headerReady && window.scrollY >= headerTriggerPoint) {
    header.classList.add("is-visible");
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-visible");
    header.classList.remove("is-scrolled");
  }
};

const updateActiveHeaderLink = (heroProgress = 0) => {
  const sectionIds = [
    "como-funciona",
    "beneficios",
    "especificaciones",
    "accesorios",
    "resenas",
  ];
  const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 260);
  let activeHref = heroProgress >= 0.66 && window.scrollY < heroScroll.offsetTop + heroScroll.offsetHeight
    ? "#hero"
    : "";

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);

    if (section && section.offsetTop <= marker) {
      activeHref = `#${id}`;
    }
  });

  headerSectionLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === activeHref);
  });
};

// El hero usa un unico viewport sticky dentro de una zona de scroll de 300vh.
const updateHero = () => {
  if (!heroScroll || heroSlides.length === 0) {
    return;
  }

  const scrollStart = heroScroll.offsetTop;
  const scrollDistance = heroScroll.offsetHeight - window.innerHeight;
  const rawProgress = (window.scrollY - scrollStart) / scrollDistance;
  const progress = Math.min(Math.max(rawProgress, 0), 1);
  let activeIndex = 0;

  if (progress >= 0.66) {
    activeIndex = 2;
  } else if (progress >= 0.33) {
    activeIndex = 1;
  }

  const sceneRanges = [
    [0, 0.33],
    [0.33, 0.66],
    [0.66, 1],
  ];

  heroSlides.forEach((slide, index) => {
    if (index === 2) {
      slide.style.setProperty("--hero-image-scale", "1.01");
      return;
    }

    const [sceneStart, sceneEnd] = sceneRanges[index];
    const sceneProgress = Math.min(
      Math.max((progress - sceneStart) / (sceneEnd - sceneStart), 0),
      1
    );
    const imageScale = 1.01 + sceneProgress * 0.035;

    slide.style.setProperty("--hero-image-scale", imageScale.toFixed(4));
  });

  setActiveHeroSlide(activeIndex);
  updateActiveHeaderLink(progress);
  updateEmotionalWindow();

};

updateHero();
window.addEventListener("scroll", updateHero, { passive: true });
window.addEventListener("resize", updateHero);
