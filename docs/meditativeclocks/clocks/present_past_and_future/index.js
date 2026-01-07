//initializing canvas

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


//        canvas size

window.onload = resizeCanvas
// In iframes, a resize can fire during initial layout/scrollbar settling.
// Reloading causes a visible "blink" (appears → disappears → reappears).
// Instead, just resize the canvas and recompute frame geometry.
window.onresize = () => {
    try {
        // Clear cached frame lines so setFrameValues() doesn't append duplicates.
        linesSeconds.length = 0
        linesMinutes.length = 0
        linesHours.length = 0
    } catch (e) { }
    resizeCanvas()
}

let smallerAspect, centerX, centerY

function resizeCanvas() {

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    centerX = canvas.width / 2
    centerY = canvas.height / 2

    scaleDrawing()

}


function scaleDrawing() {

    if (canvas.width <= canvas.height) {

        smallerAspect = canvas.width

    } else {

        smallerAspect = canvas.height

    }

    //    lineWidth = gap / 3
    setFrameValues()
}


//        defining frame

function Line(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2

    this.draw = function () {
        c.beginPath()
        c.moveTo(x1, y1)
        c.lineTo(x2, y2)
        c.lineWidth = lineWidth
        c.strokeStyle = "white"
//        c.strokeStyle = "black"
        c.stroke()
    }
}


let linesSeconds = [],
    linesMinutes = [],
    linesHours = []

let gap, lineLength, lineWidth, sectionGap

let x1FrameSeconds, x2FrameSeconds, y1FrameSeconds, y2FrameSeconds

let x1FrameMinutes, x2FrameMinutes, y1FrameMinutes,
    y2FrameMinutes

let x1FrameHours, x2FrameHours, y1FrameHours, y2FrameHours


function setFrameValues() {

    gap = canvas.width / 21 //smallerAspect / 21
    lineLength = smallerAspect / 7
    lineWidth = gap / 5
    sectionGap = lineLength / 5

    x1FrameSeconds = centerX - gap * 10
    x2FrameSeconds = centerX - gap * 10
    y1FrameSeconds = centerY - lineLength / 2 - sectionGap - lineLength
    y2FrameSeconds = centerY - lineLength / 2 - sectionGap


    function frameSeconds(x1, y1, x2, y2) {

        for (i = 0; i < 19; i++) {

            x1 += gap
            x2 += gap

            linesSeconds.push(new Line(x1, y1, x2, y2))
        }
    }

    frameSeconds(x1FrameSeconds, y1FrameSeconds, x2FrameSeconds, y2FrameSeconds)


    x1FrameMinutes = centerX - gap * 10
    x2FrameMinutes = centerX - gap * 10
    y1FrameMinutes = centerY - lineLength / 2
    y2FrameMinutes = centerY + lineLength / 2

    function frameMinutes(x1, y1, x2, y2) {

        for (i = 0; i < 19; i++) {

            x1 += gap
            x2 += gap

            linesMinutes.push(new Line(x1, y1, x2, y2))
        }

    }

    frameMinutes(x1FrameMinutes, y1FrameMinutes, x2FrameMinutes, y2FrameMinutes)


    x1FrameHours = centerX - gap * 4
    x2FrameHours = centerX - gap * 4
    y1FrameHours = sectionGap + centerY + lineLength / 2
    y2FrameHours = sectionGap + centerY + lineLength / 2 + lineLength


    function frameHours(x1, y1, x2, y2) {

        for (i = 0; i < 7; i++) {

            x1 += gap
            x2 += gap

            linesHours.push(new Line(x1, y1, x2, y2))
        }

    }

    frameHours(x1FrameHours, y1FrameHours, x2FrameHours, y2FrameHours)

}


//  PRESENT

let interval = setInterval(synchronize, 1)

function synchronize() {

    let milliseconds = new Date().getMilliseconds()

    if (milliseconds > 0 && milliseconds < 5) {

        let seconds = new Date().getSeconds()
        let minutes = new Date().getMinutes()
        let hours = new Date().getHours()

        drawSynchronized(seconds, minutes, hours)

        clearInterval(interval)

    }

}


let x1S, x2S, x1M, x2M, x1H, x2H


function drawSynchronized(seconds, minutes, hours) {

    x1S = linesSeconds[18].x1 + gap - seconds / 3 * gap
    x2S = linesSeconds[18].x2 + gap - seconds / 3 * gap
    x1M = linesMinutes[18].x1 + gap - (minutes / 3 * gap + seconds * 1 / 60)
    x2M = linesMinutes[18].x2 + gap - (minutes / 3 * gap + seconds * 1 / 60)
    x1H = linesHours[6].x1 + gap / 2 - (hours / 3 * gap + seconds * 1 / 3600)
    x2H = linesHours[6].x2 + gap / 2 - (hours / 3 * gap + seconds * 1 / 3600)

    mainAnimation()

}

let rate, color

