import '../src/styles/style.css'

import { gsap } from 'gsap'
// import { SplitText } from "gsap/SplitText";

import barba from '@barba/core';

import barbaCss from '@barba/css';
barba.use(barbaCss);

// import feature from './features/feature'
import case_study from './case_study'
import cs_website_builder_tools from './cs_website_builder_tools'

import colorModeToggle from './color_mode_toggle'


// function homepage() {

console.log('homepage.js is workinghomepage.js is working')
console.log(barba)

// console.log(gsap)
console.log(SplitText)

// letter by letter animation - https://codepen.io/ajuhpark/pen/oNVLmvg
gsap.registerPlugin(SplitText)
var home_tl = gsap.timeline({ defaults: { ease: 'power1.inOut'} });
let split_name
let split1
let split2


function init(){
split_name = new SplitText(".home_name", {type: "words,chars"})
split1 = new SplitText(".home_aboutSection_text_1", {type: "words,chars"})
split2 = new SplitText(".home_aboutSection_text_2", {type: "words,chars"})

home_tl
//this works but the split cars is getting an error.
  .from("html", {duration: 0, autoAlpha:0}, 'home_start')
  .from('Body', { backgroundColor: '#f7dcdc', opacity: 0, duration: 0.4 }, '<')
  .from(split_name.chars, {yPercent: 100, opacity: 0, stagger: 0.01, duration: .4, ease:"linear"}, 'home_start+=.1')
  .from(split1.chars, {yPercent: 90, opacity: 0, stagger: 0.012, duration: .2, ease:"linear"}, 'home_start+=.4')
  .from(split2.chars, {yPercent: 90, opacity: 0, stagger: 0.008, duration: .2,  ease:"linear"}, 'home_start+=.5')
  
  // running color_mode_toggle.js
  console.log('homepage.js function init is working.')

}
// Addressing the Flash of unstyled content issue
window.addEventListener("load", function(event) { 
  init(); // do stuff
  colorModeToggle()
  // GSDevTools.create({animation: home_tl});
});
// })

// const body = document.querySelector('body')
