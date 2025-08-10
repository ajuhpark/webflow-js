/** Rejoice Menu - https://rejouice.com/
 * From sj file.
 */

// gsap.registerPlugin(SplitText)
// gsap.registerPlugin(GSDevTools)


const rejoice_tl = gsap.timeline({ paused: true });

function sj_menu() {
  console.log('sj_menu.js is working')

  function init() {

    console.log('sj_menu init function is working')

    // gsap.from("html", {duration: 0, autoAlpha:0})

    rejoice_tl
      .to(".sj_menu_menu-overlay", {
        duration: 1,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        ease: "power2.out",
      })
      .from(
        ".sj_menu_menu-link, .sj_menu_btn",
        {
          opacity: 0,
          y: 60,
          stagger: 0.05,
          duration: 0.75,
          ease: "power1.inOut",
        },
        "<",
      )
      // .from(
      //   "sj_banner_1_icon_group_container.menu_overlay",
      //   {
      //     opacity: 0,
      //     y: 100,
      //     duration: 1
      //   },
      //   "<"
      // // )
      // .from(".sj_menu_video-preview",
      //   {
      //     height: "1px",
      //   },
      //   "<")
      .to(
        ".sj_menu_video-preview",
        {
          duration: 1,
          height: "200px",
          ease: "power2.out",
          // opacity: 100
        },
        "<"
        // "<=+10",
      )
      // .to(
      //   ".sj_menu_menu-divider",
      //   {
      //     duration: 2,
      //     width: "100%",
      //     ease: "power4.out",
      //   },
      //   "<",
      // )
  
    function openMenu() {
      document.querySelector(".sj_menu_menu-overlay").style.pointerEvents = "all";
      rejoice_tl.play();
    }
  
    function closeMenu() {
      document.querySelector(".sj_menu_menu-overlay").style.pointerEvents = "none";
      rejoice_tl.reverse();
    }
  
    document.querySelector(".sj_menu_menu-open-btn").addEventListener("click", openMenu);
    document
      .querySelector(".sj_menu_menu-close-btn")
      .addEventListener("click", closeMenu);
    rejoice_tl.reverse();
  
    
    // GSDevTools.create({})

    
  }

  window.addEventListener("load", function(event) { 
    init(); 
  });
}

if (document.body.classList.contains('sj_menu')) {
  sj_menu();
}

export default sj_menu