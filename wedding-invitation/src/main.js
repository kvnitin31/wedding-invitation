import './styles.css';
import content from './content.js';
import { renderSite } from './render.js';
import { initOverlay, initMotion, refreshScroll } from './motion.js';
import { publicUrl } from './art.js';

const root = document.documentElement;
document.querySelector('#app').innerHTML = renderSite(content);
root.classList.add('is-locked');

const main = document.querySelector('#main');
const overlay = document.querySelector('[data-overlay]');
const music = setupMusic(content.music);

const sealed = initOverlay(overlay);
initMotion();

overlay.querySelector('[data-open]').addEventListener('click', () => {
  music?.play();
  sealed.open(() => {
    root.classList.remove('is-locked');
    main.inert = false;
    // A reload can restore the old scroll position behind the overlay; always open at the hero.
    window.scrollTo(0, 0);
    if (music) music.button.hidden = false;
    document.querySelector('#hero-title').focus({ preventScroll: true });
    refreshScroll();
  });
}, { once: true });

startCountdown(document.querySelector('[data-countdown]'), content.countdownTarget);

function startCountdown(section, target) {
  const end = new Date(target).getTime();
  if (!section || Number.isNaN(end)) return;
  const nums = Object.fromEntries([...section.querySelectorAll('[data-count]')].map((el) => [el.dataset.count, el]));
  const pad = (n) => String(n).padStart(2, '0');

  const tick = () => {
    const diff = end - Date.now();
    if (diff <= 0) {
      section.querySelector('[data-count-units]').hidden = true;
      section.querySelector('[data-count-done]').hidden = false;
      clearInterval(timer);
      return;
    }
    const s = Math.floor(diff / 1000);
    nums.days.textContent = Math.floor(s / 86400);
    nums.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    nums.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    nums.seconds.textContent = pad(s % 60);
  };
  const timer = setInterval(tick, 1000);
  tick();
}

function setupMusic(config) {
  const button = document.querySelector('[data-music]');
  if (!config?.enabled || !button) return null;
  button.hidden = true;

  const audio = new Audio(publicUrl(config.src));
  audio.loop = true;
  audio.preload = 'none';

  const render = (playing) => {
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    button.querySelector('[data-music-on]').hidden = !playing;
    button.querySelector('[data-music-off]').hidden = playing;
  };
  const play = () => audio.play().then(() => render(true), () => render(false));
  const pause = () => { audio.pause(); render(false); };

  button.addEventListener('click', () => (audio.paused ? play() : pause()));
  document.addEventListener('visibilitychange', () => { if (document.hidden && !audio.paused) pause(); });

  return { button, play };
}
