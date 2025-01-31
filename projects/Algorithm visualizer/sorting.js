const barsContainer = document.getElementById("bars-container");
const speedSlider = document.getElementById("speedSlider");
const barCountSlider = document.getElementById("barCountSlider");
const barCountValue = document.getElementById("barCountValue");
const buttons = document.querySelectorAll("button");

let bars = [];
let delay = 30;
let barCount = 50;
let isSorting = false;
let abortController = null;
let mygreen = "#27ae60";
let myyellow = "#f1c40f";
let myblue = "#3498db";
let originalcolor = "#2c3e50";

speedSlider.addEventListener("input", function () {
  delay = 101 - parseInt(speedSlider.value);
});

barCountSlider.addEventListener("input", function () {
  if (!isSorting) {
    barCount = parseInt(barCountSlider.value);
    barCountValue.innerText = barCount;
    generateBars(barCount);
  }
});

function generateBars(num = barCount) {
  barsContainer.innerHTML = "";
  bars = Array.from({ length: num }, () => Math.floor(Math.random() * 100) + 5);
  bars.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 3}px`;
    bar.style.width = `${600 / num}px`;
    barsContainer.appendChild(bar);
  });
  stopSorting(); // Reset sorting state
}

function toggleButtons(disable) {
  buttons.forEach((button) => (button.disabled = disable));
}

async function flashBars(color) {
  const barElements = document.querySelectorAll(".bar");
  barElements.forEach((bar) => (bar.style.backgroundColor = color));
  await new Promise((resolve) => setTimeout(resolve, 300));
  barElements.forEach((bar) => (bar.style.backgroundColor = mygreen));
}

function startSorting(sortingFunction) {
  if (abortController) abortController.abort(); // Stop any ongoing sort
  abortController = new AbortController(); // Start fresh with a new controller
  sortingFunction(abortController.signal);
}

// Existing code below...
function stopSorting() {
  isSorting = false;
}

async function bubbleSort(abortSignal) {
  if (isSorting) return;
  isSorting = true;

  const barElements = document.querySelectorAll(".bar");
  for (let i = 0; i < bars.length - 1; i++) {
    for (let j = 0; j < bars.length - i - 1; j++) {
      if (abortSignal.aborted) return stopSorting(); // Check for cancellation

      // Make current bar yellow
      barElements[j].style.backgroundColor = myyellow;
      barElements[j + 1].style.backgroundColor = myyellow;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Swap if necessary
      if (bars[j] > bars[j + 1]) {
        [bars[j], bars[j + 1]] = [bars[j + 1], bars[j]];
        barElements[j].style.height = `${bars[j] * 3}px`;
        barElements[j + 1].style.height = `${bars[j + 1] * 3}px`;
      }
      // Revert color to default for unsorted bars, green for sorted
      barElements[j].style.backgroundColor = originalcolor;
      barElements[j + 1].style.backgroundColor =
        j + 1 === bars.length - i - 1 ? mygreen : originalcolor;
    }
    barElements[bars.length - i - 1].style.backgroundColor = mygreen;
  }
  barElements[0].style.backgroundColor = mygreen;

  await flashBars(myyellow);
  stopSorting();
}

async function selectionSort(abortSignal) {
  if (isSorting) return;
  isSorting = true;

  const barElements = document.querySelectorAll(".bar");

  for (let i = 0; i < bars.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < bars.length; j++) {
      if (abortSignal.aborted) return stopSorting();

      // Make the current comparison bar yellow
      barElements[j].style.backgroundColor = myyellow;
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (bars[j] < bars[minIndex]) {
        if (minIndex !== i) {
          barElements[minIndex].style.backgroundColor = originalcolor;
        }
        minIndex = j;
      }
      barElements[j].style.backgroundColor = originalcolor;
    }

    if (minIndex !== i) {
      [bars[i], bars[minIndex]] = [bars[minIndex], bars[i]];
      barElements[i].style.height = `${bars[i] * 3}px`;
      barElements[minIndex].style.height = `${bars[minIndex] * 3}px`;
    }

    barElements[i].style.backgroundColor = mygreen;
  }

  await flashBars(myyellow);
  stopSorting();
}

async function insertionSort(abortSignal) {
  if (isSorting) return;
  isSorting = true;

  const barElements = document.querySelectorAll(".bar");
  for (let i = 1; i < bars.length; i++) {
    let key = bars[i];
    let j = i - 1;

    barElements[i].style.backgroundColor = myyellow;

    while (j >= 0 && bars[j] > key) {
      if (abortSignal.aborted) return stopSorting();

      await new Promise((resolve) => setTimeout(resolve, delay));
      bars[j + 1] = bars[j];
      barElements[j + 1].style.height = `${bars[j + 1] * 3}px`;
      barElements[j].style.backgroundColor = originalcolor;
      j--;
    }
    bars[j + 1] = key;
    barElements[j + 1].style.height = `${key * 3}px`;

    barElements[i].style.backgroundColor = mygreen;
  }

  await flashBars(myyellow);
  stopSorting();
}

// Shell Sort
async function shellSort(abortSignal) {
  if (isSorting) return;
  isSorting = true;

  const barElements = document.querySelectorAll(".bar");
  for (
    let gap = Math.floor(bars.length / 2);
    gap > 0;
    gap = Math.floor(gap / 2)
  ) {
    for (let i = gap; i < bars.length; i++) {
      if (abortSignal.aborted) return stopSorting();

      let temp = bars[i];
      let j;
      for (j = i; j >= gap && bars[j - gap] > temp; j -= gap) {
        barElements[j].style.height = `${bars[j - gap] * 3}px`;
        bars[j] = bars[j - gap];
        barElements[j].style.backgroundColor = myyellow;
        await new Promise((resolve) => setTimeout(resolve, delay));
        barElements[j].style.backgroundColor = originalcolor;
      }
      bars[j] = temp;
      barElements[j].style.height = `${temp * 3}px`;
      barElements[j].style.backgroundColor = originalcolor;
    }
  }

  await flashBars(myyellow);
  stopSorting();
}

// Merge Sort
async function mergeSortWrapper(abortSignal) {
  if (isSorting) return;
  isSorting = true;

  await mergeSort(0, bars.length - 1, abortSignal);
  if (isSorting) {
    await flashBars(myyellow);
  }
  stopSorting();
}

// Merge Sort
async function mergeSort(left, right, abortSignal) {
  if (left >= right || abortSignal.aborted) return;

  const middle = Math.floor((left + right) / 2);
  await mergeSort(left, middle, abortSignal);
  await mergeSort(middle + 1, right, abortSignal);

  await merge(left, middle, right, abortSignal);
}

// Merge Function
async function merge(left, middle, right, abortSignal) {
  const barElements = document.querySelectorAll(".bar");
  const leftPart = bars.slice(left, middle + 1);
  const rightPart = bars.slice(middle + 1, right + 1);

  let i = 0,
    j = 0,
    k = left;
  while (i < leftPart.length && j < rightPart.length) {
    if (abortSignal.aborted) return stopSorting();

    barElements[k].style.backgroundColor = myyellow; // Highlight current position in yellow
    await new Promise((resolve) => setTimeout(resolve, delay));
    barElements[k].style.backgroundColor = originalcolor; // Highlight current position in yellow

    if (leftPart[i] <= rightPart[j]) {
      bars[k] = leftPart[i];
      barElements[k].style.height = `${bars[k] * 3}px`;
      i++;
    } else {
      bars[k] = rightPart[j];
      barElements[k].style.height = `${bars[k] * 3}px`;
      j++;
    }
    k++;
  }
  while (i < leftPart.length) {
    bars[k] = leftPart[i];
    barElements[k].style.height = `${bars[k] * 3}px`;
    i++;
    k++;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  while (j < rightPart.length) {
    bars[k] = rightPart[j];
    barElements[k].style.height = `${bars[k] * 3}px`;
    j++;
    k++;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

// Heap Sort
async function heapSort(abortSignal) {
  if (isSorting) return;
  isSorting = true;

  const barElements = document.querySelectorAll(".bar");

  // Build the heap
  for (let i = Math.floor(bars.length / 2) - 1; i >= 0; i--) {
    await heapify(bars.length, i, abortSignal);
  }

  for (let i = bars.length - 1; i > 0; i--) {
    if (abortSignal.aborted) return stopSorting();

    [bars[0], bars[i]] = [bars[i], bars[0]];
    barElements[0].style.height = `${bars[0] * 3}px`;
    barElements[i].style.height = `${bars[i] * 3}px`;
    barElements[i].style.backgroundColor = mygreen; // Mark as sorted in green
    await heapify(i, 0, abortSignal);
  }
  barElements[0].style.backgroundColor = mygreen; // Mark the root element in green

  await flashBars(myyellow);
  stopSorting();
}

// Heapify function
async function heapify(n, i, abortSignal) {
  const barElements = document.querySelectorAll(".bar");
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < n && bars[left] > bars[largest]) largest = left;
  if (right < n && bars[right] > bars[largest]) largest = right;

  if (largest !== i) {
    [bars[i], bars[largest]] = [bars[largest], bars[i]];
    barElements[i].style.height = `${bars[i] * 3}px`;
    barElements[largest].style.height = `${bars[largest] * 3}px`;

    barElements[i].style.backgroundColor = myyellow; // Highlight the swapping bars in yellow
    await new Promise((resolve) => setTimeout(resolve, delay));

    barElements[i].style.backgroundColor = originalcolor;

    await heapify(n, largest, abortSignal);
  }
}

// Quick Sort
async function quickSortWrapper(abortSignal) {
  if (isSorting) return;
  isSorting = true;
  await quickSort(0, bars.length - 1, abortSignal);
  if (isSorting) {
    await flashBars(myyellow);
  }

  stopSorting();
}

// Quick Sort
async function quickSort(low, high, abortSignal) {
  if (low < high && !abortSignal.aborted) {
    const pivotIndex = await partition(low, high, abortSignal);
    await quickSort(low, pivotIndex - 1, abortSignal);
    await quickSort(pivotIndex + 1, high, abortSignal);
  }
}

// Partition function for Quick Sort
async function partition(low, high, abortSignal) {
  const barElements = document.querySelectorAll(".bar");
  const pivot = bars[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (abortSignal.aborted) return stopSorting();

    if (bars[j] < pivot) {
      i++;
      [bars[i], bars[j]] = [bars[j], bars[i]];
      barElements[i].style.height = `${bars[i] * 3}px`;
      barElements[j].style.height = `${bars[j] * 3}px`;

      barElements[i].style.backgroundColor = myyellow;
      await new Promise((resolve) => setTimeout(resolve, delay));

      barElements[i].style.backgroundColor = originalcolor;
    }
  }
  [bars[i + 1], bars[high]] = [bars[high], bars[i + 1]];
  barElements[i + 1].style.height = `${bars[i + 1] * 3}px`;
  barElements[high].style.height = `${bars[high] * 3}px`;

  barElements[high].style.backgroundColor = originalcolor;

  return i + 1;
}

generateBars(barCount);

// Assign the new sorting functions to buttons
document.querySelector('button[onclick="bubbleSort()"]').onclick = () =>
  startSorting(bubbleSort);
document.querySelector('button[onclick="selectionSort()"]').onclick = () =>
  startSorting(selectionSort);
document.querySelector('button[onclick="insertionSort()"]').onclick = () =>
  startSorting(insertionSort);
document.querySelector('button[onclick="shellSort()"]').onclick = () =>
  startSorting(shellSort);
document.querySelector('button[onclick="mergeSort()"]').onclick = () =>
  startSorting(mergeSortWrapper);
document.querySelector('button[onclick="heapSort()"]').onclick = () =>
  startSorting(heapSort);
document.querySelector('button[onclick="quickSort()"]').onclick = () =>
  startSorting(quickSortWrapper);
