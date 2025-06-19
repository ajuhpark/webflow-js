/** UX Home js - Mobile Optimized
 * 
 * 061825
 * Fixed mobile resize issues and animation performance
 */

import '../src/styles/style.css';

gsap.registerPlugin(GSDevTools);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(Flip)

import sj_menu from './sj_menu.js';
sj_menu();

import ux_footer from './ux_footer.js';
const footerModule = ux_footer();

import imagesLoaded from 'imagesloaded';

// make the mobile size stay the same
ScrollTrigger.normalizeScroll(true);
ScrollTrigger.config({
  ignoreMobileResize: true,
});

console.log('ux_home_v2.js is working');

// Page scroll resets on refresh (vanilla JS version)
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Store original states globally
let originalStates = [];
let splitInstances = [];
let originalContent = {};

// Mobile detection and resize handling
let isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let lastWidth = window.innerWidth;
let lastHeight = window.innerHeight;
let isInitialized = false;

function ux_home_v2() {

  // Enhanced mobile-aware debounce function
  function smartDebounce(func, wait = 300) {
    let timeout;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    
    return function executedFunction(...args) {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      
      // On mobile, ignore height changes (address bar show/hide)
      // Only trigger on significant width changes or desktop height changes
      const shouldTrigger = isMobile 
        ? Math.abs(currentWidth - lastWidth) > 50 // Only width changes on mobile
        : Math.abs(currentWidth - lastWidth) > 50 || Math.abs(currentHeight - lastHeight) > 100; // Both on desktop
      
      if (!shouldTrigger) {
        return;
      }
      
      lastWidth = currentWidth;
      lastHeight = currentHeight;
      
      const later = function() {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

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
    console.log("Cleaning up SplitText instances");
    
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

  // Main initialization function
  function init() {
    if (isInitialized) {
      console.log('Already initialized, skipping...');
      return;
    }
    
    console.log('ux_home_v2.js init works');
    
    // Clear previous states
    originalStates = [];
    splitInstances = [];
    originalContent = {};
    
    // Update mobile detection
    isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
    // Initial visibility
    let tl_ux_home = gsap.from("html", { 
      duration: 0.2, 
      autoAlpha: 0, 
      ease: "power1.in"
    });
    tl_ux_home.play();

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
    let ux_home_banner_v2_header_text_container = document.querySelector(".ux_home_banner_v2_header_text_container");
    let sj_banner_1_header_link = document.querySelector(".sj_banner_1_header_link")
    let sj_banner_4_header_text = document.querySelector(".sj_banner_4_header_text")
    let sj_banner_4_subheader_text = document.querySelectorAll(".sj_banner_4_subheader_text")
    let ux_home_v2_card_number_text = document.querySelector(".ux_home_v2_card_number_text")

    // Register effect with mobile-optimized settings
    gsap.registerEffect({
      name:"slideUp", 
      extendTimeline:true,
      defaults:{
        y:"110%",
        x:0
      },
      effect: (targets, config) => {
        let tl = gsap.timeline()
        tl.from(targets, {
          duration: isMobile ? 0.8 : 1, // Shorter duration on mobile
          x:config.x,
          y:config.y,
          stagger:{
            each: isMobile ? 0.02 : 0.03, // Less stagger on mobile
            ease:"power1.in"
          }
        })
        return tl
      }
    })

    // Split text for banner elements
    let split_ux_home_banner_v2_header_text_container = new SplitText(ux_home_banner_v2_header_text_container, {type:"chars, words"})
    let split_sj_banner_1_header_link = new SplitText(sj_banner_1_header_link, {type:"chars, words"})
    let split_sj_banner_4_header_text = new SplitText(sj_banner_4_header_text, {type:"chars, words"})
    let split_sj_banner_4_subheader_text = new SplitText(sj_banner_4_subheader_text, {type:"chars, words"})
    let split_ux_home_v2_card_number_text = new SplitText(ux_home_v2_card_number_text, {type:"chars, words"})

    // Store banner SplitText instances
    splitInstances.push(
      split_ux_home_banner_v2_header_text_container,
      split_sj_banner_1_header_link,
      split_sj_banner_4_header_text,
      split_sj_banner_4_subheader_text,
      split_ux_home_v2_card_number_text
    );

    // Banner text timeline
    let banner_text_tl = gsap.timeline()
    banner_text_tl
      .slideUp(split_ux_home_banner_v2_header_text_container.chars)
      .slideUp(split_sj_banner_1_header_link.chars, {}, "<")
      .slideUp(split_sj_banner_4_header_text.chars, {}, "-=0.2")
      .slideUp(split_sj_banner_4_subheader_text.chars, {}, "<")
      .slideUp(split_ux_home_v2_card_number_text.chars, {}, "<")

    let case_studies_text = document.querySelector("#case_studies_text");
    let cs_text_grid = document.querySelector("#cs_text_grid")
    let ux_homepage_last_cs = document.querySelector("#ux_homepage_last_cs")

    // Case studies loop
    let ap_grid_container_ux_home_cs = document.querySelectorAll(".ap_grid_container.ux_home_cs")

    ap_grid_container_ux_home_cs.forEach((element, index) => {

      const ux_home_cs_image_start = element.querySelector('.ux_home_cs_image_start')
      const ux_home_cs_image_wrapper = element.querySelector('.ux_home_cs_image_hult')
      const ux_home_cs_image = element.querySelector('.ux_home_cs_image_hult_img')

      let sc_1_card_text_header = element.querySelector(".sc_1_card_text_header");
      let ux_home_v2_card_number_text = element.querySelectorAll(".ux_home_v2_card_number_text")
      let sc_1_card_text_subheader = element.querySelector(".sc_1_card_text_subheader")
      let sc_1_card_text_link_container_2 = element.querySelector(".sc_1_card_text_link_container_2")

      let ux_home_v2_cs_card_image_wrapper = element.querySelector(".ux_home_v2_cs_card_image_wrapper")
      let ux_home_v2_cs_card_image = element.querySelector(".ux_home_v2_cs_card_image")

      if (sc_1_card_text_header) {
        console.log(`✅ Found .sc_1_card_text_header in container ${index}:`, sc_1_card_text_header);
      } else {
        console.log(`❌ No .sc_1_card_text_header found in container ${index}`);
        return;
      }

      // Store original content for each card
      originalContent[`header_${index}`] = sc_1_card_text_header ? sc_1_card_text_header.innerHTML : '';
      originalContent[`subheader_${index}`] = sc_1_card_text_subheader ? sc_1_card_text_subheader.innerHTML : '';

      // Mobile-optimized SplitText
      let split_sc_1_card_text_header = new SplitText(sc_1_card_text_header, {
        type: isMobile ? "words" : "words,lines", // Simpler splitting on mobile
        linesClass: "split-line",
        lineThreshold: 0.5
      });

      let split_ux_home_v2_card_number_text = new SplitText(ux_home_v2_card_number_text, {
        type: isMobile ? "words" : "words,lines",
        linesClass: "split-line",
        lineThreshold: 0.5
      });

      let split_sc_1_card_text_subheader = new SplitText(sc_1_card_text_subheader, {
        type: isMobile ? "words" : "words,lines",
        linesClass: "split-line",
        lineThreshold: 0.5        
      });

      // Store card SplitText instances
      splitInstances.push(
        split_sc_1_card_text_header,
        split_ux_home_v2_card_number_text,
        split_sc_1_card_text_subheader
      );

      // Apply wrappers only on desktop or for lines that exist
      if (!isMobile && split_sc_1_card_text_header.lines) {
        wrapLines(split_sc_1_card_text_header.lines);
      }
      if (!isMobile && split_ux_home_v2_card_number_text.lines) {
        wrapLines(split_ux_home_v2_card_number_text.lines);
      }
      if (!isMobile && split_sc_1_card_text_subheader.lines) {
        wrapLines(split_sc_1_card_text_subheader.lines);
      }

      // Store the ORIGINAL state before any Flip animations
      if (ux_home_cs_image_wrapper) {
        originalStates[index] = {
          element: ux_home_cs_image_wrapper,
          parent: ux_home_cs_image_wrapper.parentNode
        };
      }

      const ux_home_cs_animation = () => {
        const tl_ux_home_cs = gsap.timeline({
            defaults: {
                ease: 'power3.inOut', 
                duration: isMobile ? 1.5 : 2, // Faster on mobile
            }
        })

        // Simplified Flip animation for mobile
        if (isMobile) {
          // Skip complex Flip animation on mobile, use simpler effects
          tl_ux_home_cs
            .from(ux_home_cs_image, {
              scale: 1.05,
              duration: 1
            })
            .to(ux_home_cs_image_wrapper, {
              borderRadius: '16px'
            }, '<')
        } else {
          // Full Flip animation for desktop
          const state = Flip.getState(ux_home_cs_image_wrapper)
          ux_home_cs_image_start.appendChild(ux_home_cs_image_wrapper)

          tl_ux_home_cs.from(ux_home_cs_image, {
              scale: 1.05
          })
          .to(ux_home_cs_image_wrapper, {
              borderRadius: '16px'
          }, '<')
          .add(() => {
              Flip.to(state, {
                  duration: 2,
                  ease: 'power3.inOut'
              })
          }, '<')
        }

        // Use appropriate split target based on mobile/desktop
        const headerTarget = isMobile ? split_sc_1_card_text_header.words : split_sc_1_card_text_header.lines;
        const numberTarget = isMobile ? split_ux_home_v2_card_number_text.words : split_ux_home_v2_card_number_text.lines;
        const subheaderTarget = isMobile ? split_sc_1_card_text_subheader.words : split_sc_1_card_text_subheader.lines;

        tl_ux_home_cs
          .slideUp(headerTarget, {}, "<")
          .from(ux_home_v2_cs_card_image_wrapper, {
            xPercent:-102, 
            ease:'power1.out', 
            duration: isMobile ? 1 : 1.3
          }, "-=1.8")
          .from(ux_home_v2_cs_card_image, {
            xPercent:102, 
            ease:'power1.out', 
            duration: isMobile ? 1 : 1.3
          }, "<")
          .slideUp(numberTarget, {}, "-=0.5")
          .slideUp(subheaderTarget, {
            duration: isMobile ? 0.3 : 0.5,
            stagger: isMobile ? 0.1 : 0.3
          }, "-=1.8")
          .slideUp(sc_1_card_text_link_container_2, {}, "<")
            
        return tl_ux_home_cs
      }

      // Create individual timeline for each element
      let elementTimeline = gsap.timeline({
        paused: true,
        delay: index === 0 ? (isMobile ? 1 : 1.5) : 0 // Shorter delay on mobile
      })
      elementTimeline.add(ux_home_cs_animation())

      // ScrollTrigger with mobile-optimized settings
      ScrollTrigger.create({
        trigger: element,
        start: isMobile ? "top 95%" : "top 85%", // Earlier trigger on mobile
        end: "top 20%",
        toggleActions: "play none none none",
        markers: true,
        animation: elementTimeline,
      })
    })
    
    isInitialized = true;
  }
  
  // Kill and reset all animations and properties
  function killAll() {
    if (!isInitialized) {
      console.log('Not initialized, skipping killAll');
      return;
    }
    
    console.log('=== KILL ALL DEBUG ===')
    
    isInitialized = false;
    
    // Kill all ScrollTriggers first
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    
    // Clean up SplitText instances
    cleanupSplitText()
    
    // Restore ALL elements to their original DOM state
    originalStates.forEach((state, index) => {
      if (state.element && state.parent) {
        console.log(`Restoring element ${index} to original parent:`, state.parent.className);
        state.parent.appendChild(state.element);
      }
    });
    
    // Clear ALL GSAP properties
    gsap.set([
      '.ap_grid_container.ux_home_cs',
      '.ux_home_cs_image_hult',
      '.ux_home_cs_image_hult_img',
      '.ux_home_cs_image_start',
      '.split-line',
      '.split-line-container',
      'html'
    ], {
      clearProps: "all"
    })
    
    // Force a reflow
    document.body.offsetHeight
    
    // Refresh ScrollTrigger
    ScrollTrigger.refresh()
    
    console.log('=== END KILL ALL DEBUG ===\n')
    
    // Longer delay for reinit
    gsap.delayedCall(0.8, () => {
      init()
    })
  }

  // Smart resize handler with mobile detection
  const handleResize = smartDebounce(() => {
    console.log("Smart resize triggered")
    
    // Update mobile state
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Only reinitialize if device type changed or significant resize
    if (wasMobile !== isMobile || !isMobile) {
      killAll();
    }
  }, isMobile ? 500 : 300); // Longer debounce on mobile

  // Orientation change handler (more reliable on mobile)
  const handleOrientationChange = () => {
    console.log("Orientation change detected")
    setTimeout(() => {
      killAll();
    }, 500); // Wait for orientation change to complete
  };

  // Event listeners
  window.addEventListener("resize", handleResize);
  
  // Use orientation change on mobile devices
  if (isMobile) {
    window.addEventListener("orientationchange", handleOrientationChange);
  }

  // Load event
  window.addEventListener("load", function(event) { 
    init();
  });

  // Visibility change handler to pause animations when tab is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });
}

// Only initialize if we're on the correct page
if (document.body.classList.contains("ux_home_v2")) {
  ux_home_v2();
}

export default ux_home_v2;