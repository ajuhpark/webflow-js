/** UX Home js 
 * 
 * 061825
 * removing things 
 * 
 * used claude ai and this to get flip to work on resize:
 * https://gsap.com/community/forums/topic/28058-resetting-scrolltrigger-flip-on-window-resize-%3F/
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

// Store original states globally
let originalStates = [];


function ux_home_v2() {

  // Main initialization function
  function init() {
    console.log('ux_home_v2.js init works');
    
    // Clear previous states
    originalStates = [];
      
      // Initial visibility
      let tl_ux_home = gsap.from("html", { 
        duration: 0.2, 
        autoAlpha: 0, 
        ease: "power1.in"
      });
      tl_ux_home.play();

      // banner text starting animations.
      // home link
      let ux_home_banner_v2_header_text_container = document.querySelector(".ux_home_banner_v2_header_text_container");
      // menu link
      let sj_banner_1_header_link = document.querySelector(".sj_banner_1_header_link")
      // andrew park
      let sj_banner_4_header_text = document.querySelector(".sj_banner_4_header_text")
      // subheader text
      let sj_banner_4_subheader_text = document.querySelectorAll(".sj_banner_4_subheader_text")
      // case studies text
      let ux_home_v2_card_number_text = document.querySelector(".ux_home_v2_card_number_text")

      // registering an effect
      gsap.registerEffect({
        name:"slideUp", 
        // extendTimeline allows us to reference effect in a timeline
        extendTimeline:true,
        // by default, slide in from x:200
        defaults:{
          y:"110%",
          x:0
        },
        // effect takes in target for animation and configuration 
        effect: (targets, config) => {
          let tl = gsap.timeline()
          // tl.from(split.chars, { // we previously did this but now going to change to targets
          tl.from(targets, {
            duration:1,
            // staggering x from the x from the config position.
            x:config.x,
            y:config.y,
            stagger:{
              each:0.03,
              ease:"power1.in"
            }
          })
          // tl.from(targets, {
          //   duration:1, 
          //   opacity:0, 
          //   ease:"none",
          //   stagger:{
          //     each:0.03,
          //     ease:"power2"
          //   }
          // }, 0)
          return tl
        }
      })


      // we're splitting the targets into characters
      // let split = new SplitText(targets, {type:"chars"})
      let split_ux_home_banner_v2_header_text_container = new SplitText(ux_home_banner_v2_header_text_container, {type:"chars, words"})
      let split_sj_banner_1_header_link = new SplitText(sj_banner_1_header_link, {type:"chars, words"})
      let split_sj_banner_4_header_text = new SplitText(sj_banner_4_header_text, {type:"chars, words"})
      let split_sj_banner_4_subheader_text = new SplitText(sj_banner_4_subheader_text, {type:"chars, words"})
      let split_ux_home_v2_card_number_text = new SplitText(ux_home_v2_card_number_text, {type:"chars, words"})


      // calling the effect
      let banner_text_tl = gsap.timeline()
      banner_text_tl
        // .slideUp(split_ux_home_banner_v2_header_text_container.chars, {y:100})
        // The syntax is: .effectName(targets, config, position)
        .slideUp(split_ux_home_banner_v2_header_text_container.chars)
        .slideUp(split_sj_banner_1_header_link.chars, {}, "<")
        .slideUp(split_sj_banner_4_header_text.chars, {}, "-=0.2")
        .slideUp(split_sj_banner_4_subheader_text.chars, {}, "<")
        .slideUp(split_ux_home_v2_card_number_text.chars, {}, "<")
        

      // GSDevTools.create() 

      





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
      ap_grid_container_ux_home_cs.forEach((element, index) => {

        const ux_home_cs_image_start = element.querySelector('.ux_home_cs_image_start')
        const ux_home_cs_image_wrapper = element.querySelector('.ux_home_cs_image_hult')
        const ux_home_cs_image = element.querySelector('.ux_home_cs_image_hult_img')

        // cs header
        let sc_1_card_text_header = element.querySelector(".sc_1_card_text_header");
        // numbers
        let ux_home_v2_card_number_text = element.querySelectorAll(".ux_home_v2_card_number_text")
        // card subheader text
        let sc_1_card_text_subheader = element.querySelector(".sc_1_card_text_subheader")
        // view case study link - this doesn't need splittext
        let sc_1_card_text_link_container_2 = element.querySelector(".sc_1_card_text_link_container_2")



        // Add CSS for properly hiding split lines
        const styleId = 'split-line-styles';
        if (!document.getElementById(styleId)) {
          const styleElement = document.createElement('style');
          styleElement.id = styleId;
          styleElement.textContent = `
            .split-line-container {
              overflow: hidden !important;
              display: block !important;
              position: relative !important;
            }
            .split-line {
              position: relative !important;
              display: block !important;
            }
          `;
          document.head.appendChild(styleElement);
        }
        
        // splitText elements of above
        let split_sc_1_card_text_header = new SplitText(sc_1_card_text_header, {
          type:"words,lines",
          linesClass: "split-line",
          lineThreshold: 0.5
        })
        let split_ux_home_v2_card_number_text = new SplitText(ux_home_v2_card_number_text, {type:"words, lines"})
        let split_sc_1_card_text_subheader = new SplitText(sc_1_card_text_subheader, {
          type:"words,lines",
          linesClass: "split-line",
          lineThreshold: 0.5        
        })
        

        let ux_home_v2_cs_card_image_wrapper = element.querySelector(".ux_home_v2_cs_card_image_wrapper")
        let ux_home_v2_cs_card_image = element.querySelector(".ux_home_v2_cs_card_image")

        // Check if element exists and log it
        if (sc_1_card_text_header) {
          console.log(`✅ Found .sc_1_card_text_header in container ${index}:`, sc_1_card_text_header);
          console.log(`Text content:`, sc_1_card_text_header.textContent);
        } else {
          console.log(`❌ No .sc_1_card_text_header found in container ${index}`);
          return; // Skip this iteration
        }


        // Store the ORIGINAL state before any Flip animations
        if (ux_home_cs_image_wrapper) {
          originalStates[index] = {
            element: ux_home_cs_image_wrapper,
            parent: ux_home_cs_image_wrapper.parentNode
          };
          console.log(`Stored original parent for container ${index}:`, ux_home_cs_image_wrapper.parentNode.className);
        }

        const ux_home_cs_animation = () => {
          console.log(`\n=== ANIMATION DEBUG ===`)
          console.log('Image wrapper ORIGINAL parent:', ux_home_cs_image_wrapper.parentNode)
          console.log('Image wrapper ORIGINAL parent class:', ux_home_cs_image_wrapper.parentNode?.className)
          console.log('Image start element class:', ux_home_cs_image_start?.className)
  
          const tl_ux_home_cs = gsap.timeline({
              defaults: {
                  ease: 'power3.inOut', 
                  duration: 2, 
              }, 
              // paused:true
          })
          // we're saving the state in a variable, '.ux_home_cs_image_hult',
          const state = Flip.getState(ux_home_cs_image_wrapper)
          console.log('Flip state captured, now moving to start position')

          // we're moving ux_home_cs_image_wrapper, '.ux_home_cs_image_hult', into the ux_home_cs_image_start div which is outside 
          ux_home_cs_image_start.appendChild(ux_home_cs_image_wrapper)
          console.log('After moving to start, parent is now:', ux_home_cs_image_wrapper.parentNode.className)

          // '.ux_home_cs_image_hult_img'
          tl_ux_home_cs.from(ux_home_cs_image, {
              scale: 1.05
          })

          // '.ux_home_cs_image_hult'
          .to(ux_home_cs_image_wrapper, {
              borderRadius: '16px'
          }, '<')


          // below will let us go back to the original state that we have in the variable
          .add(() => {
              console.log('About to Flip.to - moving back to original state')
              Flip.to(state, {
                  duration: 2,
                  ease: 'power3.inOut'
              })
          }, '<')

          .slideUp(split_sc_1_card_text_header.lines, {}, "<")
          .from(ux_home_v2_cs_card_image_wrapper, {
            xPercent:-102, 
            ease:'power1.out', 
            duration: 1.5
          }, "-=1.8")
          .from(ux_home_v2_cs_card_image, {
            xPercent:102, 
            ease:'power1.out', 
            duration: 1.5
          }, "<")
          .slideUp(split_ux_home_v2_card_number_text.lines, {}, "-=0.5")
          .slideUp(split_sc_1_card_text_subheader.lines, {
            duration:0.5,
            stagger:0.1
          }, "-=1")
          .slideUp(sc_1_card_text_link_container_2, {}, "<")
          


          // document.addEventListener('DOMContentLoaded', () => {
          //     const heroImageContainer = document.querySelector('.hero__image');
              
          //     // Ensure heroImage is not null
          //     if (heroImageContainer) {
          //         heroImageContainer.style.minWidth = '96vw';
          //     }
          //   });
            
          return tl_ux_home_cs
        }


        // Create individual timeline for each element
        let elementTimeline = gsap.timeline({
          paused: true,
          // Add delay only for the first element (index 0)
          delay: index === 0 ? 1.5 : 0
        })
        elementTimeline.add(ux_home_cs_animation())


        // inside the loop we're going to create a ScrollTrigger
        ScrollTrigger.create({
          trigger: element,
          start: "top 90%",
          end: "top 20%",
          markers: true,
          // on enter, on leave, on enter back, on leave back
          toggleActions: "play none none reverse",
          animation: elementTimeline,
          // scrub: true
        })

      })
  }
  




  // Kill and reset all animations and properties
function killAll() {
  console.log('=== KILL ALL DEBUG ===')
  
  // Kill all ScrollTriggers first
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  
  // Restore ALL elements to their original DOM state
  originalStates.forEach((state, index) => {
    if (state.element && state.parent) {
      console.log(`Restoring element ${index} to original parent:`, state.parent.className);
      state.parent.appendChild(state.element);
      console.log(`Successfully restored to:`, state.element.parentNode?.className);
    }
  });
  
  // Clear ALL GSAP properties to ensure clean slate
  gsap.set([
    '.ap_grid_container.ux_home_cs',
    '.ux_home_cs_image_hult',
    '.ux_home_cs_image_hult_img',
    '.ux_home_cs_image_start',
    'html'
  ], {
    clearProps: "all"
  })
  
  // Force a reflow to ensure DOM is properly updated
  document.body.offsetHeight
  
  // Refresh ScrollTrigger to recalculate positions
  ScrollTrigger.refresh()
  
  console.log('=== END KILL ALL DEBUG ===\n')
  
  // Longer delay to ensure everything is properly reset
  gsap.delayedCall(0.5, () => {
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