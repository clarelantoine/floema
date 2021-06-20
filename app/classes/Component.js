import each from 'lodash/each'

export default class Component {
  constructor ({
    element,
    elements
  }) {
    this.selector = element
    this.selectorChildren = {
      ...elements
    }

    this.create()
    this.addEventListeners()
  }

  create () {
    this.element = document.querySelector(this.selector)
    this.elements = {}

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
  }

  addEventListeners () {

  }

  removeEventListeners () {

  }
}
