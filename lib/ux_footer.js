/** UX footer
 */

gsap.registerPlugin(SplitText)
gsap.registerPlugin(GSDevTools)


function ux_footer() {
  console.log('ux_footer.js is working')
  
  // Store reference to our ScrollTrigger instance
  let footerTrigger = null;

  function init() {
    console.log('ux_footer init function is working')

    // Kill previous instance if it exists
    if (footerTrigger) {
      footerTrigger.kill();
    }

    let ux_footer_text_link = document.querySelectorAll(".sj_text_link.footer");
    let ux_footer_container = document.querySelector("#ux_footer_container")

    // Create a main timeline for all animations
    let tl_ux_footer = gsap.timeline();
    
    gsap.set(ux_footer_text_link, {
      y: 110
    })
    
    tl_ux_footer.fromTo(ux_footer_text_link, {
      y: 110,
      ease: "power1.in"
    }, {
      y: 0,
      ease: "power1.out"
    })

    // Create ScrollTrigger with proper reset callbacks
    footerTrigger = ScrollTrigger.create({
      id: "ux_footer",
      trigger: ux_footer_container,
      start: "0% 0%",
      // end: "100% 100%",
      end: () => {
        const offset = window.innerHeight * 0.15; // 15% of viewport height
        return `bottom-=${offset}px bottom`;
      },
      animation: tl_ux_footer,
      scrub: true,
      markers: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      ease: "power1.in",
    });
    

    console.log("Footer ScrollTrigger created with ID:", footerTrigger.vars.id);
  }

  // Add our own resize handler with debounce
  function debounce(func) {
    var timer;
    return function(event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, 300, event);
    };
  }

  window.addEventListener("resize", debounce(function() {
    console.log("Reinitializing footer animation after resize");
    init();
  }));

  window.addEventListener("load", function() { 
    init(); 
  });
  
  // Initialize immediately too
  init();
  
  // Return public methods
  return {
    init: init,
    // Expose a method to manually refresh the footer animation
    refresh: init 
  };
}

export default ux_footer;