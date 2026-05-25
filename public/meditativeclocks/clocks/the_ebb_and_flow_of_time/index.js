// canvas set-up

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

window.onload = resizeCanvas
window.onresize = resizeCanvas

let smallerAspect, radiusExponent

let seconds, minutes, hours, time


function resizeCanvas() {

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    scaleDrawing()
}

function scaleDrawing() {

    if (canvas.width <= canvas.height) {

        smallerAspect = canvas.width

    } else {

        smallerAspect = canvas.height

    }

    radiusExponent = smallerAspect / 30
    animate()
}


//        defining circles

function Circle(x, y, radius) {
    this.x = x
    this.y = y
    this.radius = radius

    this.draw = function () {
        c.beginPath()
        c.arc(x, y, radius, 0, 2 * Math.PI)
        c.lineWidth = lineWidth
        c.globalAlpha = alpha
        c.stroke()
        c.strokeStyle = "white"
    }
}

//time = 0
//let direction = 1
// animation

function animate() {

    requestAnimationFrame(animate)
    c.clearRect(0, 0, innerWidth, innerHeight)

    seconds = new Date().getSeconds()
    minutes = new Date().getMinutes()


    if (new Date().getHours() < 12) {

        hours = new Date().getHours()

    } else {

        hours = new Date().getHours() - 12
        //        time = 12 - time
    }


        time =  hours + minutes / 60 + seconds / 3600

  // accelerating time for demo purposes
    
//    if (time < 12 && direction % 2 != 0) {
//
//        time += 0.01
//
//        if (time >= 12) {
//            direction++
//        }
//
//    } else {
//        time -= 0.01
//
//        if (time <= 0) {
//            direction++
//        }
//
//    }


    lineWidth = 12 - time
    alpha = 1 - time / 10 + 1 / 6

    new Circle(canvas.width / 2, canvas.height / 2, radiusExponent * time).draw()

}
