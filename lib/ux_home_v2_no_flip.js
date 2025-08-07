/** UX Home js - GSAP MatchMedia Solution
 * 
 * 061825
 * Using gsap.matchMedia() for responsive animations
 * Desktop only animations with proper cleanup
 */

import '../src/styles/style.css';

gsap.registerPlugin(GSDevTools);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

import sj_menu from './sj_menu.js';
sj_menu();

import ux_footer from './ux_footer.js';
const footerModule = ux_footer();

import imagesLoaded from 'imagesloaded';

console.log('ux_home_v2_no_flip.js is working');

// Page scroll resets on refresh
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Store original states globally
let originalStates = [];
let splitInstances = [];
let originalContent = {};

function ux_home_v2_no_flip() {

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

  // Main initialization function
  function init() {
    console.log('ux_home_v2_no_flip.js init works');
    
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
    let mm = gsap.matchMedia();

    // Mobile/Tablet: Simple visibility only (≤768px)
    mm.add("(max-width: 768px)", () => {
      console.log("📱 MOBILE/TABLET: Simple animations only");

      // Just make everything visible without complex animations
      gsap.set([
        ".ux_home_banner_v2_header_text_container",
        ".sj_banner_1_header_link", 
        ".sj_banner_4_header_text",
        ".sj_banner_4_subheader_text",
        ".ux_home_v2_card_number_text",
        ".sc_1_card_text_header",
        ".sc_1_card_text_subheader", 
        ".sc_1_card_text_link_container_2",
        ".ux_home_v2_cs_card_image_wrapper",
        ".ux_home_v2_cs_card_image"
      ], {
        autoAlpha: 1,
        y: 0,
        x: 0,
        scale: 1
      });

      // Simple fade-in for cards on scroll
      const cards = document.querySelectorAll(".ap_grid_container.ux_home_cs");
      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 90%",
          end: "top 20%",
          toggleActions: "play none none none",
          animation: gsap.from(card, {
            autoAlpha: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out",
            paused: true
          }),
          id: `mobile-card-${index}`
        });
      });

      // Cleanup function for mobile
      return () => {
        // console.log("📱 Cleaning up mobile animations");
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.vars.id && trigger.vars.id.includes('mobile-')) {
            trigger.kill();
          }
        });
      };
    });

    // Desktop: Full animations (>768px)  
    mm.add("(min-width: 769px)", () => {
      console.log("🖥️ DESKTOP: Full animations");

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
      let sj_banner_1_header_link = document.querySelector(".sj_banner_1_header_link");
      let sj_banner_4_header_text = document.querySelector(".sj_banner_4_header_text");
      let sj_banner_4_subheader_text = document.querySelectorAll(".sj_banner_4_subheader_text");
      let ux_home_v2_card_number_text = document.querySelector(".ux_home_v2_card_number_text");

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
      let split_ux_home_banner_v2_header_text_container = new SplitText(ux_home_banner_v2_header_text_container, {type:"chars, words"});
      let split_sj_banner_1_header_link = new SplitText(sj_banner_1_header_link, {type:"chars, words"});
      let split_sj_banner_4_header_text = new SplitText(sj_banner_4_header_text, {type:"chars, words"});
      let split_sj_banner_4_subheader_text = new SplitText(sj_banner_4_subheader_text, {type:"chars, words"});
      let split_ux_home_v2_card_number_text = new SplitText(ux_home_v2_card_number_text, {type:"chars, words"});

      // Store banner SplitText instances
      splitInstances.push(
        split_ux_home_banner_v2_header_text_container,
        split_sj_banner_1_header_link,
        split_sj_banner_4_header_text,
        split_sj_banner_4_subheader_text,
        split_ux_home_v2_card_number_text
      );

      // Banner text timeline
      let banner_text_tl = gsap.timeline();
      banner_text_tl
        .slideUp(split_ux_home_banner_v2_header_text_container.chars)
        .slideUp(split_sj_banner_1_header_link.chars, {}, "<")
        .slideUp(split_sj_banner_4_header_text.chars, {}, "-=0.2")
        .slideUp(split_sj_banner_4_subheader_text.chars, {}, "<")
        .slideUp(split_ux_home_v2_card_number_text.chars, {}, "<");

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

        let ux_home_v2_cs_card_image_wrapper = element.querySelector(".ux_home_v2_cs_card_image_wrapper");
        let ux_home_v2_cs_card_image = element.querySelector(".ux_home_v2_cs_card_image");
        let ux_home_v2_cs_card_image_border_block = element.querySelector(".ux_home_v2_cs_card_image_border_block");

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


        const ux_home_cs_animation = () => {
          // console.log(`\n=== DESKTOP ANIMATION DEBUG ===`);
          // console.log('Image wrapper ORIGINAL parent:', ux_home_cs_image_wrapper.parentNode);
          // console.log('Image wrapper ORIGINAL parent class:', ux_home_cs_image_wrapper.parentNode?.className);
          // console.log('Image start element class:', ux_home_cs_image_start?.className);
  
          const tl_ux_home_cs = gsap.timeline({
              defaults: {
                  ease: 'power3.inOut', 
                  duration: 2, 
              }
          });

          // Simple image animation without Flip
          tl_ux_home_cs.from(ux_home_cs_image, {
              scale: 1.05,
              duration: index === 0 ? 1.8 : 1.3,
              ease: 'power3.inOut'
          })
          .slideUp(split_sc_1_card_text_header.lines, {}, "<")
          .from(ux_home_v2_cs_card_image_wrapper, {
            xPercent: -102, 
            ease: 'power1.out', 
            duration: 1.3
          }, "-=1.8")
          .from(ux_home_v2_cs_card_image, {
            xPercent: 102, 
            ease: 'power1.out', 
            duration: 1.3
          }, "<")
          .slideUp(split_ux_home_v2_card_number_text.lines, {}, "-=0.5")
          .slideUp(split_sc_1_card_text_subheader.lines, {
            duration: 0.5,
            stagger: 0.3
          }, "-=1.8")
          .slideUp(sc_1_card_text_link_container_2, {}, "<")
          .from(ux_home_v2_cs_card_image_border_block, {
            duration: 1,
            opacity: 0
          }, "-=1.5");
          
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
      });

      // Cleanup function for desktop
      return () => {
        // console.log("🖥️ Cleaning up desktop animations");
        
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
        originalStates = [];
        splitInstances = [];
        originalContent = {};
      };
    });

    // Store the matchMedia instance for potential cleanup
    window.gsapMatchMedia = mm;
  }
  
  // Kill and reset all animations and properties
  function killAll() {
    console.log('=== KILL ALL DEBUG ===')
    
    // Kill all ScrollTriggers first
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    
    // Clean up SplitText instances
    cleanupSplitText()
    
    
    // Clear ALL GSAP properties to ensure clean slate
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

  // Use imagesLoaded library for reliable image loading detection
  function waitForImages() {
    return new Promise((resolve) => {
      imagesLoaded(document.body, { background: true }, function() {
        console.log('All images loaded via imagesLoaded');
        resolve();
      });
    });
  }

  // Wait for fonts to load
  function waitForFonts() {
    if (!document.fonts) return Promise.resolve();
    return document.fonts.ready;
  }

  // Enhanced initialization with imagesLoaded
  window.addEventListener("load", async function() {
    console.log('Load event fired, waiting for assets...');
    
    try {
      await Promise.all([
        waitForImages(),
        waitForFonts()
      ]);
      console.log('Assets loaded, initializing...');
    } catch (error) {
      console.warn('Asset loading failed, proceeding anyway:', error);
    }
    
    // Small delay to ensure layout is stable
    setTimeout(() => {
      init();
    }, 50);
  });
}

// Only initialize if we're on the correct page
if (document.body.classList.contains("ux_home_v2_no_flip")) {
  ux_home_v2_no_flip();
}

export default ux_home_v2_no_flip;