import '../src/styles/style.css'

import { gsap } from 'gsap'

import barba from '@barba/core';

import barbaCss from '@barba/css';
barba.use(barbaCss);

// import feature from './features/feature'
import case_study from '../case_study'
import cs_website_builder_tools from '../cs_website_builder_tools'

// function homepage() {

console.log('homepage.js is working')
console.log(barba)

// console.log(gsap)
// alert('Local')

// document.querySelectorAll('script[class="case_study"]')
//     .forEach(script => script.replaceWith(Object.assign(script.cloneNode(), 
//        {type: 'module'})));


var home_tl = gsap.timeline({ defaults: { ease: 'power1.inOut'} })
//autoAlpha below is for the Flash of Unstyled Content issue.

function init(){
  home_tl
    .from("html", {duration: 0, autoAlpha:0}, 'home_start')
    //#f7f7f2 is light beige. #f7dcdc is light pink.
    .from('Body', { backgroundColor: '#f7dcdc', opacity: 0, duration: 0.4 }, '<')
    .from('.home_icon', { yPercent: 110, duration: 1 }, 'home_start+=.3')
    .from('.home_icon', { opacity: 0, duration: .8 }, 'home_start+=.6')
    .from('.home_icon_f1', { yPercent: 110, duration: 1 }, 'home_start+=.3')
    .from('.home_icon_f1', { opacity: 0, duration: .8 }, 'home_start+=.6')
    .from('.home_icon_f2', { yPercent: 110, duration: 1 }, 'home_start+=.3')
    .from('.home_icon_f2', { opacity: 0, duration: .8 }, 'home_start+=.6')
    .from('.home_name', { yPercent: 110, duration: .7 }, 'home_start+=.4' )
    .from('.home_name', { opacity: 0, duration: .9 }, 'home_start+=.4' )
    .from('.home_position', { yPercent: 110, duration: .7 }, 'home_start+=.4' )
    .from('.home_position', { opacity: 0, duration: .9 }, 'home_start+=.4' )
    .from('.cs_component_container_1', { yPercent: 10, duration: 1.2 }, 'home_start+=.2' )
    .from('.cs_component_container_1', { opacity: 0, duration: 1.7 }, 'home_start+=.1' )
}

//addressing the Flash of unstyled content issue.
window.addEventListener("load", function(event) { 
  init(); //do stuff
  // GSDevTools.create({animation:tl})
  });


// detect if I’m running in local dev environment
// const isLocal = () => {
//   const params = new URL(window.location.href).searchParams;
//   return params.get('dev') === 'true';
// };


// this is to get the fade transitions to cover body bg color.
// getting access to the body color and applying it to the body
// each page has a data-background attribute that = a hex value.
const body = document.querySelector('body')

// //this hook will run before any transition
// barba.hooks.before((data) => {

//   // trying to get the body background from being the flash of white.
//   // I set a background attribute to the body in webflow
//   const background = data.current.container.dataset.background;
//   // below is setting the --body-background variable in my webflow homepage
//   // to the background color from the barba data site.
//   // some color info
//   // I put #45B565 - green as data-background for cs page to test
//   // I put #4579B5 - blue as data-background for homepage to test
//   // #f7f7f2 is light beige. #f7dcdc is light pink.
//   body.style.setProperty('--body-background', background)

// })


//barba.init from course