function mainAnimation() {

    //    setTimeout(function () {
    //        requestAnimationFrame(mainAnimation)
    //    }, 1000 / 60)
    requestAnimationFrame(mainAnimation)
    c.clearRect(0, 0, innerWidth, innerHeight)


    // temp auxilary for testing centering

    //    c.moveTo(centerX, centerY)
    //    c.lineTo(centerX, centerY - 30)
    //    c.lineTo(centerX, centerY + 30)
    //    c.moveTo(centerX, centerY)
    //    c.lineTo(centerX + 30, centerY)
    //    c.lineTo(centerX - 30, centerY)
    //    c.strokeStyle = 'blue'
    //    c.lineWidth = 3
    //    c.stroke()

    //            drawing frame

    for (i = 0; i < linesSeconds.length; i++) {
        linesSeconds[i].draw()
    }

    for (i = 0; i < linesMinutes.length; i++) {
        linesMinutes[i].draw()
    }


    for (i = 0; i < linesHours.length; i++) {
        linesHours[i].draw()
    }


    //drawing time

    rate = gap / 180
    color = 'gold'
//    color = 'grey'

    //seconds

    c.beginPath()
    c.moveTo(x1S, y1FrameSeconds)
    c.lineTo(x2S, y2FrameSeconds)
    c.lineWidth = lineWidth * 1.5
    c.strokeStyle = color
    c.stroke()


    // temp auxilary for testing timing

    //    if (new Date().getSeconds() === 0) {
    //        console.log('now')
    //        c.beginPath()
    //    c.moveTo(x1S, y1FrameSeconds)
    //    c.lineTo(x2S, y2FrameSeconds)
    //    c.lineWidth = lineWidth
    //    c.strokeStyle = 'red'
    //    c.stroke()
    //        
    //    }

    x1S -= rate
    x2S -= rate

    if (x1S < linesSeconds[0].x1 - gap) {

        x1S = linesSeconds[18].x1 + gap
        x2S = linesSeconds[18].x1 + gap
    }

    //             minutes

    c.beginPath()
    c.moveTo(x1M, y1FrameMinutes)
    c.lineTo(x2M, y2FrameMinutes)
    c.lineWidth = lineWidth * 1.5
    c.strokeStyle = color
    c.stroke()

    x1M -= rate / 60
    x2M -= rate / 60

    if (x1M < linesMinutes[0].x1 - gap) {
        x1M = linesMinutes[18].x1 + gap
        x2M = linesMinutes[18].x1 + gap
    }

    //            hours

    c.beginPath()
    c.moveTo(x1H, y1FrameHours)
    c.lineTo(x2H, y2FrameHours)
    c.lineWidth = lineWidth * 1.5 
    c.strokeStyle = color
    c.stroke()

    x1H -= rate / 3600
    x2H -= rate / 3600


    // triggered once a day

    if (x1H < linesHours[0].x1 - gap / 2) {

        determineWhen()

        x1H = linesHours[6].x1 + gap / 2
        x2H = linesHours[6].x1 + gap / 2
    }

    // triggered according to determineWhen() selection 

    if (x1H === when[0]) {

        pastAndFuture()

        when.splice(0, 1)
    }

}


//PAST AND FUTURE

// how many times a day to fire past and future and when

let howManyADay, whenMin, whenMax
let when = []


function determineWhen() {

    howManyADay = Math.floor(Math.random() * 5)
    whenMin = linesHours[0].x1 - gap / 2
    whenMax = linesHours[6].x1 + gap / 2


    for (i = 0; i < howManyADay; i++) {

        when.push(Math.floor(Math.random() * (whenMax - whenMin) + whenMin))

    }

    when.sort((a, b) => b - a)
}


//// where to display past and future and for how long

let t = Math.floor(Math.random() * 18)
let w = Math.floor(Math.random() * 2)
let where
let delta = 0.001

switch (w) {

    case 0:
        where = linesSeconds
        break

    case 1:
        where = linesMinutes
        delta = delta / 2
        break

    case 2:
        where = linesHours
        t = Math.floor(Math.random() * 6)
        delta = delta / 3
}


// animating past and future


let alpha = 1

let xPastAndFuture, yPastAndFuture

function pastAndFuture() {
    const seconds = new Date().getSeconds();
    xPastAndFuture = where[t].x1 + gap / 2
    yPastAndFuture = where[t].y1

    c.save()
    c.globalAlpha = alpha
    c.beginPath()
    c.moveTo(xPastAndFuture, yPastAndFuture)
    c.lineTo(xPastAndFuture, yPastAndFuture + lineLength)
    c.lineWidth = lineWidth * 1.5
    c.strokeStyle = color
    c.stroke()
    c.restore()

    if (seconds < new Date().getSeconds() - gap / 2) alpha -= delta

    if (alpha <= 0) return

    setTimeout(function () {
        requestAnimationFrame(pastAndFuture)
    }, 1000 / 60)

}