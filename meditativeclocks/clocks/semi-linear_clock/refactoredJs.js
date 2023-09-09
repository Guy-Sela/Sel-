const divs_seconds = Array.from({ length: 60 }, (_, i) => document.getElementById(`second${i}`));
const divs_minutes = Array.from({ length: 60 }, (_, i) => document.getElementById(`minute${i}`));
const divs_hours = Array.from({ length: 24 }, (_, i) => document.getElementById(`hour${i}`));

const currentSecond_initial = new Date().getSeconds();
const currentMinute_initial = new Date().getMinutes();
const currentHour_initial = new Date().getHours();

function animateRandomly(divs) {
    if (divs.length === 0) {
        if (divs === divs_seconds) {
            refill(divs_seconds);
            animateRandomly(divs_minutes);
        } else if (divs === divs_minutes) {
            refill(divs_minutes);
            animateRandomly(divs_hours);
        } else if (divs === divs_hours) {
            refill(divs_hours);
        }
        return;
    }

    const randIndex = Math.floor(Math.random() * divs.length);
    const randDiv = divs[randIndex];

    randDiv.classList.toggle("full");
    divs.splice(randIndex, 1);
}

function refill(divs) {
    if (divs === divs_seconds) {
        divs.push(...Array.from({ length: 60 }, (_, i) => document.getElementById(`second${i}`)));
    } else if (divs === divs_minutes) {
        divs.push(...Array.from({ length: 60 }, (_, i) => document.getElementById(`minute${i}`)));
    } else if (divs === divs_hours) {
        divs.push(...Array.from({ length: 24 }, (_, i) => document.getElementById(`hour${i}`)));
    }
}

// Animate initially based on current seconds, minutes, and hours
for (let i = 0; i < currentSecond_initial; i++) {
    animateRandomly(divs_seconds);
}
for (let i = 0; i < currentMinute_initial; i++) {
    animateRandomly(divs_minutes);
}
for (let i = 0; i < currentHour_initial; i++) {
    animateRandomly(divs_hours);
}

setInterval(() => animateRandomly(divs_seconds), 1000);
