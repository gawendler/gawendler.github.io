// Array to keep track of the current slide for each slideshow
let slideIndex = [1, 1, 1, 1, 1, 1, 1, 1, 1];
let slideId = [
  "mySlides1",
  "mySlides2",
  "mySlides3",
  "mySlides4",
  "mySlides5",
  "mySlides6",
  "mySlides7",
  "mySlides8",
  "mySlides9",
];

// Initialize slideshows only after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all slideshows (only those that exist will be shown)
  for (let i = 0; i < slideId.length; i++) {
    let slides = document.getElementsByClassName(slideId[i]);
    if (slides && slides.length > 0) {
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
    return; // Exit early if no slides exist
  }

  // Wrap around the slides if the index is out of bounds
  if (n > slides.length) {
    slideIndex[no] = 1;
  }
  if (n < 1) {
    slideIndex[no] = slides.length;
  }

  // Hide all slides in the current slideshow and reset the dots
  for (i = 0; i < slides.length; i++) {
    slides[i].classList.add("hidden");
  }

  // Show the current slide and highlight the corresponding dot
  if (slides[slideIndex[no] - 1]) {
    slides[slideIndex[no] - 1].classList.remove("hidden");
  }
}
function showButtons(project) {
  project.querySelectorAll(".prev, .next").forEach((button) => {
    button.classList.remove("hidden");
  });
}

function hideButtons(project) {
  project.querySelectorAll(".prev, .next").forEach((button) => {
    button.classList.add("hidden");
  });
}

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
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
    // In light mode, show moon icon (clicking will switch to dark mode)
    if (themeIconDark) themeIconDark.classList.remove('hidden');
    if (themeIconLight) themeIconLight.classList.add('hidden');
  } else {
    body.classList.remove('bg-gradient-to-br', 'from-white', 'via-gray-50', 'to-gray-100', 'text-gray-900');
    body.classList.add('bg-gradient-to-br', 'from-gray-900', 'via-slate-900', 'to-gray-900', 'text-gray-100');
    body.classList.add('dark-mode');
    // In dark mode, show sun icon (clicking will switch to light mode)
    if (themeIconDark) themeIconDark.classList.add('hidden');
    if (themeIconLight) themeIconLight.classList.remove('hidden');
  }
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', function() {
    const isDark = body.classList.contains('dark-mode') || !body.classList.contains('light-mode');
    
    if (isDark) {
      // Switch to light mode
      body.classList.remove('bg-gradient-to-br', 'from-gray-900', 'via-slate-900', 'to-gray-900', 'text-gray-100');
      body.classList.add('bg-gradient-to-br', 'from-white', 'via-gray-50', 'to-gray-100', 'text-gray-900');
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      // Now in light mode, show moon icon (clicking will switch to dark mode)
      if (themeIconDark) themeIconDark.classList.remove('hidden');
      if (themeIconLight) themeIconLight.classList.add('hidden');
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark mode
      body.classList.remove('bg-gradient-to-br', 'from-white', 'via-gray-50', 'to-gray-100', 'text-gray-900');
      body.classList.add('bg-gradient-to-br', 'from-gray-900', 'via-slate-900', 'to-gray-900', 'text-gray-100');
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      // Now in dark mode, show sun icon (clicking will switch to light mode)
      if (themeIconDark) themeIconDark.classList.add('hidden');
      if (themeIconLight) themeIconLight.classList.remove('hidden');
      localStorage.setItem('theme', 'dark');
    }
  });
});