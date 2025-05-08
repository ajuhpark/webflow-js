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

  }

  // Logo to Nav animation
  // Updated Logo to Nav animation with proper reset
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

    // splitlines
    let splitLines_ux_cs_banner_text_subheader = new SplitText(ux_cs_banner_text_subheader, {
      type:"lines", 
      linesClass:"line"
    })
    // creating a new variable so we're not animating our trigger. The single line we have is now wrapped in a lineTrigger.
    let splitLinesTrigger_ux_cs_banner_text_subheader = new SplitText(ux_cs_banner_text_subheader, {type: "lines", linesClass:"lineTrigger"});

    splitLines_ux_cs_banner_text_subheader.lines.forEach((line) => {
      gsap.from(line, {
        duration:1, 
        y:110,
      }
      )
    })


    gsap.set(ux_cs_banner, {
      scale:0.9, 
      transformOrigin:"50% 50%"
    })
    gsap.set(ux_cs_banner_image_wrapper, {
      rotation:0.1
    })


    // Make container flex and centered
    tl_banner_image
    .from(ux_cs_banner_image, {
      scale: 2
    })
    .to(ux_cs_banner_image_wrapper, {
      clipPath:"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", 
      ease:"sine.out", 
      duration:1.2, 
      scale:1.05
    }, 0)
    .from(ux_cs_banner_text_header, {
      yPercent:"-110", 
      ease:"sine.out", 
      duration:.4
    }, "<1.6")
    .from(ux_cs_banner_text_subheader, {
      yPercent:"110", 
      ease:"sine.out", 
      duration:.4
    }, "<")
    .from(ux_cs_banner_text_trail, {
      yPercent:"110", 
      ease:"sine.out", 
      duration:.4
    }, "<")
    .to(ux_cs_banner_image_wrapper, {
      scale:1, 
      duration:2
    })


    GSDevTools.create({animation:tl_banner_image})
    
    
    // Create ScrollTrigger with proper reset callbacks
    // animations.scrollTriggers.banner_image = ScrollTrigger.create({
    //   id: "banner_image_animation",
    //   trigger: ux_home_banner,
    //   start: "70% 0%",
    //   end: "bottom 0%",
    //   animation: tl_banner_image,
    //   scrub: true,
    //   markers: false,
    //   invalidateOnRefresh: true,
    //   fastScrollEnd: true,
    //   ease: "none",
    //   onEnter: () => {
    //     console.log("Entering logo animation");
    //   },
    //   onLeaveBack: () => {
    //     console.log("Leaving logo animation backward");
    //     // Reset when scrolling back up past the starting point
    //     gsap.set(headerText, {
    //       fontSize: originalProps.headerText.fontSize,
    //       lineHeight: originalProps.headerText.lineHeight,
    //       letterSpacing: originalProps.headerText.letterSpacing
    //     });
    //     gsap.set(sj_banner_1_header_text_group_container, {
    //       height: originalProps.headerTextGroupContainer.height,
    //       display: originalProps.headerTextGroupContainer.display,
    //       flexDirection: originalProps.headerTextGroupContainer.flexDirection,
    //       justifyContent: originalProps.headerTextGroupContainer.justifyContent
    //     });
    //     gsap.set(headerTextWrapper, {
    //       height: originalProps.headerTextWrapper.height,
    //       paddingBottom: originalProps.headerTextWrapper.paddingBottom
    //     });
    //   }
    // });
    
    console.log("Logo to Nav animation initialized");
  }



  // Kill and reset all animations and properties
  function killAll() {
  // this undoes the splitLines where it wraps it in line divs
  splitLines.revert()
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
}

window.addEventListener('load', function () {
  init();  // Run animations
});

// Only initialize if we're on the correct page
if (document.body.classList.contains("ux_case_study")) {
  ux_case_study();
}

export default ux_case_study;