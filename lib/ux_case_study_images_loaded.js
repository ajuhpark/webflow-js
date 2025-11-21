/** UX Case Study js 
 * resizing works.
 * 
 * text change to deploy again.
*/

import '../src/styles/style.css';

// Register ALL plugins in one place to avoid conflicts
// Make sure these are registered before importing other modules
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  // gsap.registerPlugin(GSDevTools);
  gsap.registerPlugin(SplitText);
  console.log("GSAP plugins registered", ScrollTrigger);
}

import sj_menu from './sj_menu.js';
let menuModule = null;

// import ux_footer from './ux_footer.js';
// let footerModule = null;

import sct_text_decoration_svg from './sct_text_decoration_svg.js';

import imagesLoaded from 'imagesloaded';

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

// Create a global flag to track initialization
window.uxCaseStudyInitialized = false;

function ux_case_study() {
  // Stop if already initialized to prevent duplicates
  if (window.uxCaseStudyInitialized) {
    console.log('Case study already initialized, skipping');
    return;
  }

  // Store animations and SplitText instances
  let animations = {};
  let splitInstances = [];
  
  // Store original text content
  let originalContent = {};

  // Function to check and wait for video metadata to load
  const checkVideosLoaded = () => {
    return new Promise((resolve) => {
      const firstVideo = document.querySelector('#first_video');
      const otherVideos = Array.from(document.querySelectorAll('video')).filter(v => v.id !== 'first_video');

      console.log(`📹 First video found: ${!!firstVideo}`);
      console.log(`📹 Other videos found: ${otherVideos.length}`);

      if (!firstVideo && otherVideos.length === 0) {
        console.log('✅ No videos on page');
        resolve();
        return;
      }

      let firstVideoReady = !firstVideo;
      let otherVideosReady = otherVideos.length === 0;

      const checkAllReady = () => {
        if (firstVideoReady && otherVideosReady) {
          console.log('✅ All videos loaded');
          resolve();
        }
      };

      // Handle first video - wait for it to have enough data to play
      if (firstVideo) {
        const onFirstVideoReady = () => {
          console.log(`✅ First video ready to play - ID: ${firstVideo.id}, Dimensions: ${firstVideo.videoWidth}x${firstVideo.videoHeight}`);
          firstVideoReady = true;
          checkAllReady();
        };

        // Check if video already has enough data (readyState >= 3 means HAVE_FUTURE_DATA)
        if (firstVideo.readyState >= 3) {
          onFirstVideoReady();
        } else {
          // Wait for canplaythrough event which fires when video can play to the end
          firstVideo.addEventListener('canplaythrough', onFirstVideoReady, { once: true });

          // Force load if not already loading
          if (firstVideo.readyState === 0) {
            firstVideo.load();
          }
        }
      }

      // Handle other videos - just wait for metadata
      if (otherVideos.length > 0) {
        let loadedCount = 0;

        const onOtherVideoReady = (video, index) => {
          loadedCount++;
          console.log(`✅ Video ${index + 1}/${otherVideos.length} metadata ready - ID: ${video.id || 'no-id'}`);

          if (loadedCount === otherVideos.length) {
            console.log('✅ All other videos metadata loaded');
            otherVideosReady = true;
            checkAllReady();
          }
        };

        otherVideos.forEach((video, index) => {
          // Check if metadata already loaded (readyState >= 1 means HAVE_METADATA)
          if (video.readyState >= 1) {
            onOtherVideoReady(video, index);
          } else {
            // Wait for loadedmetadata event
            video.addEventListener('loadedmetadata', () => onOtherVideoReady(video, index), { once: true });

            // Force load metadata if not already loading
            if (video.readyState === 0) {
              video.load();
            }
          }
        });
      }
    });
  };

  // Main initialization function
  function init() {
    console.log('ux_case_study.js init works');

    // Initialize menu first to ensure it's always available
    if (!menuModule) {
      menuModule = sj_menu();
      console.log("Menu initialized from case study page");
    }

    // Initialize footer module if not already
    // if (!footerModule) {
    //   footerModule = ux_footer();
    //   console.log("Footer initialized from case study page");
    // }

    // Wait for fonts, videos, and images before starting animations
    document.fonts.ready.then(() => {
      console.log('✅ Fonts loaded');

      // Check videos before images
      checkVideosLoaded().then(() => {
        console.log('✅ Videos ready');

        // Wait for images before starting animations
        imagesLoaded(document.body, { background: true }, function() {
          console.log('✅ All images loaded');

          // Set global flag to prevent reinitializing
          window.uxCaseStudyInitialized = true;

          // Refresh footer if available
          // if (footerModule && typeof footerModule.refresh === 'function') {
          //   footerModule.refresh();
          // }

          // Small delay to ensure layout is stable
          setTimeout(() => {
            console.log('🎬 Initializing case study animations...');

            // Initialize animation only if not already done
            if (!animations.banner) {
              cs_intro_anim();
            }

            // Setup video ScrollTriggers
            setupVideoScrollTriggers();

            // Refresh ScrollTrigger to ensure proper positioning
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 100);
          }, 50);
        });
      });
    });
  }

  // Logo to Nav animation
  function cs_intro_anim() {
    console.log("Initializing intro animation");
    
    // Initial visibility
    let tl_ux_case_study = gsap.from("html", { duration: 0, autoAlpha: 0});
    tl_ux_case_study.play();
  
    // Create a main timeline for all animations
    let tl_banner_image = gsap.timeline();
    animations.banner = tl_banner_image;
    
    // Get all elements we need
    let ux_cs_banner_image_wrapper = document.querySelector(".ux_cs_banner_image_wrapper");
    let ux_cs_banner_image = document.querySelector(".ux_cs_banner_image");
    let ux_cs_banner = document.querySelector("#ux_cs_banner");
    let ux_cs_banner_text_header = document.querySelector(".ux_cs_banner_text_header");
    let ux_cs_banner_company_name_text = document.querySelector(".ux_cs_banner_company_name_text");
    let ux_cs_banner_text_trail = document.querySelectorAll(".ux_cs_banner_text_trail");
    let ux_cs_banner_text_subheader = document.querySelector(".ux_cs_banner_text_subheader");
    let ux_cs_page_body = document.querySelector(".ap_grid_container.ux_cs.body")

    // Check if elements exist before proceeding
    if (!ux_cs_banner_image_wrapper || !ux_cs_banner_image || !ux_cs_banner || 
        !ux_cs_banner_text_header || !ux_cs_banner_text_subheader) {
      console.warn("Required elements for animation not found, aborting");
      return;
    }
    
    // Store original content for reset
    originalContent.header = ux_cs_banner_text_header ? ux_cs_banner_text_header.innerHTML : '';
    originalContent.companyName = ux_cs_banner_company_name_text ? ux_cs_banner_company_name_text.innerHTML : '';
    originalContent.subheader = ux_cs_banner_text_subheader ? ux_cs_banner_text_subheader.innerHTML : '';
    originalContent.trail = [];
    ux_cs_banner_text_trail.forEach((trail, i) => {
      originalContent.trail[i] = trail.innerHTML;
    });
    
    // Add CSS for properly hiding split lines
    const styleId = 'split-line-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .split-line-container {
          overflow: hidden !important;
          display: block !important;
          position: relative !important;
        }
        .split-line {
          position: relative !important;
          display: block !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
    
    // Create SplitText instances
    let splitLines_header = new SplitText(ux_cs_banner_text_header, {
      type: "lines", 
      linesClass: "split-line",
      lineThreshold: 0.5
    });
    let headerLines = splitLines_header.lines;
    
    let splitLines_subheader = new SplitText(ux_cs_banner_text_subheader, {
      type: "lines", 
      linesClass: "split-line",
      lineThreshold: 0.5
    });
    let subheaderLines = splitLines_subheader.lines;
    
    let splitLines_trail = [];
    let trailLines = [];
    
    ux_cs_banner_text_trail.forEach(trail => {
      let split = new SplitText(trail, {
        type: "lines", 
        linesClass: "split-line",
        lineThreshold: 0.5
      });
      splitLines_trail.push(split);
      trailLines.push(...split.lines);
    });
    
    // Store all SplitText instances for cleanup
    splitInstances = [
      splitLines_header,
      splitLines_subheader,
      ...splitLines_trail
    ];

    // Split text for highlighter elements
    let highlighterElements = document.querySelectorAll('.ux_text_highlighter_deco');
    highlighterElements.forEach(elem => {
      let split = new SplitText(elem, {
        type: "words",
      });
      splitInstances.push(split);
    });

    // Wrap all lines in container divs with overflow:hidden
    function wrapLines(lines) {
      lines.forEach(line => {
        // Create wrapper div
        const wrapper = document.createElement('div');
        wrapper.className = 'split-line-container';
        wrapper.style.overflow = 'hidden';
        
        // Insert wrapper before the line
        line.parentNode.insertBefore(wrapper, line);
        
        // Move line into wrapper
        wrapper.appendChild(line);
      });
    }
    
    // Apply wrappers to all text elements
    wrapLines(headerLines);
    wrapLines(subheaderLines);
    wrapLines(trailLines);

    // sct_text_decoration_svg.js - get the SVG elements array AFTER SplitText
    const sct_decoration_svg_elements = sct_text_decoration_svg()

    // Set initial state for SVG decoration elements to hide them
    gsap.set(sct_decoration_svg_elements, { opacity: 0 });

    // Set initial position for text elements
    gsap.set(headerLines, {
      y: -110
    });

    gsap.set(ux_cs_banner_company_name_text, {
      y: -110
    });
    
    gsap.set(subheaderLines, {
      y: 110
    });
    
    gsap.set(trailLines, {
      y: 110
    });
  
    gsap.set(ux_cs_banner, {
      // scale: 0.9, 
      // transformOrigin: "50% 50%"
    });
    
    gsap.set(ux_cs_banner_image_wrapper, {
      rotation: 0.1
    });
  
    // Build the animation timeline
    tl_banner_image
    .add('cs_tl_start')
    .fromTo(ux_cs_banner_image, {
      scale: 2
    }, {
      scale: 1,
      duration: 1
    }, 'cs_tl_start+=0')
    .to(ux_cs_banner_image_wrapper, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "sine.out",
      duration: 1.2,
      scale: 1.05
    }, 'cs_tl_start+=0')
    // Start scaling the image wrapper back to 1
    .to(ux_cs_banner_image_wrapper, {
      scale: 1,
      duration: 2,
      ease: "sine.out"
    }, 'cs_tl_start+=1') // Start earlier at 1.2s instead of 1.6s
    // Animate header lines
    .to(headerLines, {
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "sine.out"
    }, 'cs_tl_start+=0.6') 
    // Animate header lines
    .to(ux_cs_banner_company_name_text, {
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "sine.out"
    }, 'cs_tl_start+=0.4') 
    // Animate trail lines
    .to(trailLines, {
      y: 0,
      duration: 0.9,
      // stagger: 0.1,
      ease: "sine.out"
    }, 'cs_tl_start+=0.8') // Start slightly after header lines
    // Animate subheader lines
    .to(subheaderLines, {
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "sine.out"
    }, 'cs_tl_start+=1') // Same timing as trail lines


    .from(ux_cs_page_body, {
      opacity:0,
      ease:"power1.out",
      duration:1,
    }, 'cs_tl_start+=1.4')
    // SVG decorations fade in
    .fromTo([...sct_decoration_svg_elements],
      {
        opacity: 0,
      },
      {
        opacity: 0.7,
        duration: 1,
        ease:'power1.out'
      }, 'cs_tl_start+=1.9');

    return splitInstances;
  }

  // Video ScrollTrigger setup
  function setupVideoScrollTriggers() {
    console.log("Setting up video ScrollTriggers");

    // Get all videos with id="video"
    let videos = document.querySelectorAll('#video');

    // Get all videos with id="first_video"
    let firstVideos = document.querySelectorAll('#first_video');

    console.log(`Found ${videos.length} videos with id="video"`);
    console.log(`Found ${firstVideos.length} videos with id="first_video"`);

    // Create ScrollTriggers for videos with id="video"
    videos.forEach((video, index) => {
      ScrollTrigger.create({
        trigger: video,
        start: "top 100%",
        end: "50% top",
        // markers: true,
        onEnter: () => video.play(),
        onLeave: () => video.pause(),
        onEnterBack: () => video.play(),
        onLeaveBack: () => video.pause(),
        id: `video-${index}`
      });
    });

    // Create ScrollTriggers for videos with id="first_video"
    firstVideos.forEach((video, index) => {
      ScrollTrigger.create({
        trigger: video,
        start: "top 100%",
        end: "50% top",
        // markers: true,
        onEnter: () => video.play(),
        onLeave: () => video.pause(),
        onEnterBack: () => video.play(),
        onLeaveBack: () => video.pause(),
        id: `first-video-${index}`
      });
    });
  }

  // Advanced cleanup function based on the card stack example
  function cleanupSplitText() {
    console.log("Cleaning up SplitText instances");
    
    // First revert all SplitText instances
    splitInstances.forEach(instance => {
      if (instance && typeof instance.revert === 'function') {
        try {
          instance.revert();
        } catch (e) {
          console.warn("Error reverting SplitText:", e);
        }
      }
    });
    
    // Clear the instances array
    splitInstances = [];
    
    // Find and remove all split-line-container elements
    const wrappers = document.querySelectorAll('.split-line-container');
    wrappers.forEach(wrapper => {
      try {
        // Move children back to parent before removing wrapper
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
    
    // Find and remove any remaining split lines
    const lines = document.querySelectorAll('.split-line');
    lines.forEach(line => {
      try {
        // Move children back to parent before removing line
        while (line.firstChild) {
          line.parentNode.insertBefore(line.firstChild, line);
        }
        // Remove the line
        if (line.parentNode) {
          line.parentNode.removeChild(line);
        }
      } catch (e) {
        console.warn("Error removing line:", e);
      }
    });
    
    // Restore original content to text elements
    const header = document.querySelector(".ux_cs_banner_text_header");
    const companyName = document.querySelector(".ux_cs_banner_company_name_text");
    const subheader = document.querySelector(".ux_cs_banner_text_subheader");
    const trails = document.querySelectorAll(".ux_cs_banner_text_trail");

    if (header && originalContent.header) {
      header.innerHTML = originalContent.header;
    }

    if (companyName && originalContent.companyName) {
      companyName.innerHTML = originalContent.companyName;
    }

    if (subheader && originalContent.subheader) {
      subheader.innerHTML = originalContent.subheader;
    }

    trails.forEach((trail, i) => {
      if (trail && originalContent.trail[i]) {
        trail.innerHTML = originalContent.trail[i];
      }
    });
  }

  // Improved killAll function with proper cleanup
  function killAll() {
    console.log("Killing all animations and SplitText instances");

    // Prevent reinitializing immediately
    window.uxCaseStudyInitialized = false;

    // Kill all GSAP animations targeting specific elements
    const animatedElements = [
      "html",
      "#ux_cs_banner",
      ".ux_cs_banner_text_header",
      ".ux_cs_banner_company_name_text",
      ".ux_cs_banner_text_subheader",
      ".ux_cs_banner_text_trail",
      ".ux_cs_banner_image_wrapper",
      ".ux_cs_banner_image",
      ".ap_grid_container.ux_cs.body",
      ".ux_text_highlighter_deco",
      ".sct_text_decoration_word",
      ".split-line",
      ".split-line-container"
    ];

    animatedElements.forEach(selector => {
      gsap.killTweensOf(selector);
    });

    // Kill banner timeline if it exists
    if (animations.banner) {
      animations.banner.kill();
      animations.banner.clear();
      animations.banner = null;
    }

    // Kill GSDevTools if they exist
    // if (animations.devTools) {
    //   animations.devTools.kill();
    //   animations.devTools = null;
    // }

    // Remove SVG text decorations
    const svgDecorations = document.querySelectorAll('.sct_text_decoration_word');
    svgDecorations.forEach(el => el.remove());
    console.log(`Removed ${svgDecorations.length} SVG decoration elements`);

    // Clean up SplitText
    cleanupSplitText();

    // Only kill ScrollTrigger instances related to case study
    ScrollTrigger.getAll().forEach(trigger => {
      // Explicitly check for the footer ID to avoid killing it
      if (trigger.vars && trigger.vars.id !== "ux_footer") {
        trigger.kill();
      }
    });

    // Pause all videos before reinitializing
    document.querySelectorAll('#video, #first_video').forEach(video => {
      video.pause();
    });

    // Clear properties on affected elements
    gsap.set(animatedElements, {
      clearProps: "all"
    });

    // Force a reflow to ensure DOM is properly updated
    document.body.offsetHeight;

    // Refresh ScrollTrigger to recalculate positions
    ScrollTrigger.refresh();

    // Wait for videos and images to be ready before reinitializing
    gsap.delayedCall(0.5, () => {
      console.log('🔄 Reinitializing after resize...');

      // Wait for videos first
      checkVideosLoaded().then(() => {
        // Then wait for images
        imagesLoaded(document.body, { background: true }, function() {
          console.log('✅ Videos and images ready after resize');
          // Small delay to ensure layout is stable
          setTimeout(() => {
            init();
          }, 50);
        });
      });
    });
  }

  // Debounce function for resize events
  function debounce(func) {
    var timer;
    return function(event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, 300, event);
    };
  }

  // Track viewport state to detect mobile/desktop transitions
  let wasMobile = window.innerWidth <= 768;

  // Add resize event listener with debounce
  window.addEventListener("resize", debounce(function() {
    const currentWidth = window.innerWidth;
    const isMobile = currentWidth <= 768;

    // Skip resize handling ONLY if we're mobile AND were already mobile
    // This prevents scroll-induced refreshes on mobile while still handling mobile↔desktop transitions
    if (isMobile && wasMobile) {
      console.log("📱 Mobile resize ignored - preventing scroll interference");
      return;
    }

    console.log(`🔄 Resize detected - ${wasMobile ? 'mobile' : 'desktop'} → ${isMobile ? 'mobile' : 'desktop'} - reinitializing`);
    wasMobile = isMobile;
    killAll();
  }));
  
  // Run the init function
  init();
  
  // Return public methods
  return {
    init: init,
    killAll: killAll,
    reinitialize: function() {
      window.uxCaseStudyInitialized = false;
      killAll();
    }
  };
}

// Initialize for case study page and make it available globally
window.uxCaseStudyModule = null;

// Only initialize if we're on the correct page
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    if (document.body.classList.contains("ux_case_study")) {
      window.uxCaseStudyModule = ux_case_study();
    }
  });
} else {
  // DOM already loaded
  if (document.body.classList.contains("ux_case_study")) {
    window.uxCaseStudyModule = ux_case_study();
  }
}

export default ux_case_study;