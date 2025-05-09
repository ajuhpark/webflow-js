/** UX Home js */

import '../src/styles/style.css';

// Register ALL plugins in one place to avoid conflicts
// Make sure these are registered before importing other modules
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(GSDevTools);
  gsap.registerPlugin(SplitText);
  console.log("GSAP plugins registered", ScrollTrigger);
}

// Import the card stack module but don't execute it yet
import ux_card_stack_module from './ux_card_stack';

import sj_menu from './sj_menu.js';
sj_menu();

import ux_footer from './ux_footer.js';
ux_footer();

// import imagesLoaded from 'imagesloaded';

console.log('ux_home.js is working');

// Store all animations and their controllers
let animations = {
  cardStack: null,
  scrollTriggers: {
    logoToNav: null,
  }
};

// Page scroll resets on refresh (vanilla JS version)
window.addEventListener('beforeunload', () => {
  document.body.style.display = "none";
  window.scrollTo(0, 0);
});

// make the mobile size stay the same
ScrollTrigger.normalizeScroll(true);
ScrollTrigger.config({
  ignoreMobileResize: true,
});

function ux_home() {
  // Main initialization function
  function init() {
    console.log('ux_home.js init works');
    


    // Initial visibility
    let tl_ux_home = gsap.from("html", { duration: 0, autoAlpha: 0});
    tl_ux_home.play();

    // Initialize logo animation first
    initLogoToNavAnimation();
    bannerSubheaderAnimation()
    home_cs_text_anim()
    intro_anim()

    // Initialize card stack after logo animation
    // Using a small delay to ensure proper sequence
    setTimeout(() => {
      if (typeof ux_card_stack_module === 'function') {
        if (animations.cardStack) {
          // If card stack controller already exists, use its init method
          if (typeof animations.cardStack.init === 'function') {
            animations.cardStack.init();
          }
        } else {
          // Otherwise create a new controller
          animations.cardStack = ux_card_stack_module();
        }
        console.log("Card stack initialized");
      }
    }, 50);
  }

  function intro_anim(){
    
    let ux_banner_name = document.querySelectorAll(".sj_banner_1_header_text.line_1")
    // vars for animation for name and cs title
    let ux_split_name = new SplitText(ux_banner_name, { type: 'words,chars' })
    let sj_banner_1_subheader_text = document.querySelectorAll(".sj_banner_1_subheader_text");
    // let ux_split_banner_subheader_text = new SplitText(sj_banner_1_subheader_text, { type: 'words'})
    let sj_banner_1_header_link = document.querySelector(".sj_banner_1_header_link")
    let sj_menu_nav_container = document.querySelector(".sj_menu_nav_container")

    // gsap
    // .set(sj_banner_1_subheader_text, {
    //   yPercent: 110,
    // })


    // Create timeline
    let tl_ux_home_intro_anim = gsap.timeline();
    
    tl_ux_home_intro_anim
    .set(sj_banner_1_subheader_text, {
      yPercent: 110,
      opacity: 0
    })
    .from(
      ux_split_name.chars,
      {
        yPercent: 120,
        stagger: 0.08,
        ease: 'power1.in',
      }, "<"
    )
    .from(
      // ux_split_banner_subheader_text.words, {
      sj_banner_1_subheader_text, {
        opacity: 100,
        yPercent: 110,
        stagger: 0.1,
        ease: 'power1.in',
      }, "-=0.4"
    )
    .from(
      sj_menu_nav_container, {
        // yPercent: 110,
        opacity: 0,
        ease: 'power1.in',
      }, "-=0.1"
    )

    // // Create GSDevTools
    // let devTools = GSDevTools.create({
    //   animation: tl_ux_home_intro_anim,
    //   id: "ux_home_intro_anim",

    // });
    // animations.devTools = devTools;


  }

  // Logo to Nav animation
  // Updated Logo to Nav animation with proper reset
  function initLogoToNavAnimation() {
    console.log("Initializing Logo To Nav Animation");
    
    // Kill existing animation first
    if (animations.scrollTriggers.logoToNav) {
      animations.scrollTriggers.logoToNav.kill();
      animations.scrollTriggers.logoToNav = null;
    }

    // Get elements
    let sj_grid_container = document.querySelector(".sj_grid_container.banner_1");
    let headerText = document.querySelectorAll(".sj_banner_1_header_text");
    let headerTextWrapper = document.querySelector(".sj_banner_1_header_text_wrapper");
    let sj_banner_1_header_text_group_container = document.querySelector(".sj_banner_1_header_text_group_container");
    let ux_home_banner = document.querySelector("#ux_home_banner");

    // Check if all required elements exist
    if (!sj_grid_container || !headerText.length || !headerTextWrapper || 
        !sj_banner_1_header_text_group_container || !ux_home_banner) {
      console.warn("Missing elements for logo animation:", {
        container: !!sj_grid_container,
        headerText: headerText.length,
        wrapper: !!headerTextWrapper,
        textGroupContainer: !!sj_banner_1_header_text_group_container,
        banner: !!ux_home_banner
      });
      return;
    }

    // Store original properties for reset
    const originalProps = {
      headerText: {
        fontSize: window.getComputedStyle(headerText[0]).fontSize,
        lineHeight: window.getComputedStyle(headerText[0]).lineHeight,
        letterSpacing: window.getComputedStyle(headerText[0]).letterSpacing
      },
      headerTextGroupContainer: {
        height: window.getComputedStyle(sj_banner_1_header_text_group_container).height,
        display: window.getComputedStyle(sj_banner_1_header_text_group_container).display,
        flexDirection: window.getComputedStyle(sj_banner_1_header_text_group_container).flexDirection,
        justifyContent: window.getComputedStyle(sj_banner_1_header_text_group_container).justifyContent
      },
      headerTextWrapper: {
        height: window.getComputedStyle(headerTextWrapper).height,
        paddingBottom: window.getComputedStyle(headerTextWrapper).paddingBottom
      }
    };
    
    // Reset elements to their initial state
    gsap.set(headerText, { clearProps: "all" });
    gsap.set(sj_banner_1_header_text_group_container, { clearProps: "all" });
    gsap.set(headerTextWrapper, { clearProps: "all" });
    
    // Create a main timeline for all animations
    let tl_logoToNav = gsap.timeline();
    
    // Create a responsive fontSize based on viewport width
    tl_logoToNav.to(headerText, {
      fontSize: "clamp(16px, 2vw, 16px)", // Responsive font size
      lineHeight: "auto",
      letterSpacing: "0px",
      ease: "none"
    }, 0);
    
    // Make container flex and centered
    tl_logoToNav.to(sj_banner_1_header_text_group_container, {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      ease: "none"
    }, 0);
    
    // Make wrapper auto height
    tl_logoToNav.to(headerTextWrapper, {
      height: "auto", // Using auto instead of fixed pixel value
      paddingBottom: 0,
      ease: "none"
    }, 0);
    
    // Create ScrollTrigger with proper reset callbacks
    animations.scrollTriggers.logoToNav = ScrollTrigger.create({
      id: "logoToNavAnimation",
      trigger: ux_home_banner,
      start: "70% 0%",
      end: "bottom 0%",
      animation: tl_logoToNav,
      scrub: true,
      markers: false,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      ease: "none",
      onEnter: () => {
        console.log("Entering logo animation");
      },
      onLeaveBack: () => {
        console.log("Leaving logo animation backward");
        // Reset when scrolling back up past the starting point
        gsap.set(headerText, {
          fontSize: originalProps.headerText.fontSize,
          lineHeight: originalProps.headerText.lineHeight,
          letterSpacing: originalProps.headerText.letterSpacing
        });
        gsap.set(sj_banner_1_header_text_group_container, {
          height: originalProps.headerTextGroupContainer.height,
          display: originalProps.headerTextGroupContainer.display,
          flexDirection: originalProps.headerTextGroupContainer.flexDirection,
          justifyContent: originalProps.headerTextGroupContainer.justifyContent
        });
        gsap.set(headerTextWrapper, {
          height: originalProps.headerTextWrapper.height,
          paddingBottom: originalProps.headerTextWrapper.paddingBottom
        });
      }
    });
    
    console.log("Logo to Nav animation initialized");
  }



  // Updated bannerSubheaderAnimation function with proper reset handling
  function bannerSubheaderAnimation() {
    // Kill existing animation first
    if (animations.scrollTriggers.bannerSubheaderText) {
      animations.scrollTriggers.bannerSubheaderText.kill();
      animations.scrollTriggers.bannerSubheaderText = null;
    }

    // Get elements
    let sj_banner_1_subheader_text = document.querySelectorAll(".sj_banner_1_subheader_text");
    let ux_home_banner = document.querySelector("#ux_home_banner");

    // Check if elements exist
    if (!sj_banner_1_subheader_text.length || !ux_home_banner) {
      console.warn("Missing elements for banner subheader animation:", {
        subheaderText: sj_banner_1_subheader_text.length,
        banner: !!ux_home_banner
      });
      return;
    }

    console.log("Found subheader elements:", sj_banner_1_subheader_text.length);
    
    // IMPORTANT: Reset elements to their initial state
    gsap.set(sj_banner_1_subheader_text, {
      yPercent: 0,
      clearProps: "transform" // This ensures we start fresh
    });
    
    // Create a main timeline for animation
    let tl_bannerSubheaderText = gsap.timeline();
    
    // Add animation to timeline
    tl_bannerSubheaderText.to(sj_banner_1_subheader_text, {
      yPercent: -110,
      ease: "power1.in"
    });

    // Create ScrollTrigger with proper reset logic
    animations.scrollTriggers.bannerSubheaderText = ScrollTrigger.create({
      id: "bannerSubheaderTextAnimation",
      trigger: ux_home_banner,
      start: "20% 0%",
      end: "50% 0%",
      animation: tl_bannerSubheaderText,
      scrub: 0.5,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      onEnter: () => {
        console.log("Entering banner subheader animation");
      },
      onLeaveBack: () => {
        console.log("Leaving banner subheader animation backward");
        // Reset when scrolling back up past the starting point
        gsap.set(sj_banner_1_subheader_text, {
          yPercent: 0,
          clearProps: "transform"
        });
      }
    });
    
    console.log("Banner subheader animation initialized");
  }

  function home_cs_text_anim(){
    let case_studies_text = document.querySelector("#case_studies_text");
    let cs_text_grid = document.querySelector("#cs_text_grid")
    let ux_homepage_last_cs = document.querySelector("#ux_homepage_last_cs")

    // Create a main timeline for all animations
    let tl_cs_text_anim = gsap.timeline();
    
    gsap.set(case_studies_text, {
      y: 110
    })
    
    tl_cs_text_anim.fromTo(case_studies_text, {
      y: 110,
      ease: "power1.in"
    }, {
      y: 0,
      ease: "power1.out"
    })
    // Using GSAP fromTo tween
    .fromTo(cs_text_grid, 
    {
      // height: "100vh"  // Starting value
    },
    {
      // height: "200vh",  // Ending value
      // duration: 1.5,    // Animation duration in seconds
      // ease: "power2.inOut",  // Easing function
      // onComplete: () => console.log("Animation completed")
    }, "<")
    

    // First scrolltrigger to enter the text
    animations.scrollTriggers.cs_text_anim_st = ScrollTrigger.create({
      id: "cs_text_anim",
      trigger: cs_text_grid,
      start: "0% 100%",
      end: "100% 0%",
      animation: tl_cs_text_anim,
      scrub: true,
      // markers: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      ease: "power1.in",
    });

    // Second scrolltrigger to exit the text
    let tl_cs_text_anim_exit = gsap.timeline();

    tl_cs_text_anim_exit.fromTo(case_studies_text, {
      y: 0,
      ease: "power1.in"
    }, {
      y: -110,
      ease: "power1.out"
    })

    animations.scrollTriggers.cs_text_anim_exit_st = ScrollTrigger.create({
      id: "cs_text_anim_exit",
      trigger: ux_homepage_last_cs,
      start: "100% 100%",
      end: "100% 0%",
      animation: tl_cs_text_anim_exit,
      scrub: true,
      // markers: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      ease: "power1.in",
    });
    
    console.log("cs text animation initialized");
  }

  // Kill and reset all animations and properties
  function killAll() {
    console.log("Killing all ux_home animations and resetting properties");
    
    // First kill card stack animations if they exist to avoid conflicts
    if (animations.cardStack && typeof animations.cardStack.killAll === 'function') {
      animations.cardStack.killAll();
    }
    
    // Kill all ScrollTrigger instances from this module
    Object.values(animations.scrollTriggers).forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill();
        console.log(`Killed ScrollTrigger: ${trigger.vars?.id || 'unnamed'}`);
      }
    });
    
    // Reset animations.scrollTriggers object
    for (let key in animations.scrollTriggers) {
      animations.scrollTriggers[key] = null;
    }
    
    // Clear all properties from animated elements - expanded list
    const elementsToReset = [
      ".sj_banner_1_header_text_wrapper",
      ".sj_banner_1_header_text",
      ".sj_banner_1_header_text_group_container",
      ".sj_banner_1_subheader_text", // Add subheader text
      ".sj_grid_container.banner_1"  // Add grid container
    ];
    
    elementsToReset.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length) {
        gsap.set(elements, { clearProps: "all" });
        console.log(`Reset properties for ${elements.length} ${selector} elements`);
      }
    });
    
    // Clear any in-progress GSAP animations for card elements
    gsap.killTweensOf(".sc_1_card");
    gsap.killTweensOf(".sc_1_card_container");
    gsap.killTweensOf(".sc_1_card_text_header .line");
    gsap.killTweensOf(".sc_1_card_text_subheader .line");
    gsap.killTweensOf(".sj_banner_1_subheader_text"); // Add this
    
    // Dispatch event to notify other modules
    window.dispatchEvent(new CustomEvent('sj_animation_reset', {
      detail: { source: 'ux_home' }
    }));
  }

  // Reinitialize all animations with proper sequence
  function reinitialize() {
    // First kill everything
    killAll();
    
    // Then reinitialize with a delay to ensure DOM updates
    setTimeout(() => {
      // Make sure scroll position is reset for consistent animation
      // This prevents issues with animations starting from wrong positions
      const currentScroll = window.scrollY;
      if (currentScroll > 0) {
        // Store scroll position
        const tempScroll = currentScroll;
        
        // Scroll to top momentarily
        window.scrollTo(0, 0);
        
        // Reinitialize everything
        init();
        
        // Force a refresh of ScrollTrigger
        ScrollTrigger.refresh(true); // true = deep refresh
        
        // Return to previous scroll position if needed
        // Uncomment if you want to maintain scroll position after refresh
        // window.scrollTo(0, tempScroll);
      } else {
        // If already at top, just reinitialize
        init();
        
        // Force a refresh of ScrollTrigger
        ScrollTrigger.refresh(true); // true = deep refresh
      }
      
      console.log("All animations reinitialized");
    }, 150); // Slightly longer delay to ensure DOM is ready
  }

  // Debounce function for resize events
  function debounce(func) {
    var timer;
    return function(event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        console.log("Debounced resize complete in ux_home");
        func(event);
      }, 300);
    };
  }

  // Debounced resize handler
  const debouncedResize = debounce(function(e) {
    console.log("Window resize detected in ux_home - reinitializing animations");
    reinitialize();
  });

  // Event listeners
  function setupEventListeners() {
    // Listen for window resize with debounce
    window.addEventListener("resize", debouncedResize);

    // Listen for animation reset events
    window.addEventListener('sj_animation_reset', function(e) {
      // Check if this event was triggered by this module to avoid loops
      if (e.detail && e.detail.source === 'ux_home') {
        return;
      }
      
      console.log("Animation reset event received in ux_home");
      // Just refresh ScrollTrigger instead of full reinitialization
      // to avoid potential loops
      ScrollTrigger.refresh(true);
    });
    
    // Add an orientation change listener specifically for mobile
    window.addEventListener("orientationchange", function() {
      console.log("Orientation change detected");
      
      // Need a longer timeout for orientation changes
      setTimeout(() => {
        reinitialize();
      }, 500);
    });
  }

  // Initialization on load with imagesLoaded
  function initOnLoad() {
    // Use imagesLoaded to ensure all images are loaded before initializing
    // imagesLoaded(document.body, function() {
    //   console.log("All images loaded, initializing animations");
    // });

    // Reset scroll position to top to ensure consistent animations
    window.scrollTo(0, 0);

    init();
    
    // Force a refresh of ScrollTrigger
    setTimeout(() => {
      ScrollTrigger.refresh(true);
      console.log("ScrollTrigger refreshed");
    }, 100);
  }

  // Set up everything
  setupEventListeners();
  
  // Initialize on load
  if (document.readyState === 'complete') {
    initOnLoad();
  } else {
    window.addEventListener("load", initOnLoad);
  }
  
  // Return controls for external use if needed
  return {
    init,
    killAll,
    reinitialize
  };
}

// Only initialize if we're on the correct page
if (document.body.classList.contains("ux_home")) {
  ux_home();
}

export default ux_home;