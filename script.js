// Array to keep track of the current slide for each slideshow
let slideIndex = [1, 1, 1, 1, 1, 1, 1, 1, 1];
let slideId = [
  "mySlides1",
  "mySlides2",
  "mySlides3",
  "mySlides5",
  "mySlides6",
  "mySlides8",
  "mySlides9",
  "mySlides10",
  "mySlides11",
];

// Initialize slideshows only after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize all slideshows and generate dot indicators
  for (let i = 0; i < slideId.length; i++) {
    let slides = document.getElementsByClassName(slideId[i]);
    if (slides && slides.length > 0) {
      // Generate dot indicators - place after the slideshow container
      let container = slides[0].closest('.slideshow-container');
      if (container) {
        let dotsDiv = document.createElement('div');
        dotsDiv.className = 'slide-dots';
        dotsDiv.setAttribute('data-slideshow', i);
        for (let j = 0; j < slides.length; j++) {
          let dot = document.createElement('span');
          dot.className = 'slide-dot';
          (function (slideNum, showNum) {
            dot.addEventListener('click', function (e) {
              e.stopPropagation();
              currentSlide(slideNum, showNum);
            });
          })(j + 1, i);
          dotsDiv.appendChild(dot);
        }
        // Insert after the container, not inside it (avoids overflow-hidden clipping)
        container.parentNode.insertBefore(dotsDiv, container.nextSibling);
      }
      showSlides(1, i);
    }
  }
});

// Move to the next/previous slide in a specific slideshow
function plusSlides(n, no) {
  showSlides((slideIndex[no] += n), no);
}

// Show the specific slide and update the dots for a specific slideshow
function currentSlide(n, no) {
  showSlides((slideIndex[no] = n), no);
}

function showSlides(n, no) {
  let i;
  let slides = document.getElementsByClassName(slideId[no]);

  // Check if slideshow exists and has slides
  if (!slides || slides.length === 0) {
    return;
  }

  // Wrap around
  if (n > slides.length) {
    slideIndex[no] = 1;
  }
  if (n < 1) {
    slideIndex[no] = slides.length;
  }

  // Hide all slides
  for (i = 0; i < slides.length; i++) {
    slides[i].classList.add("hidden");
  }

  // Show the current slide
  if (slides[slideIndex[no] - 1]) {
    slides[slideIndex[no] - 1].classList.remove("hidden");
  }

  // Update dot indicators
  let dotsContainer = document.querySelector('.slide-dots[data-slideshow="' + no + '"]');
  if (dotsContainer) {
    let dots = dotsContainer.getElementsByClassName('slide-dot');
    for (i = 0; i < dots.length; i++) {
      dots[i].classList.remove('active');
    }
    if (dots[slideIndex[no] - 1]) {
      dots[slideIndex[no] - 1].classList.add('active');
    }
  }
}

function showButtons(project) {
  project.querySelectorAll(".prev, .next").forEach(function (button) {
    button.classList.remove("hidden");
  });
}

function hideButtons(project) {
  project.querySelectorAll(".prev, .next").forEach(function (button) {
    button.classList.add("hidden");
  });
}

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIconDark = document.getElementById('theme-icon-dark');
  const themeIconLight = document.getElementById('theme-icon-light');
  const body = document.getElementById('body');

  if (!themeToggle || !body) {
    console.error('Theme toggle elements not found');
    return;
  }

  // Check for saved theme preference or default to dark mode
  const currentTheme = localStorage.getItem('theme') || 'dark';

  // Apply theme on page load
  if (currentTheme === 'light') {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    if (themeIconDark) themeIconDark.classList.remove('hidden');
    if (themeIconLight) themeIconLight.classList.add('hidden');
  } else {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    if (themeIconDark) themeIconDark.classList.add('hidden');
    if (themeIconLight) themeIconLight.classList.remove('hidden');
  }

  // Toggle theme on button click
  themeToggle.addEventListener('click', function () {
    const isDark = body.classList.contains('dark-mode') || !body.classList.contains('light-mode');

    if (isDark) {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      if (themeIconDark) themeIconDark.classList.remove('hidden');
      if (themeIconLight) themeIconLight.classList.add('hidden');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      if (themeIconDark) themeIconDark.classList.add('hidden');
      if (themeIconLight) themeIconLight.classList.remove('hidden');
      localStorage.setItem('theme', 'dark');
    }
  });
});

