/**
 * ONE MINUTE OF YOUR LIFE - Meditative Timer
 * 
 * --- CONFIGURATION ---
 */
const CONFIG = {
    durationMs: 60000,            // 60 seconds loop
    colorIn: { r: 0, g: 0, b: 0 },    // Black
    colorOut: { r: 255, g: 255, b: 255 }, // White
    exportFps: 60,                // 60 FPS for video export
    videoBitrate: 20000000,       // 20 Mbps for high quality
    recordKey: 'r'                // Press 'r' to record
};

// --- INITIALIZATION ---
const canvas = document.getElementById('timerCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
}

window.addEventListener('resize', resize);
resize();

const lerp = (start, end, t) => start + (end - start) * t;

/**
 * Core Animation Loop
 */
function draw(timestamp) {
    const elapsed = timestamp % CONFIG.durationMs;
    const halfDuration = CONFIG.durationMs / 2;
    
    let progress; // 0 to 1 back to 0

    if (elapsed < halfDuration) {
        // Phase 1: Fade In (0 -> 1)
        progress = elapsed / halfDuration;
    } else {
        // Phase 2: Fade Out (1 -> 0)
        progress = 1 - ((elapsed - halfDuration) / halfDuration);
    }

    const r = lerp(CONFIG.colorIn.r, CONFIG.colorOut.r, progress);
    const g = lerp(CONFIG.colorIn.g, CONFIG.colorOut.g, progress);
    const b = lerp(CONFIG.colorIn.b, CONFIG.colorOut.b, progress);

    ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(draw);
}

// Start the animation immediately
requestAnimationFrame(draw);

/**
 * --- VIDEO EXPORT ---
 * Press 'r' to start/stop recording. 
 * The file will download as 'one-minute-of-your-life.webm'
 */
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === CONFIG.recordKey) {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    }
});

function startRecording() {
    console.log("Recording started...");
    recordedChunks = [];
    const stream = canvas.captureStream(CONFIG.exportFps);
    
    const options = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: CONFIG.videoBitrate
    };

    try {
        mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
        mediaRecorder = new MediaRecorder(stream); // Fallback
    }

    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'one-minute-of-your-life.webm';
        a.click();
        window.URL.revokeObjectURL(url);
        console.log("Recording saved.");
    };

    mediaRecorder.start();
    isRecording = true;
}

function stopRecording() {
    mediaRecorder.stop();
    isRecording = false;
    console.log("Recording stopped.");
}
