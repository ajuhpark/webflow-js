/** UX footer
 */

gsap.registerPlugin(SplitText)
gsap.registerPlugin(GSDevTools)


function ux_footer() {
  console.log('ux_footer.js is working')

  function init() {

    console.log('ux_footer init function is working')

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
    // Using GSAP fromTo tween
    .fromTo(ux_footer_container, 
    {
      // height: "100vh"  // Starting value
    },
    {
      // height: "200vh",  // Ending value
      // duration: 1.5,    // Animation duration in seconds
      // ease: "power2.inOut",  // Easing function
      // onComplete: () => console.log("Animation completed")
    }, "<")
    

    // Create ScrollTrigger with proper reset callbacks
    let ux_footer_st = ScrollTrigger.create({
      id: "ux_footer",
      trigger: ux_footer_container,
      start: "0% 0%",
      end: "100% 100%",
      animation: tl_ux_footer,
      scrub: true,
      // markers: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      ease: "power1.in",
    });
    
    console.log("footer text link animation initialized");
    


  }

  window.addEventListener("load", function(event) { 
    init(); 
  });
}


export default ux_footer