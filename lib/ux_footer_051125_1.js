/** UX footer
 */

function ux_footer() {
  console.log('ux_footer.js is working')
  
  // Store reference to our ScrollTrigger instance
  let ux_footer_st = null;

  function init() {
    console.log('ux_footer init function is working')

    // Kill previous instance if it exists
    if (ux_footer_st) {
      ux_footer_st.kill();
    }

    let ux_footer_text_link = document.querySelectorAll(".sj_text_link.footer");
    let ux_footer_container = document.querySelector("#ux_footer_container");

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
    ux_footer_st = ScrollTrigger.create({
      id: "ux_footer",
      trigger: ux_footer_container,
      start: "0% 0%", 
      end: "100% 100%",
      animation: tl_ux_footer,
      scrub: true,
      markers: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      ease: "power1.in",
    });
    
    console.log("Footer ScrollTrigger created with ID:", ux_footer_st.vars.id);
  }

  // Add a separate refresh function that also refreshes ScrollTrigger
  function refresh() {
    init();
    // Give a small delay before refreshing to ensure DOM updates are complete
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }

  // Don't initialize immediately anymore - let the main file control this
  // init();
  
  // Return public methods
  return {
    init: init,
    refresh: refresh
  };
}

export default ux_footer;