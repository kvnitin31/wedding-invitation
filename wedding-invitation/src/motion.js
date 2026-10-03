import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { art } from './art.js';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
ScrollTrigger.clearScrollMemory('manual');

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const rand = gsap.utils.random;

function petals(layer, count = 20) {
  const imgs = Array.from({ length: count }, () => {
    const img = document.createElement('img');
    img.src = art('petal');
    img.alt = '';
    img.width = 28;
    img.height = 31;
    img.className = 'petal';
    layer.append(img);
    return img;
  });

  const drop = (img, scatter) => {
    const w = layer.clientWidth;
    const h = layer.clientHeight;
    const x = rand(0, w);
    const y = scatter ? rand(-40, h) : -40;
    gsap.set(img, { x, y, rotation: rand(0, 360), scale: rand(0.4, 1), opacity: rand(0.5, 0.9) });
    gsap.to(img, {
      x: x + rand(-120, 120),
      y: h + 40,
      rotation: `+=${rand(120, 420)}`,
      duration: rand(7, 14) * ((h + 40 - y) / (h + 80)),
      ease: 'none',
      onComplete: () => drop(img, false),
    });
  };

  let running = false;
  return {
    play() {
      if (running) return;
      running = true;
      imgs.forEach((img) => drop(img, true));
    },
    stop() {
      running = false;
      gsap.killTweensOf(imgs);
    },
  };
}

/** Runs behind the sealed overlay: petals, initial hero state. */
export function initOverlay(overlay) {
  if (reducedMotion) return { open: (done) => { overlay.remove(); done(); } };

  const overlayPetals = petals(overlay.querySelector('[data-petals]'));
  overlayPetals.play();
  gsap.set('[data-hero-reveal]', { autoAlpha: 0, y: 24 });

  return {
    open(done) {
      gsap.to(overlay, {
        autoAlpha: 0,
        scale: 1.04,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          overlayPetals.stop();
          overlay.remove();
          done();
          gsap.to('[data-hero-reveal]', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' });
        },
      });
    },
  };
}

function heroMotion() {
  const hero = document.querySelector('.hero');
  const heroPetals = petals(hero.querySelector('[data-petals]'));
  heroPetals.play();

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onToggle: (self) => (self.isActive ? heroPetals.play() : heroPetals.stop()),
    },
  })
    .to('[data-layer="backdrop"]', { yPercent: 10 }, 0)
    .to('[data-layer="couple"]', { yPercent: 8 }, 0)
    .to('[data-layer="foreground"]', { yPercent: -45 }, 0)
    .to('[data-layer="text"]', { y: -90, opacity: 0 }, 0);
}

function celebrationsMotion() {
  const stage = document.querySelector('[data-stage]');
  const scenes = gsap.utils.toArray('[data-scene]', stage);
  const arts = gsap.utils.toArray('[data-scene-art]', stage);
  const cards = gsap.utils.toArray('[data-scene-card]', stage);
  const dots = gsap.utils.toArray('.dot', stage);
  const n = scenes.length;
  if (!n) return;

  stage.classList.add('stage--pinned');
  gsap.set(scenes.slice(1), { opacity: 0 });
  gsap.set(cards.slice(1), { opacity: 0, y: 44 });

  let active = 0;
  const setActive = (i) => {
    if (i === active) return;
    active = i;
    scenes.forEach((s, j) => s.classList.toggle('is-active', j === i));
    dots.forEach((d, j) => d.classList.toggle('is-active', j === i));
  };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage,
      pin: true,
      start: 'top top',
      end: () => `+=${n * window.innerHeight}`,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n + 0.25))),
    },
  });

  // One timeline unit per event; each next scene fades over the last at (i - 0.45).
  arts.forEach((el, i) => {
    tl.fromTo(el, { scale: 1.08, yPercent: 2 }, { scale: 1, yPercent: 0, duration: 1, ease: 'power1.out' }, i === 0 ? 0 : i - 0.45);
  });
  for (let i = 1; i < n; i++) {
    const at = i - 0.45;
    tl.to(cards[i - 1], { y: -34, opacity: 0, duration: 0.2, ease: 'power2.in' }, at)
      .to(scenes[i], { opacity: 1, duration: 0.35, ease: 'power1.inOut' }, at)
      .to(cards[i], { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }, at + 0.2);
  }
  tl.set({}, {}, n);

  // Keyboard users tabbing into a faded-out card get scrolled to its scene.
  stage.addEventListener('focusin', (e) => {
    const i = scenes.findIndex((s) => s.contains(e.target));
    if (i < 0 || i === active) return;
    const st = tl.scrollTrigger;
    window.scrollTo({ top: st.start + ((i + 0.05) / n) * (st.end - st.start), behavior: 'instant' });
  });
}

function reveals() {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, { y: 32, autoAlpha: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
    gsap.from(group.querySelectorAll('[data-reveal-item]'), {
      y: 36,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    });
  });
}

function duskTint() {
  gsap.to('[data-dusk]', { opacity: 0.25, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
}

function floaterParallax() {
  gsap.utils.toArray('.floater--drift').forEach((el) => {
    gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

export function initMotion() {
  if (reducedMotion) return;
  heroMotion();
  celebrationsMotion();
  reveals();
  duskTint();
  floaterParallax();
}

export const refreshScroll = () => ScrollTrigger.refresh();
