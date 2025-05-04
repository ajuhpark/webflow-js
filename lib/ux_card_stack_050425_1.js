/** ux card stack */

import "../src/styles/style.css";

function ux_card_stack() {
  console.log('ux_card_stack.js is working');
  
  // Declare these variables at the function level so they're accessible to all inner functions
  let splitTextInstances = [];
  let cardTriggers = [];
  let textTriggers = [];
    
  function init() {
    console.log('ux_card_stack init function is working');

    // Clear previous instances when re-initializing
    splitTextInstances = [];
    cardTriggers = [];
    textTriggers = [];

    // Initial animation for page load
    gsap.from('html', { duration: 0, autoAlpha: 0 });
    
    // Get all cards and containers in reverse order
    const sc_cards = gsap.utils.toArray(".sc_1_card").reverse();
    const sc_card_containers = gsap.utils.toArray(".sc_1_card_container");

    // Check if elements exist before proceeding
    if (!sc_cards.length || !sc_card_containers.length) {
      console.warn("Card stack elements not found on page");
      return;
    }

    // Set all cards to display:flex but hide them with autoAlpha initially
    gsap.set(sc_cards, { display: "flex", autoAlpha: 0 });
    // Make only the first card visible at start
    gsap.set(sc_cards[0], { autoAlpha: 1 });

    // Detect if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Adjust scrub values based on device
    const cardScrubValue = isMobile ? 1.5 : 1.5;
    const textScrubValue = isMobile ? 0.5 : true;

    sc_cards.forEach((card, index) => {
        let cards_index = sc_cards[index];
        let card_containers_index = sc_card_containers[index];
        
        let sc_1_card_text_header = card_containers_index.querySelector(".sc_1_card_text_header");
        let sc_1_card_text_subheader = card_containers_index.querySelector(".sc_1_card_text_subheader");
        let sc_1_card_number_text = card_containers_index.querySelectorAll(".sc_1_card_number_text")
        let sc_1_card_text_link_container_2 = card_containers_index.querySelector(".sc_1_card_text_link_container_2")

        // Make sure text elements exist
        if (!sc_1_card_text_header || !sc_1_card_text_subheader) {
          console.warn(`Text elements missing for card ${index}`);
          return;
        }

        // Create SplitText instances
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
        

        .fromTo(sc_1_card_number_text, 
          { translateY: "100%" },
          { 
              translateY: "0%", 
              duration: 1.5,  
              stagger: 0.2,
              ease: "power2.out" 
          }, 
        0.7)
        
        .fromTo(subheaderLines, 
            { translateY: "100%" },
            { 
                translateY: "0%", 
                duration: 1.5,  
                stagger: 0.2,
                ease: "power2.out" 
            }, 
        1)


        .fromTo(sc_1_card_text_link_container_2, 
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
        .to([headerLines, subheaderLines, sc_1_card_number_text, sc_1_card_text_link_container_2], {
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
        
        .to(sc_1_card_number_text, {
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
        }, 9.5)
        
        .to(sc_1_card_text_link_container_2, {
            translateY: "100%",
            duration: 1.5,
            stagger: 0.2,
            ease: "power2.in" 
        }, 9.5)

        // Create ScrollTrigger for card animations with adjusted scrub
        const cardTrigger = ScrollTrigger.create({
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
        const textTrigger = ScrollTrigger.create({
            trigger: card_containers_index,
            start: "top 0%",
            end: "100% 100%",
            animation: tl_text,
            // markers: true, // Enable for debugging
            ease: "power1.inOut", 
            scrub: textScrubValue, // Adjusted scrub value
            id: "text-trigger-" + index,
            // Add snapTo for mobile to help with flick gestures
            ...isMobile && {snapDirectional: 0.05}
        });

        // Store triggers for cleanup
        cardTriggers.push(cardTrigger);
        textTriggers.push(textTrigger);
    });
  }

  // Updated killAll function that uses the splitTextInstances array
  function killAll() {
    console.log("Killing all card stack animations");
    
    // Revert all SplitText instances
    if (splitTextInstances.length) {
      splitTextInstances.forEach(instance => {
        if (instance && typeof instance.revert === 'function') {
          instance.revert();
        }
      });
      splitTextInstances = [];
    }
    
    // Kill all stored ScrollTrigger instances
    [...cardTriggers, ...textTriggers].forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill();
      }
    });
    cardTriggers = [];
    textTriggers = [];
    
    // Reset all card elements
    const sc_cards = gsap.utils.toArray(".sc_1_card");
    if (sc_cards.length) {
      gsap.set(sc_cards, { clearProps: "all" });
    }
    
    // Allow a brief moment for DOM to settle
    setTimeout(() => {
      // Reinitialize
      init();
      
      // Force ScrollTrigger refresh
      ScrollTrigger.refresh();
    }, 100);
  }
  
  // Debounce function for resize events
  function debounce(func) {
    var timer;
    return function(event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func(event);
      }, 300);
    };
  }
  
  // Setup resize handler
  const debouncedResize = debounce(function(e) {
    console.log("Card stack resize detected - reinitializing");
    killAll();
  });

  // Setup the initialization and cleanup functions
  function setup() {
    window.addEventListener("resize", debouncedResize);
    
    // Listen for animation reset events from other components
    window.addEventListener('sj_animation_reset', function() {
      console.log("Animation reset event received in card stack");
      killAll();
    });
    
    // Initialize on load
    if (document.readyState === 'complete') {
      init();
    } else {
      window.addEventListener('load', init);
    }
  }
  
  function cleanup() {
    // Remove event listeners
    window.removeEventListener("resize", debouncedResize);
    window.removeEventListener('sj_animation_reset', killAll);
    window.removeEventListener('load', init);
    
    // Kill all animations
    killAll();
  }

  // Run setup
  setup();
  
  // Return cleanup function for external components to use
  return {
    init,
    killAll,
    cleanup
  };
}

// Export the function
export default ux_card_stack;