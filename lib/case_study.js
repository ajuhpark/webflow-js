import '../src/styles/style.css'

import { gsap } from 'gsap'
// import { SplitText } from 'gsap/SplitText';

// import feature from './features/feature'
// import homepage from './homepage'

gsap.registerPlugin(SplitText)
// Case Studies - Load Animation
var case_study_tl = gsap.timeline({ defaults: { ease: 'power1.inOut'} })
let split_name  
let split_cs

function case_study() {
  console.log('case_study.js is working')
  // console.log(gsap)


  function init(){
    // vars for animation for name and cs title
    split_name = new SplitText(".home_name", {type: "words,chars"})
    split_cs = new SplitText(".project_title", {type: "words,chars"})

    case_study_tl
      //#f7f7f2 is light beige. #f7dcdc is light pink.
      .from("html", {duration: 0, autoAlpha: 0}, 'case_study_tl')
      .from('.proj', {duration: 0, autoAlpha: 0}, 'case_study_tl')
      .from('.proj', { backgroundColor: '#f7f7f2', opacity: 0, duration: 1}, '<')
      // name and project title animations
      .from(split_name.chars, {yPercent: 100, opacity: 0, stagger: 0.01, duration: .4, ease:"linear"}, 'case_study_tl+=.2')
      .from(split_cs.chars, {yPercent: 110, opacity: 0, stagger: 0.01, duration: .5, ease:"linear"}, 'case_study_tl+=.4')
      .from('.project_hero_image_container', { xPercent: -101, duration: 1.1, ease: 'circ.out' }, 'case_study_tl+=.5')
      .from('.project_hero_image', { xPercent: 101, duration: 1.1, ease: 'circ.out' }, 'case_study_tl+=.5')
      .from('.project_body_section', { opacity: 0, duration: 1.2 }, 'case_study_tl+=1.5')
    }
 
  // addressing the Flash of unstyled content issue.
  window.addEventListener("load", function(event) { 
    init(); //do stuff
    // GSDevTools.create({animation:tl})
   });
}

if ($('body').hasClass('case_study')) {
  case_study();
}


export default case_study
