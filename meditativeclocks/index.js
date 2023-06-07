// SERVICE WORKER

// if ('serviceWorker' in navigator) {
//
//     navigator.serviceWorker.register('sw.js')
//         .then((reg) => console.log('Service worker registered', reg))
//         .catch((err) => console.log('Service worker not registered', err))
//
// }


const homeBtn = document.getElementById('homeBtn')

const navBtns = document.getElementsByTagName('button')

const customAlert = document.getElementById('customAlert')

const innerBtns = document.getElementsByClassName('innerBtns')

const sections = document.getElementsByClassName('section')

const elsContainers = document.getElementsByClassName('elsContainer')

const els = document.getElementsByClassName('els')

const subEls = document.getElementsByClassName('subEls')

const iframes = document.getElementsByTagName('iframe')

const subSubEls = document.getElementsByClassName('subSubEls')

const iframeSrcs = [

  "clocks/present_past_and_future/index.html",
  "clocks/the_ebb_and_flow_of_time/index.html",
  "clocks/semi-linear_clock/index.html",
  "clocks/serendipity/index.html",
  "clocks/abstract_hourglass/index.html",
  "clocks/universe_clock/index.html"
]


let prevIndexNavBtn

let elsOpenIndex

const navBtnsArr = Array.from(navBtns, (el, indexNavBtn) => {

  let scrollSpeedAndDirection = 3

  el.addEventListener('click', () => {

    switch (indexNavBtn) {

      case 0:

        if (!sections.item(prevIndexNavBtn).classList.contains('showSection')) {

          sections.item(indexNavBtn).classList.toggle('showSection')
          scrollToSection()
          prevIndexNavBtn = indexNavBtn

        } else if (prevIndexNavBtn == indexNavBtn) {
          sections.item(indexNavBtn).classList.toggle('showSection')
          //                            scrollToSection()


        } else {


          if (elsOpenIndex != undefined) {

            preCloseClocksSection()
          }

          sections.item(prevIndexNavBtn).classList.toggle('showSection')
          sections.item(indexNavBtn).classList.toggle('showSection')

          scrollToSection()
          prevIndexNavBtn = indexNavBtn

        }


        const innerBtnsArr = Array.from(innerBtns, (el, index) => {

          el.addEventListener('click', () => {

            switch (index) {

              case 0:

                navBtns[1].click()
                break

              case 1:
                navBtns[4].click()
            }

          })

        })

        break

      case 1:


        if (!sections.item(prevIndexNavBtn).classList.contains('showSection')) {

          sections.item(indexNavBtn).classList.toggle('showSection')
          scrollToSection()
          prevIndexNavBtn = indexNavBtn

        } else if (prevIndexNavBtn == indexNavBtn) {

          sections.item(indexNavBtn).classList.toggle('showSection')

          if (!sections.item(indexNavBtn).classList.contains('showSection') && elsOpenIndex != undefined) {

            preCloseClocksSection()

          }

        } else {

          sections.item(prevIndexNavBtn).classList.toggle('showSection')

          setTimeout(() => {
            sections.item(indexNavBtn).classList.toggle('showSection')
          }, 1000)


          prevIndexNavBtn = indexNavBtn

        }


        function preCloseClocksSection() {

          els.item(elsOpenIndex).classList.remove('expandEl')
          subEls.item(elsOpenIndex).classList.remove('showSub')
          subSubEls.item(elsOpenIndex).classList.remove('showSubSub')

          iframes.item(elsOpenIndex).src = ""

        }


        function scrollToSection() {

          const navBar = document.getElementById('navBar')

          let requestAnimation = window.requestAnimationFrame(scrollToSection)

          let scrollListener = window.scrollY

          window.scrollBy(0, scrollSpeedAndDirection)

          if (scrollSpeedAndDirection > 0) {

            if (sections.item(indexNavBtn).getBoundingClientRect().top < 5 || scrollListener == window.scrollY) {

              window.cancelAnimationFrame(requestAnimation)
              scrollSpeedAndDirection = -scrollSpeedAndDirection
            }

          } else if (navBar.getBoundingClientRect().bottom >= window.innerHeight || scrollListener == window.scrollY) {

            window.cancelAnimationFrame(requestAnimation)
            scrollSpeedAndDirection = -scrollSpeedAndDirection

          }
        }

        break

      case 2:

        customAlert.classList.add('showCustomAlertDiv')
        customAlert.childNodes[1].classList.add('showCustomAlertText')

        setTimeout(() => {
          customAlert.classList.remove('showCustomAlertDiv')

        }, 1500)

        setTimeout(() => {

          customAlert.childNodes[3].classList.remove('showCustomAlertText')

        }, 3000)


        // scrollToSection()
        // prevIndexNavBtn = indexNavBtn

        break

      case 3:

        navigator.clipboard.writeText(location.href)

        customAlert.classList.add('showCustomAlertDiv')
        customAlert.childNodes[3].classList.add('showCustomAlertText')

        setTimeout(() => {
          customAlert.classList.remove('showCustomAlertDiv')

        }, 1500)

        setTimeout(() => {

          customAlert.childNodes[3].classList.remove('showCustomAlertText')

        }, 3000)



        break

      case 4:

        window.location.href = "mailto:guyselastein@protonmail.com"

    }

  })
})

