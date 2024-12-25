import '../src/styles/style.css';
import { gsap } from 'gsap';
// import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

function case_study() {
  console.log('case_study.js is working');

  let case_study_tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } });
  let split_name;
  let split_cs;

  function init() {
    split_name = new SplitText('.home_name', { type: 'words,chars' });
    split_cs = new SplitText('.project_title', { type: 'words,chars' });

    case_study_tl
      .from('html', { duration: 0, autoAlpha: 0 }, 'case_study_tl')
      .from('.proj', { duration: 0, autoAlpha: 0 }, 'case_study_tl')
      .from('.proj', { backgroundColor: '#f7f7f2', opacity: 0, duration: 1 }, '<')
      .from(split_name.chars, { yPercent: 100, opacity: 0, stagger: 0.01, duration: 0.4, ease: 'linear' }, 'case_study_tl+=.2')
      .from(split_cs.chars, { yPercent: 110, opacity: 0, stagger: 0.01, duration: 0.5, ease: 'linear' }, 'case_study_tl+=.4')
      .from('.project_hero_image_container', { xPercent: -101, duration: 1.1, ease: 'circ.out' }, 'case_study_tl+=.5')
      .from('.project_hero_image', { xPercent: 101, duration: 1.1, ease: 'circ.out' }, 'case_study_tl+=.5')
      .from('.project_body_section', { opacity: 0, duration: 1.2 }, 'case_study_tl+=1.5');
  }

  window.addEventListener('load', function () {
    init();
  });
}

if (document.body.classList.contains('case_study')) {
  case_study();
}

export default case_study;
