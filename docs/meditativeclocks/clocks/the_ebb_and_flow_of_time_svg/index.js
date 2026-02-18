const circle = document.getElementById("ebbCircle");

// Set this to 43200 for the real 12-hour clock (12 * 60 * 60)
// Set this to 15 for a quick demo
const cycleDurationSeconds = 43200;

function update() {
  const now = new Date();
  const ms = now.getMilliseconds();
  const s = now.getSeconds();
  const m = now.getMinutes();
  const h = now.getHours();

  // Current time of day in total seconds (0 to 86400)
  const totalSeconds24 = h * 3600 + m * 60 + s + ms / 1000;

  // Determine if we are in the First cycle (Flow Out) or Second cycle (Flow In) of the 24h day
  // For the real clock, this is 0-12h vs 12-24h
  const isFlowOut = totalSeconds24 < cycleDurationSeconds;

  // Progress within the current cycle (0 to 1)
  // This resets exactly every cycleDurationSeconds
  const progress =
    (totalSeconds24 % cycleDurationSeconds) / cycleDurationSeconds;

  // Radius logic:
  // Flow Out: expands from 0 to 45
  // Flow In: contracts from 45 to 0
  const radius = isFlowOut ? progress * 45 : (1 - progress) * 45;

  // Opacity logic:
  // Fades to black (0) at the start and end of every cycle
  const opacity = Math.sin(progress * Math.PI);

  // Stroke width logic:
  // Subtly thins as the cycle progresses
  const strokeWidth = 0.5 - progress * 0.3;

  circle.setAttribute("r", radius);
  circle.setAttribute("opacity", opacity);
  circle.setAttribute("stroke-width", strokeWidth);

  requestAnimationFrame(update);
}

update();