barba.init({
  transitions: [
    {
      //setting transition name to home.
      name: 'home',
        // creating a hook
        beforeOnce(){
          console.log('running hook beforeOnce')
        },
        // this is a hook that's called once. It happens once on the page load.
        once(){
          // with css plugin, this won't work.
          console.log('running hook once')
        },
        // another hook
        afterOnce(){
          console.log('running hook afterOnce')
        },
    }, 
    {
      name: 'fade',
        // we're going to the 'fade' namespace, the one that's the 
        // namespace for the container in homepage.
        to:{
          namespace: ['fade']
        },
        // when you leave the page, the fade class will be added to 
        // the container of current page
        leave() {},
        afterLeave() {
          
          const bottomDOM = document.getElementsByTagName("body")[0]
          const newScript = document.createElement("script")
          const oldScript = document.querySelector(".homepage")

          // newScript.src = "lib/cs_website_builder_tools.js"
          newScript.src = "http://localhost:5173/lib/cs_website_builder_tools.js"
          // newScript.src = "https://andrewjypark-portfolio.netlify.app/cs_website_builder_tools.js"

          // if (isLocal = true) {
          // newScript.src = "http://localhost:5173/lib/cs_website_builder_tools.js"
          // } else {
          // newScript.src = "https://andrewjypark-portfolio.netlify.app/cs_website_builder_tools.js"
          // }
          
          newScript.className = "cs_website_builder_tools"
          newScript.type = "module"

          oldScript.remove()
          bottomDOM.appendChild(newScript)
          console.log(oldScript)
          console.log(newScript)

          // this bottom doesn't work so I had to import the js file
          // window.eval(newScript.innerHTML);
          // console.log(newScript.innerHTML)

        },

        // when it enters next page, we're going to call the namespace 
        // for the container which is in this case fade
        beforeEnter(){
          // calling that imported js file
          cs_website_builder_tools;
          cs_website_builder_tools();
        },      
        enter() {
        }   
    },
    {
      name: 'clip',
        // we're going to the 'clip' namespace, the one that's the 
        // namespace for the container in homepage.
        // clip-path animation, we have to put in sync: true.
        sync: true, 
        // we're going to the 'clip' namespace, the one that's the 
        // namespace for the container in homepage.
        to:{
          namespace: ['clip']
        },
        // when you leave the page, the clip class will be added to 
        // the container of current page
        leave() {},
        afterLeave() {
          
          const bottomDOM = document.getElementsByTagName("body")[0]
          const newScript = document.createElement("script")
          const oldScript = document.querySelector(".homepage")

          // newScript.src = "./case_study.js"
          newScript.src = "http://localhost:5173/lib/case_study.js"
          // newScript.src = "https://andrewjypark-portfolio.netlify.app/case_study.js"

          newScript.className = "case_study"
          newScript.type = "module"
          oldScript.remove()
          bottomDOM.appendChild(newScript)
          console.log(oldScript)
          console.log(newScript)

          // this bottom doesn't work so I had to import the js file
          // window.eval(newScript.innerHTML);
          // console.log(newScript.innerHTML)
        },

        // when it enters next page, we're going to call the namespace 
        // for the container which is in this case clip

        enter() {
          // calling that imported js file
          case_study;
          case_study();
        },
        beforeEnter(){
          console.log('before enter')
        }   

    },
    {
      name: 'with-cover',
        // we're going to the 'with-cover' namespace, the one that's the 
        // namespace for the container in homepage.
        to:{
          namespace: ['with-cover']
        },
        // when you leave the page, the fade class will be added to 
        // the container of current page
        leave() {
          console.log('leave with-cover')
        },
        afterLeave() {
          
          const bottomDOM = document.getElementsByTagName("body")[0]
          const newScript = document.createElement("script")
          const oldScript = document.querySelector(".homepage")

          // newScript.src = "./case_study.js"
          newScript.src = "http://localhost:5173/lib/case_study.js"
          // newScript.src = "https://andrewjypark-portfolio.netlify.app/case_study.js"

          newScript.className = "case_study"
          newScript.type = "module"
          oldScript.remove()
          bottomDOM.appendChild(newScript)
          console.log(oldScript)
          console.log(newScript)
          
          // this bottom doesn't work so I had to import the js file
          // window.eval(newScript.innerHTML);
          // console.log(newScript.innerHTML)
        },
        // when it enters next page, we're going to call the namespace 
        // for the container which is in this case fade
        beforeEnter(){
          // calling that imported js file
          case_study;
          case_study();
        },      
        enter() {
          console.log('enter with-cover')
        }
    },
    {
      //setting transition name to home.
      name: 'slide',
      to: {
        namespace: ['slide']
      },
      sync: true, 
      once() {},
      leave() {},
      afterLeave() {
        
        const bottomDOM = document.getElementsByTagName("body")[0]
        const newScript = document.createElement("script")
        const oldScript = document.querySelector(".homepage")

        // newScript.src = "./case_study.js"
        newScript.src = "http://localhost:5173/lib/case_study.js"
        // newScript.src = "https://andrewjypark-portfolio.netlify.app/case_study.js"

        newScript.className = "case_study"
        newScript.type = "module"
        oldScript.remove()
        bottomDOM.appendChild(newScript)
        console.log(oldScript)
        console.log(newScript)

        // this bottom doesn't work so I had to import the js file
        // window.eval(newScript.innerHTML);
        // console.log(newScript.innerHTML)
      },

      // when it enters next page, we're going to call the namespace 
      // for the container which is in this case clip

      enter() {
      },
      beforeEnter(){
        // calling that imported js file
        case_study;
        case_study();
        console.log('before enter')
      }   
    }
  ]
})



 export default homepage
