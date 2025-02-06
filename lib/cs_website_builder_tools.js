import '../src/styles/style.css'

import { gsap } from 'gsap'

import barba from '@barba/core'

import case_study from './case_study'
import colorModeToggle from './color_mode_toggle'

// import feature from './features/feature'

// there are some errors because of vimeo video
// https://chatgpt.com/c/41fe9c75-9c72-4d74-81a9-b11fff1d10a6

gsap.registerPlugin(SplitText)
// Case Studies - Load Animation
var cs_website_builder_tools_tl = gsap.timeline({
  defaults: { ease: 'power1.inOut' },
})
let split_name
let split_cs

function cs_website_builder_tools() {
  console.log('cs_website_builder_tools.js is working')
  // console.log(gsap)

  function init() {
    // vars for animation for name and cs title
    split_name = new SplitText('.home_name', { type: 'words,chars' })
    split_cs = new SplitText('.project_title', { type: 'words,chars' })

    let sj_swatch_text_and_boxes = document.querySelectorAll(".sj_swatch_text_and_boxes")
    console.log(sj_swatch_text_and_boxes)

    cs_website_builder_tools_tl
      //#f7f7f2 is light beige. #f7dcdc is light pink.
      .from(
        'html',
        { duration: 0, autoAlpha: 0 },
        'cs_website_builder_tools_tl'
      )
      .from(
        '.proj',
        { duration: 0, autoAlpha: 0 },
        'cs_website_builder_tools_tl'
      )
      .from(
        '.proj',
        {
          // backgroundColor: 'var(--color_set_ap_portfolio_light_1--color_2-600)',
          opacity: 0,
          duration: 1,
        },
        '<'
      )
      // name and project title animations
      .from(
        split_name.chars,
        {
          yPercent: 100,
          opacity: 0,
          stagger: 0.01,
          duration: 0.4,
          ease: 'linear',
        },
        'cs_website_builder_tools_tl+=.2'
      )
      .from(sj_swatch_text_and_boxes, {
        opacity: 0,
        stagger: 0.2,
      }, 'cs_website_builder_tools_tl+=.3')
      .from(
        split_cs.chars,
        {
          yPercent: 110,
          opacity: 0,
          stagger: 0.01,
          duration: 0.5,
          ease: 'linear',
        },
        'cs_website_builder_tools_tl+=.4'
      )
      .from(
        '.project_hero_image_container',
        { xPercent: -101, duration: 1.1, ease: 'circ.out' },
        'cs_website_builder_tools_tl+=.5'
      )
      .from(
        '.project_hero_image',
        { xPercent: 101, duration: 1.1, ease: 'circ.out' },
        'cs_website_builder_tools_tl+=.5'
      )
      .from(
        '.project_body_section',
        { opacity: 0, duration: 1.2 },
        'cs_website_builder_tools_tl+=1.5'
      )
  }

  // addressing the Flash of unstyled content issue.
  window.addEventListener('load', function (event) {
    init() //do stuff
    // GSDevTools.create({animation:tl})
  })
}

/** barba stuff 
barba.init({
  transitions: [
    {name: 'clip',
    // if we want both containers in the dom at the same time for 
    // clip-path animation, we have to put in sync: true.
      sync: true, 
    // we're going to the 'clip' namespace, the one that's the 
    // namespace for the container in homepage.
    to:{
      namespace: ['clip']
    },
    // when you leave the page, the clip class will be added to 
    // the container of current page
    leave() {
      console.log('running leave')
    },
    beforeEnter(){
      console.log('running beforeEnter')
    },
    // when it enters next page, we're going to call the namespace 
    // for the container which is in this case clip
    enter() {
      console.log('running enter')
      case_study;
    }
    }
  ]
}
)
*/

if ($('body').hasClass('cs_website_builder_tools')) {
  cs_website_builder_tools()
}

export default cs_website_builder_tools
