/** UX Home js - GSAP MatchMedia Solution
 *
 * 061825
 * Using gsap.matchMedia() for responsive animations
 * Desktop only animations with proper cleanup
 *
 * 090825
 * added back ignore mobile resize cuz it was giving difficulties in flip.
 * marquee working now.
 */

import '../src/styles/style.css';

import { gsap } from 'gsap'
// gsap.registerPlugin(GSDevTools);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(Flip);
gsap.registerPlugin(ScrollTrigger); 

import sj_menu from './sj_menu.js';
sj_menu();

import ux_footer from './ux_footer.js';
const footerModule = ux_footer();

import sct_text_decoration_svg from './sct_text_decoration_svg.js';

import imagesLoaded from 'imagesloaded';


// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';

// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


console.log('ux_home_v2.js is working');
 
// Page scroll resets on actual refresh/reload
// Use 'load' event with history state to handle only refreshes
if (window.performance && window.performance.navigation.type === 1) {
  window.scrollTo(0, 0);
}

// Store original states globally
let originalStates = [];
let splitInstances = [];
let originalContent = {};

function ux_home_v2() {

  // Function to wrap lines in container divs with overflow:hidden
  function wrapLines(lines) {
    lines.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.className = 'split-line-container';
      wrapper.style.overflow = 'hidden';
      
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });
  }

  // Advanced cleanup function for SplitText
  function cleanupSplitText() {
    // console.log("Cleaning up SplitText instances");

    splitInstances.forEach(instance => {
      if (instance && typeof instance.revert === 'function') {
        try {
          instance.revert();
        } catch (e) {
          console.warn("Error reverting SplitText:", e);
        }
      }
    });

    splitInstances = [];

    const wrappers = document.querySelectorAll('.split-line-container');
    wrappers.forEach(wrapper => {
      try {
        while (wrapper.firstChild) {
          wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
        }
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
        }
      } catch (e) {
        console.warn("Error removing wrapper:", e);
      }
    });

    const lines = document.querySelectorAll('.split-line');
    lines.forEach(line => {
      try {
        while (line.firstChild) {
          line.parentNode.insertBefore(line.firstChild, line);
        }
        if (line.parentNode) {
          line.parentNode.removeChild(line);
        }
      } catch (e) {
        console.warn("Error removing line:", e);
      }
    });
  }

  // Swiper JS 
  function ux_home_swiper_js(){

      const swiperElement = document.querySelector(".swiper-marquee");
      console.log('Swiper element found:', swiperElement);
      
      if (!swiperElement) {
        console.warn('Swiper element .swiper-marquee not found');
        return;
      }
      
      const swiper = new Swiper(".swiper-marquee", {
        modules: [Autoplay], 
        // swiper will use the width we define in Webflow if we do auto. 
        slidesPerView: 'auto',
        spaceBetween: 60, 
        // loop to true makes it infinite marquee.
        loop: true, 
        speed: 4000,
        // can't interact w things in slider
        allowTouchMove: false,
        // prevent jumping during loop transitions
        // loopAdditionalSlides: 2,
        // smoother transitions
        freeMode: true,
        freeModeMomentum: false,
        // for infinite marquee
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          reverseDirection: false
        },
        // responsive breakpoints
        breakpoints: {
          768: {
            spaceBetween: 90
          },
          992: {
            spaceBetween: 120
          }
        }
    })
  }
  
  // regular marquee
  function ux_home_marquee(){

    // Get all marquees instead of just the first one using querySelectorAll
    // This is the key fix - we need to select ALL marquees, not just the first one
    const ms_marquees = document.querySelectorAll('.ms_marquee')
    console.log(`Found ${ms_marquees.length} marquees`)

    // If no marquees exist, exit function to prevent errors
    if (!ms_marquees.length) {
      return
    }

    // Create an array to store all the tweens so we can reference them later if needed
    const tweens = []

    // Loop through each marquee element to set up animations individually
    ms_marquees.forEach((ms_marquee, index) => {
      // Get the first child of the marquee, which contains the content to animate
      const ms_marquee_content = ms_marquee.firstChild
      if (!ms_marquee_content) {
        return // Skip this iteration if there's no content
      }

      // Clone the content to create an infinite scroll effect
      // We need two copies of the content to create a seamless loop
      const ms_marquee_content_clone = ms_marquee_content.cloneNode(true)
      ms_marquee.append(ms_marquee_content_clone)

      // Initialize tween variable for this specific marquee instance
      let ms_tween

      // Function to create or recreate the marquee animation
      const playMarquee = () => {
        // If the tween already exists, store its progress so we can resume from same position
        // This prevents the animation from resetting during window resize
        let ms_progress = ms_tween ? ms_tween.progress() : 0

        // Kill existing tween before creating a new one (prevents animation duplicates)
        ms_tween && ms_tween.progress(0).kill()

        // Calculate the width of the content element
        // This needs to be recalculated on resize to ensure proper animation
        const ms_width = parseInt(
          getComputedStyle(ms_marquee_content).getPropertyValue('width'),
          10
        )

        // Get the gap between elements (used in the calculation for smooth animation)
        const ms_gap = parseInt(
          getComputedStyle(ms_marquee_content).getPropertyValue('column-gap'),
          10
        )

        // Calculate how far to move the elements (negative value to move left)
        // We move exactly the width + gap to create a perfect loop
        const distanceToTranslate = -1 * (ms_gap + ms_width)

        // Create the GSAP animation for this marquee
        // fromTo lets us define both start and end positions
        ms_tween = gsap.fromTo(
          ms_marquee.children, // Animate both the original and cloned content
          { x: 0 }, // Start position
          {
            x: distanceToTranslate, // End position
            duration: 30, // Animation time in seconds
            ease: 'none', // Linear movement (no easing)
            repeat: -1, // Repeat indefinitely
          }
        )

        // Restore the previous progress if this is a recreation of the animation
        ms_tween.progress(ms_progress)

        // Store reference to this marquee's tween in our array
        tweens[index] = ms_tween
      }

      // Initialize the animation for this marquee
      playMarquee()

      // Set up a resize handler for this specific marquee with debounce
      // This ensures the animation adjusts properly when the window size changes
      window.addEventListener(
        'resize',
        ms_debounce(() => {
          playMarquee()
        })
      )
    })

    // Debounce function to prevent excessive function calls during resize
    // This improves performance by waiting until resizing stops before recalculating
    function ms_debounce(func) {
      var timer
      return function (event) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(
          () => {
            func()
          },
          500, // Wait 500ms after last resize event before executing
          event
        )
      }
    }

  }

  // Main initialization function
  function init() {
    console.log('ux_home_v2.js init works');
    
    // Reinitialize menu on resize
    sj_menu();
    
    // Clear previous states
    originalStates = [];
    splitInstances = [];
    originalContent = {};

    // Initial visibility for all screens
    let tl_ux_home = gsap.from("html", { 
      duration: 0.2, 
      autoAlpha: 0, 
      ease: "power1.in"
    });
    tl_ux_home.play();

    // Use gsap.matchMedia for responsive animations
    // let mm = gsap.matchMedia();

    // // Mobile/Tablet: Simple visibility only (≤768px)
    // mm.add("(max-width: 768px)", () => {
    //   console.log("📱 MOBILE/TABLET: Simple animations only");

    //   // Just make everything visible without complex animations
    //   gsap.set([
    //     ".ux_home_banner_v2_header_text_container",
    //     ".sj_banner_1_header_link", 
    //     ".sj_banner_4_header_text",
    //     ".sj_banner_4_subheader_text",
    //     ".ux_home_v2_card_number_text",
    //     ".sc_1_card_text_header",
    //     ".sc_1_card_text_subheader", 
    //     ".sc_1_card_text_link_container_2",
    //     ".ux_home_v2_cs_card_image_wrapper",
    //     ".ux_home_v2_cs_card_image"
    //   ], {
    //     autoAlpha: 1,
    //     y: 0,
    //     x: 0,
    //     scale: 1
    //   });

    //   // Simple fade-in for cards on scroll
    //   const cards = document.querySelectorAll(".ap_grid_container.ux_home_cs");
    //   cards.forEach((card, index) => {
    //     ScrollTrigger.create({
    //       trigger: card,
    //       start: "top 90%",
    //       end: "top 20%",
    //       toggleActions: "play none none none",
    //       animation: gsap.from(card, {
    //         autoAlpha: 0,
    //         y: 50,
    //         duration: 0.8,
    //         ease: "power2.out",
    //         paused: true
    //       }),
    //       id: `mobile-card-${index}`
    //     });
    //   });

    //   // Cleanup function for mobile
    //   return () => {
    //     // console.log("📱 Cleaning up mobile animations");
    //     ScrollTrigger.getAll().forEach(trigger => {
    //       if (trigger.vars.id && trigger.vars.id.includes('mobile-')) {
    //         trigger.kill();
    //       }
    //     });
    //   };
    // });

    // Desktop: Full animations with Flip (>768px)
    // mm.add("(min-width: 769px)", () => {
      console.log("🖥️ DESKTOP: Full animations with Flip");

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

      // Banner text elements
      // let ux_home_banner_v2_header_text_container = document.querySelector(".ux_home_banner_v2_header_text_container");
      let ux_nav_link_home = document.querySelector("#ux_nav_link_home");
      let ux_nav_link_menu = document.querySelector("#ux_nav_link_menu");
      // let sj_banner_1_header_link = document.querySelector(".sj_banner_1_header_link");
      let sj_banner_4_header_text = document.querySelector(".sj_banner_4_header_text");
      let sj_banner_4_subheader_text = document.querySelectorAll(".sj_banner_4_subheader_text");
      let ux_home_v2_card_number_text = document.querySelector(".ux_home_v2_card_number_text");
      let ux_home_swiper_js = document.querySelector(".w-layout-grid.sj_grid_1-2.ux_home_swiper_js");
      let ux_home_marquee_js = document.querySelector(".ap_grid_container.ux_home_swiper_js");


      // Register slideUp effect
      gsap.registerEffect({
        name:"slideUp", 
        extendTimeline:true,
        defaults:{
          y:"110%",
          x:0
        },
        effect: (targets, config) => {
          let tl = gsap.timeline();
          tl.from(targets, {
            duration:1,
            x:config.x,
            y:config.y,
            stagger:{
              each:0.03,
              ease:"power1.in"
            }
          });
          return tl;
        }
      });

      // Split text for banner elements
      // let split_ux_home_banner_v2_header_text_container = new SplitText(ux_home_banner_v2_header_text_container, {type:"chars, words"});
      let split_ux_nav_link_home = new SplitText(ux_nav_link_home, {type:"chars, words"});
      // let split_sj_banner_1_header_link = new SplitText(sj_banner_1_header_link, {type:"chars, words"});
      let split_ux_nav_link_menu = new SplitText(ux_nav_link_menu, {type:"chars, words"});
      let split_sj_banner_4_header_text = new SplitText(sj_banner_4_header_text, {type:"chars, words"});
      let split_sj_banner_4_subheader_text = new SplitText(sj_banner_4_subheader_text, {type:"chars, words"});
      let split_ux_home_v2_card_number_text = new SplitText(ux_home_v2_card_number_text, {type:"chars, words"});

      // console.log('split_ux_nav_link_home.chars:', split_ux_nav_link_home.chars);
      // console.log('split_ux_nav_link_menu.chars:', split_ux_nav_link_menu.chars);
      // console.log('split_sj_banner_4_header_text.chars:', split_sj_banner_4_header_text.chars);
      // console.log('split_sj_banner_4_subheader_text.chars:', split_sj_banner_4_subheader_text.chars);

      // Store banner SplitText instances
      splitInstances.push(
        // split_ux_home_banner_v2_header_text_container,
        // split_sj_banner_1_header_link,
        split_ux_nav_link_home,
        split_ux_nav_link_menu,
        split_sj_banner_4_header_text,
        split_sj_banner_4_subheader_text,
        split_ux_home_v2_card_number_text
      );

      // sct_text_decoration_svg.js - get the SVG elements array AFTER SplitText
      const sct_decoration_svg_elements = sct_text_decoration_svg()

      // Set initial state for SVG decoration elements to hide them
      gsap.set(sct_decoration_svg_elements, { opacity: 0 });

      // Banner text timeline
      let banner_text_tl = gsap.timeline();
      banner_text_tl
        .slideUp(split_ux_nav_link_home.chars, {},
          "banner_text_tl_start"
        )
        .slideUp(split_ux_nav_link_menu.chars, {
          // duration:0.4
        }, "banner_text_tl_start+=0")
        .slideUp(split_sj_banner_4_header_text.chars, {}, "banner_text_tl_start+=0.4")
        .slideUp(split_sj_banner_4_subheader_text.chars, {}, "<")
        // .slideUp(split_ux_home_v2_card_number_text.chars, {}, "<");
        // .from(ux_home_swiper_js, {
        //     duration: 1,
        //     opacity: 0
        //   }, "+=1")
        .from(ux_home_marquee_js, {
            duration: 1,
            opacity: 0
          }, "<+1")

        // SVG decorations fade in
        .fromTo([...sct_decoration_svg_elements],
        {
          opacity: 0,
        },
        {
          opacity: 0.7,
          duration: 1,
          ease:'power1.out'
        }, "<+0.5")


      // Case studies loop with full animations
      let ap_grid_container_ux_home_cs = document.querySelectorAll(".ap_grid_container.ux_home_cs");

      ap_grid_container_ux_home_cs.forEach((element, index) => {
        const ux_home_cs_image_start = element.querySelector('.ux_home_cs_image_start');
        const ux_home_cs_image_wrapper = element.querySelector('.ux_home_cs_image_hult');
        const ux_home_cs_image = element.querySelector('.ux_home_cs_image_hult_img');

        let sc_1_card_text_header = element.querySelector(".sc_1_card_text_header");
        let ux_home_v2_card_number_text = element.querySelectorAll(".ux_home_v2_card_number_text");
        let sc_1_card_text_subheader = element.querySelector(".sc_1_card_text_subheader");
        let sc_1_card_text_link_container_2 = element.querySelector(".sc_1_card_text_link_container_2");

        let ux_home_v2_cs_card_image_wrapper = element.querySelector(".ux_home_v2_cs_card_image_wrapper.image");
        let ux_home_v2_cs_card_image = element.querySelector(".ux_home_v2_cs_card_image");
        let ux_home_v2_cs_card_image_border_block = element.querySelector(".ux_home_v2_cs_card_image_border_block");

        // for videos on homepage
        let ux_home_v2_cs_card_video_wrapper = element.querySelector(".ux_home_v2_cs_card_image_wrapper.video");
        let ux_home_v2_cs_card_video = element.querySelector(".ux_home_cs_image_slot");
        
        let video = element.querySelector('#video');
        let first_video = element.querySelector('#first_video');


        if (!sc_1_card_text_header) {
          console.log(`❌ No .sc_1_card_text_header found in container ${index}`);
          return;
        }

        // console.log(`✅ Found .sc_1_card_text_header in container ${index}:`, sc_1_card_text_header);

        // Store original content for each card
        originalContent[`header_${index}`] = sc_1_card_text_header ? sc_1_card_text_header.innerHTML : '';
        originalContent[`subheader_${index}`] = sc_1_card_text_subheader ? sc_1_card_text_subheader.innerHTML : '';

        // SplitText elements with line wrapping (desktop only)
        let split_sc_1_card_text_header = new SplitText(sc_1_card_text_header, {
          type:"words,lines",
          linesClass: "split-line",
          lineThreshold: 0.5
        });

        let split_ux_home_v2_card_number_text = new SplitText(ux_home_v2_card_number_text, {
          type:"words,lines",
          linesClass: "split-line",
          lineThreshold: 0.5
        });

        let split_sc_1_card_text_subheader = new SplitText(sc_1_card_text_subheader, {
          type:"words,lines",
          linesClass: "split-line",
          lineThreshold: 0.5        
        });

        // Store card SplitText instances
        splitInstances.push(
          split_sc_1_card_text_header,
          split_ux_home_v2_card_number_text,
          split_sc_1_card_text_subheader
        );

        // Apply wrappers to all text elements lines
        wrapLines(split_sc_1_card_text_header.lines);
        wrapLines(split_ux_home_v2_card_number_text.lines);
        wrapLines(split_sc_1_card_text_subheader.lines);

        // Store the ORIGINAL state before any Flip animations
        if (ux_home_cs_image_wrapper) {
          originalStates[index] = {
            element: ux_home_cs_image_wrapper,
            parent: ux_home_cs_image_wrapper.parentNode
          };
          // console.log(`Stored original parent for container ${index}:`, ux_home_cs_image_wrapper.parentNode.className);
        }

        const ux_home_cs_animation = () => {
          // console.log(`\n=== DESKTOP ANIMATION DEBUG ===`);
          // console.log('Image wrapper ORIGINAL parent:', ux_home_cs_image_wrapper.parentNode);
          // console.log('Image wrapper ORIGINAL parent class:', ux_home_cs_image_wrapper.parentNode?.className);
          // console.log('Image start element class:', ux_home_cs_image_start?.className);
          
          // Set initial states for image elements to prevent stuck transforms
          // gsap.set([ux_home_v2_cs_card_image_wrapper, ux_home_v2_cs_card_image], {
          //   xPercent: 0,
          //   x: 0,
          //   y: 0,
          //   scale: 1,
          //   opacity: 1
          // });

          // Set initial states for video elements to prevent stuck transforms
          gsap.set([ux_home_v2_cs_card_video_wrapper, ux_home_v2_cs_card_video], {
            xPercent: 0,
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1
          });
  
          const tl_ux_home_cs = gsap.timeline({
              defaults: {
                  ease: 'power3.inOut', 
                  duration: 2, 
              }
          });

          // Full Flip animation (desktop only)
          const state = Flip.getState(ux_home_cs_image_wrapper);
          // console.log('Flip state captured, now moving to start position');

          ux_home_cs_image_start.appendChild(ux_home_cs_image_wrapper);
          // console.log('After moving to start, parent is now:', ux_home_cs_image_wrapper.parentNode.className);

          tl_ux_home_cs.from(ux_home_cs_image, {
              scale: 1.05
          })
          .to(ux_home_cs_image_wrapper, {
              borderRadius: '16px'
          }, '<')
          // .from(ux_home_cs_image, {
          //     position: 'absolute',
          //     left: '0px',
          //     top: '0px',
          //     right: '0px'
          // }, '<')
          // .from(ux_home_cs_image_wrapper, {
          //     position: 'static'
          // }, '<')
          // .from(element.querySelector('.ux_home_v2_cs_card_container'), {
          //     position: 'static'
          // }, '<')
          // .from(element.querySelector('.ap_grid_1.ux_home_v2_cs_card_text_container.hult'), {
          //     position: 'static'
          // }, '<')

          .add(() => {
              // console.log('About to Flip.to - moving back to original state');
              Flip.to(state, {
                  duration: index === 0 ? 1.8 : 1.3,  // Conditional duration
                  ease: 'power3.inOut',
              });
          }, '<')
          .slideUp(split_sc_1_card_text_header.lines, {}, "<")
          // .from(ux_home_v2_cs_card_image_wrapper, {
          //   xPercent:-102, 
          //   ease:'power1.out', 
          //   duration: 1.3
          // }, "-=1.8")
          .from(ux_home_v2_cs_card_video_wrapper, {
            xPercent:-102, 
            ease:'power1.out', 
            duration: 1.3
          }, "-=1.8")
          // .from(ux_home_v2_cs_card_image, {
          //   xPercent:102, 
          //   ease:'power1.out', 
          //   duration: 1.3
          // }, "<")
          .from(ux_home_v2_cs_card_video, {
            xPercent:102, 
            ease:'power1.out', 
            duration: 1.3
          }, "<")
          .slideUp(split_ux_home_v2_card_number_text.lines, {}, "-=0.5")
          .slideUp(split_sc_1_card_text_subheader.lines, {
            duration:0.5,
            stagger:0.3
          }, "-=1.8")
          .slideUp(sc_1_card_text_link_container_2, {}, "<")
          // .from(ux_home_v2_cs_card_image_border_block, {
          //   duration: 1,
          //   opacity: 0
          // }, "-=1.5");
          
          return tl_ux_home_cs;
        };

        // Create individual timeline for each element
        let elementTimeline = gsap.timeline({
          paused: true,
          delay: index === 0 ? 1.3 : 0
        });
        elementTimeline.add(ux_home_cs_animation());

        // ScrollTrigger for desktop
        ScrollTrigger.create({
          trigger: element,
          start: "top 90%",
          end: "top 20%",
          toggleActions: "play none none none",
          animation: elementTimeline,
          id: `desktop-card-${index}`,
          // markers:true
        });

        // Scrolltrigger for videos 
        if (video) {
          ScrollTrigger.create({
            trigger:video,
            start:"top 100%",
            end:"50% top",
            // markers:true,
            onEnter:()=> video.play(),
            onLeave:() => video.pause(),
            onEnterBack: ()=> video.play(),
            onLeaveBack: ()=> video.pause(),
          })
        }

        // Scrolltrigger for videos 
        if (first_video) {
          ScrollTrigger.create({
            trigger:first_video,
            start:"top 100%",
            end:"50% top",
            // markers:true,
            onEnter:()=> first_video.play(),
            onLeave:() => first_video.pause(),
            onEnterBack: ()=> first_video.play(),
            onLeaveBack: ()=> first_video.pause(),
          })
        }
      

      });
      



      
      // randomcomment?
      ux_home_marquee()

      // Cleanup function for desktop
      return () => {
        // console.log("🖥️ Cleaning up desktop animations");
        
        // Clean up SplitText instances
        cleanupSplitText();
        
        // Restore elements to original DOM state
        originalStates.forEach((state, index) => {
          if (state.element && state.parent) {
            // console.log(`Restoring element ${index} to original parent:`, state.parent.className);
            state.parent.appendChild(state.element);
          }
        });
        
        // Clear GSAP properties
        gsap.set([
          '.ap_grid_container.ux_home_cs',
          '.ux_home_cs_image_hult',
          '.ux_home_cs_image_hult_img',
          '.ux_home_cs_image_start',
          '.split-line',
          '.split-line-container'
        ], {
          clearProps: "all"
        });

        // Kill desktop ScrollTriggers
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.vars.id && trigger.vars.id.includes('desktop-')) {
            trigger.kill();
          }
        });

        // Clear arrays
        originalStates = [];
        splitInstances = [];
        originalContent = {};
      };


  }
  
  // Kill and reset all animations and properties
  function killAll() {
    console.log('=== KILL ALL DEBUG ===')

    // Kill all active tweens first
    gsap.killTweensOf("*")

    // Kill all ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

    // Restore ALL elements to their original DOM state BEFORE cleanup
    originalStates.forEach((state, index) => {
      if (state.element && state.parent) {
        // console.log(`Restoring element ${index} to original parent:`, state.parent.className);
        state.parent.appendChild(state.element);
        // console.log(`Successfully restored to:`, state.element.parentNode?.className);
      }
    });

    // Clean up SplitText instances AFTER restoring DOM
    cleanupSplitText()

    // Explicitly reset image transforms that might be stuck
    gsap.set([
      '.ux_home_v2_cs_card_image_wrapper',
      '.ux_home_v2_cs_card_image',
      '.ux_home_cs_image_hult',
      '.ux_home_cs_image_hult_img',
      '.ux_home_v2_cs_card_video_wrapper',
      '.ux_home_v2_cs_card_video'
    ], {
      xPercent: 0,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      borderRadius: ''
    })

    // Clear ALL GSAP properties to ensure clean slate
    gsap.set([
      '.ap_grid_container.ux_home_cs',
      '.ux_home_cs_image_hult',
      '.ux_home_cs_image_hult_img',
      '.ux_home_cs_image_start',
      '.ux_home_cs_image_wrapper',
      '.split-line',
      '.split-line-container',
      '.sc_1_card_text_link_container_2',
      '.sc_1_card_text_header',
      '.sc_1_card_text_subheader',
      '.ux_home_v2_card_number_text',
      '.ux_home_v2_cs_card_image_wrapper',
      '.ux_home_v2_cs_card_image',
      '.ux_home_v2_cs_card_video_wrapper',
      '.ux_home_v2_cs_card_video',
      '#ux_nav_link_home',
      '#ux_nav_link_menu',
      '.sj_banner_4_header_text',
      '.sj_banner_4_subheader_text',
      'html'
    ], {
      clearProps: "all"
    })

    // Force a reflow to ensure DOM is properly updated
    document.body.offsetHeight

    // Refresh ScrollTrigger to recalculate positions
    ScrollTrigger.refresh()

    console.log('=== END KILL ALL DEBUG ===\n')

    // Wait for videos and images to be ready before reinitializing
    gsap.delayedCall(0.5, () => {
      console.log('🔄 Reinitializing after resize...');

      // Wait for videos first
      checkVideosLoaded().then(() => {
        // Then wait for images
        imagesLoaded(document.body, { background: true }, function() {
          console.log('✅ Videos and images ready after resize');
          // Small delay to ensure layout is stable
          setTimeout(() => {
            init()
          }, 50);
        });
      });
    })
  }

  // This bit of code from stackoverflow is going to help us when resizing
  function debounce(func){
    var timer;
    return function(event){
      if(timer) clearTimeout(timer)
      timer = setTimeout(func,300,event)
    }
  }

  // Add resize listener with debounce - but avoid triggering on mobile scroll
  window.addEventListener("resize", debounce(function(e){
    const currentWidth = window.innerWidth;
    const isMobile = currentWidth <= 768;
    
    // Skip resize handling on mobile to prevent scroll-induced refreshes
    if (isMobile) {
      console.log("📱 Mobile resize ignored - preventing scroll interference");
      return;
    }
    
    console.log("🖥️ Desktop resize detected - reinitializing");
    killAll();
  }))

  // Function to check and wait for video metadata to load
  const checkVideosLoaded = () => {
    return new Promise((resolve) => {
      const videos = document.querySelectorAll('video');
      console.log(`📹 Total videos found: ${videos.length}`);

      if (videos.length === 0) {
        console.log('✅ No videos on page');
        resolve();
        return;
      }

      let loadedCount = 0;

      const onVideoReady = (video, index) => {
        loadedCount++;
        console.log(`✅ Video ${index + 1}/${videos.length} ready - ID: ${video.id || 'no-id'}, Dimensions: ${video.videoWidth}x${video.videoHeight}`);

        if (loadedCount === videos.length) {
          console.log('✅ All videos metadata loaded');
          resolve();
        }
      };

      videos.forEach((video, index) => {
        // Check if metadata already loaded (readyState >= 1 means HAVE_METADATA)
        if (video.readyState >= 1) {
          onVideoReady(video, index);
        } else {
          // Wait for loadedmetadata event
          video.addEventListener('loadedmetadata', () => onVideoReady(video, index), { once: true });

          // Force load metadata if not already loading
          if (video.readyState === 0) {
            video.load();
          }
        }
      });
    });
  };

  // Fixed initialization with imagesLoaded using callback instead of promise
  let hasInitialized = false;

  const initializeOnce = () => {
    if (hasInitialized) {
      console.log('Already initialized, skipping...');
      return;
    }
    hasInitialized = true;

    console.log('🚀 initializeOnce called');
    console.log('Document ready state:', document.readyState);

    // Wait for fonts, then videos, then images before starting animations
    document.fonts.ready.then(() => {
      console.log('✅ Fonts loaded');

      // Check videos first before images
      checkVideosLoaded().then(() => {
        // Use imagesLoaded with callback instead of promise to avoid async listener error
        imagesLoaded(document.body, { background: true }, function() {
          console.log('✅ All images loaded');
          // Small delay to ensure layout is stable
          setTimeout(() => {
            console.log('🎬 Calling init()...');
            init();
          }, 50);
        });
      });
    });
  };

  // Use DOMContentLoaded for faster initialization
  console.log('Adding DOMContentLoaded listener, current state:', document.readyState);
  if (document.readyState === 'loading') {
    window.addEventListener("DOMContentLoaded", initializeOnce);
  } else {
    console.log('DOM already loaded, calling initializeOnce immediately');
    initializeOnce();
  }

  // Fallback for compatibility
  window.addEventListener("load", initializeOnce);
}

// Only initialize if we're on the correct page
console.log('Script loaded, checking for ux_home_v2 class...');
console.log('Body classes:', document.body.className);
console.log('Has ux_home_v2 class:', document.body.classList.contains("ux_home_v2"));
console.log('Document ready state:', document.readyState);

if (document.body.classList.contains("ux_home_v2")) {
  console.log('✅ ux_home_v2 class found, initializing...');
  ux_home_v2();
} else {
  console.warn('❌ ux_home_v2 class NOT found on body element');
}

export default ux_home_v2;