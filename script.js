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

// Initialize both slideshows
showSlides(1, 0);
showSlides(1, 1);
showSlides(1, 2);
showSlides(1, 3);
showSlides(1, 4);
showSlides(1, 5);
showSlides(1, 6);
showSlides(1, 7);
showSlides(1, 8);
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
  slides[slideIndex[no] - 1].classList.remove("hidden");
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
