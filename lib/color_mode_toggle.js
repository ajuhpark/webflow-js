
import '../src/styles/style.css'
import { gsap } from 'gsap'


function colorModeToggle() {
  console.log('color_mode_toggle.js is working')

  const htmlElement = document.documentElement;
  
  // Helper function for attribute parsing
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }

  const scriptTag = document.querySelector("[sj_color_vars]");
  if (!scriptTag) {
    console.warn("Script tag with sj_color_vars attribute not found");
    return;
  }

  let colorModeDuration = attr(0.5, scriptTag.getAttribute("duration"));
  let colorModeEase = attr("power1.out", scriptTag.getAttribute("ease"));

  const cssVariables = scriptTag.getAttribute("sj_color_vars");
  if (!cssVariables.length) {
    console.warn("Value of sj_color_vars attribute not found");
    return;
  }

  // Store color values for each set
  let color_set_1 = {};
  let color_set_2 = {};
  let color_set_3 = {};

  // Build color objects
  cssVariables.split(",").forEach(function (item) {
    const computed = getComputedStyle(htmlElement);
    let ap_portfolio_light_1 = computed.getPropertyValue(`--color_set_ap_portfolio_light_1--${item}`).trim();
    let ap_portfolio_dark_1 = computed.getPropertyValue(`--color_set_ap_portfolio_dark_1--${item}`).trim();
    let ap_portfolio_light_2 = computed.getPropertyValue(`--color_set_ap_portfolio_light_2--${item}`).trim();

    if (ap_portfolio_light_1) {
      color_set_1[`--color_set_ap_portfolio_light_1--${item}`] = ap_portfolio_light_1;
      color_set_2[`--color_set_ap_portfolio_light_1--${item}`] = ap_portfolio_dark_1 || ap_portfolio_light_1;
      color_set_3[`--color_set_ap_portfolio_light_1--${item}`] = ap_portfolio_light_2 || ap_portfolio_light_1;
    }
  });

  function setColors(colorObject, animate) {
    if (typeof gsap !== "undefined" && animate) {
      gsap.to(":root", {
        duration: colorModeDuration,
        ease: colorModeEase,
        ...colorObject
      });
    } else {
      Object.entries(colorObject).forEach(([variable, value]) => {
        htmlElement.style.setProperty(variable, value);
      });
    }
  }

  function switchMode(mode, animate) {
    console.log("Switching mode to:", mode);
    
    const colorObject = 
      mode === "color_set_2" ? color_set_2 :
      mode === "color_set_3" ? color_set_3 :
      color_set_1;

    setColors(colorObject, animate);
    
    // Store the preference
    localStorage.setItem("color_set_mode", mode);
  }

  // Event listeners for mode toggle buttons
  document.addEventListener("click", (e) => {
    const button_ap_portfolio_light_1 = e.target.closest("[sj_color_set_ap_portfolio_light_1]");
    const button_ap_portfolio_dark_1 = e.target.closest("[sj_color_set_ap_portfolio_dark_1]");
    const button_ap_portfolio_light_2 = e.target.closest("[sj_color_set_ap_portfolio_light_2]");

    if (button_ap_portfolio_light_1) {
      switchMode("color_set_1", true);
    } else if (button_ap_portfolio_dark_1) {
      switchMode("color_set_2", true);
    } else if (button_ap_portfolio_light_2) {
      switchMode("color_set_3", true);
    }
  });

  // Initialize based on stored preference
  const storagePreference = localStorage.getItem("color_set_mode");
  if (storagePreference) {
    switchMode(storagePreference, false);
  } else {
    switchMode("color_set_1", false);
  }
}

// Call the function
colorModeToggle();

export default colorModeToggle

