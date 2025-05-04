import '../src/styles/style.css'
import { gsap } from 'gsap'

function colorModeToggle() {
  console.log('color_mode_toggle.js is working')

  const htmlElement = document.documentElement

  // Helper function to parse attribute values with a default fallback
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal
    if (typeof attrVal !== 'string' || attrVal.trim() === '') return defaultVal
    if (attrVal === 'true' && defaultValType === 'boolean') return true
    if (attrVal === 'false' && defaultValType === 'boolean') return false
    if (isNaN(attrVal) && defaultValType === 'string') return attrVal
    if (!isNaN(attrVal) && defaultValType === 'number') return +attrVal
    return defaultVal
  }

  // Find the script tag that contains color variables
  const scriptTag = document.querySelector('[sj_color_vars]')
  if (!scriptTag) {
    console.warn('Script tag with sj_color_vars attribute not found')
    return
  }

  // Retrieve animation duration and easing values from attributes (or use defaults)
  let colorModeDuration = attr(0.5, scriptTag.getAttribute('duration'))
  let colorModeEase = attr('power1.out', scriptTag.getAttribute('ease'))

  // Get the color variable list from the script tag's attribute
  const cssVariables = scriptTag.getAttribute('sj_color_vars')
  if (!cssVariables.length) {
    console.warn('Value of sj_color_vars attribute not found')
    return
  }

  // Store color values for each theme mode
  let color_set_1 = {} // Light Mode 1
  let color_set_2 = {} // Dark Mode 1
  let color_set_3 = {} // Light Mode 2
  let color_set_4 = {} // Dark Mode 2 (New)

  // Extract and store CSS variable values for each color mode
  cssVariables.split(',').forEach(function (item) {
    const computed = getComputedStyle(htmlElement)

    // Retrieve color values from CSS custom properties (if they exist)
    let ap_portfolio_light_1 = computed
      .getPropertyValue(`--color_set_ap_portfolio_light_1--${item}`)
      .trim()
    let ap_portfolio_dark_1 = computed
      .getPropertyValue(`--color_set_ap_portfolio_dark_1--${item}`)
      .trim()
    let ap_portfolio_light_2 = computed
      .getPropertyValue(`--color_set_ap_portfolio_light_2--${item}`)
      .trim()
    let ap_portfolio_dark_2 = computed
      .getPropertyValue(`--color_set_ap_portfolio_dark_2--${item}`)
      .trim() // New dark mode
    
      // Assign values to each color set (fallbacks ensure a valid color is always set)
    if (ap_portfolio_light_1) {
      color_set_1[`--color_set_ap_portfolio_light_1--${item}`] =
        ap_portfolio_light_1
      color_set_2[`--color_set_ap_portfolio_light_1--${item}`] =
        ap_portfolio_dark_1 || ap_portfolio_light_1
      color_set_3[`--color_set_ap_portfolio_light_1--${item}`] =
        ap_portfolio_light_2 || ap_portfolio_light_1
      color_set_4[`--color_set_ap_portfolio_light_1--${item}`] =
        ap_portfolio_dark_2 || ap_portfolio_light_1 // New dark mode
    }
  })

  // Function to apply color variables to the document
  function setColors(colorObject, animate) {
    if (typeof gsap !== 'undefined' && animate) {
      // Use GSAP for animated color transitions
      gsap.to(':root', {
        duration: colorModeDuration,
        ease: colorModeEase,
        // Apply all CSS variable changes
        ...colorObject,
      })
    } else {
      // If GSAP is unavailable or animation is disabled, apply colors instantly
      Object.entries(colorObject).forEach(([variable, value]) => {
        htmlElement.style.setProperty(variable, value)
      })
    }
  }

  // Function to switch between color modes
  function switchMode(mode, animate) {
    console.log('Switching mode to:', mode)

    // Determine which color set to apply based on the mode
    const colorObject =
      mode === 'color_set_2'
        ? color_set_2
        : mode === 'color_set_3'
        ? color_set_3
        : mode === 'color_set_4'
        ? color_set_4 // New dark mode
        : color_set_1

    // Apply the selected color scheme    
    setColors(colorObject, animate)

    // Save the user’s preference in local storage
    localStorage.setItem('color_set_mode', mode)
  }

  // Event listeners for mode toggle buttons
  document.addEventListener('click', (e) => {
    const button_ap_portfolio_light_1 = e.target.closest(
      '[sj_color_set_ap_portfolio_light_1]'
    )
    const button_ap_portfolio_dark_1 = e.target.closest(
      '[sj_color_set_ap_portfolio_dark_1]'
    )
    const button_ap_portfolio_light_2 = e.target.closest(
      '[sj_color_set_ap_portfolio_light_2]'
    )
    const button_ap_portfolio_dark_2 = e.target.closest(
      '[sj_color_set_ap_portfolio_dark_2]'
    ) // New button

    // Check which button was clicked and switch to the corresponding color set
    if (button_ap_portfolio_light_1) {
      switchMode('color_set_1', true)
    } else if (button_ap_portfolio_dark_1) {
      switchMode('color_set_2', true)
    } else if (button_ap_portfolio_light_2) {
      switchMode('color_set_3', true)
    } else if (button_ap_portfolio_dark_2) {
      // New button handler
      switchMode('color_set_4', true)
    }
  })

  // Check if a color mode preference is stored in local storage
  const storagePreference = localStorage.getItem('color_set_mode')
  if (storagePreference) {
    // Apply stored preference without animation
    switchMode(storagePreference, false)
  } else {
    // Default to light mode 1
    switchMode('color_set_1', false)
  }
}

// Call the function to initialize color mode functionality
colorModeToggle()

export default colorModeToggle
