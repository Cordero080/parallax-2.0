const cards = document.querySelectorAll(".card");

function updateTransforms() {
  //quick note: this function is called whenever the user scrolls the page. It updates the transforms of each card based on the scroll position.
  const scrollY = window.scrollY; // simply put, window is the global object in the browser, and scrollY is a property that returns the number of pixels that the document has already been scrolled vertically. This is used to calculate the parallax effect based on the scroll position.

  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const rawProgress = Math.min(scrollY / maxScroll, 1);
  const cardHue = rawProgress * 260; // Gradual hue shift up to 260deg

  // Sinewave parameters for card motion
  const waveAmplitude = 24; // Subtle amplitude
  const waveWavelength = 480; // Match main sinewave wavelength
  const waveSpeed = window.waveGen ? window.waveGen.speed : 0.7;
  const waveTime = window.waveGen
    ? window.waveGen.time
    : performance.now() / 1000;

  cards.forEach((card, i) => {
    card.style.filter = `hue-rotate(${cardHue}deg)`;
    const speed = parseFloat(card.getAttribute("data-speed")); // parseFloat is used to convert the string value of the data-speed attribute into a floating-point number. This allows for decimal values, which can create a more subtle parallax effect. The data-speed attribute is set in the HTML and determines how fast the card moves relative to the scroll position. To see this in the HTML, you can look for something like <div class="card" data-speed="0.5">. The speed value can be adjusted to make the parallax effect more or less pronounced.
    const offset = scrollY * speed;

    // Subtle sinewave vertical offset
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const waveY =
      Math.sin(waveTime * waveSpeed + cardCenterX / waveWavelength) *
      waveAmplitude;

    // Only apply parallax if not being hovered
    if (!card.matches(":hover")) {
      card.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(50px) translateY(${
        offset + waveY
      }px)`; //this is the transform that will be applied to the card when it is not being hovered. When mouse is not hovering over the card, it will apply a parallax effect based on the scroll position
    }
  });

  // Sinewave hue shift
  const sineWaveCanvas = document.getElementById("waves");
  if (sineWaveCanvas) {
    sineWaveCanvas.style.filter = `hue-rotate(${cardHue}deg)`;
  }
}

// Handle parallax on scroll
window.addEventListener("scroll", updateTransforms);

// Rotate card toward mouse position
cards.forEach((card) => {
  // this is the loop that adds the event listeners to each card so that they can react to mouse movements
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect(); // this is a built-in method that returns the size of an element and its position relative to the viewport
    const x = e.clientX - rect.left; // x position within the card
    const y = e.clientY - rect.top; // y position within the card

    const centerX = rect.width / 2; // this is the center of the card
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 5; // invert so it tilts correctly. to exxaggerate the effect, you can change the divisor into a smaller number foe example 5 or 3 (it was 10 before)
    const rotateY = (x - centerX) / 5;

    const scrollY = window.scrollY;
    const speed = parseFloat(card.getAttribute("data-speed"));
    const offset = scrollY * speed;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(80px) translateY(${offset}px)`;
  });

  card.addEventListener("mouseleave", () => {
    const scrollY = window.scrollY;
    const speed = parseFloat(card.getAttribute("data-speed"));
    const offset = scrollY * speed;

    card.style.transform = `rotateY(10deg) translateZ(50px) translateY(${offset}px)`;
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "r") {
    waveGen.direction *= -1; // Reverse animation direction
  }
});

// Complementary Color Effect for PABLOPISTOLA hover

document.addEventListener("DOMContentLoaded", function () {
  const myNameElement = document.getElementById("myName");
  if (!myNameElement) return;

  let scrambleInterval = null;
  let scrambleTimeout = null;
  const originalText = myNameElement.textContent;
  const nameLetters = originalText.split("");

  // Upside down unicode map for basic Latin letters
  const upsideDownMap = {
    A: "$",
    B: "𐐒",
    C: "Ↄ",
    D: "◖",
    E: "Ǝ",
    F: "Ⅎ",
    G: "⅁",
    H: "H",
    I: "e",
    J: "L",
    K: "8",
    L: "0",
    M: "W",
    N: "o",
    O: "⌘",
    P: "L",
    Q: "d",
    R: "ᴚ",
    S: "S",
    T: "⊥",
    U: "∩",
    V: "Λ",
    W: "$",
    X: "X",
    Y: "⅄",
    Z: "Z",
    a: "⏄",
    b: "q",
    c: "ɔ",
    d: "p",
    e: "ǝ",
    f: "ɟ",
    g: "ƃ",
    h: "ɥ",
    i: "ᴉ",
    j: "ɾ",
    k: "ʞ",
    l: "ʃ",
    m: "ɯ",
    n: "u",
    o: "o",
    p: "d",
    q: "b",
    r: "ɹ",
    s: "s",
    t: "¡",
    u: "n",
    v: "ʌ",
    w: "ʍ",
    x: "x",
    y: "ʎ",
    z: "z",
  };

  // Ensure toggleComplementaryColors is accessible
  window.toggleComplementaryColors =
    window.toggleComplementaryColors ||
    function () {
      if (typeof isComplementaryMode === "undefined") {
        window.isComplementaryMode = false;
      }
      window.isComplementaryMode = !window.isComplementaryMode;
      if (window.isComplementaryMode) {
        document.body.classList.add("complementary-colors");
        updateWaveColors(true);
        setEtherealWaveComplexity(true);
      } else {
        document.body.classList.remove("complementary-colors");
        updateWaveColors(false);
        setEtherealWaveComplexity(false);
      }
    };

  function scrambleName() {
    // Scramble using only letters in the name
    let scrambled = [];
    for (let i = 0; i < nameLetters.length; i++) {
      // Pick a random letter from the name
      let randLetter =
        nameLetters[Math.floor(Math.random() * nameLetters.length)];
      // Convert to upside down if possible
      let upside = upsideDownMap[randLetter] || randLetter;
      scrambled.push(upside);
    }
    // Reverse the scrambled array
    scrambled = scrambled.reverse();
    myNameElement.textContent = scrambled.join("");
  }

  myNameElement.addEventListener("mouseenter", () => {
    scrambleInterval = setInterval(scrambleName, 80);
    scrambleTimeout = setTimeout(() => {
      clearInterval(scrambleInterval);
      scrambleInterval = null;
      // After 3 seconds, show the final scrambled, reversed, upside down name
      let final = nameLetters
        .map((l) => upsideDownMap[l] || l)
        .reverse()
        .join("");
      myNameElement.textContent = final;
      // Activate complimentary mode
      window.toggleComplementaryColors();
    }, 2000);
  });

  myNameElement.addEventListener("mouseleave", () => {
    if (scrambleInterval) {
      clearInterval(scrambleInterval);
      scrambleInterval = null;
    }
    if (scrambleTimeout) {
      clearTimeout(scrambleTimeout);
      scrambleTimeout = null;
    }
    myNameElement.textContent = originalText;
  });
});

function updateWaveColors(isComplementary) {
  if (window.waveGen && window.waveGen.ctx) {
    const gradient = window.waveGen.ctx.createLinearGradient(
      0,
      0,
      window.waveGen.width,
      0
    );

    if (isComplementary) {
      // Complementary colors
      gradient.addColorStop(0, "#00ff7f"); // Complement of pink
      gradient.addColorStop(0.2, "#00ff80"); // Complement of magenta
      gradient.addColorStop(0.5, "#ffaa00"); // Complement of blue
      gradient.addColorStop(1, "#ff4500"); // Complement of turquoise
    } else {
      // Original colors
      gradient.addColorStop(0, "pink");
      gradient.addColorStop(0.2, "magenta");
      gradient.addColorStop(0.5, "blue");
      gradient.addColorStop(1, "turquoise");
    }

    window.waveGen.waves.forEach((w) => (w.strokeStyle = gradient));
  }
}

function setEtherealWaveComplexity(isEthereal) {
  if (window.waveGen) {
    if (isEthereal) {
      window.waveGen.speed = 0.7; // Slow, fabric-like
      window.waveGen.waves = [
        {
          timeModifier: 1,
          lineWidth: 5.4,
          amplitude: 264,
          wavelength: 480,
          segmentLength: 16,
        },
        {
          timeModifier: 0.8,
          lineWidth: 3,
          amplitude: 244,
          wavelength: 220,
          segmentLength: 12,
        },
        {
          timeModifier: 1.5,
          lineWidth: 2,
          amplitude: 96,
          wavelength: 80,
          segmentLength: 6,
        },
        {
          timeModifier: 2.3,
          lineWidth: 1,
          amplitude: 48,
          wavelength: 40,
          segmentLength: 3,
        },
        {
          timeModifier: 0.6,
          lineWidth: 0.7,
          amplitude: 36,
          wavelength: 720,
          segmentLength: 24,
        },
      ];
      window.waveGen.resizeEvent();
    } else {
      window.waveGen.speed = 4;
      window.waveGen.waves = [
        {
          timeModifier: 1,
          lineWidth: 3,
          amplitude: 150,
          wavelength: 200,
          segmentLength: 20,
        },
        { timeModifier: 1, lineWidth: 2, amplitude: 150, wavelength: 100 },
        {
          timeModifier: 1,
          lineWidth: 1,
          amplitude: -150,
          wavelength: 50,
          segmentLength: 10,
        },
        {
          timeModifier: 1,
          lineWidth: 0.5,
          amplitude: -100,
          wavelength: 100,
          segmentLength: 10,
        },
        {
          timeModifier: 1,
          lineWidth: 0.5,
          amplitude: -50,
          wavelength: 50,
          segmentLength: 20,
        },
      ];
      window.waveGen.resizeEvent();
    }
  }
}

myNameElement.addEventListener("mouseenter", () => {
  // Start the 4-second timer
  hoverTimer = setTimeout(() => {
    toggleComplementaryColors();
  }, 3000);
});

myNameElement.addEventListener("mouseleave", () => {
  // Clear the timer if mouse leaves before 4 seconds
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
});

// Optional: Click to toggle back to normal
myNameElement.addEventListener("click", () => {
  if (isComplementaryMode) {
    toggleComplementaryColors();
  }
});

const audio = document.getElementById("site-audio");
if (audio) {
  audio.volume = 0.3; // set volume
}

let cursorY = window.innerHeight / 2;
let cursorX = window.innerWidth / 2;
window.addEventListener("mousemove", function (e) {
  cursorX = e.clientX;
  cursorY = e.clientY;
});
// Patch sinewave animation to attract to cursor in both X and Y
if (window.waveGen) {
  const originalDraw = window.waveGen.draw;
  window.waveGen.draw = function () {
    const canvas = document.getElementById("waves");
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    window.waveGen.waves.forEach((wave, i) => {
      // Track both X and Y offset for each wave
      if (!wave._offsetY) wave._offsetY = canvas.height / 2;
      if (!wave._offsetX) wave._offsetX = canvas.width / 2;
      // Calculate distance from wave to cursor
      let distY = Math.abs(wave._offsetY - cursorY);
      let distX = Math.abs(wave._offsetX - cursorX);
      // Pull strength decreases as distance increases
      let strengthY = Math.max(0.04, 0.18 - (distY / canvas.height) * 0.16);
      let strengthX = Math.max(0.04, 0.18 - (distX / canvas.width) * 0.16);
      wave._offsetY += (cursorY - wave._offsetY) * strengthY;
      wave._offsetX += (cursorX - wave._offsetX) * strengthX;
      wave.offsetY = wave._offsetY;
      wave.offsetX = wave._offsetX;
    });
    if (originalDraw) originalDraw.call(window.waveGen);
  };
}
