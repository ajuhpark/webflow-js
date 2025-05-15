/** ux_home_v2
 */

import '../src/styles/style.css'

import { gsap } from 'gsap'
// import { SplitText } from "gsap/SplitText";

import ScrollTrigger from "gsap/ScrollTrigger";
// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
console.log(ScrollTrigger)
// Add this line right after registering the plugin

import imagesLoaded from 'imagesloaded'; // Install with `npm install imagesloaded`

import sj_menu from './sj_menu.js';
sj_menu();


function ux_home_v2() {
  console.log('ux_home_v2.js is working');

  // Define your animation function
  function initAnimations() {
    console.log('ux_home_v2 animations initializing');
    
    // Start with body/html hidden
    gsap.set('html', { autoAlpha: 0 });
    
    var tl_ux_home = gsap.timeline();
    
    // Animation sequence
    tl_ux_home
      .to('html', { duration: 0.5, autoAlpha: 1 }, 'home_start')
      // Add your other animations here
      
    tl_ux_home.play();
  }

  // Set up proper load sequence
  function init() {
    // First ensure document is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupLoader);
    } else {
      setupLoader();
    }
  }
  
  function setupLoader() {
    console.log("DOM content loaded, waiting for images...");
    
    // Then wait for all images to load
    imagesLoaded(document.body, function() {
      console.log("All images loaded, initializing animations");
      
      // Reset scroll position to top for consistent animations
      window.scrollTo(0, 0);
      
      // Give a small delay to ensure browser rendering is complete
      setTimeout(() => {
        // Initialize animations
        initAnimations();
        
        // Refresh ScrollTrigger to ensure proper calculations
        ScrollTrigger.refresh(true);
        console.log("ScrollTrigger refreshed");
      }, 100);
    });
  }
  
  // Start the initialization process
  init();
}

// Only initialize if we're on the correct page
if (document.body.classList.contains("ux_home_v2")) {
  ux_home_v2();
}