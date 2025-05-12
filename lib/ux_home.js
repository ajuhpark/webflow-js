/** UX Home js */

import '../src/styles/style.css';

// Register ALL plugins in one place to avoid conflicts
// Make sure these are registered before importing other modules
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(GSDevTools);
  gsap.registerPlugin(SplitText);
  gsap.registerPlugin(ScrollSmoother);
  console.log("GSAP plugins registered", ScrollTrigger);
}

// Import the card stack module but don't execute it yet
import ux_card_stack_module from './ux_card_stack';

import sj_menu from './sj_menu.js';
sj_menu();

import ux_footer from './ux_footer.js';
const footerModule = ux_footer(); // Store the exported object but don't initialize yet

import imagesLoaded from 'imagesloaded';

console.log('ux_home.js is working');

// Store all animations and their controllers
let animations = {
  cardStack: null,
  scrollTriggers: {
    logoToNav: null,
    bannerSubheaderText: null,
    banner_marquee_arrow: null,
    banner_marquee_arrow_pt2:null,
    cs_text_anim_st: null,
    cs_text_anim_exit_st: null,
    ux_cs_marquee_arrow: null,
    ux_cs_marquee_arrow_exit: null

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


// Add a flag to track if intro animation has already run
let introAnimationHasRun = false;


function ux_home() {
  // Main initialization function
  function init() {
    console.log('ux_home.js init works');

    // CRITICAL: Use imagesLoaded to wait for all images to load before initializing animations
    imagesLoaded(document.body, function() {
      console.log("All images loaded, initializing home animations");
      
      // Initial visibility
      let tl_ux_home = gsap.from("html", { duration: 0, autoAlpha: 0});
      tl_ux_home.play();

      // Initialize logo animation first
      marquee_arrow()
      initLogoToNavAnimation();
      bannerSubheaderAnimation();
      home_cs_text_anim();

      // MANUAL REFRESH after all animations are set up
      // This is where you control when refresh happens, not leaving it to automatic triggers
      ScrollTrigger.refresh();
      
      // Only run intro animation if it hasn't run yet
      if (!introAnimationHasRun) {
        intro_anim();
        introAnimationHasRun = true; // Set flag to true after running
        console.log("Intro animation run for the first time");
      } else {
        console.log("Skipping intro animation on reinitialize");
      }


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
        
        // Initialize footer AFTER all other animations are complete
        if (footerModule && typeof footerModule.refresh === 'function') {
          setTimeout(() => {
            footerModule.refresh();
            console.log("Footer refreshed after all animations");
          }, 100);
        }
        
        // Final ScrollTrigger refresh
        setTimeout(() => {
          ScrollTrigger.refresh();
          console.log("All ScrollTriggers refreshed");
        }, 200);
      }, 100);
    });
  }

  // Handle orientation changes manually
  window.addEventListener("orientationchange", function() {
    console.log("Orientation change detected");
    
    // Since ignoreMobileResize is true, we need to manually refresh after orientation change
    setTimeout(() => {
      // This manual refresh is critical because ignoreMobileResize would prevent automatic refresh
      ScrollTrigger.refresh(true);
      console.log("Manually refreshed after orientation change");
    }, 500);
  });

  // Add a special method for troubleshooting position issues
  function forceRefreshScrollTriggers() {
    // This can be called from console for debugging
    console.log("Forcing manual refresh of all ScrollTriggers");
    
    // Force layout recalculation first
    document.body.offsetHeight;
    
    // Then do the refresh (overriding ignoreMobileResize setting for this specific call)
    ScrollTrigger.refresh(true);
    
    // Log the state of triggers for debugging
    Object.values(animations.scrollTriggers).forEach(trigger => {
      if (trigger && trigger.vars.trigger) {
        console.log(`${trigger.vars.id}: start=${trigger.start}, end=${trigger.end}`);
      }
    });
  }

  function intro_anim(){
    
    let ux_banner_name = document.querySelectorAll(".sj_banner_1_header_text.line_1")
    // vars for animation for name and cs title
    let ux_split_name = new SplitText(ux_banner_name, { type: 'words,chars' })
    let sj_banner_1_subheader_text = document.querySelectorAll(".sj_banner_1_subheader_text");
    // let ux_split_banner_subheader_text = new SplitText(sj_banner_1_subheader_text, { type: 'words'})
    let sj_banner_1_header_link = document.querySelector(".sj_banner_1_header_link")
    let sj_menu_nav_container = document.querySelector(".sj_menu_nav_container")
    let ux_home_banner_marquee_arrow = document.querySelector('#ux_home_banner_marquee_arrow');
 
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
    .set(sj_menu_nav_container, {
      opacity: 0,
      }, "<"
    )
    .set(ux_home_banner_marquee_arrow, {
      opacity: 0,
      }, "<"
    )
    .from(
      ux_split_name.chars,
      {
        yPercent: 130,
        stagger: 0.07,
        ease: 'power1.in',
      }, "<"
    )
    .from(
      // ux_split_banner_subheader_text.words, {
      sj_banner_1_subheader_text, {
        opacity: 100,
        yPercent: 110,
        stagger: 0.15,
        ease: 'power1.in',
      }, "-=0.4"
    )
    .to(
      sj_menu_nav_container, {
        // yPercent: 110,
        opacity: 100,
        ease: 'power1.in',
        duration: "4"
      }, "-=0.1"
    )
    .to(
      ux_home_banner_marquee_arrow, {
        // yPercent: 110,
        opacity: 100,
        ease: 'power1.in',
        duration: "4"
      }, "<"
    )

    // // Create GSDevTools
    // let devTools = GSDevTools.create({
    //   animation: tl_ux_home_intro_anim,
    //   id: "ux_home_intro_anim",

    // });
    // animations.devTools = devTools;


  }

  function marquee_arrow() {
  // Select all marquees instead of just the first one
  const marquees = document.querySelectorAll('.sj_banner_1_arrow_marquee');
  
  if (marquees.length === 0) {
    return;
  }
  
  // Loop through each marquee
  marquees.forEach(marquee => {
    const marqueeContent = marquee.firstChild;
    if (!marqueeContent) {
      return;
    }
    
    // Cloning the content
    const marqueeContentClone = marqueeContent.cloneNode(true);
    marquee.append(marqueeContentClone);
    
    let tween;
    
    const playMarquee = () => {
      // Let progress = if the tween exists, then we want tween.progress otherwise 0 for first time
      let progress = tween ? tween.progress() : 0;
      
      // For second time, if tween exists
      tween && tween.progress(0).kill();
      
      const height = parseInt(getComputedStyle(marqueeContent).getPropertyValue("height"), 10);
      const gap = parseInt(getComputedStyle(marqueeContent).getPropertyValue("row-gap"), 10);
      
      const distanceToTranslate = -1 * (gap + height);
      tween = gsap.fromTo(
        marquee.children,
        {y: 0}, 
        {y: -distanceToTranslate, 
          duration: 5, 
          ease: "none", 
          repeat: -1
        }
      );
      tween.progress(progress);
    };
    
    playMarquee();
    
    window.addEventListener('resize', () => playMarquee());
  });
  }
  // Logo to Nav animation
  // Updated Logo to Nav animation with proper reset
  function initLogoToNavAnimation() {
    // console.log("Initializing Logo To Nav Animation");
    
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
      fontSize: "clamp(16px, 16px, 16px)", // Responsive font size
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
      start: "50% 0%",
      end: "bottom 0%",
      animation: tl_logoToNav,
      scrub: 0,
      // markers: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      ease: "0.1",
      onEnter: () => {
        // console.log("Entering logo animation");
      },
      onLeaveBack: () => {
        // console.log("Leaving logo animation backward");
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
    
    // console.log("Logo to Nav animation initialized");
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
    let ux_home_banner_marquee_arrow = document.querySelector("#ux_home_banner_marquee_arrow")

    // Check if elements exist
    if (!sj_banner_1_subheader_text.length || !ux_home_banner) {
      console.warn("Missing elements for banner subheader animation:", {
        subheaderText: sj_banner_1_subheader_text.length,
        banner: !!ux_home_banner
      });
      return;
    }

    // console.log("Found subheader elements:", sj_banner_1_subheader_text.length);
    
    // IMPORTANT: Reset elements to their initial state
    gsap.set(sj_banner_1_subheader_text, {
      yPercent: 0,
      clearProps: "transform" // This ensures we start fresh
    })
    
    
    // Create a main timeline for animation
    let tl_bannerSubheaderText = gsap.timeline();
    
    // Add animation to timeline
    tl_bannerSubheaderText.to(sj_banner_1_subheader_text, {
      yPercent: -110,
      ease: "power1.in"
    })

    // Create ScrollTrigger with proper reset logic
    animations.scrollTriggers.bannerSubheaderText = ScrollTrigger.create({
      id: "bannerSubheaderTextAnimation",
      trigger: ux_home_banner,
      // start: "20% 0%",
      start: "17% 0%",
      // end: "50% 0%",
      end: "40% 0%",
      animation: tl_bannerSubheaderText,
      scrub: 0.5,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      onEnter: () => {
        // console.log("Entering banner subheader animation");
      },
      onLeaveBack: () => {
        // console.log("Leaving banner subheader animation backward");
        // Reset when scrolling back up past the starting point
        gsap.set(sj_banner_1_subheader_text, {
          yPercent: 0,
          clearProps: "transform"
        });
      }
    });
    


    let tl_banner_marquee_arrow = gsap.timeline()

    tl_banner_marquee_arrow.to(ux_home_banner_marquee_arrow, {
      opacity: '0'
    })

    animations.scrollTriggers.banner_marquee_arrow = ScrollTrigger.create({
      id: "banner_marquee_arrow_animation",
      trigger: ux_home_banner,
      // start: "20% 0%",
      start: "30% 0%",
      // end: "50% 0%",
      end: "40% 0%",
      // markers:true,
      animation: tl_banner_marquee_arrow,
      scrub: 0.5,
      invalidateOnRefresh: true,
      fastScrollEnd: true      
    });


    let tl_banner_marquee_arrow_pt2 = gsap.timeline()

    tl_banner_marquee_arrow_pt2.set(ux_home_banner_marquee_arrow, {
      opacity: '0'
    })

    animations.scrollTriggers.banner_marquee_arrow_pt2 = ScrollTrigger.create({
      id: "banner_marquee_arrow_animation pt2",
      trigger: ux_home_banner,
      // start: "20% 0%",
      start: "40% 0%",
      // end: "50% 0%",
      end: "100% 0%",
      // markers:true,
      animation: tl_banner_marquee_arrow_pt2,
      scrub: 0.5,
      invalidateOnRefresh: true,
      fastScrollEnd: true      
    });



    // console.log("Banner subheader animation initialized");
  }

  function home_cs_text_anim(){
    let case_studies_text = document.querySelector("#case_studies_text");
    let cs_text_grid = document.querySelector("#cs_text_grid")
    let ux_homepage_last_cs = document.querySelector("#ux_homepage_last_cs")
    let ux_cs_marquee_arrow = document.querySelector("#ux_cs_marquee_arrow")
    console.log("Arrow element:", ux_cs_marquee_arrow);

    let sj_spacer_after_cs_text = document.querySelector(".sj_spacer_after_cs_text")

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
    

    // ux_cs_marquee_arrow animation and scrolltrigger

    gsap.set(ux_cs_marquee_arrow, {
      opacity: 0
    })

    let tl_ux_cs_marquee_arrow = gsap.timeline()

    tl_ux_cs_marquee_arrow.to(ux_cs_marquee_arrow, {
      opacity: 1, 
      // duration:0.5
    })

    animations.scrollTriggers.ux_cs_marquee_arrow = ScrollTrigger.create({
      id: "ux_cs_marquee_arrow_animation",
      trigger: sj_spacer_after_cs_text,
      start: "0% 0%",
      end: "100% 0%",
      // markers:true,
      animation: tl_ux_cs_marquee_arrow,
      scrub: 0.5,
      invalidateOnRefresh: true,
      fastScrollEnd: true
    });

    // second scrolltrigger 

    let tl_ux_cs_marquee_arrow_exit = gsap.timeline()

    tl_ux_cs_marquee_arrow_exit.to(ux_cs_marquee_arrow, {
      opacity: 0, 
    })

    animations.scrollTriggers.ux_cs_marquee_arrow_exit = ScrollTrigger.create({
      id: "ux_cs_marquee_arrow_animation",
      trigger: ux_homepage_last_cs,
      start: "50% 0%",
      end: "70% 0%",
      animation: tl_ux_cs_marquee_arrow_exit,
      // markers: true,
      scrub: 0.5,
      invalidateOnRefresh: true,
      fastScrollEnd: true
    });

    // console.log("cs text animation initialized");
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
        window.scrollTo(0, tempScroll);
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
      
      // console.log("Animation reset event received in ux_home");
      // Just refresh ScrollTrigger instead of full reinitialization
      // to avoid potential loops
      ScrollTrigger.refresh(true);
    });
    
    // Add an orientation change listener specifically for mobile
    window.addEventListener("orientationchange", function() {
      // console.log("Orientation change detected");
      
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