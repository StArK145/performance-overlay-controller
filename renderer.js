let isDragging = false, offsetX, offsetY;
const overlay = document.getElementById("overlay");

// Draggable Overlay
// overlay.addEventListener("mousedown", (e) => {
//     isDragging = true;
//     offsetX = e.clientX - overlay.offsetLeft;
//     offsetY = e.clientY - overlay.offsetTop;
//     overlay.style.cursor = "grabbing";
// });

// document.addEventListener("mousemove", (e) => {
//     if (isDragging) {
//         overlay.style.left = e.clientX - offsetX + "px";
//         overlay.style.top = e.clientY - offsetY + "px";
//     }
// });

// document.addEventListener("mouseup", () => {
//     isDragging = false;
//     overlay.style.cursor = "grab";
// });

// FPS Calculation
let lastFrameTime = performance.now(), frameCount = 0;
function calculateFPS() {
    const now = performance.now();
    frameCount++;
    if (now - lastFrameTime >= 1000) {
        document.getElementById("fps").textContent = frameCount;
        frameCount = 0;
        lastFrameTime = now;
    }
    requestAnimationFrame(calculateFPS);
}
calculateFPS();

// Latency Calculation
async function measureLatency() {
    const start = performance.now();
    try {
        await fetch("https://www.google.com/generate_204", { mode: 'no-cors' });
        const latency = Math.round(performance.now() - start);
        document.getElementById("latency").textContent = latency;
    } catch {
        document.getElementById("latency").textContent = "Error";
    }
}
setInterval(measureLatency, 2000);