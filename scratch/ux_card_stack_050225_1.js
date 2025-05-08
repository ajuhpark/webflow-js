/** UX Home js
 * This one has the disappearing banner text animation working.
 * But when it scrolls back up and down elements are out of place.
 */
import "../src/styles/style.css";
// import { gsap } from "gsap";
// import { GSDevTools } from "gsap/GSDevTools"; 


function ux_card_stack() {
  console.log('ux_card_stack.js is working')
  
  // Declare these variables at the function level so they're accessible to all inner functions
  let splitTextInstances = [];
    
  function init() {
    console.log('ux_card_stack init function is working')

    gsap.from('html', { duration: 0, autoAlpha: 0 }, 'gsap_pinning_tl')
    
    
    // Clear previous instances when re-initializing
    splitTextInstances = [];

    // this gets the page to scroll to the top after refresh.
    $(window).on('beforeunload', function() {
        $('body').hide();
        $(window).scrollTop(0);
    })

    // we're splitting into lines and adding a lines class of 'line'. can see in inspect.
          
    // Get all cards and containers in reverse order
    const sc_cards = gsap.utils.toArray(".sc_1_card").reverse();
    const sc_card_containers = gsap.utils.toArray(".sc_1_card_container");

    // Set all cards to display:flex but hide them with autoAlpha initially
    gsap.set(sc_cards, { display: "flex", autoAlpha: 0 });
    // Make only the first card visible at start
    gsap.set(sc_cards[0], { autoAlpha: 1 });

    // Detect if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Adjust scrub values based on device
    /**
     * This sets the scrub value for card animations
      If isMobile is true (user is on mobile), the scrub value is set to 0.8
      If isMobile is false (user is on desktop), the scrub value is set to 1.5
     */
    // const cardScrubValue = isMobile ? 0.8 : 1.5;
    const cardScrubValue = isMobile ? 1.5 : 1.5;

    /**
     * This sets the scrub value for text animations
      If isMobile is true (user is on mobile), the scrub value is set to 0.5
      If isMobile is false (user is on desktop), the scrub value is set to true
      When scrub is set to true, the animation plays exactly in sync with the
      scroll position - it's directly tied to scroll position with no smoothing.
     */
    // const textScrubValue = isMobile ? 0.5 : true;
    const textScrubValue = isMobile ? 0.5 : true;

    sc_cards.forEach((card, index) => {
        let cards_index = sc_cards[index];
        let card_containers_index = sc_card_containers[index];
        
        let sc_1_card_text_header = card_containers_index.querySelector(".sc_1_card_text_header")
        let sc_1_card_text_subheader = card_containers_index.querySelector(".sc_1_card_text_subheader")

        // After creating your SplitText instances
        let sc_1_card_text_header_split = new SplitText(sc_1_card_text_header, {type: "lines", linesClass: "line"});
        let sc_1_card_text_subheader_split = new SplitText(sc_1_card_text_subheader, {type: "lines", linesClass: "line"});
        
        // Store the instances in our array for later cleanup
        splitTextInstances.push(sc_1_card_text_header_split, sc_1_card_text_subheader_split);

        // Get the lines
        let headerLines = sc_1_card_text_header_split.lines;
        let subheaderLines = sc_1_card_text_subheader_split.lines;

        // Wrap each line in a container div with overflow hidden
        headerLines.forEach(line => {
            // Create a wrapper div
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden'; // Set overflow hidden
            
            // Insert the wrapper before the line in the DOM
            line.parentNode.insertBefore(wrapper, line);
            
            // Move the line into the wrapper
            wrapper.appendChild(line);
        });

        // Do the same for subheader lines
        subheaderLines.forEach(line => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
        });

        // Debug logging
        // console.log("Card:", cards_index);
        // console.log("Header element:", sc_1_card_text_header);
        // console.log("Subheader element:", sc_1_card_text_subheader);

        // Create two separate timelines
        // Timeline for the card animations
        let tl_cards = gsap.timeline({
            defaults: {
                ease: "none"
            }
        });

        // Timeline for text animations
        let tl_text = gsap.timeline({
            defaults: {
                ease: "none"
            }
        });

        // Card animations timeline - animation is symmetrical for forward and reverse
        tl_cards
        // Starting visibility state
        .set(cards_index, {
            display: "flex",
            autoAlpha: 0
        }, 0)
        
        // Entrance animation
        .to(cards_index, {
            rotationX: -90,
            rotationY: 40,
            translateX: "40%",
            transformOrigin: "50% 100% 0",
            autoAlpha: 0,
            display: "flex",
            duration: 0.01  // Very short duration for initial state
        }, 0.01)
        
        // Main appearance animation
        .to(cards_index, {
            rotationX: 0,
            rotationY: 0,
            translateX: "0%",
            transformOrigin: "50% 100% 0",
            autoAlpha: 1,
            display: "flex",
            duration: 2,
            ease: "power1.out" 
        }, 0.5)
        
        // Hold position (no animation during this period)
        .to(cards_index, { 
            duration: 7
        }, 2.5) 
        
        // Begin exit - fade out a bit
        .to(cards_index, {
          /**This creates a device-specific animation effect. 
           * On mobile devices, the card becomes more transparent 
           * (only 30% visible) during the exit animation, while on 
           * desktop devices, the card remains more visible (70% visible) 
           * during the same animation phase. */
            autoAlpha: isMobile ? 0.3 : 0.7, 
            duration: 0.5,
            ease: "power1.in"
        }, 9.5)
        
        // Exit animation - flip and move
        .to(cards_index, {
            rotationX: -90,
            rotationY: 40,
            translateX: "-10%",
            transformOrigin: "50% -100% 0",
            duration: 2,
            ease: "power1.in"
        }, 10)
        
        // Complete fade out
        .to(cards_index, { 
            autoAlpha: 0,
            duration: 1.0,
            ease: "power1.in"
        }, 10.5);

        // Text animations timeline
        tl_text
        // Text animations with smoother transition
        .fromTo(headerLines, 
            { translateY: "100%" },
            { 
                translateY: "0%", 
                duration: 1.5,  
                stagger: 0.2,
                ease: "power2.out" 
            }, 
        0.3)
        
        .fromTo(subheaderLines, 
            { translateY: "100%" },
            { 
                translateY: "0%", 
                duration: 1.5,  
                stagger: 0.2,
                ease: "power2.out" 
            }, 
        1)
        
        // Hold position (no animation during this period)
        .to({}, { duration: 7 }, 2) 
        
        // First fade out text before translating it on mobile
        .to([headerLines, subheaderLines], {
            autoAlpha: isMobile ? 0 : 1, 
            duration: isMobile ? 0.3 : 0,
            ease: "power2.in"
        }, 8.7)
        
        // Exit animations start much later - explicit from/to values
        .to(headerLines, {
            translateY: "100%",
            duration: 1.5,
            stagger: 0.2,
            ease: "power2.in" 
        }, 9)
        
        .to(subheaderLines, {
            translateY: "100%",
            duration: 1.5,
            stagger: 0.2,
            ease: "power2.in" 
        }, 9.5);

        // Create ScrollTrigger for card animations with adjusted scrub
        ScrollTrigger.create({
            trigger: card_containers_index,
            start: "top 0%",
            end: "bottom 100%", 
            animation: tl_cards,
            // markers: true,
            ease: "power1.inOut", 
            scrub: cardScrubValue, // Adjusted scrub value
            id: "card-trigger-" + index,
            // Add snapTo for mobile to help with flick gestures
            ...isMobile && {snapDirectional: 0.05}
        });
        
        // Create ScrollTrigger for text animations with adjusted scrub
        ScrollTrigger.create({
            trigger: card_containers_index,
            start: "top 0%",
            end: "100% 100%",
            animation: tl_text,
            markers: true,
            ease: "power1.inOut", 
            scrub: textScrubValue, // Adjusted scrub value
            id: "text-trigger-" + index,
            // Add snapTo for mobile to help with flick gestures
            ...isMobile && {snapDirectional: 0.05}
        });
    });
  }

  // we're trying to make it responsive.
  // this killAll function we created will handle reverting of splitText objects. 
  // Updated killAll function that uses the splitTextInstances array
  function killAll(){
    // Revert all SplitText instances
    splitTextInstances.forEach(instance => {
      instance.revert();
    });
    
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
  

  window.addEventListener('load', function (event) {
    init()
  })
}

// Only run the marquee code if we're on the correct page
// This prevents the code from running unnecessarily on other pages
// if (document.body.classList.contains("ux_card_stack")) {
//   ux_card_stack();
// }

export default ux_card_stack;