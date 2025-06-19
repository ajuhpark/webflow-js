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
  console.log('ux_home_v2.js is working')

  function init() {
    console.log('ux_home_v2 init function is working')
    
    var tl_ux_home = gsap.timeline()

    tl_ux_home
    .from('html', { duration: 0, autoAlpha: 0 }, 'home_start')
    .to('html', { duration: .5, autoAlpha: 1 }, 'home_start+=0.1') // Add this line
    tl_ux_home.play();
  }

  window.addEventListener('load', function () {
  imagesLoaded(document.body, function () {
    setTimeout(() => {
      console.log("All content loaded, refreshing ScrollTrigger.");
      ScrollTrigger.refresh();  // Force ScrollTrigger to recalculate after everything is loaded
      init();  // Run animations
    }, 100);  // Delay of 100ms for safety
    });
  });


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


    // Initialize on load
    if (document.readyState === 'complete') {
      initOnLoad();
    } else {
      window.addEventListener("load", initOnLoad);
    }

  }


}






// Only initialize if we're on the correct page
if (document.body.classList.contains("ux_home_v2")) {
  ux_home_v2();
}

export default ux_home_v2;