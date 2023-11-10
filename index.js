document.addEventListener("DOMContentLoaded", function () {

    const hash = window.location.hash;
    switch (hash) {
        case "#home":
            console.log("home");
            break;
        case "#art":
            setTimeout(() => {
                slide('right', '#art');
            }, 1200);
            console.log("art");
            break;
        case "#else":
            console.log("else");
            break;
        default:
            console.log("Does not end with 'home', 'art', or 'else'");
    }
});


// -TRANSITIONS BETWEEN PAGES-


const pages = document.getElementById("pages");

const translateAmountX = 33.33;
const translateAmountY = 50;
let translate_X = 0
let translate_Y = 0
let axis


slide = (direction, href) => {

    console.log(direction, href)

    switch (direction) {

        case 'left':
            console.log('left')
            axis = 'X'
            translate_X += translateAmountX

            break;

        case 'right':
            console.log('right')
            translate_X -= translateAmountX
            axis = 'X'

            break;

        case 'up':
            console.log('up')
            translate_Y += translateAmountY
            axis = 'Y'

            break;

        case 'down':
            console.log('down')
            translate_Y = -translateAmountY
            axis = 'Y'

    }

    console.log(translate_X, translate_Y, axis)
    pages.style.transform = `translate(${translate_X}%, ${translate_Y}%)`


    setTimeout(() => {
        location.href = href
    }, 750)
}


const backFromAppChevron = document.getElementById('backFromAppChevron')

backFromAppChevron.addEventListener('click', () => {
    slide('right', '#home')
})


// -TRANSITION FROM IFRAME/ART PAGE TO HOME PAGE-

window.addEventListener('message', function (event) {

    // Check the event source to make sure it's trusted
    if (event.source !== window.frames[0]) {
        return;
    }

    // Check the message content to make sure it's safe and expected
    if (typeof event.data !== 'string' || event.data.indexOf('Back') !== 0) {
        return;
    }

    // Process the message
    console.log('Received message from iframe:', event.data);

    slide('left', '#home')

});


// -GET WORLD POPULATION DATA-


const worldPopCounter = document.getElementsByClassName('worldPopCounter')

const xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {

        getWorldPopData(this)

    }

}


xhttp.open("get", "https://www.census.gov/popclock/data/population.php/world?_=" + new Date().getTime(), true)

xhttp.responseType = "json"

xhttp.send()


function getWorldPopData(receivedData) {

    let pop = receivedData.response.world.population

    const growthRate = receivedData.response.world.population_rate

    displayWorldPopCounter(pop, growthRate)

}


function displayWorldPopCounter(pop, growthRate) {

    function count() {

        pop = Math.round(pop += growthRate)

        worldPopCounter[0].innerHTML = pop.toLocaleString('en-US')
        worldPopCounter[1].innerHTML = worldPopCounter[0].innerHTML

    }

    count()

    setInterval(count, 1000)
}


// -BOTTOM NAVBAR-

const contact = document.getElementById('contact')

// const altSite = document.getElementById('altSite')


contact.addEventListener('click', () => {

    window.location.href = "mailto:" + "guyselastein@protonmail.com";

})

// altSite.addEventListener('click', () => {

//     window.open('https://guy-sela.github.io/', '_blank');

// })


// -FOOTER-

const copyrightYear = document.getElementById('copyrightYear')

copyrightYear.innerHTML = new Date().getFullYear()

