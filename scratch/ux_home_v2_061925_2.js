/** UX Home js 
 * 
 * 061825
 * removing things 
*/

import '../src/styles/style.css';

gsap.registerPlugin(GSDevTools);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(Flip)
console.log(Flip)
// console.log(gsap)


import sj_menu from './sj_menu.js';
sj_menu();

import ux_footer from './ux_footer.js';
const footerModule = ux_footer(); // Store the exported object but don't initialize yet

import imagesLoaded from 'imagesloaded';

console.log('ux_home_v2.js is working');


// Page scroll resets on refresh (vanilla JS version)
window.addEventListener('beforeunload', () => {
  // document.body.style.display = "none";
  window.scrollTo(0, 0);
});

let mainTimeline;



function ux_home_v2() {

  // Main initialization function
  function init() {
    console.log('ux_home_v2.js init works');
      
      // Initial visibility
      let tl_ux_home = gsap.from("html", { 
        duration: 0.3, 
        autoAlpha: 0, 
        ease: "power1.in"
      });
      tl_ux_home.play();





      let case_studies_text = document.querySelector("#case_studies_text");
      let cs_text_grid = document.querySelector("#cs_text_grid")
      let ux_homepage_last_cs = document.querySelector("#ux_homepage_last_cs")
      // let ux_cs_marquee_arrow = document.querySelector("#ux_cs_marquee_arrow")
      // console.log("Arrow element:", ux_cs_marquee_arrow);

      // const heroImageStart = document.querySelector('.hero-image-start')
      // const heroCaption = document.querySelector('.hero__caption')
      // const heroButton = document.querySelector('.hero__button')
      // const heroImageWrapper = document.querySelector('.hero__image')
      // const heroImage = document.querySelector('.hero__image_img')
      // const headerItems = [document.querySelectorAll('.header *')]
      // const heroImageContainer = document.querySelector('.hero__image');


      
      // loop for ux_home_cs
      let ap_grid_container_ux_home_cs = document.querySelectorAll(".ap_grid_container.ux_home_cs")
      // console.log(ap_grid_container_ux_home_cs)

      // then doing a loop on the elements and logging them out.
      ap_grid_container_ux_home_cs.forEach( (element) => {

        const ux_home_cs_image_start = element.querySelector('.ux_home_cs_image_start')
        const ux_home_cs_image_wrapper = element.querySelector('.ux_home_cs_image_hult')
        const ux_home_cs_image = element.querySelector('.ux_home_cs_image_hult_img')

        const ux_home_cs_animation = () => {
                const tl_ux_home_cs = gsap.timeline({
                    defaults: {
                        ease: 'power3.inOut', 
                        duration: 2, 
                    }, 
                    // paused:true
                })
            // we're saving the state in a variable, '.hero__image',
            const state = Flip.getState(ux_home_cs_image_wrapper)
            // we're moving ux_home_cs_image_wrapper, '.hero__image', into the ux_home_cs_image_start div which is outside 
            ux_home_cs_image_start.appendChild(ux_home_cs_image_wrapper)

            // '.hero__image img'
            tl_ux_home_cs.from(ux_home_cs_image, {
                scale: 1.05
            })

            // '.hero__image'
            .to(ux_home_cs_image_wrapper, {
                borderRadius: '16px'
            }, '<')


            // below will let us go back to the original state that we have in the variable
            .add(() => {
                Flip.to(state, {
                    duration: 2,
                    ease: 'power3.inOut'
                })
            }, '<')

                
            // document.addEventListener('DOMContentLoaded', () => {
            //     const heroImageContainer = document.querySelector('.hero__image');
                
            //     // Ensure heroImage is not null
            //     if (heroImageContainer) {
            //         heroImageContainer.style.minWidth = '96vw';
            //     }
            //   });
              
            return tl_ux_home_cs
        }


        // our main timeline that we're putting other ones in
        mainTimeline = gsap.timeline({paused: true})
        // mainTimeline
            // .add(setInitialStates())
            // .add(preloaderAnimation())
            // .add(ux_home_cs_animation(), '-=1.5')
            // .addPause()
            .add(ux_home_cs_animation())
            // .add(UIAnimation(),'<')


        // inside the loop we're going to create a ScrollTrigger
        ScrollTrigger.create({
          trigger:element,
          start:"top 90%",
          end:"top 20%",
          markers: true,
          // on enter, on leave, on enter back, on leave back
          toggleActions:"play none none reverse",
          animation:mainTimeline,
          // scrub: true
        })

      })
  }
  




  // Kill and reset all animations and properties
// Kill and reset all animations and properties
function killAll() {
  // Kill all ScrollTriggers first
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  
  // Kill the main timeline if it exists
  if (mainTimeline) {
    mainTimeline.kill()
  }
        //   const ux_home_cs_image_start = element.querySelector('.ux_home_cs_image_start')
        // const ux_home_cs_image_wrapper = element.querySelector('.ux_home_cs_image_hult')
        // const ux_home_cs_image = element.querySelector('.ux_home_cs_image_hult_img')

  // Reset DOM structure for all Flip animations
  let ap_grid_container_ux_home_cs = document.querySelectorAll(".ap_grid_container.ux_home_cs")
  
  ap_grid_container_ux_home_cs.forEach((element) => {
    const ux_home_cs_image_wrapper = element.querySelector('.ux_home_cs_image_hult')
    
    // Move the image wrapper back to its original parent (the main element)
    if (ux_home_cs_image_wrapper && element) {
      element.appendChild(ux_home_cs_image_wrapper)
    }
  })
  
  // Clear any set styles on elements to reset them
  gsap.set([
    '.ux_home_cs_image_start',
    '.ux_home_cs_image_hult',
    '.ux_home_cs_image_hult_img',
    'html'
  ], {
    clearProps: "all"
  })
  
  // Refresh ScrollTrigger to recalculate positions
  ScrollTrigger.refresh()
  
  // Small delay before reinitializing
  gsap.delayedCall(0.1, () => {
    init()
  })
}


  // this bit of code from stackoverflow is going to help us when resizing
  function debounce(func){
    var timer;
    return function(event){
      if(timer) clearTimeout(timer)
      timer = setTimeout(func,300,event)
    }
  }

  window.addEventListener("resize", debounce(function(e){
    console.log("end of resizing")
    // we're going to run our code here once it debounces and resizes.
    killAll()
  }))


  // Addressing the Flash of unstyled content issue
  window.addEventListener("load", function(event) { 
      init(); // do stuff
          // GSDevTools.create();

  });



}


// Only initialize if we're on the correct page
if (document.body.classList.contains("ux_home_v2")) {
  ux_home_v2();
}

export default ux_home_v2;