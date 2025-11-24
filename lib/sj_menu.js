/** Rejoice Menu - https://rejouice.com/
 * From sj file.
 */

// import { gsap } from 'gsap'
// gsap.registerPlugin(SplitText)
// gsap.registerPlugin(GSDevTools)


const rejoice_tl = gsap.timeline({ paused: true });

function sj_menu() {
  console.log('sj_menu.js is working')

  function init() {

    console.log('sj_menu init function is working')
    
    // Remove existing event listeners to prevent duplicates
    const openBtn = document.querySelector(".sj_menu_menu-open-btn");
    const closeBtn = document.querySelector(".sj_menu_menu-close-btn");
    
    if (openBtn) {
      openBtn.replaceWith(openBtn.cloneNode(true));
    }
    if (closeBtn) {
      closeBtn.replaceWith(closeBtn.cloneNode(true));
    }

    // Reset timeline and clear any existing animations
    rejoice_tl.clear();
    rejoice_tl.pause();
    
    // Reset menu elements to initial state
    gsap.set(".sj_menu_menu-overlay", {
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      clearProps: "pointerEvents"
    });
    gsap.set(".sj_menu_menu-link, .sj_menu_btn", {
      opacity: 1,
      y: 0,
      clearProps: "all"
    });
    gsap.set(".sj_menu_video-preview", {
      height: "1px"
    });

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
    
    // Close menu when clicking outside
    document.addEventListener("click", function(event) {
      const menu = document.querySelector("#sj_sticky_nav");
      const menuOverlay = document.querySelector(".sj_menu_menu-overlay");
      
      // Check if menu is open and click is outside the menu
      if (menuOverlay && menuOverlay.style.pointerEvents === "all" && 
          menu && !menu.contains(event.target)) {
        closeMenu();
      }
    });
    
    rejoice_tl.reverse();
  
    
    // GSDevTools.create({})

    
  }

  // Initialize once - either immediately or on load
  let hasInitialized = false;

  const initOnce = () => {
    if (hasInitialized) return;
    hasInitialized = true;
    init();
  };

  // Try to initialize immediately
  initOnce();

  // Also try on load in case DOM wasn't ready
  window.addEventListener("load", initOnce);
}

if (document.body.classList.contains('sj_menu')) {
  sj_menu();
}

export default sj_menu