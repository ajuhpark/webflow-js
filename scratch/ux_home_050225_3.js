/** UX Home js */

import '../src/styles/style.css';

// Register ALL plugins in one place to avoid conflicts
// Make sure these are registered before importing other modules
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(GSDevTools);
  gsap.registerPlugin(SplitText); // Added missing SplitText registration
  console.log("GSAP plugins registered", ScrollTrigger);
}

// Import the card stack module but don't execute it yet
import ux_card_stack_module from './ux_card_stack';

import imagesLoaded from 'imagesloaded';

console.log('ux_home.js is working');

// Store all animations and their controllers
let animations = {
  cardStack: null,
  scrollTriggers: {
    logoToNav: null
  }
};

// Page scroll resets on refresh (vanilla JS version)
window.addEventListener('beforeunload', () => {
  document.body.style.display = "none";
  window.scrollTo(0, 0);
});

function ux_home() {
  // Main initialization function
  function init() {
    console.log('ux_home.js init works');
    
    // Initialize logo animation
    initLogoToNavAnimation();
    
    // Initialize card stack and store its controller functions
    if (typeof ux_card_stack_module === 'function') {
      animations.cardStack = ux_card_stack_module();
    }
  }

  // Logo to Nav animation
  function initLogoToNavAnimation() {
    console.log("Initializing Logo To Nav Animation");
    
    // Kill existing animation first
    if (animations.scrollTriggers.logoToNav) {
      animations.scrollTriggers.logoToNav.kill();
    }
    
    // Initial visibility
    let tl_ux_home = gsap.from("html", { duration: 0, autoAlpha: 0});
    tl_ux_home.play();

    // Get elements
    let sj_grid_container = document.querySelector(".sj_grid_container.banner_1");
    let headerText = document.querySelectorAll(".sj_banner_1_header_text");
    let headerTextWrapper = document.querySelector(".sj_banner_1_header_text_wrapper");
    let sj_banner_1_header_text_group_container = document.querySelector(".sj_banner_1_header_text_group_container");
    let ux_home_banner = document.querySelector("#ux_home_banner");

    // Check if all required elements exist
    if (!sj_grid_container || !headerText.length || !headerTextWrapper || 
        !sj_banner_1_header_text_group_container || !ux_home_banner) {
      console.log("Missing elements for logo animation:", {
        container: !!sj_grid_container,
        headerText: headerText.length,
        wrapper: !!headerTextWrapper,
        textGroupContainer: !!sj_banner_1_header_text_group_container,
        banner: !!ux_home_banner
      });
      return;
    }
    
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
    
    // Create ScrollTrigger
    animations.scrollTriggers.logoToNav = ScrollTrigger.create({
      id: "logoToNavAnimation",
      trigger: ux_home_banner,
      start: "top 0%",
      end: "bottom 0%",
      animation: tl_logoToNav,
      scrub: 0.5, // Fixed: changed from string "true" to number
      markers: false, // Set to true for debugging
      invalidateOnRefresh: true, // Re-calculate on window resize
      fastScrollEnd: true,
      ease: "none"
    });
    
    console.log("Logo to Nav animation initialized");
  }

  // Kill and reset all animations and properties
  function killAll() {
    console.log("Killing all ux_home animations and resetting properties");
    
    // Kill all ScrollTrigger instances from this module
    Object.values(animations.scrollTriggers).forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill();
      }
    });
    
    // Clear all properties from animated elements
    const elementsToReset = [
      ".sj_banner_1_header_text_wrapper",
      ".sj_banner_1_header_text",
      ".sj_banner_1_header_text_group_container"
    ];
    
    elementsToReset.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length) {
        gsap.set(elements, { clearProps: "all" });
        console.log(`Reset properties for ${elements.length} ${selector} elements`);
      }
    });
    
    // Also kill card stack animations if they exist
    if (animations.cardStack && typeof animations.cardStack.killAll === 'function') {
      animations.cardStack.killAll();
    }
    
    // Dispatch event to notify other modules
    window.dispatchEvent(new CustomEvent('sj_animation_reset'));
    
    // Re-initialize with a slight delay to ensure DOM is ready
    setTimeout(() => {
      init();
      
      // Force a refresh of ScrollTrigger
      ScrollTrigger.refresh();
    }, 100);
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
    killAll();
  });

  // Event listeners
  function setupEventListeners() {
    // Listen for window resize with debounce
    window.addEventListener("resize", debouncedResize);

    // Listen for animation reset events
    window.addEventListener('sj_animation_reset', function() {
      console.log("Animation reset event received in ux_home");
      // No need to call killAll here as it would create a loop
      // Just refresh ScrollTrigger
      ScrollTrigger.refresh();
    });
  }

  // Initialization on load with imagesLoaded
  function initOnLoad() {
    // Use imagesLoaded to ensure all images are loaded before initializing
    imagesLoaded(document.body, function() {
      console.log("All images loaded, initializing animations");
      init();
      
      // Force a refresh of ScrollTrigger
      setTimeout(() => {
        ScrollTrigger.refresh();
        console.log("ScrollTrigger refreshed");
      }, 100);
    });
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
    killAll
  };
}

// Only initialize if we're on the correct page
if (document.body.classList.contains("ux_home")) {
  ux_home();
}

export default ux_home;