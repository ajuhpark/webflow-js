/** ux card stack 
 * even though the lines are still wrapping
 * on splittext when it resizes, it works decently for now. 
*/

import "../src/styles/style.css";

function ux_card_stack() {
  console.log('ux_card_stack.js is working');
  
  // Store original content of text elements
  let originalContents = {};
  
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
    gsap.set(sc_cards, { 
      // display: "flex", 
      // justifyContent: "center",
      // alignItems: "center",
      // autoAlpha: 0 
      display: "flex", 
      position: "fixed",
      xPercent: -50,
      yPercent: -50,
      left: "50%", 
      top: "50%",
      autoAlpha: 0 
    });
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
        let sc_1_card_number_text = card_containers_index.querySelectorAll(".sc_1_card_number_text");
        let sc_1_card_text_link_container_2 = card_containers_index.querySelector(".sc_1_card_text_link_container_2");

        // Make sure text elements exist
        if (!sc_1_card_text_header || !sc_1_card_text_subheader) {
          console.warn(`Text elements missing for card ${index}`);
          return;
        }

        // Store original content if not already stored
        if (!originalContents[`header-${index}`]) {
          originalContents[`header-${index}`] = sc_1_card_text_header.innerHTML;
        }
        if (!originalContents[`subheader-${index}`]) {
          originalContents[`subheader-${index}`] = sc_1_card_text_subheader.innerHTML;
        }

        // Create SplitText instances
        let sc_1_card_text_header_split = new SplitText(sc_1_card_text_header, {type: "lines", linesClass: "line"});
        let sc_1_card_text_subheader_split = new SplitText(sc_1_card_text_subheader, {type: "lines", linesClass: "line"});

        // Store the instances in our array for later cleanup
        splitTextInstances.push(sc_1_card_text_header_split, sc_1_card_text_subheader_split);

        // Get the lines
        let headerLines = sc_1_card_text_header_split.lines;
        let subheaderLines = sc_1_card_text_subheader_split.lines;

        // Add a data attribute to each line to identify it
        headerLines.forEach((line, lineIndex) => {
            line.setAttribute('data-cs-line', `header-${index}-${lineIndex}`);
        });
        
        subheaderLines.forEach((line, lineIndex) => {
            line.setAttribute('data-cs-line', `subheader-${index}-${lineIndex}`);
        });

        // Wrap each line in a container div with overflow hidden
        headerLines.forEach(line => {
            // Create a wrapper div
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden'; // Set overflow hidden
            wrapper.classList.add('cs-line-wrapper'); // Add class for easy identification
            wrapper.setAttribute('data-cs-wrapper', line.getAttribute('data-cs-line'));
            
            // Insert the wrapper before the line in the DOM
            line.parentNode.insertBefore(wrapper, line);
            
            // Move the line into the wrapper
            wrapper.appendChild(line);
        });

        // Do the same for subheader lines
        subheaderLines.forEach(line => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.classList.add('cs-line-wrapper'); // Add class for easy identification
            wrapper.setAttribute('data-cs-wrapper', line.getAttribute('data-cs-line'));
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
        // .to(cards_index, {
        //     rotationX: -90,
        //     rotationY: 40,
        //     x: "calc(-50% + 40%)",  // Preserve horizontal centering
        //     y: "-50%",  // Preserve vertical centering
        //     transformOrigin: "50% 100% 0",
        //     autoAlpha: 0,
        //     display: "flex",
        //     duration: 0.01  // Very short duration for initial state
        // }, 0.01)
        
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
        }, 9.5);

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

  // Completely resets all card text elements to their original state
  function resetCardTextElements() {
    console.log("Resetting all card text elements to original state");
    
    // Process each card container
    const sc_card_containers = gsap.utils.toArray(".sc_1_card_container");
    
    sc_card_containers.forEach((container, index) => {
      // Get the text elements
      const header = container.querySelector(".sc_1_card_text_header");
      const subheader = container.querySelector(".sc_1_card_text_subheader");
      
      // Check if elements exist and we have stored original content
      if (header && originalContents[`header-${index}`]) {
        // Reset to original content
        header.innerHTML = originalContents[`header-${index}`];
      }
      
      if (subheader && originalContents[`subheader-${index}`]) {
        // Reset to original content
        subheader.innerHTML = originalContents[`subheader-${index}`];
      }
    });
  }

  // Thoroughly clean up SplitText-related elements
  function cleanupSplitText() {
    // First revert all SplitText instances
    if (splitTextInstances.length) {
      splitTextInstances.forEach(instance => {
        if (instance && typeof instance.revert === 'function') {
          try {
            instance.revert();
          } catch (e) {
            console.warn("Error reverting SplitText:", e);
          }
        }
      });
      splitTextInstances = [];
    }
    
    // Find and remove all line wrappers
    const lineWrappers = document.querySelectorAll('.cs-line-wrapper');
    if (lineWrappers.length) {
      lineWrappers.forEach(wrapper => {
        try {
          // Move all children back to parent before removing wrapper
          while (wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
          }
          // Remove the wrapper
          if (wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
          }
        } catch (e) {
          console.warn("Error removing wrapper:", e);
        }
      });
    }
    
    // Find and remove all .line elements that might be left over
    const lineElements = document.querySelectorAll('.line');
    if (lineElements.length) {
      lineElements.forEach(line => {
        try {
          // Move all children back to parent before removing line element
          while (line.firstChild) {
            line.parentNode.insertBefore(line.firstChild, line);
          }
          // Remove the line element
          if (line.parentNode) {
            line.parentNode.removeChild(line);
          }
        } catch (e) {
          console.warn("Error removing line element:", e);
        }
      });
    }
  }

  // Updated killAll function with improved cleanup
  function killAll() {
    console.log("Killing all card stack animations");
    
    // First kill all ScrollTrigger instances
    [...cardTriggers, ...textTriggers].forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill();
      }
    });
    cardTriggers = [];
    textTriggers = [];
    
    // Kill all GSAP animations related to cards and text
    gsap.killTweensOf(".sc_1_card");
    gsap.killTweensOf(".sc_1_card_container");
    gsap.killTweensOf(".sc_1_card_text_header");
    gsap.killTweensOf(".sc_1_card_text_subheader");
    gsap.killTweensOf(".sc_1_card_number_text");
    gsap.killTweensOf(".sc_1_card_text_link_container_2");
    gsap.killTweensOf(".line");
    
    // Thoroughly clean up SplitText-related elements
    cleanupSplitText();
    
    // Reset card text elements to original state
    resetCardTextElements();
    
    // Reset all card elements
    const sc_cards = gsap.utils.toArray(".sc_1_card");
    if (sc_cards.length) {
      gsap.set(sc_cards, { clearProps: "all" });
    }
    
    // Also reset all text elements
    const textElements = [
      ".sc_1_card_text_header",
      ".sc_1_card_text_subheader",
      ".sc_1_card_number_text",
      ".sc_1_card_text_link_container_2"
    ];
    
    textElements.forEach(selector => {
      const elements = gsap.utils.toArray(selector);
      if (elements.length) {
        gsap.set(elements, { clearProps: "all" });
      }
    });
    
    // Allow a brief moment for DOM to settle before reinitializing
    setTimeout(() => {
      // Reinitialize
      init();
      
      // Force ScrollTrigger refresh
      ScrollTrigger.refresh(true);
    }, 200);
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
    
    // Kill all animations and reset elements
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
export default ux_card_stack