/** UX Home js */

import '../src/styles/style.css'

// Register ALL plugins
gsap.registerPlugin(ScrollTrigger);
console.log(ScrollTrigger)
gsap.registerPlugin(GSDevTools);
// gsap.registerPlugin(Flip);
// gsap.registerPlugin(ScrollSmoother);

// change this to the card stack js
// import example_16 from './example_16';
// example_16();

import imagesLoaded from 'imagesloaded'; // Install with `npm install imagesloaded`

// import feature from './features/feature'

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
  function init() {
    console.log('ux_home.js init works')
    initLogoToNavAnimation();


    function initLogoToNavAnimation() {
      let tl_ux_home = gsap.from("html", { duration: 0, autoAlpha: 0});
      tl_ux_home.play();
  
      // Page scroll resets on refresh (using vanilla JS version is recommended)
      window.addEventListener('beforeunload', () => {
        document.body.style.display = "none";
        window.scrollTo(0, 0);
      });
  
      // logo to nav animation
      // Get elements
      let sj_grid_container = document.querySelector(".sj_grid_container.banner_1");
      let headerText = document.querySelectorAll(".sj_banner_1_header_text");
      let headerTextWrapper = document.querySelector(".sj_banner_1_header_text_wrapper");
      let sj_banner_1_header_text_group_container = document.querySelector(".sj_banner_1_header_text_group_container")
      let ux_home_banner = document.querySelector("#ux_home_banner")
  
      if (!sj_grid_container || !headerText.length || !headerTextWrapper) {
        console.log("Missing elements for logo animation:", {
          container: !!sj_grid_container,
          headerText: headerText.length,
          wrapper: !!headerTextWrapper
        });
        return;
      }
      
      // Create tweens for the header texts
      let tweenSmallerText = gsap.to(headerText, {
        fontSize: "16px",
        lineHeight: "auto",
        ease: "none",
      });
      
      // tween for header text container and wrapper
      let tweenHeaderContainer = gsap
      .to(sj_banner_1_header_text_group_container, {
        height:"100%",
        display: "flex",
        flexDirection: "column",
        justifyContent:"center", 
        ease: "none",
        // ease:'power1.in'      
      })
  
      let tweenHeaderWrapper = gsap
      .to(headerTextWrapper, {
        height: "20px",
        paddingBottom: 0,
        ease: "none",
      })
  
      let tweenHeaderLetterSpacing = gsap.to(
        headerText, {
          letterSpacing: "0px",
          ease: "none",
        }
      )
  
      // Create timeline for logo to nav
      let tl_logoToNav = gsap.timeline();
      tl_logoToNav
        .add(tweenSmallerText)
        .add(tweenHeaderContainer, "<")
        .add(tweenHeaderWrapper, "<")
        .add(tweenHeaderLetterSpacing, "<")
  
      scrollTriggers.logoToNav = ScrollTrigger.create({
      // let logoToNav = ScrollTrigger.create({
        id: "logoToNavAnimation",
        trigger: ux_home_banner,
        start: "top 0%",
        end: "bottom 0%",
        animation: tl_logoToNav,
        scrub: "true",
        markers: true,
        // invalidateOnRefresh: true,
        // fastScrollEnd: true,
        ease: "power1.in",
      });
      
      console.log("Logo to Nav animation initialized");
    }
    
    
  


  }


  // we're trying to make it responsive.
  // this killAll function we created will handle reverting of splitText objects. 
  function killAll(){
    // this undoes the splitLines where it wraps it in line divs
    // splitLines.revert()
    // so the scrollTriggers are an array, we showed it above when we console logged it. So for each of the triggers in them, we're going to kill them. 
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    init()
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


  // Listen for animation reset events
  window.addEventListener('sj_animation_reset', function() {
    console.log("Animation reset event received - reinitializing logoToNav");
    // Reinitialize logoToNav animation
    initLogoToNavAnimation();
  });

  // Initialize everything once the page has fully loaded
  window.addEventListener("load", function (event) {
    init();
  });
  
  window.addEventListener('load', function () {
    imagesLoaded(document.body, function () {
      setTimeout(() => {
        console.log("All content loaded, refreshing ScrollTrigger.");
        ScrollTrigger.refresh();  // Force ScrollTrigger to recalculate after everything is loaded
        init();  // Run animations
      }, 100);  // Delay of 100ms for safety
    });
  });

}

// Only initialize if we're on the correct page
if (document.body.classList.contains("ux_home")) {
  ux_home();
}

export default ux_home;