let prevIndexEls

const elsArr = Array.from(els, (el, index) => {

  let scrollSpeedAndDirection = 3
  let transitionend = false

  el.addEventListener('click', (e) => {

    elsOpenIndex = index

    if (prevIndexEls == index) {

      els.item(index).classList.toggle('expandEl')
      subEls.item(index).classList.toggle('showSub')
      subSubEls.item(index).classList.toggle('showSubSub')

      if (subEls.item(index).classList.contains('showSub')) {

        scroll()

      } else {

        elsOpenIndex = undefined

        scrollSpeedAndDirection = -scrollSpeedAndDirection

        scroll()
      }

    } else if (els.item(prevIndexEls).classList.contains('expandEl')) {

      els.item(prevIndexEls).classList.toggle('expandEl')
      subEls.item(prevIndexEls).classList.toggle('showSub')
      subSubEls.item(prevIndexEls).classList.toggle('showSubSub')

      els.item(index).classList.toggle('expandEl')
      subEls.item(index).classList.toggle('showSub')
      subSubEls.item(index).classList.toggle('showSubSub')

      scroll()


    } else {
      els.item(index).classList.toggle('expandEl')
      subEls.item(index).classList.toggle('showSub')
      subSubEls.item(index).classList.toggle('showSubSub')

      scroll()
    }


    if (!subEls.item(index).classList.contains('showSub')) {

      iframes.item(index).src = ""

    }




    subEls.item(index).addEventListener('transitionend', (e) => {

      if (els.item(index).getBoundingClientRect().top >= 0) {

        transitionend = false

      } else if (e.propertyName == 'min-width') {

        transitionend = true

      }


      if (e.propertyName == 'min-width') {

        if (subEls.item(index).classList.contains('showSub')) {

          if (prevIndexEls != undefined) {

            iframes.item(prevIndexEls).src = ""

          }

          iframes.item(index).src = iframeSrcs[index]

          prevIndexEls = index
        }
      }

    })



    function scroll() {

      let requestAnimation = window.requestAnimationFrame(scroll)
      let scrollListener = window.scrollY

      window.scrollBy(0, scrollSpeedAndDirection)


      if (scrollSpeedAndDirection > 0) {

        if (subEls.item(index).getBoundingClientRect().top < 5 || transitionend && scrollListener == window.scrollY) {
          //
          window.cancelAnimationFrame(requestAnimation)
          transitionend = false

        }

      } else {

        if (els.item(index).getBoundingClientRect().top >= 0 || transitionend) {

          window.cancelAnimationFrame(requestAnimation)
          scrollSpeedAndDirection = -scrollSpeedAndDirection
          transitionend = false

        }

      }

    }

  })
})


let windowResized
let prevElsActiveBorderSide = []

const initClocksSection = (function iCS() {


  if (window.innerWidth < 600) {

    adjustToSmallScreen()

  } else {

    adjustToBigScreen()

  }

  return iCS

})()


window.onresize = () => {

  windowResized = true

  initClocksSection()

}



function adjustToSmallScreen() {


  for (i = 0; i < els.length; i++) {

    els[i].append(subEls[i], subSubEls[i])

  }

  animateElsBorder('small')

}


function adjustToBigScreen() {


  for (i = 0, j = 0; i < elsContainers.length; i++, j = j + 2) {

    elsContainers[i].after(subEls[j], subSubEls[j], subEls[j + 1], subSubEls[j + 1])
  }

  animateElsBorder()

}




function animateElsBorder(screenSize) {

  const elsBorderColors = ['red', 'red', 'red', 'red', 'red', 'red']

  let elsActiveBorderSide = []

  if (screenSize == 'small') {

    elsActiveBorderSide = ['borderTop', 'borderTop', 'borderTop', 'borderTop', 'borderTop', 'borderTop']

  } else {

    elsActiveBorderSide = ['borderTop', 'borderTop', 'borderRight', 'borderLeft', 'borderBottom', 'borderBottom']

  }



  if (windowResized) {

    for (i = 0; i < els.length; i++) {

      els[i].style[prevElsActiveBorderSide[i]] = 'transparent'

    }
  }

  for (i = 0; i < els.length; i++) {

    els[i].style[elsActiveBorderSide[i]] = `${elsBorderColors[i]} 0.3vmin solid`

  }

  prevElsActiveBorderSide = elsActiveBorderSide

}


homeBtn.addEventListener('click', () => {
  window.parent.postMessage('Back home...', '*');
})

const copyrightYear = document.getElementById('copyrightYear')

copyrightYear.innerHTML = new Date().getFullYear()
