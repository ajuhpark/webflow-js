import '../src/styles/style.css'

import { gsap } from 'gsap'
// import { SplitText } from 'gsap/SplitText';

// import feature from './features/feature'
// import homepage from './homepage'
import colorModeToggle from './color_mode_toggle'

gsap.registerPlugin(SplitText)
// Case Studies - Load Animation
var case_study_tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } })
let split_name
let split_cs

function case_study() {
  console.log('case_study.js is working')
  // console.log(gsap)

  function init() {
    // vars for animation for name and cs title
    split_name = new SplitText('.home_name', { type: 'words,chars' })
    split_cs = new SplitText('.project_title', { type: 'words,chars' })
    let sj_swatch_text_and_boxes = document.querySelectorAll(".sj_swatch_text_and_boxes")
    console.log(sj_swatch_text_and_boxes)

    case_study_tl
      //#f7f7f2 is light beige. #f7dcdc is light pink.
      .from('html', { duration: 0, autoAlpha: 0 }, 'case_study_tl')
      .from('.project', { duration: 0, autoAlpha: 0 }, 'case_study_tl')
      .from(
        '.project', {
          // backgroundColor: '#f7f7f2',
          opacity: 0,
          duration: 1,
        }, '<')
      // name and project title animations
      .from(
        split_name.chars, {
          yPercent: 100,
          opacity: 0,
          stagger: 0.01,
          duration: 0.4,
          ease: 'linear',
        }, 'case_study_tl+=.2')
      .from(
        sj_swatch_text_and_boxes, {
        opacity: 0,
        stagger: 0.2,
      }, 'case_study_tl+=.3')
      .from(
        split_cs.chars, {
          yPercent: 110,
          opacity: 0,
          stagger: 0.01,
          duration: 0.5,
          ease: 'linear',
        }, 'case_study_tl+=.4')
      .from(
        '.project_hero_image_container',{ 
          xPercent: -101, 
          duration: 1.1, 
          ease: 'circ.out' 
        }, 'case_study_tl+=.5')
      .from(
        '.project_hero_image',{ 
          xPercent: 101, 
          duration: 1.1, 
          ease: 'circ.out' 
        }, 'case_study_tl+=.5')
      .from(
        '.project_body_section', { 
          opacity: 0, 
          duration: 1.2
        }, 'case_study_tl+=1')
  }

  // addressing the Flash of unstyled content issue.
  window.addEventListener('load', function (event) {
    init() //do stuff
    // GSDevTools.create({animation:tl})
  })
}

if ($('body').hasClass('case_study')) {
  case_study()
}

export default case_study
