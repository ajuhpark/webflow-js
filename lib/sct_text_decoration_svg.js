/**
 * sct gradient
*/


import '../src/styles/style.css'
import { gsap } from 'gsap'
import rough from 'roughjs'
// import { SplitText } from 'gsap/SplitText'


// gsap.registerPlugin(SplitText)
// gsap.registerPlugin(GSDevTools)
// gsap.registerPlugin(ScrollTrigger)

// make the mobile size stay the same
// ScrollTrigger.normalizeScroll(true);
// ScrollTrigger.config({
//   ignoreMobileResize: true,
// });


function sct_text_decoration_svg() {
  console.log('sct_text_decoration_svg.js is working')

  function init() {
    console.log('sct_text_decoration_svg init is working')

    // Array to store all created SVG elements
    const allSvgElements = [];

    // Color mapping - easy to add more colors!
    const colors = {
      blue: 'var(--color--blue--400)',
      gold: 'var(--_theme---color_group_3--color-300)',
      teal: 'var(--_theme---color_group_2--color-200)'
    };

    // Helper function to get color from element classes
    function getColor(element) {
      for (let colorName in colors) {
        if (element.classList.contains(colorName)) {
          return colors[colorName];
        }
      }
      return colors.blue; // default color
    }

    // === ROUGH ELLIPSE ===
    const spanEllipses = document.querySelectorAll('.sct_text_decoration_word.ellipse');

    spanEllipses.forEach((spanEllipse, index) => {
      console.log('Found ellipse span:', spanEllipse);

      // Create empty SVG container for rough ellipse
      const svgEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgEllipse.id = `text-border-ellipse-${index}`;
      svgEllipse.style.position = 'absolute';
      svgEllipse.style.pointerEvents = 'none';
      svgEllipse.style.zIndex = '1';
      svgEllipse.style.opacity = '0'; // Initial hidden state
      document.body.appendChild(svgEllipse);
      allSvgElements.push(svgEllipse);

      // Initialize rough.js for ellipse
      const rcEllipse = rough.svg(svgEllipse);
      let isRoughEllipseCreated = false;

      function positionEllipse() {
        const rect = spanEllipse.getBoundingClientRect();

        // Adjust these values to control padding around the text
        const paddingX = 10; // horizontal padding (left/right)
        const paddingY = 10; // vertical padding (top/bottom)

        // Use absolute positioning with document coordinates
        svgEllipse.style.position = 'absolute';
        svgEllipse.style.left = (rect.left + window.scrollX - paddingX) + 'px';
        svgEllipse.style.top = (rect.top + window.scrollY - paddingY) + 'px';
        svgEllipse.style.width = (rect.width + paddingX * 2) + 'px';
        svgEllipse.style.height = (rect.height + paddingY * 2) + 'px';

        // Create rough ellipse only once (with a seed so it's always the same)
        if (!isRoughEllipseCreated) {
          const width = rect.width + paddingX * 2;
          const height = rect.height + paddingY * 2;

          const roughEllipse = rcEllipse.ellipse(
            width / 2,  // center x (50%)
            height / 2, // center y (50%)
            width * 0.96,  // width (rx="48%" * 2)
            height * 0.90, // height (ry="45%" * 2)
            {
              stroke: getColor(spanEllipse),
              strokeWidth: 3,
              fill: 'none',
              roughness: 1.5,  // Increased from 0.5 for more irregularity
              bowing: 2,       // Increased from 1 for more curve variation
              disableMultiStroke: true,  // Single stroke makes imperfections more visible
              seed: 12345 + index // Different seed for each ellipse

              
            }
          );

          svgEllipse.appendChild(roughEllipse);
          isRoughEllipseCreated = true;
        }
      }

      positionEllipse();
      window.addEventListener('resize', positionEllipse);
    });

    // === ROUGH RECTANGLE ===
    const spanRectangles = document.querySelectorAll('.sct_text_decoration_word.rectangle');

    spanRectangles.forEach((spanRectangle, index) => {
      console.log('Found rectangle span:', spanRectangle);

      // Create empty SVG container for rough rectangle
      const svgRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgRectangle.id = `text-border-rectangle-${index}`;
      svgRectangle.style.position = 'absolute';
      svgRectangle.style.pointerEvents = 'none';
      svgRectangle.style.zIndex = '1';
      svgRectangle.style.opacity = '0'; // Initial hidden state
      document.body.appendChild(svgRectangle);
      allSvgElements.push(svgRectangle);

      // Initialize rough.js for rectangle
      const rcRectangle = rough.svg(svgRectangle);
      let isRoughRectangleCreated = false;

      function positionRectangle() {
        const rect = spanRectangle.getBoundingClientRect();

        // Adjust these values to control padding around the text
        const paddingX = 10; // horizontal padding (left/right)
        const paddingY = 10; // vertical padding (top/bottom)

        // Use absolute positioning with document coordinates
        svgRectangle.style.position = 'absolute';
        svgRectangle.style.left = (rect.left + window.scrollX - paddingX) + 'px';
        svgRectangle.style.top = (rect.top + window.scrollY - paddingY) + 'px';
        svgRectangle.style.width = (rect.width + paddingX * 2) + 'px';
        svgRectangle.style.height = (rect.height + paddingY * 2) + 'px';

        // Create rough rectangle only once (with a seed so it's always the same)
        if (!isRoughRectangleCreated) {
          const width = rect.width + paddingX * 2;
          const height = rect.height + paddingY * 2;

          const roughRectangle = rcRectangle.rectangle(
            0,      // x position (top-left corner)
            0,      // y position (top-left corner)
            width,  // width
            height, // height
            {
              stroke: getColor(spanRectangle),
              strokeWidth: 3,
              fill: 'none',
              roughness: 0.5,
              bowing: 1,
              seed: 23456 + index // Different seed for each rectangle
            }
          );

          svgRectangle.appendChild(roughRectangle);
          isRoughRectangleCreated = true;
        }
      }

      positionRectangle();
      window.addEventListener('resize', positionRectangle);
    });

    // === ROUGH LINE ===
    const spanLines = document.querySelectorAll('.sct_text_decoration_word.line');

    spanLines.forEach((spanLine, spanIndex) => {
      console.log('Found line span:', spanLine);

      // Create empty SVG container for rough line
      const svgLine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgLine.id = `text-border-line-${spanIndex}`;
      svgLine.style.position = 'absolute';
      svgLine.style.pointerEvents = 'none';
      svgLine.style.zIndex = '1';
      svgLine.style.opacity = '0'; // Initial hidden state
      document.body.appendChild(svgLine);
      allSvgElements.push(svgLine);

      // Initialize rough.js for line
      const rcLine = rough.svg(svgLine);

      function positionLine() {
        // Get all line boxes (one for each wrapped line)
        const rects = spanLine.getClientRects();

        if (rects.length === 0) return;

        // Find the bounding box that contains all lines
        let minLeft = Infinity, minTop = Infinity;
        let maxRight = -Infinity, maxBottom = -Infinity;

        for (let rect of rects) {
          minLeft = Math.min(minLeft, rect.left);
          minTop = Math.min(minTop, rect.top);
          maxRight = Math.max(maxRight, rect.right);
          maxBottom = Math.max(maxBottom, rect.bottom);
        }

        const totalWidth = maxRight - minLeft;
        const totalHeight = maxBottom - minTop;

        // Adjust these values to control padding around the text
        const paddingX = 0; // horizontal padding (left/right)
        const paddingY = 5; // vertical padding (adds space below each line)

        // Use absolute positioning with document coordinates
        svgLine.style.position = 'absolute';
        svgLine.style.left = (minLeft + window.scrollX) + 'px';
        svgLine.style.top = (minTop + window.scrollY) + 'px';
        svgLine.style.width = totalWidth + 'px';
        svgLine.style.height = (totalHeight + paddingY) + 'px';

        // Clear existing lines
        while (svgLine.firstChild) {
          svgLine.removeChild(svgLine.firstChild);
        }

        // Draw a line under each line of text
        Array.from(rects).forEach((rect, index) => {
          const lineStartX = rect.left - minLeft;
          const lineEndX = rect.right - minLeft;
          const lineY = (rect.bottom - minTop) + paddingY;

          const roughLine = rcLine.line(
            lineStartX, // start x (left edge of this line)
            lineY,      // start y (bottom of this line)
            lineEndX,   // end x (right edge of this line)
            lineY,      // end y (same as start for horizontal line)
            {
              stroke: getColor(spanLine),
              strokeWidth: 3,
              roughness: 0.5,
              bowing: 1,
              seed: 54321 + (spanIndex * 100) + index // Unique seed for each line
            }
          );

          svgLine.appendChild(roughLine);
        });
      }

      positionLine();
      window.addEventListener('resize', positionLine);
    });

    // === HIGHLIGHT TOP RIGHT ===
    const spanHighlightTopRight = document.querySelectorAll('.sct_text_decoration_word.highlight_top_right_1');

    spanHighlightTopRight.forEach((spanHighlight, index) => {
      console.log('Found highlight_top_right_1 span:', spanHighlight);

      // Create SVG container with the HIGHLIGHT_TOP_RIGHT.SVG content
      const svgHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgHighlight.id = `highlight-top-right-${index}`;
      svgHighlight.setAttribute('viewBox', '0 0 55 51');
      svgHighlight.setAttribute('fill', 'none');
      svgHighlight.style.position = 'absolute';
      svgHighlight.style.pointerEvents = 'none';
      svgHighlight.style.zIndex = '1';
      svgHighlight.style.height = '24px';
      svgHighlight.style.width = 'auto';
      svgHighlight.style.opacity = '0'; // Initial hidden state

      // Add the SVG path content
      svgHighlight.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0001 47.8559C11.0114 46.8205 11.9246 45.9896 13.0397 46.0001C22.263 46.0871 31.4498 46.5781 40.6021 47.0672C41.767 47.1294 42.9314 47.1916 44.0952 47.253C45.2086 47.3117 46.0599 48.1974 45.9967 49.2313C45.9335 50.2651 44.9796 51.0556 43.8663 50.9969C42.6995 50.9354 41.5342 50.8732 40.3701 50.811C31.2066 50.3214 22.1197 49.8359 12.9987 49.7499C11.8836 49.7393 10.9888 48.8914 11.0001 47.8559Z" fill="${getColor(spanHighlight)}"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M54.9414 23.5543C55.2048 24.6508 54.5557 25.7597 53.4914 26.0312C51.4829 26.5434 49.4757 27.0529 47.4702 27.562C35.749 30.5372 24.0826 33.4985 12.5344 36.9198C11.4807 37.232 10.3808 36.605 10.0778 35.5194C9.77482 34.4338 10.3834 33.3007 11.4371 32.9885C23.065 29.5436 34.8148 26.5612 46.5329 23.5869C48.5355 23.0786 50.5372 22.5705 52.5372 22.0604C53.6015 21.789 54.6779 22.4578 54.9414 23.5543Z" fill="${getColor(spanHighlight)}"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M30.5683 0.723125C31.2416 1.56018 31.1132 2.78806 30.2815 3.46568L3.15662 25.5656C2.32493 26.2432 1.10492 26.1139 0.431651 25.2769C-0.241621 24.4398 -0.113199 23.2119 0.71849 22.5343L27.8434 0.434435C28.6751 -0.24318 29.8951 -0.113929 30.5683 0.723125Z" fill="${getColor(spanHighlight)}"/>
      `;

      document.body.appendChild(svgHighlight);
      allSvgElements.push(svgHighlight);

      function positionHighlight() {
        const rect = spanHighlight.getBoundingClientRect();

        // Adjust size and offset based on screen width
        const isMobile = window.innerWidth < 768;
        const height = isMobile ? '18px' : '24px';
        const offset = isMobile ? 4 : 5;

        svgHighlight.style.height = height;

        const svgRect = svgHighlight.getBoundingClientRect();

        // Position the middle of the SVG at the top right of the text element
        // Add offset to move it down and to the right
        svgHighlight.style.position = 'absolute';
        svgHighlight.style.left = (rect.right + window.scrollX + offset) + 'px';
        svgHighlight.style.top = (rect.top + window.scrollY - (svgRect.height / 2) + offset) + 'px';
      }

      positionHighlight();
      window.addEventListener('resize', positionHighlight);
    });

    // === UNDERLINE 2 ===
    const spanUnderline2 = document.querySelectorAll('.sct_text_decoration_word.underline_2');

    spanUnderline2.forEach((spanUnderline, index) => {
      console.log('Found underline_2 span:', spanUnderline);

      // Create SVG container with the UNDERLINE_2.SVG content
      const svgUnderline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgUnderline.id = `underline-2-${index}`;
      svgUnderline.setAttribute('viewBox', '0 0 751 36');
      svgUnderline.setAttribute('fill', 'none');
      svgUnderline.style.position = 'absolute';
      svgUnderline.style.pointerEvents = 'none';
      svgUnderline.style.zIndex = '1';
      svgUnderline.style.opacity = '0'; // Initial hidden state

      // Add the SVG path content
      svgUnderline.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M133.514 12.8204C125.316 14.3549 117.621 16.5764 110.681 19.6911C109.925 20.0346 109.696 20.5154 109.628 20.7216C109.513 21.088 109.559 21.4317 109.742 21.7523C109.857 21.9584 110.04 22.2104 110.429 22.3707C110.704 22.4852 111.414 22.5767 112.353 22.5538C113.956 22.5309 116.43 22.3478 117.621 22.3478C121.697 22.3936 125.774 22.3705 129.85 22.4392C142.836 22.6682 145.103 22.8514 161.798 22.714C181.288 22.5537 200.824 22.2789 220.336 21.8667C158.318 25.302 96.3903 29.3099 34.7837 33.0429C34.0966 33.0887 33.5699 33.6843 33.6157 34.3714C33.6386 35.0814 34.2568 35.6082 34.9439 35.5624C178.7 26.8596 324.037 16.5993 468.893 15.9351C476.038 16.0954 483.16 16.2556 490.26 16.4159C533.156 17.4236 576.074 18.6375 618.924 20.5155C632.871 21.1339 646.819 21.8209 660.789 22.4621C664.911 22.6454 669.057 22.8285 673.202 23.0118C676.546 23.1492 685.157 23.6531 686.37 23.676C687.47 23.6989 687.745 22.7143 687.768 22.6685C687.836 22.3478 687.79 21.9812 687.516 21.6377C687.447 21.5461 687.264 21.2943 686.851 21.1798C686.783 21.1798 686.462 21.1338 685.798 21.0651C651.353 18.2482 616.817 16.3015 582.212 15.0648C586.861 15.1106 591.51 15.1336 596.159 15.1794C632.001 15.4542 667.934 16.439 703.753 15.1794C711.906 14.9046 720.082 14.5838 728.213 14.1945C733.686 13.9426 747.771 14.2633 749.763 13.6678C750.679 13.4159 750.885 12.7746 750.908 12.4539C750.931 12.0875 750.863 11.6753 750.45 11.3088C750.267 11.1256 749.695 10.828 748.618 10.599C713.464 2.9726 672.331 5.12524 636.536 2.99535C539.316 -2.84469 442.44 1.04883 345.244 4.59866C261.354 7.66754 177.463 7.82781 93.619 11.996C62.9302 13.5075 31.2797 11.7671 1.02608 17.5384C0.339013 17.6758 -0.0962711 18.3168 0.0182392 19.0039C0.155652 19.691 0.819868 20.1491 1.50693 20.0117C31.6231 14.2633 63.1593 16.0267 93.7336 14.5152C106.994 13.851 120.254 13.3014 133.514 12.8204ZM392.88 14.5152C341.511 13.7136 290.142 13.3013 238.727 13.5532C203.458 13.7135 152.065 7.00344 117.025 19.8286C117.277 19.8286 117.483 19.8286 117.666 19.8286C121.743 19.8744 125.819 19.8284 129.896 19.92C142.859 20.1491 145.126 20.3323 161.776 20.1948C204.351 19.8284 247.04 18.9125 289.592 17.4926C324.06 16.3475 358.482 15.3167 392.88 14.5152ZM740.373 11.5607C707.143 5.74358 669.469 7.48438 636.375 5.5148C539.247 -0.325236 442.44 3.56801 345.336 7.11784C301.936 8.72098 258.56 9.52251 215.206 10.5073C223.52 10.8279 231.467 11.0569 238.727 11.034C312.219 10.6676 385.689 11.6525 459.182 13.2099C504.826 12.5228 550.47 12.2709 596.182 12.6373C632.001 12.935 667.865 13.897 703.684 12.6602C711.815 12.3854 719.968 12.0647 728.098 11.6753C730.869 11.5608 735.885 11.5836 740.373 11.5607Z" fill="${getColor(spanUnderline)}"/>
      `;

      document.body.appendChild(svgUnderline);
      allSvgElements.push(svgUnderline);

      function positionUnderline() {
        const rect = spanUnderline.getBoundingClientRect();

        // Adjust positioning to place underline below text
        const paddingY = 5; // vertical offset below text

        svgUnderline.style.position = 'absolute';
        svgUnderline.style.left = (rect.left + window.scrollX) + 'px';
        svgUnderline.style.top = (rect.bottom + window.scrollY + paddingY) + 'px';
        svgUnderline.style.width = rect.width + 'px';
        svgUnderline.style.height = 'auto';
      }

      positionUnderline();
      window.addEventListener('resize', positionUnderline);
    });

    // === UNDERLINE 3 ===
    const spanUnderline3 = document.querySelectorAll('.sct_text_decoration_word.underline_3');

    spanUnderline3.forEach((spanUnderline, index) => {
      console.log('Found underline_3 span:', spanUnderline);

      // Create SVG container with the UNDERLINE_3.SVG content
      const svgUnderline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgUnderline.id = `underline-3-${index}`;
      svgUnderline.setAttribute('viewBox', '0 0 701 41');
      svgUnderline.setAttribute('fill', 'none');
      svgUnderline.style.position = 'absolute';
      svgUnderline.style.pointerEvents = 'none';
      svgUnderline.style.zIndex = '1';
      svgUnderline.style.opacity = '0'; // Initial hidden state

      // Add the SVG path content
      svgUnderline.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M297.372 3.8421C264.478 5.15876 231.969 6.77771 200.269 8.54764C155.392 11.0514 110.534 13.6416 65.9454 17.7427C51.9099 19.0377 37.6568 19.8579 23.7091 21.4767C14.9537 22.4912 3.34411 23.9372 1.82051 24.2393C1.0236 24.412 0.675935 24.6713 0.563595 24.7576C-0.226293 25.362 -0.0821673 25.9445 0.363681 26.3978C0.542722 26.5921 0.995464 27.0671 2.25226 27.1319C86.3034 31.5567 172.25 22.9229 256.403 22.0163C402.339 20.4623 552.699 26.6354 697.477 40.1042C698.74 40.2121 699.969 39.6723 700.145 38.8737C700.355 38.0967 699.443 37.3412 698.179 37.2333C553.156 23.7429 402.55 17.5482 256.333 19.1238C177.906 19.9656 97.9305 27.5419 19.3946 24.9518C21.199 24.736 22.9685 24.52 24.5834 24.3258C38.4749 22.7069 52.6683 21.9084 66.6475 20.6133C111.141 16.5122 155.908 13.9221 200.725 11.4399C256.333 8.33172 314.363 5.65522 372.85 4.40332C393.773 4.59758 414.626 4.79193 435.479 5.02936C480.591 5.54738 525.913 7.05831 570.919 9.08725C584.47 9.7132 598.021 10.3607 611.572 10.9219C616.066 11.1161 627.651 11.6772 629.266 11.6341C631.267 11.5909 631.653 10.5549 631.688 10.3823C631.793 9.99375 631.723 9.45411 630.74 9.00083C630.634 8.93608 630.003 8.7201 628.598 8.59059C546.766 0.949676 459.387 -0.323609 372.921 1.51107C281.715 0.712447 190.158 0.366936 99.1839 0C97.8815 0 96.8177 0.64763 96.8072 1.44626C96.8002 2.24488 97.8498 2.89253 99.1522 2.91412C165.025 3.17313 231.232 3.432 297.372 3.8421Z" fill="${getColor(spanUnderline)}"/>
      `;

      document.body.appendChild(svgUnderline);
      allSvgElements.push(svgUnderline);

      function positionUnderline() {
        const rect = spanUnderline.getBoundingClientRect();

        // Adjust positioning to place underline below text
        const paddingY = 5; // vertical offset below text

        svgUnderline.style.position = 'absolute';
        svgUnderline.style.left = (rect.left + window.scrollX) + 'px';
        svgUnderline.style.top = (rect.bottom + window.scrollY + paddingY) + 'px';
        svgUnderline.style.width = rect.width + 'px';
        svgUnderline.style.height = 'auto';
      }

      positionUnderline();
      window.addEventListener('resize', positionUnderline);
    });

    // === UNDERLINE 1 ===
    const spanUnderline1 = document.querySelectorAll('.sct_text_decoration_word.underline_1');

    spanUnderline1.forEach((spanUnderline, index) => {
      console.log('Found underline_1 span:', spanUnderline);

      // Create SVG container with the UNDERLINE_1.SVG content
      const svgUnderline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgUnderline.id = `underline-1-${index}`;
      svgUnderline.setAttribute('viewBox', '0 0 600 54');
      svgUnderline.setAttribute('fill', 'none');
      svgUnderline.style.position = 'absolute';
      svgUnderline.style.pointerEvents = 'none';
      svgUnderline.style.zIndex = '1';
      svgUnderline.style.opacity = '0'; // Initial hidden state

      // Add the SVG path content
      svgUnderline.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M359.081 24.664C279.232 25.6231 199.343 29.4278 119.842 36.2287C82.0441 39.4627 38.1499 39.0584 1.49101 50.0841C-0.335611 50.639 0.0122627 52.3035 0.0517999 52.47C0.130874 52.8108 0.463072 53.9442 1.91804 53.9997C2.07619 54.0076 3.19106 53.8491 3.61806 53.7936C14.4433 52.3669 25.2291 50.7024 36.0623 49.3549C73.4645 44.6863 110.977 41.159 148.546 38.0677C198.41 33.9618 248.701 31.774 298.7 30.0619C326.068 29.1266 354.092 30.371 381.546 28.437C391.628 28.3815 401.71 28.3737 411.792 28.4054C453.939 28.556 496.038 30.1571 538.114 32.3528C551.643 33.0582 561.962 33.8191 575.207 34.3344C580.237 34.5325 588.215 34.6673 593.766 34.7545C594.581 34.7703 596.66 34.786 597.522 34.794C597.609 34.8098 597.696 34.8098 597.791 34.8098C598.123 34.8098 598.281 34.786 598.313 34.786C600.195 34.5086 600.021 32.7252 599.974 32.4557C599.966 32.4002 599.681 30.8942 598.06 30.8387C597.673 30.8228 594.897 30.8071 593.829 30.7913C588.31 30.7041 580.363 30.5693 575.358 30.3791C562.137 29.8639 551.825 29.1029 538.319 28.3975C496.18 26.2019 454.018 24.5928 411.808 24.4422C406.652 24.4263 401.489 24.4184 396.333 24.4263C396.159 23.9745 395.772 23.4672 394.918 23.2453C394.119 23.0392 388.402 22.8569 386.196 22.6746C369.867 21.3271 370.349 21.3905 352.384 20.2887C325.174 18.6163 321.031 18.2356 292.73 17.5302C241.324 16.2461 189.894 16.3493 138.48 16.4761C113.097 16.5474 85.9187 18.2674 60.1483 15.0572C68.6409 14.0585 77.1652 13.3293 85.6736 12.497C114.726 9.65933 143.801 7.89958 172.972 6.66305C242.945 3.69857 313.028 2.51762 382.978 6.5601C368.088 6.70278 353.206 7.03559 338.316 7.2496C277.706 8.13736 216.51 7.47161 156.026 12.0769C154.943 12.1641 154.128 13.1152 154.207 14.2011C154.286 15.295 155.243 16.1114 156.327 16.0322C216.731 11.4269 277.84 12.1006 338.372 11.2128C360.861 10.8878 383.341 10.3013 405.83 10.4757C413.548 10.5391 421.265 10.8245 428.983 10.9196C430.509 10.9434 434.439 11.2446 435.001 11.1178C436.242 10.8404 436.511 9.92085 436.59 9.46904C436.629 9.19955 436.756 7.64596 434.858 7.09111C421.906 3.30228 398.002 3.47666 385.413 2.73157C314.602 -1.46944 243.648 -0.296356 172.806 2.69984C143.564 3.94429 114.417 5.71199 85.2861 8.55758C75.1093 9.54839 64.9087 10.4044 54.7713 11.7202C53.1345 11.9342 49.4576 12.2434 47.6784 12.5684C46.9351 12.7032 46.3974 12.8933 46.1601 13.028C45.235 13.5512 45.0689 14.3121 45.0689 14.8273C45.061 15.2236 45.2271 16.6187 47.1644 16.9992C76.6829 22.7934 108.803 20.5186 138.487 20.4393C189.87 20.3125 241.26 20.2093 292.635 21.4934C320.865 22.1988 324.992 22.5716 352.146 24.244C354.827 24.4026 357.096 24.5451 359.081 24.664Z" fill="${getColor(spanUnderline)}"/>
      `;

      document.body.appendChild(svgUnderline);
      allSvgElements.push(svgUnderline);

      function positionUnderline() {
        const rect = spanUnderline.getBoundingClientRect();

        // Adjust positioning to place underline below text
        const paddingY = -10; // vertical offset below text

        svgUnderline.style.position = 'absolute';
        svgUnderline.style.left = (rect.left + window.scrollX) + 'px';
        svgUnderline.style.top = (rect.bottom + window.scrollY + paddingY) + 'px';
        svgUnderline.style.width = rect.width + 'px';
        svgUnderline.style.height = 'auto';
      }

      positionUnderline();
      window.addEventListener('resize', positionUnderline);
    });

    // === HIGHLIGHT TOP LEFT ===
    const spanHighlightTopLeft = document.querySelectorAll('.sct_text_decoration_word.highlight_top_left');

    spanHighlightTopLeft.forEach((spanHighlight, index) => {
      console.log('Found highlight_top_left span:', spanHighlight);

      // Create SVG container with the HIGHLIGHT_05.SVG content
      const svgHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgHighlight.id = `highlight-top-left-${index}`;
      svgHighlight.setAttribute('viewBox', '0 0 72 78');
      svgHighlight.setAttribute('fill', 'none');
      svgHighlight.style.position = 'absolute';
      svgHighlight.style.pointerEvents = 'none';
      svgHighlight.style.zIndex = '1';
      svgHighlight.style.height = '24px';
      svgHighlight.style.width = 'auto';
      svgHighlight.style.opacity = '0'; // Initial hidden state

      // Add the SVG path content
      svgHighlight.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4259 68.5278C16.0259 66.7318 9.32534 65.8258 2.82534 64.9958C1.42534 64.8218 0.125535 65.7928 0.0255346 67.1608C-0.174465 68.5298 0.826121 69.7818 2.12612 69.9557C8.42612 70.7548 14.9255 71.6097 21.0255 73.3387C22.3255 73.7137 23.7261 72.9418 24.1261 71.6138C24.5261 70.2868 23.7259 68.9038 22.4259 68.5278Z" fill="${getColor(spanHighlight)}"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M41.8251 43.0648C31.5251 32.5538 19.9251 23.3958 9.8251 12.6028C8.9251 11.5948 7.3251 11.5408 6.3251 12.4818C5.3251 13.4238 5.22549 15.0078 6.22549 16.0158C16.3255 26.8398 27.9255 36.0278 38.2255 46.5698C39.2255 47.5538 40.8251 47.5678 41.8251 46.5998C42.7251 45.6328 42.8251 44.0488 41.8251 43.0648Z" fill="${getColor(spanHighlight)}"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M61.1264 2.63576C61.4264 8.65176 61.7259 14.6678 62.0259 20.6848C62.0259 22.0628 63.2264 23.1268 64.6264 23.0598C66.0264 22.9918 67.0259 21.8188 67.0259 20.4398C66.7259 14.4138 66.4264 8.38876 66.1264 2.36376C66.0264 0.985757 64.8262 -0.0712432 63.4262 0.00375683C62.1262 0.0787568 61.0264 1.25876 61.1264 2.63576Z" fill="${getColor(spanHighlight)}"/>
      `;

      document.body.appendChild(svgHighlight);
      allSvgElements.push(svgHighlight);

      function positionHighlight() {
        const rect = spanHighlight.getBoundingClientRect();

        // Adjust size and offset based on screen width
        const isMobile = window.innerWidth < 768;
        const height = isMobile ? '18px' : '24px';
        const offsetHorizontal = isMobile ? 8 : 5;
        const offsetVertical = isMobile ? 0 : 5;

        svgHighlight.style.height = height;

        const svgRect = svgHighlight.getBoundingClientRect();

        // Position the middle of the SVG at the top left of the text element
        // Add offset to move it down and to the right
        svgHighlight.style.position = 'absolute';
        svgHighlight.style.left = (rect.left + window.scrollX - svgRect.width + offsetHorizontal) + 'px';
        svgHighlight.style.top = (rect.top + window.scrollY - (svgRect.height / 2) + offsetVertical) + 'px';
      }

      positionHighlight();
      window.addEventListener('resize', positionHighlight);
    });

    // === HIGHLIGHT TOP LEFT 1 ===
    const spanHighlightTopLeft1 = document.querySelectorAll('.sct_text_decoration_word.highlight_top_left_1');

    spanHighlightTopLeft1.forEach((spanHighlight, index) => {
      console.log('Found highlight_top_left_1 span:', spanHighlight);

      // Create SVG container with the HIGHLIGHT_11.SVG content
      const svgHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgHighlight.id = `highlight-top-left-1-${index}`;
      svgHighlight.setAttribute('viewBox', '0 0 231 196');
      svgHighlight.setAttribute('fill', 'none');
      svgHighlight.style.position = 'absolute';
      svgHighlight.style.pointerEvents = 'none';
      svgHighlight.style.zIndex = '1';
      svgHighlight.style.height = '24px';
      svgHighlight.style.width = 'auto';
      svgHighlight.style.opacity = '0'; // Initial hidden state

      // Add the SVG path content
      svgHighlight.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M136.344 46.6004C132.114 43.1507 127.436 40.1505 122.593 37.7115C113.122 32.9405 98.9024 28.6461 85.7365 28.5245C76.7118 28.4411 68.186 30.3305 61.8892 35.1961C49.8958 44.4634 47.426 60.4715 50.8528 77.1044C53.3523 89.2355 58.9643 101.682 66.052 111.9C58.0011 107.3 47.5902 103.034 37.48 101.984C26.1467 100.799 15.2048 103.608 8.0621 114.068C-6.86421 135.932 0.610674 157.086 16.8256 172.355C32.7553 187.353 57.1842 196.559 76.4641 194.985C77.4836 194.898 78.243 194.003 78.1597 192.984C78.0763 191.966 77.1816 191.206 76.1628 191.293C57.7924 192.787 34.5434 183.951 19.3658 169.657C4.47405 155.635 -2.58652 136.234 11.1216 116.161C17.4128 106.948 27.113 104.621 37.096 105.664C47.4815 106.751 58.1888 111.437 66.0477 116.192C68.1761 117.476 70.323 118.748 72.4526 120.051C78.1646 126.454 84.4268 131.276 90.5754 133.61C92.1024 134.184 92.805 133.184 92.9884 132.894C93.2391 132.499 93.4818 131.863 93.0773 131.041C93.0014 130.887 92.8143 130.597 92.4815 130.276C92.0265 129.844 91.0132 129.047 90.5927 128.658C88.8577 127.04 86.9553 125.552 85.0832 124.107C81.8292 121.588 78.3727 119.347 74.8644 117.192C74.3624 116.618 73.8659 116.037 73.3744 115.445C64.5788 104.806 57.367 90.3637 54.481 76.3574C51.3628 61.2217 53.2411 46.5603 64.1546 38.1277C69.8352 33.7382 77.5608 32.1539 85.7025 32.2292C98.2862 32.3453 111.874 36.46 120.927 41.0199C126.456 43.8052 131.762 47.3574 136.372 51.4987C137.902 52.8731 139.297 54.4328 140.635 55.9944C140.782 56.166 140.985 56.4198 141.21 56.7106C141.794 57.5831 142.412 58.4234 143.063 59.2292C143.407 59.6534 143.641 59.8046 143.684 59.8318C144.803 60.5474 145.599 59.9467 145.938 59.6355C146.038 59.5429 147.054 58.5488 146.228 57.241C146.06 56.9761 145.014 55.5584 144.181 54.4909C138.001 45.1815 136.077 32.0798 138.807 21.4454C140.537 14.704 144.149 8.94317 149.872 5.93679C153.678 3.9381 158.399 3.1774 164.063 4.08568C177.722 6.2764 189.164 14.0705 199.345 23.6657C209.761 33.4814 218.858 45.1908 227.575 54.9885C228.254 55.7523 229.426 55.8208 230.19 55.141C230.953 54.4618 231.022 53.2899 230.342 52.5261C221.559 42.6524 212.382 30.8615 201.886 20.9693C191.155 10.8573 179.045 2.73654 164.649 0.427879C158.06 -0.629201 152.577 0.331585 148.149 2.65691C141.523 6.13688 137.222 12.7195 135.219 20.5241C133.125 28.6801 133.559 38.1598 136.344 46.6004Z" fill="${getColor(spanHighlight)}"/>
      `;

      document.body.appendChild(svgHighlight);
      allSvgElements.push(svgHighlight);

      function positionHighlight() {
        const rect = spanHighlight.getBoundingClientRect();

        // Adjust size and offset based on screen width
        const isMobile = window.innerWidth < 768;
        const height = isMobile ? '38px' : '74px';
        const offsetHorizontal = isMobile ? 8 : 5;
        const offsetVertical = isMobile ? 0 : 5;

        svgHighlight.style.height = height;

        const svgRect = svgHighlight.getBoundingClientRect();

        // Position the middle of the SVG at the top left of the text element
        // Add offset to move it down and to the right
        svgHighlight.style.position = 'absolute';
        svgHighlight.style.left = (rect.left + window.scrollX - svgRect.width + offsetHorizontal) + 'px';
        svgHighlight.style.top = (rect.top + window.scrollY - (svgRect.height / 2) + offsetVertical) + 'px';
      }

      positionHighlight();
      window.addEventListener('resize', positionHighlight);
    });

    // === HIGHLIGHT TOP RIGHT 2 ===
    const spanHighlightTopRight2 = document.querySelectorAll('.sct_text_decoration_word.highlight_top_right_2');

    spanHighlightTopRight2.forEach((spanHighlight, index) => {
      console.log('Found highlight_top_right_2 span:', spanHighlight);

      // Create SVG container with the HIGHLIGHT_10.SVG content
      const svgHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgHighlight.id = `highlight-top-right-2-${index}`;
      svgHighlight.setAttribute('viewBox', '0 0 256 152');
      svgHighlight.setAttribute('fill', 'none');
      svgHighlight.style.position = 'absolute';
      svgHighlight.style.pointerEvents = 'none';
      svgHighlight.style.zIndex = '1';
      svgHighlight.style.height = '24px';
      svgHighlight.style.width = 'auto';
      svgHighlight.style.opacity = '0'; // Initial hidden state

      // Add the SVG path content
      svgHighlight.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M184.205 144.583C207.015 145.133 230.325 144.033 252.135 151.833C253.435 152.293 254.865 151.623 255.335 150.323C255.795 149.023 255.125 147.593 253.825 147.123C231.505 139.143 207.665 140.143 184.325 139.583C182.945 139.543 181.795 140.643 181.765 142.023C181.725 143.403 182.825 144.543 184.205 144.583Z" fill="${getColor(spanHighlight)}"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M182.155 111.466C189.265 104.924 197.025 100.023 206.405 97.5936C207.745 97.2476 208.545 95.8826 208.205 94.5466C207.855 93.2106 206.485 92.4076 205.155 92.7536C194.955 95.3936 186.505 100.676 178.775 107.785C177.755 108.719 177.685 110.302 178.625 111.318C179.555 112.333 181.145 112.4 182.155 111.466Z" fill="${getColor(spanHighlight)}"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M162.375 40.0426C165.635 28.8676 172.055 20.1256 181.895 13.8126C183.055 13.0676 183.395 11.5196 182.645 10.3586C181.905 9.1976 180.355 8.85958 179.195 9.60458C168.305 16.5946 161.185 26.2686 157.575 38.6416C157.185 39.9656 157.955 41.3556 159.275 41.7416C160.605 42.1286 161.995 41.3666 162.375 40.0426Z" fill="${getColor(spanHighlight)}"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M50.0249 24.8766C48.0849 27.1596 46.3449 29.6196 44.8649 32.2386C44.2049 33.4046 43.0449 35.8826 42.8649 38.0076C42.6649 40.2716 43.4348 42.1816 45.4148 43.1876C48.0448 44.5216 50.1449 44.3826 51.7649 43.5756C53.3249 42.8006 54.5448 41.2776 55.3148 39.2356C56.7848 35.3326 56.5648 29.3676 55.7948 25.9636C57.8648 23.8276 60.1348 21.8906 62.5648 20.1686C80.6648 7.34356 107.215 12.0726 127.645 31.2486C134.795 37.9626 138.235 52.0626 140.025 67.2756C142.815 90.9626 141.225 117.419 141.005 125.17C140.955 127.084 141.135 128.22 141.235 128.447C141.705 129.563 142.535 129.853 143.115 129.963C143.955 130.113 144.625 129.953 145.165 129.673C145.895 129.289 146.495 128.613 146.775 127.57C146.925 126.994 146.965 126.192 146.945 125.337C146.925 124.744 146.805 124.096 146.925 123.671C147.705 120.949 148.645 118.291 149.565 115.614C152.635 106.615 156.605 98.1816 161.015 89.7586C175.025 62.9946 188.575 34.7156 211.545 14.3246C212.575 13.4096 212.675 11.8276 211.755 10.7956C210.845 9.76358 209.265 9.66955 208.225 10.5856C184.795 31.3796 170.875 60.1456 156.585 87.4396C152.835 94.6046 149.395 101.78 146.535 109.285C146.825 96.0086 146.715 77.6316 144.285 61.3716C142.125 46.9106 138.015 34.1306 131.065 27.6036C108.685 6.59656 79.4948 2.03958 59.6748 16.0896C57.5548 17.5936 55.5349 19.2476 53.6549 21.0416C43.2849 2.31661 21.0848 -5.18844 1.46484 3.76756C0.204836 4.34056 -0.345154 5.82457 0.224846 7.07957C0.804846 8.33457 2.28479 8.8886 3.54479 8.3156C21.2248 0.245596 41.2749 7.44757 50.0249 24.8766ZM51.4748 31.1456C50.6648 32.2896 49.9148 33.4756 49.2148 34.7016C48.8448 35.3596 48.2048 36.6246 47.9348 37.8626C47.8748 38.1526 47.8649 38.6066 47.8649 38.8166C48.5549 39.1566 49.0948 39.3206 49.5348 39.0996C50.0848 38.8276 50.3649 38.1876 50.6349 37.4726C51.3149 35.6786 51.5348 33.3006 51.4748 31.1456Z" fill="${getColor(spanHighlight)}"/>
      `;

      document.body.appendChild(svgHighlight);
      allSvgElements.push(svgHighlight);

      function positionHighlight() {
        const rect = spanHighlight.getBoundingClientRect();

        // Adjust size and offset based on screen width
        const isMobile = window.innerWidth < 768;
        const height = isMobile ? '38px' : '74px';
        const offset = isMobile ? 4 : 5;

        svgHighlight.style.height = height;

        const svgRect = svgHighlight.getBoundingClientRect();

        // Position the middle of the SVG at the top right of the text element
        // Add offset to move it down and to the right
        svgHighlight.style.position = 'absolute';
        svgHighlight.style.left = (rect.right + window.scrollX + offset) + 'px';
        svgHighlight.style.top = (rect.top + window.scrollY - (svgRect.height / 2) + offset) + 'px';
      }

      positionHighlight();
      window.addEventListener('resize', positionHighlight);
    });

    // === HIGHLIGHT TOP RIGHT 3 ===
    const spanHighlightTopRight3 = document.querySelectorAll('.sct_text_decoration_word.highlight_top_right_3');

    spanHighlightTopRight3.forEach((spanHighlight, index) => {
      console.log('Found highlight_top_right_3 span:', spanHighlight);

      // Create SVG container with the HIGHLIGHT_06.SVG content
      const svgHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgHighlight.id = `highlight-top-right-3-${index}`;
      svgHighlight.setAttribute('viewBox', '0 0 220 190');
      svgHighlight.setAttribute('fill', 'none');
      svgHighlight.style.position = 'absolute';
      svgHighlight.style.pointerEvents = 'none';
      svgHighlight.style.zIndex = '1';
      svgHighlight.style.height = '24px';
      svgHighlight.style.width = 'auto';
      svgHighlight.style.opacity = '0'; // Initial hidden state

      // Add the SVG path content
      svgHighlight.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M132.153 78.5104C132.102 74.8516 131.623 71.1613 130.664 67.4457C127.302 54.4064 112.301 46.0353 96.3344 44.0671C80.3744 42.0989 63.7773 46.5778 57.3807 57.9201C53.7219 64.405 53.2172 69.9942 54.7123 74.7065C56.2011 79.3936 59.7334 83.2794 64.5277 86.3074C77.895 94.7416 101.305 96.4638 111.985 92.9374C116.925 91.3036 121.75 89.3355 126.45 87.0835C123.763 101.826 113.751 115.792 100.39 128.378C71.3534 155.73 26.2933 176.491 1.75409 184.124C0.435662 184.534 -0.296161 185.934 0.113878 187.253C0.523916 188.571 1.92433 189.309 3.24276 188.899C28.2677 181.115 74.2048 159.913 103.816 132.017C119.114 117.609 130.014 101.391 131.875 84.3393C166.457 65.8623 194.857 32.3401 219.138 4.12945C220.04 3.08858 219.92 1.50514 218.873 0.603058C217.826 -0.292719 216.248 -0.179219 215.346 0.867957C192.056 27.9242 165.025 60.1092 132.153 78.5104ZM127.125 81.1915C127.314 77.0785 126.911 72.9023 125.819 68.6884C122.911 57.4029 109.544 50.7287 95.7224 49.0255C87.2503 47.9846 78.5387 48.8426 71.7068 51.8958C67.4109 53.8135 63.8717 56.5954 61.7395 60.3804C58.9386 65.345 58.333 69.5906 59.4811 73.1926C60.6292 76.8199 63.4809 79.7342 67.1964 82.0746C79.3777 89.7644 100.693 91.3983 110.414 88.1874C116.149 86.2949 121.713 83.9356 127.125 81.1915Z" fill="${getColor(spanHighlight)}"/>
      `;

      document.body.appendChild(svgHighlight);
      allSvgElements.push(svgHighlight);

      function positionHighlight() {
        const rect = spanHighlight.getBoundingClientRect();

        // Adjust size and offset based on screen width
        const isMobile = window.innerWidth < 768;
        const height = isMobile ? '38px' : '74px';
        const offset = isMobile ? 4 : 5;

        svgHighlight.style.height = height;

        const svgRect = svgHighlight.getBoundingClientRect();

        // Position the middle of the SVG at the top right of the text element
        // Add offset to move it down and to the right
        svgHighlight.style.position = 'absolute';
        svgHighlight.style.left = (rect.right + window.scrollX + offset) + 'px';
        svgHighlight.style.top = (rect.top + window.scrollY - (svgRect.height / 2) + offset) + 'px';
      }

      positionHighlight();
      window.addEventListener('resize', positionHighlight);
    });

    // === HIGHLIGHT ELLIPSE 07 (Original) ===
    const spanHighlightEllipse07 = document.querySelectorAll('.sct_text_decoration_word.highlight_ellipse_07');

    spanHighlightEllipse07.forEach((spanHighlight, index) => {
      console.log('Found highlight_ellipse_07 span:', spanHighlight);

      // Create SVG container with the HIGHLIGHT_07.SVG content (original)
      const svgHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgHighlight.id = `highlight-ellipse-07-${index}`;
      svgHighlight.setAttribute('viewBox', '0 0 197 166');
      svgHighlight.setAttribute('preserveAspectRatio', 'none');
      svgHighlight.setAttribute('fill', 'none');
      svgHighlight.style.position = 'absolute';
      svgHighlight.style.pointerEvents = 'none';
      svgHighlight.style.zIndex = '1';
      svgHighlight.style.opacity = '0'; // Initial hidden state

      // Add the SVG path content
      svgHighlight.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M142.944 18.5435C152.501 19.0329 160.097 23.863 167.693 29.2866C192.605 47.0973 200.937 74.7316 183.866 101.887C157.32 143.999 95.4879 171.56 47.5416 158.84C36.9232 156.037 22.5474 153.566 12.0107 139.877C2.20905 127.148 2.61745 112.016 7.10987 98.0073C11.684 83.6438 20.5054 70.4242 27.5299 61.9266C58.2417 24.8517 119.747 -8.84446 175.371 8.91986C176.515 9.26214 177.658 8.67352 177.985 7.60522C178.312 6.53692 177.74 5.39139 176.678 5.04911C119.42 -13.2331 55.9543 21.1866 24.3441 59.3421C15.6043 69.9381 4.1697 87.626 0.902488 105.927C-1.30288 118.435 0.248727 131.221 8.74347 142.344C19.9337 156.926 35.208 159.782 46.4799 162.768C95.9781 175.905 159.933 147.538 187.296 104.046C205.674 74.8584 196.853 45.1282 170.062 25.9842C161.894 20.0996 153.562 15.0142 143.189 14.4841C142.045 14.4264 141.065 15.289 141.065 16.4093C140.984 17.5297 141.882 18.4858 142.944 18.5435Z" fill="${getColor(spanHighlight)}"/>
      `;

      document.body.appendChild(svgHighlight);
      allSvgElements.push(svgHighlight);

      function positionHighlight() {
        const rect = spanHighlight.getBoundingClientRect();

        // Adjust padding to control spacing around the text
        const paddingX = 30; // horizontal padding
        const paddingY = 20; // vertical padding

        // Position SVG to wrap around the text element
        svgHighlight.style.position = 'absolute';
        svgHighlight.style.left = (rect.left + window.scrollX - paddingX) + 'px';
        svgHighlight.style.top = (rect.top + window.scrollY - paddingY) + 'px';
        svgHighlight.style.width = (rect.width + paddingX * 2) + 'px';
        svgHighlight.style.height = (rect.height + paddingY * 2) + 'px';
      }

      positionHighlight();
      window.addEventListener('resize', positionHighlight);
    });

    // === HIGHLIGHT ELLIPSE 07_1 (Variation 1: Tilted & stretched) ===
    const spanHighlightEllipse07_1 = document.querySelectorAll('.sct_text_decoration_word.highlight_ellipse_07_1');

    spanHighlightEllipse07_1.forEach((spanHighlight, index) => {
      console.log('Found highlight_ellipse_07_1 span:', spanHighlight);

      // Create SVG container with the HIGHLIGHT_07.SVG variation 1
      const svgHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgHighlight.id = `highlight-ellipse-07-1-${index}`;
      svgHighlight.setAttribute('viewBox', '-30 -30 250 220');
      svgHighlight.setAttribute('preserveAspectRatio', 'none');
      svgHighlight.setAttribute('fill', 'none');
      svgHighlight.style.position = 'absolute';
      svgHighlight.style.pointerEvents = 'none';
      svgHighlight.style.zIndex = '1';
      svgHighlight.style.opacity = '0'; // Initial hidden state

      // Add the SVG path content with transform
      svgHighlight.innerHTML = `
        <g transform="translate(98.5, 83) rotate(35) scale(1.15, 0.95) translate(-98.5, -83)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M142.944 18.5435C152.501 19.0329 160.097 23.863 167.693 29.2866C192.605 47.0973 200.937 74.7316 183.866 101.887C157.32 143.999 95.4879 171.56 47.5416 158.84C36.9232 156.037 22.5474 153.566 12.0107 139.877C2.20905 127.148 2.61745 112.016 7.10987 98.0073C11.684 83.6438 20.5054 70.4242 27.5299 61.9266C58.2417 24.8517 119.747 -8.84446 175.371 8.91986C176.515 9.26214 177.658 8.67352 177.985 7.60522C178.312 6.53692 177.74 5.39139 176.678 5.04911C119.42 -13.2331 55.9543 21.1866 24.3441 59.3421C15.6043 69.9381 4.1697 87.626 0.902488 105.927C-1.30288 118.435 0.248727 131.221 8.74347 142.344C19.9337 156.926 35.208 159.782 46.4799 162.768C95.9781 175.905 159.933 147.538 187.296 104.046C205.674 74.8584 196.853 45.1282 170.062 25.9842C161.894 20.0996 153.562 15.0142 143.189 14.4841C142.045 14.4264 141.065 15.289 141.065 16.4093C140.984 17.5297 141.882 18.4858 142.944 18.5435Z" fill="${getColor(spanHighlight)}"/>
        </g>
      `;

      document.body.appendChild(svgHighlight);
      allSvgElements.push(svgHighlight);

      function positionHighlight() {
        const rect = spanHighlight.getBoundingClientRect();

        // Adjust padding to control spacing around the text
        const paddingX = 35; // horizontal padding (more for rotated shape)
        const paddingY = 25; // vertical padding

        // Position SVG to wrap around the text element
        svgHighlight.style.position = 'absolute';
        svgHighlight.style.left = (rect.left + window.scrollX - paddingX) + 'px';
        svgHighlight.style.top = (rect.top + window.scrollY - paddingY) + 'px';
        svgHighlight.style.width = (rect.width + paddingX * 2) + 'px';
        svgHighlight.style.height = (rect.height + paddingY * 2) + 'px';
      }

      positionHighlight();
      window.addEventListener('resize', positionHighlight);
    });

    // === HIGHLIGHT ELLIPSE 07_2 (Variation 2: Flipped & angled) ===
    const spanHighlightEllipse07_2 = document.querySelectorAll('.sct_text_decoration_word.highlight_ellipse_07_2');

    spanHighlightEllipse07_2.forEach((spanHighlight, index) => {
      console.log('Found highlight_ellipse_07_2 span:', spanHighlight);

      // Create SVG container with the HIGHLIGHT_07.SVG variation 2
      const svgHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgHighlight.id = `highlight-ellipse-07-2-${index}`;
      svgHighlight.setAttribute('viewBox', '-30 -30 250 220');
      svgHighlight.setAttribute('preserveAspectRatio', 'none');
      svgHighlight.setAttribute('fill', 'none');
      svgHighlight.style.position = 'absolute';
      svgHighlight.style.pointerEvents = 'none';
      svgHighlight.style.zIndex = '1';
      svgHighlight.style.opacity = '0'; // Initial hidden state

      // Add the SVG path content with transform
      svgHighlight.innerHTML = `
        <g transform="translate(98.5, 83) rotate(-25) scale(-1.08, 1.12) translate(-98.5, -83)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M142.944 18.5435C152.501 19.0329 160.097 23.863 167.693 29.2866C192.605 47.0973 200.937 74.7316 183.866 101.887C157.32 143.999 95.4879 171.56 47.5416 158.84C36.9232 156.037 22.5474 153.566 12.0107 139.877C2.20905 127.148 2.61745 112.016 7.10987 98.0073C11.684 83.6438 20.5054 70.4242 27.5299 61.9266C58.2417 24.8517 119.747 -8.84446 175.371 8.91986C176.515 9.26214 177.658 8.67352 177.985 7.60522C178.312 6.53692 177.74 5.39139 176.678 5.04911C119.42 -13.2331 55.9543 21.1866 24.3441 59.3421C15.6043 69.9381 4.1697 87.626 0.902488 105.927C-1.30288 118.435 0.248727 131.221 8.74347 142.344C19.9337 156.926 35.208 159.782 46.4799 162.768C95.9781 175.905 159.933 147.538 187.296 104.046C205.674 74.8584 196.853 45.1282 170.062 25.9842C161.894 20.0996 153.562 15.0142 143.189 14.4841C142.045 14.4264 141.065 15.289 141.065 16.4093C140.984 17.5297 141.882 18.4858 142.944 18.5435Z" fill="${getColor(spanHighlight)}"/>
        </g>
      `;

      document.body.appendChild(svgHighlight);
      allSvgElements.push(svgHighlight);

      function positionHighlight() {
        const rect = spanHighlight.getBoundingClientRect();

        // Adjust padding to control spacing around the text
        const paddingX = 35; // horizontal padding (more for rotated shape)
        const paddingY = 25; // vertical padding

        // Position SVG to wrap around the text element
        svgHighlight.style.position = 'absolute';
        svgHighlight.style.left = (rect.left + window.scrollX - paddingX) + 'px';
        svgHighlight.style.top = (rect.top + window.scrollY - paddingY) + 'px';
        svgHighlight.style.width = (rect.width + paddingX * 2) + 'px';
        svgHighlight.style.height = (rect.height + paddingY * 2) + 'px';
      }

      positionHighlight();
      window.addEventListener('resize', positionHighlight);
    });

    // Return all SVG elements so they can be used in GSAP animations
    return allSvgElements;
  } // Close init() function

  // Call init immediately and return the SVG elements array
  return init();
}

// if (document.body.classList.contains('sct_text_decoration_svg')) {
  sct_text_decoration_svg();
// }

export default sct_text_decoration_svg