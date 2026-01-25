/** UX Home js - GSAP MatchMedia Solution
 *
 * 061825
 * Using gsap.matchMedia() for responsive animations
 * Desktop only animations with proper cleanup
 *
 * 090825
 * added back ignore mobile resize cuz it was giving difficulties in flip.
 * marquee working now.
 * 
 * 012126
 * new homepage, v3. removing flip
 * 
 * 012226
 * trying to not put cs animation in banner tl
 */

import '../src/styles/style.css';

import { gsap } from 'gsap'
// gsap.registerPlugin(GSDevTools);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger); 

import sj_menu from './sj_menu.js';
sj_menu();

import sct_text_decoration_svg from './sct_text_decoration_svg.js';


console.log('ux_home_v3.js is working');
// Page scroll resets on actual refresh/reload
// Use 'load' event with history state to handle only refreshes
if (window.performance && window.performance.navigation.type === 1) {
  window.scrollTo(0, 0);
}

// Store original states globally
let splitInstances = [];
let originalContent = {};

function ux_home_v3() {

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
  ux_home_marquee()
  
  // Main initialization function
  function init() {
    console.log('🔵 ux_home_v3.js init called at:', new Date().toISOString());
    console.trace('init() call stack');

    // NOTE: sj_menu() handles its own initialization via window.load event
    // Don't call it here to avoid double initialization during animation

    // Clear previous states
    splitInstances = [];
    originalContent = {};


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
          duration: config.duration || 1,
          x: config.x,
          y: config.y,
          stagger: config.stagger || {
            each: 0.03,
            ease: "power1.in"
          }
        });
        return tl;
      }
    });


    // Banner text elements (query AFTER sj_menu clones elements)
    let ux_nav_link_home = document.querySelector("#ux_nav_link_home");
    let ux_nav_link_menu = document.querySelector("#ux_nav_link_menu");

    let sj_banner_4_header_text = document.querySelectorAll(".sj_banner_4_header_text");
    let sj_banner_4_subheader_text = document.querySelectorAll(".sj_banner_4_subheader_text");
    let ux_home_marquee_js = document.querySelector(".ap_grid_container.ux_home_swiper_js");



    // Split text for banner elements
    let split_ux_nav_link_home = new SplitText(ux_nav_link_home, {type:"chars, words"});
    let split_ux_nav_link_menu = new SplitText(ux_nav_link_menu, {type:"chars, words"});

    let split_sj_banner_4_header_text = new SplitText(sj_banner_4_header_text, {type:"chars, words"});    
    let split_sj_banner_4_subheader_text = new SplitText(sj_banner_4_subheader_text, {type:"chars, words"});    
    

    // Store original content for banner elements
    originalContent['ux_nav_link_home'] = 'HOME';
    originalContent['ux_nav_link_menu'] = 'MENU';

    // Store banner SplitText instances
    splitInstances.push(
      split_ux_nav_link_home,
      split_ux_nav_link_menu,
      split_sj_banner_4_header_text,
      split_sj_banner_4_subheader_text
    );

    // sct_text_decoration_svg.js - get the SVG elements array AFTER SplitText
    const sct_decoration_svg_elements = sct_text_decoration_svg()

    // Set initial state for SVG decoration elements to hide them
    gsap.set(sct_decoration_svg_elements, { opacity: 0 });

    // Banner text timeline
    let banner_text_tl = gsap.timeline()
    banner_text_tl
      .from("html", {
        autoAlpha: 0,
        ease: "power1.in"
      }, "banner_text_tl_start"
      )
      .slideUp(split_ux_nav_link_home.chars, {},
        "banner_text_tl_start+=0"
      )
      .slideUp(split_ux_nav_link_menu.chars, {}, "banner_text_tl_start+=0")
      .slideUp(split_sj_banner_4_header_text.chars, {}, "banner_text_tl_start+=0.1")
      .slideUp(split_sj_banner_4_subheader_text.words, {
        duration:0.8,
        stagger:{
          each:0.06,
          ease:"power1.in"
        }
      }, "banner_text_tl_start+=0.5")

      // marquee animation
      .from(ux_home_marquee_js, {
          duration: 1,
          opacity: 0
      }, "banner_text_tl_start+=1.5")

      // SVG decorations fade in
      .fromTo([...sct_decoration_svg_elements],
      {
        opacity: 0,
      },
      {
        opacity: 0.7,
        duration: 1,
        ease:'power1.out'
      }, "banner_text_tl_start+=2.0")


      // Case studies loop with full animations
      let ap_grid_container_ux_home_cs = document.querySelectorAll(".ap_grid_container.ux_home_cs");

      ap_grid_container_ux_home_cs.forEach((element, index) => {
        
        let sc_1_card_text_header = element.querySelector(".sc_1_card_text_header");
        let ux_card_company_name_text = element.querySelector(".ux_card_company_name_text");
        let building_icon_svg = element.querySelector(".building_icon_svg");
        let sc_1_card_text_subheader = element.querySelector(".sc_1_card_text_subheader");
        let ux_btn_parent = element.querySelector(".ux_btn_parent");


        // for videos on homepage
        let ux_home_cs_card_image_wrapper_v3 = element.querySelector(".ux_home_cs_card_image_wrapper_v3");
        let ux_home_cs_image_slot = element.querySelector(".ux_home_cs_image_slot");
        let ux_home_cs_image = element.querySelector(".ux_home_cs_image");

        // Select any video element within this card (works for all video IDs)
        let video = element.querySelector('video');

        // Store original content for each card
        originalContent[`header_${index}`] = sc_1_card_text_header ? sc_1_card_text_header.innerHTML : '';
        originalContent[`subheader_${index}`] = sc_1_card_text_subheader ? sc_1_card_text_subheader.innerHTML : '';

        let split_sc_1_card_text_header = new SplitText(sc_1_card_text_header, {type:"chars, words, lines"});
        let split_sc_1_card_text_subheader = new SplitText(sc_1_card_text_subheader, {type:"chars, words, lines"});

        // Store card SplitText instances
        splitInstances.push(
          split_sc_1_card_text_header,
          split_sc_1_card_text_subheader
        );

        // Apply wrappers to all text elements lines
        wrapLines(split_sc_1_card_text_header.lines);
        wrapLines(split_sc_1_card_text_subheader.lines);

        const ux_home_cs_animation = () => {
  
          const tl_ux_home_cs = gsap.timeline({
              defaults: {
                  ease: 'power3.inOut', 
                  duration: 2, 
              }
          });


          tl_ux_home_cs
          .addLabel("tl_ux_home_cs_start")
          .slideUp(split_sc_1_card_text_header.lines, {
              duration:0.8,
          }, "tl_ux_home_cs_start")
          .slideUp(building_icon_svg, {}, "tl_ux_home_cs_start+=0.4")
          .slideUp(ux_card_company_name_text, {}, "tl_ux_home_cs_start+=0.4")
          .from(ux_home_cs_card_image_wrapper_v3, {
            xPercent:-102,
            ease:'power1.out',
            duration: 1.3
          }, "tl_ux_home_cs_start+=0.4")
          .from(ux_home_cs_image_slot, {
            xPercent:102,
            ease:'power1.out',
            duration: 1.3
          }, "tl_ux_home_cs_start+=0.4")
          .slideUp(split_sc_1_card_text_subheader.lines, {
            duration:0.8,
            stagger:0.3
          }, "tl_ux_home_cs_start+=0.7")
          .slideUp(ux_btn_parent, {}, "tl_ux_home_cs_start+=0.9")

          .from(ux_home_cs_image, {
            outlineColor: 'transparent',
            outlineOffset:'0px',
            duration:0.5
          }, "tl_ux_home_cs_start+=1")
          return tl_ux_home_cs;
        };

        // Create individual timeline for each element
        let elementTimeline = gsap.timeline({
          paused: true,
          // i previously used this so the first case study could work with scrolltrigger and it would just have a little delay. 
          delay: index === 0 ? 1.3 : 0
        });
        elementTimeline.add(ux_home_cs_animation());

        // ScrollTrigger for desktop
        ScrollTrigger.create({
          trigger: element,
          start: "top 85%",
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


      });
      



      


      // Cleanup function for desktop
      return () => {
        // console.log("🖥️ Cleaning up desktop animations");

        // Remove ALL SVG decoration elements created by sct_text_decoration_svg.js
        // DON'T remove the .sct_text_decoration_word spans - those are the target elements!
        const svgPatterns = [
          'svg[id^="text-border-line-"]',
          'svg[id^="text-border-ellipse-"]',
          'svg[id^="text-border-rectangle-"]',
          'svg[id^="highlight-"]',
          'svg[id^="underline-"]'
        ];

        let totalRemoved = 0;
        svgPatterns.forEach(pattern => {
          const svgs = document.querySelectorAll(pattern);
          svgs.forEach(svg => svg.remove());
          totalRemoved += svgs.length;
        });
        console.log(`Removed ${totalRemoved} SVG decoration elements`);

        // Clean up SplitText instances
        cleanupSplitText();

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

    // Remove ALL SVG decoration elements created by sct_text_decoration_svg.js
    // DON'T remove the .sct_text_decoration_word spans - those are the target elements!
    const svgPatterns = [
      'svg[id^="text-border-line-"]',
      'svg[id^="text-border-ellipse-"]',
      'svg[id^="text-border-rectangle-"]',
      'svg[id^="highlight-"]',
      'svg[id^="underline-"]'
    ];

    let totalRemoved = 0;
    svgPatterns.forEach(pattern => {
      const svgs = document.querySelectorAll(pattern);
      svgs.forEach(svg => svg.remove());
      totalRemoved += svgs.length;
    });
    console.log(`Removed ${totalRemoved} SVG decoration elements`);


    // Clean up SplitText instances AFTER restoring DOM
    cleanupSplitText()

    // Restore original innerHTML for banner text elements
    const ux_nav_link_home_el = document.querySelector('#ux_nav_link_home');
    const ux_nav_link_menu_el = document.querySelector('#ux_nav_link_menu');

    if (ux_nav_link_home_el && originalContent['ux_nav_link_home']) {
      ux_nav_link_home_el.innerHTML = originalContent['ux_nav_link_home'];
    }
    if (ux_nav_link_menu_el && originalContent['ux_nav_link_menu']) {
      ux_nav_link_menu_el.innerHTML = originalContent['ux_nav_link_menu'];
    }

    // Explicitly reset image transforms that might be stuck
    gsap.set([
      '.ux_home_v2_cs_card_image_wrapper',
      '.ux_home_v2_cs_card_image',
      '.ux_home_cs_image_hult',
      '.ux_home_cs_image_hult_img',
      '.ux_home_v2_cs_card_image_wrapper.video',
      '.ux_home_cs_image_slot',
      '.ux_home_cs_card_image_wrapper_v3',
      '.ux_home_cs_image'
    ], {
      xPercent: 0,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      borderRadius: ''
    })

    // Clear ALL GSAP properties to ensure clean slate
    // IMPORTANT: Clear banner text elements first before other cleanup
    const ux_nav_link_home = document.querySelector('#ux_nav_link_home');
    const ux_nav_link_menu = document.querySelector('#ux_nav_link_menu');

    if (ux_nav_link_home) {
      gsap.set(ux_nav_link_home, { clearProps: "all" });
    }
    if (ux_nav_link_menu) {
      gsap.set(ux_nav_link_menu, { clearProps: "all" });
    }

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
      '.ux_card_company_name_text',
      '.sc_1_card_text_subheader',
      '.ux_home_v2_cs_card_image_wrapper',
      '.ux_home_v2_cs_card_image',
      '.ux_home_v2_cs_card_image_wrapper.video',
      '.ux_home_cs_image_slot',
      '.sj_banner_4_header_text',
      '.sj_banner_4_subheader_text',
      '.ap_grid_container.ux_home_swiper_js',
      '.sct_text_decoration_word',
      '.ux_home_cs_card_image_wrapper_v3',
      '.ux_home_cs_image',
      'html'
    ], {
      clearProps: "all"
    })

    // Force a reflow to ensure DOM is properly updated
    document.body.offsetHeight

    // Refresh ScrollTrigger to recalculate positions
    ScrollTrigger.refresh()

    console.log('=== END KILL ALL DEBUG ===\n')

    // Reinitialize immediately after a short delay
    gsap.delayedCall(0.1, () => {
      console.log('🔄 Reinitializing after resize...');
      init();

      // Refresh ScrollTrigger after brief delay
      gsap.delayedCall(0.1, () => {
        ScrollTrigger.refresh();
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

  // Track viewport state to detect mobile/desktop transitions
  let wasMobile = window.innerWidth <= 768;
  let initialLoadComplete = false;

  // Track orientation to detect rotation changes
  let wasPortrait = window.matchMedia('(orientation: portrait)').matches;

  // Add resize listener with debounce - but avoid triggering on mobile scroll
  window.addEventListener("resize", debounce(function(){
    // Ignore resize events during initial page load
    if (!initialLoadComplete) {
      console.log("🚫 Ignoring resize during initial page load");
      return;
    }

    const currentWidth = window.innerWidth;
    const isMobile = currentWidth <= 768;
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    const orientationChanged = wasPortrait !== isPortrait;

    // Skip resize handling ONLY if we're mobile AND were already mobile AND orientation hasn't changed
    // This prevents scroll-induced refreshes on mobile while still handling:
    // 1. mobile↔desktop transitions
    // 2. orientation changes (portrait↔landscape)
    if (isMobile && wasMobile && !orientationChanged) {
      console.log("📱 Mobile resize ignored - preventing scroll interference");
      return;
    }

    if (orientationChanged) {
      console.log(`🔄 Orientation changed - ${wasPortrait ? 'portrait' : 'landscape'} → ${isPortrait ? 'portrait' : 'landscape'} - reinitializing`);
      wasPortrait = isPortrait;
    } else {
      console.log(`🔄 Resize detected - ${wasMobile ? 'mobile' : 'desktop'} → ${isMobile ? 'mobile' : 'desktop'} - reinitializing`);
    }

    wasMobile = isMobile;
    killAll();
  }))

  // Fast initialization - start animations immediately
  let hasInitialized = false;

  const initializeOnce = () => {
    if (hasInitialized) {
      console.log('Already initialized, skipping...');
      return;
    }
    hasInitialized = true;

    console.log('🚀 initializeOnce called');
    console.log('Document ready state:', document.readyState);

    // Wait for fonts to load to prevent SplitText layout shifts
    // DOMContentLoaded already ensures sj_menu has initialized
    document.fonts.ready.then(() => {
      console.log('✅ Fonts loaded');

      // Wait for browser to complete initial paint before starting animations
      // Double RAF ensures we start after the browser has painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          console.log('✅ First paint complete - starting animations');
          init();

          // Refresh ScrollTrigger after brief delay
          gsap.delayedCall(0.2, () => {
            ScrollTrigger.refresh();

            // Mark initial load as complete AFTER refresh settles (prevent refresh-triggered resize from reinitializing)
            gsap.delayedCall(0.3, () => {
              initialLoadComplete = true;
              console.log('✅ Initial load complete - resize handling enabled');
            });
          });
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

  // No longer needed - DOMContentLoaded is sufficient
  // window.addEventListener("load", initializeOnce);
}

// Only initialize if we're on the correct page
console.log('Script loaded, checking for ux_home_v3 class...');
console.log('Body classes:', document.body.className);
console.log('Has ux_home_v3 class:', document.body.classList.contains("ux_home_v3"));
console.log('Document ready state:', document.readyState);

if (document.body.classList.contains("ux_home_v3")) {
  console.log('✅ ux_home_v3 class found, initializing...');
  ux_home_v3();
} else {
  console.warn('❌ ux_home_v3 class NOT found on body element');
}

export default ux_home_v3;