// Language Toggle Functionality
const translations = {
  sv: {
    "hero-subtitle": "Systemvetarstudent | Fullstack Developer",
    "hero-desc": "Praktisk erfarenhet av fullstack-utveckling i C#/.NET och JavaScript. Bygger webbtj\u00e4nster, REST API:er och Office Add-ins med CI/CD i Azure DevOps.",
    "about-title": "Om mig",
    "about-text": "Systemvetarstudent med praktisk erfarenhet av fullstack-utveckling i C#/.NET och JavaScript. Har byggt och driftsatt webbtj\u00e4nster, REST API:er och Office Add-ins med CI/CD i Azure DevOps. Stark probleml\u00f6sare med erfarenhet av agilt teamarbete och teknisk fels\u00f6kning.",
    "edu-title": "Utbildning",
    "edu-su": "Stockholms universitet \u2013 Data- och systemvetenskap",
    "edu-su-type": "Kandidatprogram",
    "edu-su-date": "2023 \u2013 2026 (f\u00f6rv\u00e4ntad examen sommaren 2026)",
    "edu-ssis-type": "Teknikprogrammet",
    "skills-title": "Tekniska f\u00e4rdigheter",
    "skills-lang": "Spr\u00e5k",
    "skills-tools": "Verktyg",
    "skills-cloud": "Databas & Moln",
    "skills-network": "N\u00e4tverk",
    "projects-title": "Projekt",
    "projects-desc": "En samling av mina arbeten och kreativa projekt",
    "proj-snus-title": "Snus Smart Valet",
    "proj-snus-desc": "Fullstack-webbapp som skrapar, bearbetar och visualiserar den svenska snusmarknaden. Utforska 200+ produkter med avancerade filter, sortering, AI-rekommendationer och statistik.",
    "proj-jobb-title": "Jobbmatcharen",
    "proj-jobb-desc": "Matcha ditt CV mot 50 000+ aktiva jobbannonser fr\u00e5n Arbetsf\u00f6rmedlingen. Intelligent CV-analys med po\u00e4ngs\u00e4ttning baserad p\u00e5 kompetenser, erfarenhet, utbildning och spr\u00e5k. Daglig uppdatering via GitHub Actions.",
    "proj-fractal-title": "Fraktal Generator",
    "proj-fractal-desc": "Interaktiv webbapp som genererar fraktaler med L-system. Anv\u00e4ndare kan utforska och anpassa fraktalm\u00f6nster genom att justera axiom, regler, vinklar och rekursionsdjup. Gr\u00e4nssnittet drivs av p5.js.",
    "proj-yatzy-desc": "Interaktivt, webbl\u00e4sarbaserat Yatzy-spel. Spelaren kastar t\u00e4rningar och f\u00f6rs\u00f6ker samla po\u00e4ng genom specifika kombinationer. Spelet har enkla kontroller och visuell feedback.",
    "proj-website-title": "Personlig Webbsida",
    "proj-website-desc": "Denna webbsida. En personlig portf\u00f6ljsida som visar min bakgrund inom systemvetenskap, mina f\u00e4rdigheter och projekt. Byggd med HTML, CSS, JavaScript och Tailwind CSS.",
    "proj-algo-title": "Algoritmvisualiserare",
    "proj-algo-desc": "Webbapp f\u00f6r visualisering av sorterings- och s\u00f6kalgoritmer i en interaktiv milj\u00f6. Anv\u00e4ndare kan observera popul\u00e4ra algoritmer i realtid med anpassningsbar arraystorlek, hastighet och rutf\u00e4ltskonfiguration.",
    "proj-doodle-desc": "AI Doodle Jump-simulering med NEAT (NeuroEvolution of Augmenting Topologies). AI:n utvecklas \u00f6ver generationer f\u00f6r att optimera r\u00f6relser och maximera po\u00e4ng genom att hoppa p\u00e5 plattformar.",
    "proj-unity-title": "Unity-spel",
    "proj-unity-desc": "Ett spel jag skapade som skolprojekt i Unity. All grafik och rekvisita \u00e4r gjord av mig.",
    "view-github": "Visa p\u00e5 GitHub",
    "view-live": "Bes\u00f6k sidan",
    "view-itchio": "Visa p\u00e5 Itch.io",
    "footer-title": "Kontakt",
    "footer-text": "Har du en fr\u00e5ga eller vill samarbeta? H\u00f6r g\u00e4rna av dig!",
    "footer-copy": "\u00a9 2025 Gabriel Wendler",
  },
  en: {
    "hero-subtitle": "Computer Science Student | Fullstack Developer",
    "hero-desc": "Hands-on experience in fullstack development with C#/.NET and JavaScript. Building web services, REST APIs, and Office Add-ins with CI/CD in Azure DevOps.",
    "about-title": "About Me",
    "about-text": "Computer science student with hands-on experience in fullstack development using C#/.NET and JavaScript. Built and deployed web services, REST APIs, and Office Add-ins with CI/CD in Azure DevOps. Strong problem solver with experience in agile teamwork and technical troubleshooting.",
    "edu-title": "Education",
    "edu-su": "Stockholm University \u2013 Computer and Systems Sciences",
    "edu-su-type": "Bachelor's Programme",
    "edu-su-date": "2023 \u2013 2026 (expected graduation summer 2026)",
    "edu-ssis-type": "Technology Programme",
    "skills-title": "Technical Skills",
    "skills-lang": "Languages",
    "skills-tools": "Tools",
    "skills-cloud": "Database & Cloud",
    "skills-network": "Networking",
    "projects-title": "Projects",
    "projects-desc": "A collection of my work and creative projects",
    "proj-snus-title": "Snus Smart Valet",
    "proj-snus-desc": "Full-stack web app that scrapes, processes, and visualises the Swedish snus market. Explore 200+ products with advanced filters, sorting, AI recommendations, and statistics.",
    "proj-jobb-title": "Jobbmatcharen",
    "proj-jobb-desc": "Match your CV against 50,000+ active job listings from Arbetsf\u00f6rmedlingen. Intelligent CV analysis with scoring based on skills, experience, education, and languages. Daily updates via GitHub Actions.",
    "proj-fractal-title": "Fractal Generator",
    "proj-fractal-desc": "Interactive web app that generates beautiful fractals using L-systems. Users can explore and customize fractal patterns by adjusting the axiom, rules, angles, and recursion depth. Powered by p5.js.",
    "proj-yatzy-desc": "Interactive, browser-based Yatzy game. Players roll dice and attempt to score points by creating specific dice combinations. Features simple controls and visual feedback.",
    "proj-website-title": "Personal Website",
    "proj-website-desc": "This website. A personal portfolio site showcasing my background in computer science, skills, and projects. Built with HTML, CSS, JavaScript, and Tailwind CSS.",
    "proj-algo-title": "Algorithm Visualizer",
    "proj-algo-desc": "Web app for visualizing sorting and pathfinding algorithms in an interactive environment. Users can observe popular algorithms in real-time with customizable array sizes, speeds, and grid configurations.",
    "proj-doodle-desc": "AI Doodle Jump simulation using NEAT (NeuroEvolution of Augmenting Topologies). The AI evolves over generations to optimize movement and maximize score by jumping on platforms.",
    "proj-unity-title": "Unity Game",
    "proj-unity-desc": "A game I made for a school project in Unity. All graphics and props are made by me.",
    "view-github": "View on GitHub",
    "view-live": "Visit site",
    "view-itchio": "View on Itch.io",
    "footer-title": "Contact",
    "footer-text": "Have a question or want to collaborate? Feel free to reach out!",
    "footer-copy": "\u00a9 2025 Gabriel Wendler",
  },
};

function setLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  document.documentElement.lang = lang;
  localStorage.setItem("lang", lang);
}

document.addEventListener("DOMContentLoaded", function () {
  const langToggle = document.getElementById("lang-toggle");
  const savedLang = localStorage.getItem("lang") || "sv";

  // Apply saved language on load
  setLanguage(savedLang);
  if (langToggle) {
    langToggle.textContent = savedLang === "sv" ? "EN" : "SV";
  }

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      const currentLang = localStorage.getItem("lang") || "sv";
      const newLang = currentLang === "sv" ? "en" : "sv";
      setLanguage(newLang);
      langToggle.textContent = newLang === "sv" ? "EN" : "SV";
    });
  }
});