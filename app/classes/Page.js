import GSAP from 'gsap'
import NormalizeWheel from 'normalize-wheel'
import Prefix from 'prefix'

import each from 'lodash/each'
import map from 'lodash/map'

import Title from 'animations/Title'

export default class Pages {
  constructor ({
    id,
    element,
    elements
  }) {
    this.id = id
    this.selector = element
    this.selectorChildren = {
      ...elements,
      animationTitles: '[data-animation="title"]'
    }

    this.transformPrefix = Prefix('transform')

    this.onMouseWheelEvent = this.onMouseWheel.bind(this)
  }

  create () {
    this.element = document.querySelector(this.selector)
    this.elements = {}

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0
    }

    each(this.selectorChildren, (selector, key) => {
      if (selector instanceof window.HTMLElement || selector instanceof window.NodeList || Array.isArray(selector)) {
        this.elements[key] = selector
      } else {
        this.elements[key] = document.querySelectorAll(selector)

        if (this.elements[key].length === 0) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(selector)
        }
      }

      // console.log(this.elements[key], selector)
    })

    this.createAnimation()
  }

  createAnimation () {
    // console.log(this.elements.animationTitles)

    this.animationTitles = map(this.elements.animationTitles, (element) => {
      return new Title({
        element
      })
    })

    // console.log(this.animationTitles)
  }

  show () {
    return new Promise(resolve => {
      this.animationIn = GSAP.timeline()

      this.animationIn.fromTo(this.element, {
        autoAlpha: 0
      }, {
        autoAlpha: 1
      })

      this.animationIn.call(() => {
        this.addEventlisteners()

        resolve()
      })
    })
  }

  hide () {
    return new Promise(resolve => {
      this.removeEventListeners()

      this.animationOut = GSAP.timeline()

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  onMouseWheel (event) {
    const { pixelY } = NormalizeWheel(event)

    this.scroll.target += pixelY

    // console.log(pixelY)
  }

  onResize () {
    if (this.elements.wrapper) {
      this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
    }
    each(this.animationTitles, animation => animation.onResize())
  }

  update () {
    this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target)

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0
    }

    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

    if (this.elements.wrapper) {
      this.elements.wrapper.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
    }
  }

  addEventlisteners () {
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }

  removeEventListeners () {
    window.removeEventListener('mousewheel', this.onMouseWheelEvent)
  }
}
