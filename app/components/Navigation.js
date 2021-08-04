import GSAP from 'gsap'
import Component from 'classes/Component'
import { COLOR_BRIGHT_GRAY, COLOR_QUATER_SAPNISH_WHITE } from 'utils/color'
import each from 'lodash/each'

export default class Navigation extends Component {
  constructor ({ template }) {
    super({
      element: '.navigation',
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link'
      }
    })

    this.onChange(template)
  }

  onChange (template) {
    // if (template === 'about') {
    //   GSAP.to(this.element, {
    //     color: COLOR_BRIGHT_GRAY,
    //     duration: 1.5
    //   })

    //   GSAP.to(this.elements.items[0], {
    //     autoAlpha: 1
    //   })
    //   GSAP.to(this.elements.items[1], {
    //     autoAlpha: 0
    //   })
    // } else {
    //   GSAP.to(this.element, {
    //     color: COLOR_QUATER_SAPNISH_WHITE,
    //     duration: 1.5
    //   })

    //   GSAP.to(this.elements.items[1], {
    //     autoAlpha: 1
    //   })
    //   GSAP.to(this.elements.items[0], {
    //     autoAlpha: 0
    //   })
    // }

    let linkName = ''

    each(this.elements.items, (item, key) => {
      linkName = item.children[0].pathname.replace(/\//g, '')

      if (template === 'about') {
        if (linkName === template) {
          GSAP.to(this.element, {
            color: COLOR_BRIGHT_GRAY,
            duration: 1.5
          })

          GSAP.to(item, {
            autoAlpha: 0
          })
        } else {
          GSAP.to(item, {
            autoAlpha: 1
          })
        }
      } else {
        GSAP.to(this.element, {
          color: COLOR_QUATER_SAPNISH_WHITE,
          duration: 1.5
        })

        if (linkName === 'collections') {
          GSAP.to(item, {
            autoAlpha: 0
          })
        } else {
          GSAP.to(item, {
            autoAlpha: 1
          })
        }
      }
    })
  }
}
