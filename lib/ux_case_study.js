/** UX Case Study js */

import '../src/styles/style.css';

// Register ALL plugins in one place to avoid conflicts
// Make sure these are registered before importing other modules
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(GSDevTools);
  gsap.registerPlugin(SplitText);
  console.log("GSAP plugins registered", ScrollTrigger);
}

import sj_menu from './sj_menu.js';
sj_menu();

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

function ux_case_study() {
  // Main initialization function
  function init() {
    console.log('ux_case_study.js init works');
    
    // Initialize logo animation first
    cs_intro_anim();
    // bannerSubheaderAnimation()
    // Store SplitText instances for later cleanup
    window.splitTextInstances = cs_intro_anim();
  }

  // Logo to Nav animation
  function cs_intro_anim() {
    console.log("Initializing intro animation");
    
    // Initial visibility
    let tl_ux_case_study = gsap.from("html", { duration: 0, autoAlpha: 0});
    tl_ux_case_study.play();
  
    // Create a main timeline for all animations
    let tl_banner_image = gsap.timeline();
    
    let ux_cs_banner_image_wrapper = document.querySelector(".ux_cs_banner_image_wrapper");
    let ux_cs_banner_image = document.querySelector(".ux_cs_banner_image")
    let ux_cs_banner = document.querySelector("#ux_cs_banner")
    let ux_cs_banner_text_header = document.querySelector(".ux_cs_banner_text_header")
    let ux_cs_banner_text_trail = document.querySelectorAll(".ux_cs_banner_text_trail")
    let ux_cs_banner_text_subheader = document.querySelector(".ux_cs_banner_text_subheader")
  
    // Create SplitText instances for all text elements
    // Header SplitText
    let splitLines_header = new SplitText(ux_cs_banner_text_header, {
      type: "lines", 
      linesClass: "line"
    });
    let headerLines = splitLines_header.lines;
    
    // Subheader SplitText
    let splitLines_subheader = new SplitText(ux_cs_banner_text_subheader, {
      type: "lines", 
      linesClass: "line"
    });
    let subheaderLines = splitLines_subheader.lines;
    
    // Trail SplitText (for multiple elements)
    let splitLines_trail = [];
    let trailLines = [];
    
    // For each trail element, create a SplitText instance
    ux_cs_banner_text_trail.forEach(trail => {
      let split = new SplitText(trail, {
        type: "lines", 
        linesClass: "line"
      });
      splitLines_trail.push(split);
      trailLines.push(...split.lines);
    });
    
    // Set initial states for all text elements
    gsap.set(headerLines, {
      y: -110,
      opacity: 0
    });
    
    gsap.set(subheaderLines, {
      y: 110,
      opacity: 0
    });
    
    gsap.set(trailLines, {
      y: 110,
      opacity: 0
    });
  
    gsap.set(ux_cs_banner, {
      scale: 0.9, 
      transformOrigin: "50% 50%"
    });
    
    gsap.set(ux_cs_banner_image_wrapper, {
      rotation: 0.1
    });
  

    // Animate everything in the timeline
    tl_banner_image
    .from(ux_cs_banner_image, {
      scale: 2
    })
    .to(ux_cs_banner_image_wrapper, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", 
      ease: "sine.out", 
      duration: 1.2, 
      scale: 1.05
    }, 0)
    // Animate header lines
    .to(headerLines, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: "sine.out"
    }, "<1.6")
    // Animate subheader lines
    .to(subheaderLines, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "sine.out"
    }, "<0.2") // Start slightly after header animation begins
    // Animate trail lines
    .to(trailLines, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.05,
      ease: "sine.out"
    }, "<0.1") // Start slightly after subheader animation begins
    .to(ux_cs_banner_image_wrapper, {
      scale: 1, 
      duration: 2
    }, "<.2")
  
    GSDevTools.create({animation: tl_banner_image});
    
    // Store all SplitText instances for cleanup
    return {
      header: splitLines_header,
      subheader: splitLines_subheader,
      trail: splitLines_trail
    };
  }


  // Update the killAll function to properly revert all SplitText instances
  function killAll() {
  // Get the SplitText instances from your stored reference
  let splitTextInstances = window.splitTextInstances || {};
  
  // Revert all SplitText instances
  if (splitTextInstances.header) {
    splitTextInstances.header.revert();
  }
  
  if (splitTextInstances.subheader) {
    splitTextInstances.subheader.revert();
  }
  
  if (splitTextInstances.trail && splitTextInstances.trail.length) {
    splitTextInstances.trail.forEach(instance => instance.revert());
  }
  
  // Kill all ScrollTrigger instances
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  
  // Reinitialize
  init();
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
  
  // Run the init function
  init();
}

// Only initialize if we're on the correct page AND wait for page to fully load
window.addEventListener('load', function() {
  console.log('Page fully loaded');
  if (document.body.classList.contains("ux_case_study")) {
    ux_case_study();
  }
});

export default ux_case_study;