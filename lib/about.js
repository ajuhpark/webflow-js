// import '../src/styles/style.css'

import { gsap } from 'gsap'
// import { SplitText } from "gsap/SplitText";

import ScrollTrigger from "gsap/ScrollTrigger";
// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
console.log(ScrollTrigger)

// import feature from './features/feature'
import case_study from './case_study'
import cs_website_builder_tools from './cs_website_builder_tools'

import colorModeToggle from './color_mode_toggle'

console.log('homepage.js is working')

// console.log(gsap)
console.log(SplitText)

// letter by letter animation - https://codepen.io/ajuhpark/pen/oNVLmvg
gsap.registerPlugin(SplitText)


function init() {
  // Create the matchMedia instance
  let mm = gsap.matchMedia();
  console.log('GSAP matchMedia instance:', mm);
  
  // this lets the image revert so it doesn't disappear when resizing. 
  ScrollTrigger.saveStyles("#home_cs-image_1,#homepage-cs-image_1")
  
  // console.log('Before mm.add() execution');
  // mm.add({
  //   "(min-width: 768px)": () => {
  //     console.log('Desktop breakpoint triggered');
  //   },
  //   "(max-width: 767px)": () => {
  //     console.log('Mobile breakpoint triggered');
  //   }
  // });
  // console.log('After mm.add() execution');

  
  var about_tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } })

  let split_name
  let split1
  let split2

  let home_switch = document.querySelector(".text-container__icon.switch-1")
  let about_switch = document.querySelector(".text-container__icon.switch-2")

  let sj_swatch_text_and_boxes = document.querySelectorAll(".sj_swatch_text_and_boxes")
  console.log(sj_swatch_text_and_boxes)

  let sj_aboutpage_text_container = document.querySelectorAll(".sj_aboutpage_text_container")
  let sj_about_image_container = document.querySelectorAll(".sj_about_image_container")
  let contactlinks_home_container = document.querySelector(".contactlinks_home_container")
  split_name = new SplitText('.home_name', { type: 'words,chars' })

  /** This tl is for the load animations and the first case study. */
  // Common animations that don't change based on screen size
  about_tl
    .from('html', { duration: 0, autoAlpha: 0 }, 'about_start')
    .from('Body',{
        // backgroundColor: 'var(--color_set_ap_portfolio_light_1--color_2-400)',
        opacity: 0,
        duration: 0.4,
      },'<')
    .set(home_switch, {
      opacity:0
    })
    .set(about_switch, {
      opacity:0
    })
    .from(split_name.chars,{
      yPercent: 50,
      rotationX:100, 
      rotationY:-80,
      opacity: 0,
      stagger: 0.02,
      duration: 0.6,
      ease: 'linear',
    }, 'about_start+=.1')
    .to(about_switch, {
      opacity:1,
      duration:1.6
    }, 'about_start+=1')
    .from(sj_swatch_text_and_boxes, {
      opacity: 0,
      stagger: 0.2,
    }, 'about_start+=.1')
    .from(sj_aboutpage_text_container, {
      opacity: 0, 
      translateY:16,
      duration:1,
      stagger:{
        each: 0.5,
      }
    }, 'about_start+=.4')
    .from(sj_about_image_container, {
      opacity:0, 
      duration:2, 
      // translateY:16
    }, 'about_start+=.3')
    .from(contactlinks_home_container, {
      opacity:0, 
      duration:1.5
    }, 'about_start+=.3')
  }


    
// Addressing the Flash of unstyled content issue
window.addEventListener('load', function (event) {
  init() // do stuff
  // colorModeToggle()
  // GSDevTools.create({animation: about_tl});
})
