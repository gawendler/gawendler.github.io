// Array to keep track of the current slide for each slideshow
let slideIndex = [1, 1, 1, 1, 1, 1, 1];
let slideId = [
  "mySlides1",
  "mySlides2",
  "mySlides3",
  "mySlides5",
  "mySlides6",
  "mySlides8",
  "mySlides9",
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
    body.classList.remove('bg-gradient-to-br', 'from-gray-900', 'via-slate-900', 'to-gray-900', 'text-gray-100');
    body.classList.add('bg-gradient-to-br', 'from-white', 'via-gray-50', 'to-gray-100', 'text-gray-900');
    body.classList.add('light-mode');
    if (themeIconDark) themeIconDark.classList.remove('hidden');
    if (themeIconLight) themeIconLight.classList.add('hidden');
  } else {
    body.classList.remove('bg-gradient-to-br', 'from-white', 'via-gray-50', 'to-gray-100', 'text-gray-900');
    body.classList.add('bg-gradient-to-br', 'from-gray-900', 'via-slate-900', 'to-gray-900', 'text-gray-100');
    body.classList.add('dark-mode');
    if (themeIconDark) themeIconDark.classList.add('hidden');
    if (themeIconLight) themeIconLight.classList.remove('hidden');
  }

  // Toggle theme on button click
  themeToggle.addEventListener('click', function () {
    const isDark = body.classList.contains('dark-mode') || !body.classList.contains('light-mode');

    if (isDark) {
      body.classList.remove('bg-gradient-to-br', 'from-gray-900', 'via-slate-900', 'to-gray-900', 'text-gray-100');
      body.classList.add('bg-gradient-to-br', 'from-white', 'via-gray-50', 'to-gray-100', 'text-gray-900');
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      if (themeIconDark) themeIconDark.classList.remove('hidden');
      if (themeIconLight) themeIconLight.classList.add('hidden');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.remove('bg-gradient-to-br', 'from-white', 'via-gray-50', 'to-gray-100', 'text-gray-900');
      body.classList.add('bg-gradient-to-br', 'from-gray-900', 'via-slate-900', 'to-gray-900', 'text-gray-100');
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