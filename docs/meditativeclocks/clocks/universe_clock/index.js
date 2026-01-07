//initializing canvas        

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//        sizing canvas 

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.onresize = resizeCanvas

function resizeCanvas() {

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    scaleDrawing()

}


let smallerAspect, side, centerX, centerY, intoTheFuture = 0,
    smallSide = 0,
    theProgressOfTime

function scaleDrawing() {

    if (canvas.width <= canvas.height) {

        smallerAspect = canvas.width

    } else {

        smallerAspect = canvas.height

    }

    side = smallerAspect * 3.5 / 5

    centerX = canvas.width / 2
    centerY = canvas.height / 2

    drawClockFrame()
    drawTimeSinceBigBang()
}

scaleDrawing()


function drawClockFrame() {

    c.beginPath();
    c.lineWidth = 2;
    c.strokeStyle = "white";
    c.moveTo(centerX - side / 2, centerY - side / 2);
    c.lineTo(centerX - side / 2, centerY + side / 2);
    c.lineTo(centerX + side / 2, centerY + side / 2);
    c.stroke();

}


function drawTimeSinceBigBang() {

    theProgressOfTime = side / 500

    smallSideMax = Math.sqrt((((Math.pow(side, 2) / 2) / 1000) * 9) * 2)


    if (smallSide < smallSideMax) {

        requestAnimationFrame(drawTimeSinceBigBang)

    }

    smallSide += theProgressOfTime

    c.beginPath();
    c.moveTo(centerX - side / 2, centerY + side / 2 - smallSide);
    c.lineTo(centerX - side / 2, centerY + side / 2);
    c.lineTo(centerX - side / 2 + smallSide, centerY + side / 2);
    c.closePath()
    c.fillStyle = 'white'
    c.fill()

}


// joke, triggered randomly once every 24 hours (from loading)

let triggerJoke = Math.floor(Math.random() * 86400000)

//console.log(triggerJoke)

setTimeout(universeByeBye, triggerJoke)


function universeByeBye() {

    if (intoTheFuture < side) {

        requestAnimationFrame(universeByeBye)

    }

    c.beginPath();
    c.moveTo(centerX - side / 2, centerY + side / 2 - intoTheFuture);
    c.lineTo(centerX - side / 2, centerY + side / 2);
    c.lineTo(centerX - side / 2 + intoTheFuture, centerY + side / 2);
    c.closePath()
    c.fillStyle = 'white'
    c.fill()

    intoTheFuture += side / 500

    if (intoTheFuture >= side) {

        setTimeout(() => {
            c.clearRect(0, 0, canvas.width, canvas.height)
            c.font = "35px Serif"
            c.textAlign = "center"
            c.fillText("Just Kidding", canvas.width / 2, canvas.height / 2)
            setTimeout(() => {
                location.reload()
            }, 1500)
        }, 3000)

    }
}
