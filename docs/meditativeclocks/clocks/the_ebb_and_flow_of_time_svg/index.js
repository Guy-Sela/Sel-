const circle = document.getElementById("ebbCircle");
const svg = document.querySelector("svg");

// Set this to 43200 for the real 12-hour clock (12 * 60 * 60)
// Set this to 15 for a quick demo
const cycleDurationSeconds = 43200;
// const cycleDurationSeconds = 15;

function update() {
  const now = new Date();
  const ms = now.getMilliseconds();
  const s = now.getSeconds();
  const m = now.getMinutes();
  const h = now.getHours();

  // Current time of day in total seconds (0 to 86400)
  const totalSeconds24 = h * 3600 + m * 60 + s + ms / 1000;

  // Viewport dimensions (matching canvas logic)
  const width = window.innerWidth;
  const height = window.innerHeight;
  const smallerAspect = Math.min(width, height);

  // Same radius scaling factor as the non-SVG version
  const radiusExponent = smallerAspect / 30;

  // Determine if we are in a Flow Out (expanding) or Flow In (contracting) phase
  const cycleIndex = Math.floor(totalSeconds24 / cycleDurationSeconds);
  const isFlowOut = cycleIndex % 2 === 0;

  // Progress within the current cycle (0 to 1)
  const progress =
    (totalSeconds24 % cycleDurationSeconds) / cycleDurationSeconds;

  // Radius logic:
  // We scale the max radius to 12 * radiusExponent to match the canvas version's peak size
  const maxRadius = 12 * radiusExponent;
  const radius = isFlowOut ? progress * maxRadius : (1 - progress) * maxRadius;

  // Opacity logic:
  // Brightest (1) when contracted (radius = 0), fades to 0 as it expands to maxRadius
  const opacity = 1 - radius / maxRadius;

  // Stroke width logic:
  // Thicker when contracted, thins as it expands (matching canvas logic)
  const strokeWidth =
    (0.5 - (radius / maxRadius) * 0.3) * (smallerAspect / 100);

  // Update SVG dimensions to match viewport
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);

  // Update Circle properties
  circle.setAttribute("cx", width / 2);
  circle.setAttribute("cy", height / 2);
  circle.setAttribute("r", radius);
  circle.setAttribute("opacity", opacity);
  circle.setAttribute("stroke-width", strokeWidth);

  requestAnimationFrame(update);
}

update();
