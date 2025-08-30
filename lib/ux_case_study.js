/** UX Case Study js 
 * resizing works.
 * 
 * text change to deploy again.
*/

import '../src/styles/style.css';

// Register ALL plugins in one place to avoid conflicts
// Make sure these are registered before importing other modules
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  // gsap.registerPlugin(GSDevTools);
  gsap.registerPlugin(SplitText);
  console.log("GSAP plugins registered", ScrollTrigger);
}

import sj_menu from './sj_menu.js';
let menuModule = null;

// import ux_footer from './ux_footer.js';
// let footerModule = null;

import imagesLoaded from 'imagesloaded';

console.log('ux_case_study.js is working');

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

// Create a global flag to track initialization
window.uxCaseStudyInitialized = false;

function ux_case_study() {
  // Stop if already initialized to prevent duplicates
  if (window.uxCaseStudyInitialized) {
    console.log('Case study already initialized, skipping');
    return;
  }

  // Store animations and SplitText instances
  let animations = {};
  let splitInstances = [];
  
  // Store original text content
  let originalContent = {};

  // Main initialization function
  function init() {
    console.log('ux_case_study.js init works');
    
    // Initialize menu first to ensure it's always available
    if (!menuModule) {
      menuModule = sj_menu();
      console.log("Menu initialized from case study page");
    }
    
    // Initialize footer module if not already
    // if (!footerModule) {
    //   footerModule = ux_footer();
    //   console.log("Footer initialized from case study page");
    // }
    
    // First, wait for all images to load before initializing animations
    imagesLoaded(document.body, function() {
      console.log("All images loaded, initializing case study animations");
      
      // Set global flag to prevent reinitializing
      window.uxCaseStudyInitialized = true;
      
      // Refresh footer if available
      // if (footerModule && typeof footerModule.refresh === 'function') {
      //   footerModule.refresh();
      // }
      
      // Initialize animation only if not already done
      if (!animations.banner) {
        cs_intro_anim();
      }
      
      // Refresh ScrollTrigger to ensure proper positioning
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    });
  }

  // Logo to Nav animation
  function cs_intro_anim() {
    console.log("Initializing intro animation");
    
    // Initial visibility
    let tl_ux_case_study = gsap.from("html", { duration: 0, autoAlpha: 0});
    tl_ux_case_study.play();
  
    // Create a main timeline for all animations
    let tl_banner_image = gsap.timeline();
    animations.banner = tl_banner_image;
    
    // Get all elements we need
    let ux_cs_banner_image_wrapper = document.querySelector(".ux_cs_banner_image_wrapper");
    let ux_cs_banner_image = document.querySelector(".ux_cs_banner_image");
    let ux_cs_banner = document.querySelector("#ux_cs_banner");
    let ux_cs_banner_text_header = document.querySelector(".ux_cs_banner_text_header");
    let ux_cs_banner_text_trail = document.querySelectorAll(".ux_cs_banner_text_trail");
    let ux_cs_banner_text_subheader = document.querySelector(".ux_cs_banner_text_subheader");
    
    // Check if elements exist before proceeding
    if (!ux_cs_banner_image_wrapper || !ux_cs_banner_image || !ux_cs_banner || 
        !ux_cs_banner_text_header || !ux_cs_banner_text_subheader) {
      console.warn("Required elements for animation not found, aborting");
      return;
    }
    
    // Store original content for reset
    originalContent.header = ux_cs_banner_text_header ? ux_cs_banner_text_header.innerHTML : '';
    originalContent.subheader = ux_cs_banner_text_subheader ? ux_cs_banner_text_subheader.innerHTML : '';
    originalContent.trail = [];
    ux_cs_banner_text_trail.forEach((trail, i) => {
      originalContent.trail[i] = trail.innerHTML;
    });
    
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
    
    // Create SplitText instances
    let splitLines_header = new SplitText(ux_cs_banner_text_header, {
      type: "lines", 
      linesClass: "split-line",
      lineThreshold: 0.5
    });
    let headerLines = splitLines_header.lines;
    
    let splitLines_subheader = new SplitText(ux_cs_banner_text_subheader, {
      type: "lines", 
      linesClass: "split-line",
      lineThreshold: 0.5
    });
    let subheaderLines = splitLines_subheader.lines;
    
    let splitLines_trail = [];
    let trailLines = [];
    
    ux_cs_banner_text_trail.forEach(trail => {
      let split = new SplitText(trail, {
        type: "lines", 
        linesClass: "split-line",
        lineThreshold: 0.5
      });
      splitLines_trail.push(split);
      trailLines.push(...split.lines);
    });
    
    // Store all SplitText instances for cleanup
    splitInstances = [
      splitLines_header,
      splitLines_subheader,
      ...splitLines_trail
    ];
    
    // Wrap all lines in container divs with overflow:hidden
    function wrapLines(lines) {
      lines.forEach(line => {
        // Create wrapper div
        const wrapper = document.createElement('div');
        wrapper.className = 'split-line-container';
        wrapper.style.overflow = 'hidden';
        
        // Insert wrapper before the line
        line.parentNode.insertBefore(wrapper, line);
        
        // Move line into wrapper
        wrapper.appendChild(line);
      });
    }
    
    // Apply wrappers to all text elements
    wrapLines(headerLines);
    wrapLines(subheaderLines);
    wrapLines(trailLines);
    
    // Set initial position for text elements
    gsap.set(headerLines, {
      y: -110
    });
    
    gsap.set(subheaderLines, {
      y: 110
    });
    
    gsap.set(trailLines, {
      y: 110
    });
  
    gsap.set(ux_cs_banner, {
      // scale: 0.9, 
      // transformOrigin: "50% 50%"
    });
    
    gsap.set(ux_cs_banner_image_wrapper, {
      rotation: 0.1
    });
  
    // Build the animation timeline
    tl_banner_image
    .fromTo(ux_cs_banner_image, {
      scale: 2
    }, {
      scale: 1,
      duration: 1
    })
    .to(ux_cs_banner_image_wrapper, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", 
      ease: "sine.out", 
      duration: 1.2, 
      scale: 1.05
    }, 0)
    // Start scaling the image wrapper back to 1
    .to(ux_cs_banner_image_wrapper, {
      scale: 1, 
      duration: 2,
      ease: "sine.out"
    }, "<1") // Start earlier at 1.2s instead of 1.6s
    // Animate header lines
    .to(headerLines, {
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "sine.out"
    }, "-=2.4") 
    // Animate trail lines
    .to(trailLines, {
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "sine.out"
    }, "<0.2") // Start slightly after header lines
    // Animate subheader lines
    .to(subheaderLines, {
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "sine.out"
    }, "<0.2"); // Same timing as trail lines
    
    return splitInstances;
  }
  
  // Advanced cleanup function based on the card stack example
  function cleanupSplitText() {
    console.log("Cleaning up SplitText instances");
    
    // First revert all SplitText instances
    splitInstances.forEach(instance => {
      if (instance && typeof instance.revert === 'function') {
        try {
          instance.revert();
        } catch (e) {
          console.warn("Error reverting SplitText:", e);
        }
      }
    });
    
    // Clear the instances array
    splitInstances = [];
    
    // Find and remove all split-line-container elements
    const wrappers = document.querySelectorAll('.split-line-container');
    wrappers.forEach(wrapper => {
      try {
        // Move children back to parent before removing wrapper
        while (wrapper.firstChild) {
          wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
        }
        // Remove the wrapper
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
        }
      } catch (e) {
        console.warn("Error removing wrapper:", e);
      }
    });
    
    // Find and remove any remaining split lines
    const lines = document.querySelectorAll('.split-line');
    lines.forEach(line => {
      try {
        // Move children back to parent before removing line
        while (line.firstChild) {
          line.parentNode.insertBefore(line.firstChild, line);
        }
        // Remove the line
        if (line.parentNode) {
          line.parentNode.removeChild(line);
        }
      } catch (e) {
        console.warn("Error removing line:", e);
      }
    });
    
    // Restore original content to text elements
    const header = document.querySelector(".ux_cs_banner_text_header");
    const subheader = document.querySelector(".ux_cs_banner_text_subheader");
    const trails = document.querySelectorAll(".ux_cs_banner_text_trail");
    
    if (header && originalContent.header) {
      header.innerHTML = originalContent.header;
    }
    
    if (subheader && originalContent.subheader) {
      subheader.innerHTML = originalContent.subheader;
    }
    
    trails.forEach((trail, i) => {
      if (trail && originalContent.trail[i]) {
        trail.innerHTML = originalContent.trail[i];
      }
    });
  }

  // Improved killAll function with proper cleanup
  function killAll() {
    console.log("Killing all animations and SplitText instances");
    
    // Prevent reinitializing immediately
    const tempFlag = window.uxCaseStudyInitialized;
    
    // Kill all GSAP animations targeting specific elements
    const animatedElements = [
      ".ux_cs_banner_text_header", 
      ".ux_cs_banner_text_subheader", 
      ".ux_cs_banner_text_trail",
      ".ux_cs_banner_image_wrapper", 
      ".ux_cs_banner_image",
      ".split-line",
      ".split-line-container"
    ];
    
    animatedElements.forEach(selector => {
      gsap.killTweensOf(selector);
    });
    
    // Kill banner timeline if it exists
    if (animations.banner) {
      animations.banner.kill();
      animations.banner.clear();
      animations.banner = null;
    }
    
    // Kill GSDevTools if they exist
    // if (animations.devTools) {
    //   animations.devTools.kill();
    //   animations.devTools = null;
    // }
    
    // Clean up SplitText
    cleanupSplitText();
    
    // Only kill ScrollTrigger instances related to case study
    ScrollTrigger.getAll().forEach(trigger => {
      // Explicitly check for the footer ID to avoid killing it
      if (trigger.vars && trigger.vars.id !== "ux_footer") {
        trigger.kill();
      }
    });
    
    // Clear properties on affected elements
    gsap.set(animatedElements, {
      clearProps: "all"
    });
    
    // Restore initialization flag
    window.uxCaseStudyInitialized = tempFlag;
    
    // Reinitialize after a short delay
    setTimeout(() => {
      init();
    }, 300);
  }

  // Debounce function for resize events
  function debounce(func) {
    var timer;
    return function(event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, 300, event);
    };
  }

  // Add resize event listener with debounce
  window.addEventListener("resize", debounce(function(e) {
    console.log("End of resizing - reinitializing animations");
    killAll();
  }));
  
  // Run the init function
  init();
  
  // Return public methods
  return {
    init: init,
    killAll: killAll,
    reinitialize: function() {
      window.uxCaseStudyInitialized = false;
      killAll();
    }
  };
}

// Initialize for case study page and make it available globally
window.uxCaseStudyModule = null;

// Only initialize if we're on the correct page
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    if (document.body.classList.contains("ux_case_study")) {
      window.uxCaseStudyModule = ux_case_study();
    }
  });
} else {
  // DOM already loaded
  if (document.body.classList.contains("ux_case_study")) {
    window.uxCaseStudyModule = ux_case_study();
  }
}

export default ux_case_study;