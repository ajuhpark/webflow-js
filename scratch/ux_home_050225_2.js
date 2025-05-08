/** UX Home js */

import '../src/styles/style.css'

// Register ALL plugins
gsap.registerPlugin(ScrollTrigger);
console.log(ScrollTrigger)
gsap.registerPlugin(GSDevTools);
// gsap.registerPlugin(Flip);
// gsap.registerPlugin(ScrollSmoother);

import ux_card_stack from './ux_card_stack';
ux_card_stack();

import imagesLoaded from 'imagesloaded'; // Install with `npm install imagesloaded`

console.log('ux_home.js is working')

// letter by letter animation - https://codepen.io/ajuhpark/pen/oNVLmvg
gsap.registerPlugin(SplitText)
console.log(SplitText)

// Page scroll resets on refresh (using vanilla JS version is recommended)
window.addEventListener('beforeunload', () => {
  document.body.style.display = "none";
  window.scrollTo(0, 0);
});

// Store ScrollTrigger instances
let scrollTriggers = {
  logoToNav: null,
  // buttonAppear: null
};

function ux_home() {
  // Main initialization function
  function init() {
    console.log('ux_home.js init works');
    
    // Only initialize the animation once - all other calls will first kill existing animations
    initLogoToNavAnimation();
  }

  // Centralized animation initialization function
  function initLogoToNavAnimation() {
    console.log("Initializing Logo To Nav Animation");
    
    let tl_ux_home = gsap.from("html", { duration: 0, autoAlpha: 0});
    tl_ux_home.play();

    // Get elements
    let sj_grid_container = document.querySelector(".sj_grid_container.banner_1");
    let headerText = document.querySelectorAll(".sj_banner_1_header_text");
    let headerTextWrapper = document.querySelector(".sj_banner_1_header_text_wrapper");
    let sj_banner_1_header_text_group_container = document.querySelector(".sj_banner_1_header_text_group_container");
    let ux_home_banner = document.querySelector("#ux_home_banner");

    if (!sj_grid_container || !headerText.length || !headerTextWrapper || !sj_banner_1_header_text_group_container || !ux_home_banner) {
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
    // Instead of fixed values, we'll use a calculation
    tl_logoToNav.to(headerText, {
      fontSize: "clamp(16px, 2vw, 16px)", // Responsive font size
      // lineHeight: "1.2",
      // fontSize: "16px",
      lineHeight: "auto",
      letterSpacing: "0px",
      // ease: "power1.out",
      ease: "none"
    }, 0);
    
    // Make container flex and centered
    tl_logoToNav.to(sj_banner_1_header_text_group_container, {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      // ease: "power1.out",
      ease: "none"

    }, 0);
    
    // Make wrapper auto height
    tl_logoToNav.to(headerTextWrapper, {
      height: "auto", // Using auto instead of fixed pixel value
      paddingBottom: 0,
      // ease: "power1.out",
      ease: "none"

    }, 0);
    
    // Kill any existing ScrollTrigger before creating a new one
    if (scrollTriggers.logoToNav) {
      scrollTriggers.logoToNav.kill();
    }
    
    // Create ScrollTrigger
    scrollTriggers.logoToNav = ScrollTrigger.create({
      id: "logoToNavAnimation",
      trigger: ux_home_banner,
      start: "top 0%",
      end: "bottom 0%",
      animation: tl_logoToNav,
      scrub: 0.5, // Fixed: changed from string "true" to number
      markers: true,
      invalidateOnRefresh: true, // Re-calculate on window resize
      fastScrollEnd: true,
      ease: "none"

    });
    
    console.log("Logo to Nav animation initialized");
  }

  // Kill and reset all animations and properties
  function killAll() {
    // console.log("Killing all animations and resetting properties");
    
    // Kill all ScrollTrigger instances
    ScrollTrigger.getAll().forEach((trigger) => {
      // console.log("Killing trigger:", trigger.vars.id);
      trigger.kill();
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
    
    // Re-initialize with a slight delay to ensure DOM is ready
    setTimeout(() => {
      init();
    }, 100);
  }

  // Debounce function for resize events
  function debounce(func) {
    var timer;
    return function(event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        console.log("Debounced resize complete");
        func(event);
      }, 300);
    }
  }

  // Listen for window resize with debounce
  window.addEventListener("resize", debounce(function(e) {
    console.log("Window resize detected - reinitializing animations");
    killAll();
  }));

  // Listen for animation reset events
  window.addEventListener('sj_animation_reset', function() {
    console.log("Animation reset event received");
    killAll();
  });

  // Single initialization on load
  window.addEventListener("load", function() {
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
  });
}

// Only initialize if we're on the correct page
if (document.body.classList.contains("ux_home")) {
  ux_home();
}

export default ux_home;