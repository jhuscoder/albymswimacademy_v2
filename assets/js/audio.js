// ✅ 2. Initialize ambient background audio (looping, subtle volume)
const audio = new Audio("/assets/sea-swimming-loop.wav");
audio.loop = true;
audio.volume = 0.01; // gentle background level

// ✅ 3. Play audio safely (respecting browser autoplay policies)
const playAudio = () => {
    audio.play().catch((err) => {
        console.warn("Audio playback deferred:", err.message);
    });
    // Once played manually, remove listener
    document.removeEventListener("click", playAudio);
};

// Attempt immediate play, or wait for user interaction
audio.play().catch(() => {
    document.addEventListener("click", playAudio, { once: true });
});

// ✅ Optional: fade-in effect for ambient audio
// let volume = 0;
// const fadeIn = setInterval(() => {
//     if (volume < 0.02) {
//         volume += 0.001;
//         audio.volume = volume;
//     } else {
//         clearInterval(fadeIn);
//     }
// }, 200);