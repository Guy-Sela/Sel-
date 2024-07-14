document.addEventListener("DOMContentLoaded", function () {
    const hash = window.location.hash;
    switch (hash) {
        case "#home":
            break;
        case "#art":
            setTimeout(() => slide('right', '#art'), 1200);
            break;
        case "#else":
            break;
    }
});

const pages = document.getElementById("pages");
const translateAmountX = 33.33;
const translateAmountY = 50;
let translateX = 0;
let translateY = 0;

function slide(direction, href) {
    switch (direction) {
        case 'left':
            translateX += translateAmountX;
            break;
        case 'right':
            translateX -= translateAmountX;
            break;
        case 'up':
            translateY += translateAmountY;
            break;
        case 'down':
            translateY -= translateAmountY;
            break;
    }
    pages.style.transform = `translate(${translateX}%, ${translateY}%)`;
    setTimeout(() => location.href = href, 750);
}

document.getElementById('backFromAppChevron').addEventListener('click', () => {
    slide('right', '#home');
});

window.addEventListener('message', function (event) {
    if (event.source !== window.frames[0]) return;
    if (typeof event.data !== 'string' || !event.data.startsWith('Back')) return;
    slide('left', '#home');
});

const worldPopCounter = document.getElementsByClassName('worldPopCounter');
fetch('https://www.census.gov/popclock/data/population.php/world?_=' + new Date().getTime())
    .then(response => response.json())
    .then(data => {
        let pop = data.world.population;
        const growthRate = data.world.population_rate;
        function count() {
            pop = Math.round(pop += growthRate);
            worldPopCounter[0].innerHTML = pop.toLocaleString('en-US');
            worldPopCounter[1].innerHTML = worldPopCounter[0].innerHTML;
        }
        count();
        setInterval(count, 1000);
    });

document.getElementById('copyrightYear').innerHTML = new Date().getFullYear();
