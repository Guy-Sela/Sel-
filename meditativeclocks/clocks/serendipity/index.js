//initializing canvas

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

window.onload = resizeCanvas
window.onresize = () => location.reload(true)

let smallerAspect, centerX, centerY
let handWidth, handLength

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

    handWidth = smallerAspect / 65
    handLength = smallerAspect / 7


    mainAnimation()
}


let choice = 2 // 2 or 3 a day 
let sound
let when = []
let day = new Date().getDate()


function determineWhen() {

    for (i = 0; i < choice; i++) {

        let whenHours = '' + (Math.round(Math.random() * 23) + 1)
        let whenMinutes = '' + Math.round(Math.random() * 59)
        let whenSeconds = '' + Math.round(Math.random() * 59)

        if (+whenHours <= 12) {

            let am = whenHours.concat(whenMinutes, whenSeconds)

            when.push(am)

        } else {

            setTimeout(function () {
                let pm = ('' + +whenHours % 12).concat(whenMinutes, whenSeconds)
                when.push(pm)
            }, 4320000)
        }

        when.sort((a, b) => a - b)
    }
}

determineWhen()

let color = 'red'
//let color = 'gold'
let degreesSeconds, degreesMinutes, degreesHours

function mainAnimation() {

    requestAnimationFrame(mainAnimation)

    c.clearRect(0, 0, canvas.width, canvas.height)

    // seconds

    degreesSeconds = new Date().getSeconds() * 6

    c.save()
    c.translate(centerX, centerY)
    c.rotate(degreesSeconds * Math.PI / 180)
    c.translate(-centerX, -centerY)
    c.beginPath()
    c.moveTo(centerX, centerY)
    c.lineTo(centerX, centerY - smallerAspect / 2.5)
    c.lineWidth = handWidth
    c.strokeStyle = color
    c.stroke()
    c.restore()


    // minutes

    degreesMinutes = new Date().getMinutes() * 6

    c.save()
    c.translate(centerX, centerY)
    c.rotate(degreesMinutes * Math.PI / 180)
    c.translate(-centerX, -centerY)
    c.beginPath()
    c.moveTo(centerX, centerY)
    c.lineTo(centerX, centerY - smallerAspect / 4)
    c.lineWidth = handWidth
    c.strokeStyle = color
    c.stroke()
    c.restore()


    // hours

    degreesHours = (new Date().getHours() % 12) * 30

    c.save()
    c.translate(centerX, centerY)
    c.rotate(degreesHours * Math.PI / 180)
    c.translate(-centerX, -centerY)
    c.beginPath()
    c.moveTo(centerX, centerY)
    c.lineTo(centerX, centerY - smallerAspect / 6)
    c.lineWidth = handWidth
    c.strokeStyle = color
    c.stroke()
    c.restore()


    // serendipity

    if (day !== new Date().getDate()) {

        determineWhen()
        day = new Date().getDate()

    }


    let hours = '' + new Date().getHours() % 12
    let minutes = '' + new Date().getMinutes()
    let seconds = '' + new Date().getSeconds()


    let currentTime = hours.concat(minutes, seconds)


    if (currentTime === when[0]) {

        console.log('serendipity')
        when.splice(0, 1)
        navigator.notification.beep(1)
        color = 'gold'

        setTimeout(function () {
            color = 'red'
        }, 1000)

    }
}

//mainAnimation()


//serendipty is always computed for a span of 24 hours, from midnight till next midnight.
