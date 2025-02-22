import '../src/styles/style.css'

import { gsap } from 'gsap'
// import { SplitText } from "gsap/SplitText";

import ScrollTrigger from "gsap/ScrollTrigger";
// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
console.log(ScrollTrigger)
// Add this line right after registering the plugin

import barba from '@barba/core'

import barbaCss from '@barba/css'
barba.use(barbaCss)

import imagesLoaded from 'imagesloaded'; // Install with `npm install imagesloaded`

// import feature from './features/feature'
import case_study from './case_study'
import cs_website_builder_tools from './cs_website_builder_tools'

import colorModeToggle from './color_mode_toggle'

console.log('homepage.js is working')
console.log(barba)

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

  
  var home_tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } })

  let split_name
  let split1
  let split2

  let sj_swatch_text_and_boxes = document.querySelectorAll(".sj_swatch_text_and_boxes")
  console.log(sj_swatch_text_and_boxes)

  let home_switch = document.querySelector(".text-container__icon.switch-1")
  let about_switch = document.querySelector(".text-container__icon switch-2")
  // let contactlinks_home_container = document.querySelector(".contactlinks_home_container")

  split_name = new SplitText('.home_name', { type: 'words,chars' })
  split1 = new SplitText('.home_aboutSection_text_1', { type: 'words,chars' })
  split2 = new SplitText('.home_aboutSection_text_2', { type: 'words,chars' })

  /** This tl is for the load animations and the first case study. */
  // Common animations that don't change based on screen size
  
  home_tl
    .from('html', { duration: 0, autoAlpha: 0 }, 'home_start')
    .from('Body',{
        // backgroundColor: 'var(--color_set_ap_portfolio_light_1--color_2-400)',
        opacity: 0,
        duration: 0.4,
      },'<')
    .from(split_name.chars,{
      yPercent: 50,
      rotationX:100, 
      rotationY:-80,
      opacity: 0,
      stagger: 0.02,
      duration: 0.6,
      ease: 'linear',
    }, 'home_start+=.1')
    .to(home_switch, {
      opacity:1,
      duration:1.6
    }, 'home_start+=1')
    .from(sj_swatch_text_and_boxes, {
      opacity: 0,
      stagger: 0.2,
    }, 'home_start+=.1')
    .from(split1.chars,{
        yPercent: 50,
        opacity: 0,
        rotationX:180, 
        rotationY:45,
        stagger: 0.012,
        duration: 0.2,
        ease: 'linear',
      },'home_start+=.4')
    .from(split2.chars,{
        yPercent: 50,
        opacity: 0,
        rotationX:180, 
        rotationY:45,
        stagger: 0.008,
        duration: 0.2,
        ease: 'linear',
      }, 'home_start+=.5')
    .from('.cs_component_container_1',{
        yPercent: 25,
        opacity: 0,
        ease: 'power1.out',
        duration: 1.1,
      }, 'home_start+=0.8')
    .from('#home_csTitleText_1', {
        yPercent: 100,
        opacity: 0,
        ease: 'power1.out',
        duration: 0.8,
      }, 'home_start+=1.6')
    .from('#home_bodyText_1', {
      yPercent: 100,
      opacity: 0,
      ease: 'power1.out',
      duration: 0.8,
    }, 'home_start+=1.8')
    .from('#view-cs-button_1', {
      yPercent: 100,
      opacity: 0,
      ease: 'power1.out',
      duration: 0.8,
    }, 'home_start+=2')


  console.log('Window width:', window.innerWidth);
  console.log('Matching Desktop:', window.matchMedia("(min-width: 768px)").matches);
  console.log('Matching Mobile:', window.matchMedia("(max-width: 767px)").matches);

  // this is for the first case study image. The start times are just different. 
  mm.add(
    // Desktop and tablet (greater than 767px)
    "(min-width: 768px)", () => {
      console.log('Desktop breakpoint triggered');
      home_tl
        .from('#home_cs-image_1', {
          xPercent: 102,
          ease: 'power1.out',
          duration: 1.3,
        }, 'home_start+=2.1')
        .from('#homepage-cs-image_1', {
          xPercent: -102,
          ease: 'power1.out',
          duration: 1.3,
        }, 'home_start+=2.1')
    }
  )

  mm.add(
    // Mobile (767px and below)
    "(max-width: 767px)", () => {
      console.log('Mobile breakpoint triggered');
      home_tl
        .from('#home_cs-image_1', {
          xPercent: 102,
          ease: 'power1.out',
          duration: 1.3,
        }, 'home_start+=1.5')
        .from('#homepage-cs-image_1', {
          xPercent: -102,
          ease: 'power1.out',
          duration: 1.3,
        }, 'home_start+=1.5')
    } 
  );
  



  // Add a quick check to see which elements are present
  // console.log('home_cs-image_1 exists:', !!document.querySelector('#home_cs-image_1'));
  // console.log('homepage-cs-image_1 exists:', !!document.querySelector('#homepage-cs-image_1'));
  // console.log('Window width:', window.innerWidth);
  
  home_tl
  .from('.cs_component_2ndset', {
    y: 40,
    opacity: 0,
    ease: 'power1.out',
    duration: 0.7,
  }, 'home_start+=2.8')
  .from('.contactlinks_home_container', {
    opacity: 0,
    ease: 'power1.out',
    duration: 0.8,
  }, 'home_start+=2.8')

  /** This is for the case study rows from the second one on. */

  let cs_component_container_2 = document.querySelectorAll(".cs_component_container_2")

  cs_component_container_2.forEach( (element) => {

    let home_cstitletext = element.querySelector(".home_cstitletext")
    let home_bodytext = element.querySelector(".home_bodytext")
    let view_cs_button = element.querySelector(".view_cs_button")
    let homepage_cs_image = element.querySelector(".homepage_cs_image")
    let home_cs_image_image = element.querySelector(".home_cs_image_image")
    let homepage_cs_tl = gsap.timeline()

    homepage_cs_tl
    .from(home_cstitletext, {
      yPercent: 100,
      opacity: 0,
      ease: 'power1.out',
      scrollTrigger:{
        trigger: home_cstitletext,
        start: "top 100%",
        end: "top 75%",
        // markers: true, 
        scrub: 1
    }
    })
    .from(home_bodytext, {
      yPercent: 100,
      opacity: 0,
      ease: 'power1.out',
      scrollTrigger:{
        trigger: home_bodytext,
        start: "top 100%",
        end: "top 72.5%",
        // markers: true, 
        scrub: 1
    }
    })
    .from(view_cs_button, {
      yPercent: 100,
      opacity: 0,
      ease: 'power1.out',
      scrollTrigger:{
        trigger: view_cs_button,
        start: "top 100%",
        end: "top 70%",
        // markers: true, 
        scrub: 1
    }
    })
    .from(element, {
      opacity: 0,
      ease: 'power1.out',
      scrollTrigger:{
        trigger: element,
        start: "top 100%",
        end: "top 95%",
        // markers: true, 
        scrub: 1
    }
    }
    )
    .from(homepage_cs_image, {
      xPercent: -102,
      ease: 'power1.out',
      scrollTrigger:{
        trigger: homepage_cs_image,
        start: "top 100%",
        end: "top 60%",
        markers: true, 
        scrub: 1
    }
    })
    .from(home_cs_image_image, {
      xPercent: 102,
      ease: 'power1.out',
      scrollTrigger:{
        trigger: home_cs_image_image,
        start: "top 100%",
        end: "top 60%",
        markers: true, 
        scrub: 1
    }
    })

  })
}
/** 
// Addressing the Flash of unstyled content issue
window.addEventListener('load', function (event) {
  init() // do stuff
  // colorModeToggle()
  // GSDevTools.create({animation: home_tl});
})
*/

window.addEventListener('load', function () {
  imagesLoaded(document.body, function () {
    setTimeout(() => {
      console.log("All content loaded, refreshing ScrollTrigger.");
      ScrollTrigger.refresh();  // Force ScrollTrigger to recalculate after everything is loaded
      init();  // Run animations
    }, 3000);  // Delay of 100ms for safety
  });
});
