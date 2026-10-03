import { art, publicUrl } from './art.js';
import { icon } from './icons.js';

const esc = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Only http(s) links are rendered, so a bad config value can't inject javascript: URLs.
const safeUrl = (url) => (/^https?:\/\//i.test(url ?? '') ? esc(url) : null);
const telHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, '')}`;

const divider = (width = 160) =>
  `<div class="divider" style="--w:${width}px" aria-hidden="true"><span></span><i></i><span></span></div>`;

const corners = (size = '') =>
  ['tl', 'tr', 'bl', 'br']
    .map((pos) => `<img class="corner corner--${pos} ${size}" src="${art('corner-ornament')}" alt="" aria-hidden="true" width="256" height="262" decoding="async">`)
    .join('');

const floater = (name, cls, style) =>
  `<div class="floater ${cls}" style="${style}" aria-hidden="true"><img src="${art(name)}" alt="" loading="lazy" decoding="async"></div>`;

const sectionHead = ({ eyebrow, title, subtitle }, id) => `
  <header class="section-head">
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <h2 id="${id}">${esc(title)}</h2>
    ${subtitle ? `<p class="subtitle">${esc(subtitle)}</p>` : ''}
    <div class="section-head__divider">${divider()}</div>
  </header>`;

const strands = (variant) => `
  <img class="strand strand--left strand--${variant}" src="${art('marigold-strand')}" alt="" aria-hidden="true" width="106" height="897" decoding="async">
  <img class="strand strand--right strand--${variant}" src="${art('marigold-strand')}" alt="" aria-hidden="true" width="106" height="897" decoding="async">`;

function ambient() {
  return `
  <div class="ambient" aria-hidden="true">
    <div class="ambient__layer ambient__base"></div>
    <div class="ambient__layer paper-tile"></div>
    <div class="ambient__layer damask-tile"></div>
    <div class="ambient__layer ambient__glow"></div>
    <img class="ambient__sun" src="${art('sun-medallion')}" alt="" width="300" height="301" decoding="async">
    <img class="ambient__cloud ambient__cloud--a" src="${art('cloud-a')}" alt="" width="520" height="382" decoding="async">
    <img class="ambient__cloud ambient__cloud--b" src="${art('cloud-b')}" alt="" width="420" height="308" decoding="async">
    <div class="ambient__layer ambient__dusk" data-dusk></div>
    <div class="ambient__layer ambient__vignette"></div>
    ${strands('ambient')}
  </div>`;
}

function overlay(c) {
  return `
  <div class="overlay" role="dialog" aria-modal="true" aria-labelledby="overlay-names" data-overlay>
    <div class="overlay__decor" aria-hidden="true">
      <div class="ambient__layer paper-tile"></div>
      <div class="ambient__layer damask-tile"></div>
      <div class="ambient__layer overlay__glow"></div>
      ${strands('overlay')}
    </div>
    <div class="petals" data-petals aria-hidden="true"></div>
    <div class="frame overlay__card">
      ${corners('corner--md')}
      <div class="plate" aria-hidden="true">
        <img class="plate__img" src="${art('plate')}" alt="" width="750" height="767" decoding="async">
        <div class="plate__medallion"><img src="${art('ganesh-medallion')}" alt="" width="256" height="259" decoding="async"></div>
      </div>
      <p class="deva overlay__deva" lang="hi">${esc(c.invocation)}</p>
      <p class="overlay__invite">${esc(c.overlay.invite)}</p>
      <p class="overlay__names" id="overlay-names">${esc(c.bride)} <span class="amp">&amp;</span> ${esc(c.groom)}</p>
      <button class="pill" type="button" data-open>${esc(c.overlay.button)}</button>
    </div>
  </div>`;
}

function hero(c) {
  return `
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__backdrop" data-layer="backdrop">
      <img src="${art('hero-backdrop')}" alt="" width="1080" height="717" fetchpriority="high" decoding="async">
    </div>
    <div class="hero__couple" data-layer="couple">
      <img src="${art('hero-couple')}" alt="Illustration of ${esc(c.bride)} and ${esc(c.groom)}" width="640" height="964" decoding="async">
    </div>
    <div class="hero__foreground" data-layer="foreground" aria-hidden="true">
      <img src="${art('hero-foreground')}" alt="" width="1080" height="384" decoding="async">
    </div>
    <div class="petals" data-petals aria-hidden="true"></div>
    <div class="hero__text" data-layer="text">
      <div class="hero__panel">
        <p class="deva hero__deva" lang="hi" data-hero-reveal>${esc(c.invocation)}</p>
        <div class="hero__divider" data-hero-reveal>${divider(90)}</div>
        <h1 id="hero-title" tabindex="-1">
          <span data-hero-reveal>${esc(c.bride)}</span>
          <span class="hero__weds" data-hero-reveal>weds</span>
          <span data-hero-reveal>${esc(c.groom)}</span>
        </h1>
        <p class="hero__tagline" data-hero-reveal>${esc(c.hero.tagline)}</p>
        <div class="hero__pill" data-hero-reveal>
          <p class="hero__date">${esc(c.heroDateText)}</p>
          <p class="hero__city"><span aria-hidden="true">✦</span>${esc(c.city)}<span aria-hidden="true">✦</span></p>
        </div>
      </div>
    </div>
  </section>`;
}

function families(c) {
  const f = c.families;
  const side = (s) => `
      <div class="families__side">
        <p class="families__label">${esc(s.label)}</p>
        <p class="families__parents">${esc(s.parents)}</p>
        ${s.grandparents ? `<p class="families__grand">${esc(s.grandparents)}</p>` : ''}
      </div>`;
  return `
  <section class="section families" aria-label="Invitation">
    ${floater('parrots', 'floater--sm-up floater--sway', 'top:2rem;right:13%;width:clamp(80px,11vw,150px)')}
    ${floater('cloud-b', 'floater--md-up floater--drift', 'top:16%;left:-1%;width:clamp(90px,13vw,180px);opacity:.5')}
    <div class="frame frame--lg families__card" data-reveal>
      ${corners('corner--lg')}
      <p class="deva families__deva" lang="hi">${esc(f.invocation)}</p>
      <p class="families__blessing">${esc(f.blessingLine)}</p>
      <div class="families__cols">
        ${side(f.bride)}
        <div class="families__sep" aria-hidden="true">✦</div>
        ${side(f.groom)}
      </div>
      ${divider(110)}
      <p class="families__request">${esc(f.request)}</p>
      <p class="families__closing">${esc(f.closing)}</p>
    </div>
  </section>`;
}

function scene(e, i) {
  const map = safeUrl(e.mapUrl);
  return `
    <article class="scene${i === 0 ? ' is-active' : ''}" data-scene aria-labelledby="event-${esc(e.key)}">
      <div class="scene__art" data-scene-art>
        <img src="${art(e.art)}" alt="" width="1080" height="717" ${i === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
      </div>
      <div class="scene__shade" aria-hidden="true"></div>
      <div class="scene__inner">
        <div class="event-card" data-scene-card>
          ${corners('corner--sm')}
          <p class="label">${String(i + 1).padStart(2, '0')} <span class="star" aria-hidden="true">✦</span> ${esc(e.date)}</p>
          <h3 id="event-${esc(e.key)}">${esc(e.name)}</h3>
          <p class="event-card__time">${esc(e.time)}</p>
          <p class="event-card__row">${icon('map-pin')}<span><strong>${esc(e.venue)}</strong>${e.area ? `<span class="muted"> · ${esc(e.area)}</span>` : ''}</span></p>
          ${e.dress ? `<p class="event-card__row">${icon('shirt')}<span>Dress: ${esc(e.dress)}</span></p>` : ''}
          ${e.note ? `<p class="event-card__note">${esc(e.note)}</p>` : ''}
          ${map ? `<a class="map-link" href="${map}" target="_blank" rel="noopener">${icon('navigation', { size: 14 })}Open in Google Maps<span class="sr-only"> for ${esc(e.name)} at ${esc(e.venue)} (opens in a new tab)</span></a>` : ''}
        </div>
      </div>
    </article>`;
}

function celebrations(c) {
  return `
  <section class="celebrations" aria-labelledby="celebrations-title">
    <div class="celebrations__head">${sectionHead(c.celebrations, 'celebrations-title')}</div>
    <div class="stage" data-stage>
      ${c.events.map(scene).join('')}
      <div class="stage__dots" aria-hidden="true">${c.events.map((_, i) => `<span class="dot${i === 0 ? ' is-active' : ''}"></span>`).join('')}</div>
    </div>
    <div class="celebrations__foot">${divider()}</div>
  </section>`;
}

function story(c) {
  const s = c.story;
  if (!s?.enabled || !s.items?.length) return '';
  return `
  <section class="section story" aria-labelledby="story-title">
    ${floater('vine-sprig', 'floater--bob', 'top:5%;left:-1.5%;width:clamp(90px,13vw,190px);opacity:.9')}
    ${floater('vine-sprig', 'floater--bob floater--flip', 'top:12%;right:-1.5%;width:clamp(90px,13vw,190px);opacity:.9')}
    ${floater('lotus-cluster', 'floater--md-up floater--bob', 'bottom:0;right:6%;width:clamp(70px,9vw,130px)')}
    ${sectionHead(s, 'story-title')}
    <div class="story__grid" data-reveal-group>
      ${s.items.map((item) => `
        <div class="story__item" data-reveal-item>
          <div class="story__photo"><img src="${publicUrl(`photos/${item.img}`)}" alt="${esc(item.title)}" loading="lazy" decoding="async"></div>
          <p class="label">${esc(item.year)}</p>
          <h3>${esc(item.title)}</h3>
          <p class="story__text">${esc(item.text)}</p>
        </div>`).join('')}
    </div>
  </section>`;
}

function gallery(c) {
  const g = c.gallery;
  if (!g?.enabled || !g.items?.length) return '';
  return `
  <section class="section gallery" aria-labelledby="gallery-title">
    ${floater('parrots', 'floater--sm-up floater--sway', 'top:3%;right:9%;width:clamp(76px,10vw,140px)')}
    ${floater('vine-sprig', 'floater--md-up floater--bob', 'bottom:4%;left:-1.5%;width:clamp(90px,12vw,170px);opacity:.85')}
    ${sectionHead(g, 'gallery-title')}
    <div class="gallery__row" data-reveal-group>
      ${g.items.map((item) => `
        <figure class="arch" data-reveal-item>
          <div class="arch__frame"><img src="${item.art ? art(item.art) : publicUrl(`photos/${item.img}`)}" alt="${esc(item.caption)}" loading="lazy" decoding="async"></div>
          <figcaption>${esc(item.caption)}</figcaption>
        </figure>`).join('')}
    </div>
  </section>`;
}

function details(c) {
  const d = c.details;
  if (!d?.enabled) return '';
  return `
  <section class="section details" aria-labelledby="details-title">
    ${floater('elephant', 'floater--bob', 'bottom:0;right:2%;width:clamp(110px,16vw,230px)')}
    ${floater('cloud-a', 'floater--sm-up floater--drift', 'top:3%;left:-2%;width:clamp(100px,14vw,200px);opacity:.45')}
    ${sectionHead(d, 'details-title')}
    ${d.hashtag ? `
    <div class="details__hashtag" data-reveal>
      <p class="details__tag">${esc(d.hashtag)}</p>
      ${d.hashtagNote ? `<p class="details__tag-note">${esc(d.hashtagNote)}</p>` : ''}
    </div>` : ''}
    <div class="details__grid" data-reveal-group>
      ${(d.items ?? []).map((item) => `
        <div class="details__item" data-reveal-item>
          ${icon(item.icon, { size: 38, stroke: 1.1, cls: 'details__icon' })}
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.text)}</p>
        </div>`).join('')}
    </div>
  </section>`;
}

function venues(c) {
  if (!c.venues?.enabled) return '';
  const byVenue = new Map();
  for (const e of c.events) {
    const id = `${e.venue}|${e.area}`;
    if (!byVenue.has(id)) byVenue.set(id, { ...e, names: [] });
    byVenue.get(id).names.push(e.name);
  }
  return `
  <section class="section venues" aria-labelledby="venues-title">
    ${floater('lotus-cluster', 'floater--bob', 'bottom:0;left:4%;width:clamp(80px,11vw,150px)')}
    ${floater('parrots', 'floater--sm-up floater--sway', 'top:6%;right:12%;width:clamp(72px,9vw,130px)')}
    ${sectionHead(c.venues, 'venues-title')}
    <ul class="venues__list" data-reveal-group>
      ${[...byVenue.values()].map((v) => {
        const map = safeUrl(v.mapUrl);
        return `
        <li class="venue" data-reveal-item>
          <p class="label">${esc(v.names.join(' · '))}</p>
          <h3>${esc(v.venue)}</h3>
          <p class="venue__address">${icon('map-pin')}<span>${esc(v.address || v.area)}</span></p>
          ${map ? `<a class="pill pill--sm" href="${map}" target="_blank" rel="noopener">${icon('navigation', { size: 14 })}Open in Google Maps<span class="sr-only"> for ${esc(v.venue)} (opens in a new tab)</span></a>` : ''}
        </li>`;
      }).join('')}
    </ul>
  </section>`;
}

function countdown(c) {
  const unit = (key, label) => `
        <div class="countdown__unit"><p class="countdown__num" data-count="${key}">00</p><p class="label">${label}</p></div>`;
  return `
  <section class="section countdown" aria-labelledby="countdown-title" data-countdown>
    ${floater('cloud-b', 'floater--drift', 'top:6%;right:1%;width:clamp(90px,12vw,170px);opacity:.5')}
    ${floater('cloud-a', 'floater--sm-up floater--drift', 'bottom:8%;left:-2%;width:clamp(110px,15vw,210px);opacity:.45')}
    <div class="frame countdown__card" data-reveal>
      ${corners('corner--lg')}
      <h2 id="countdown-title">${esc(c.countdown.title)}</h2>
      <div class="countdown__units" data-count-units>
        ${unit('days', 'Days')}${unit('hours', 'Hours')}${unit('minutes', 'Minutes')}${unit('seconds', 'Seconds')}
      </div>
      <p class="countdown__done" data-count-done hidden>${esc(c.countdown.doneText)}</p>
      <div class="countdown__divider">${divider(90)}</div>
    </div>
  </section>`;
}

function footer(c) {
  const f = c.footer;
  return `
  <footer class="footer">
    <div class="footer__skyline" aria-hidden="true"><img src="${art('skyline')}" alt="" width="1820" height="1024" loading="lazy" decoding="async"></div>
    ${floater('peacock', 'floater--bob', 'bottom:.25rem;left:6%;width:clamp(80px,11vw,150px)')}
    ${floater('parrots', 'floater--sm-up floater--sway', 'top:6%;right:12%;width:clamp(70px,9vw,120px)')}
    ${divider()}
    <p class="footer__families">${esc(f.families)}</p>
    <p class="footer__line">${esc(f.line)}</p>
    ${f.contacts?.length ? `
    <ul class="footer__contacts">
      ${f.contacts.map((p) => `<li><span class="footer__contact-name">${esc(p.name)}</span><a href="${telHref(p.phone)}">${icon('phone', { size: 14 })}${esc(p.phone)}</a></li>`).join('')}
    </ul>` : ''}
  </footer>`;
}

function musicToggle(c) {
  if (!c.music?.enabled) return '';
  return `<button class="music-toggle" type="button" aria-pressed="false" aria-label="Play background music" data-music>
    <span data-music-on hidden>${icon('volume-2', { size: 20 })}</span><span data-music-off>${icon('volume-x', { size: 20 })}</span>
  </button>`;
}

export function renderSite(c) {
  return `
  ${ambient()}
  ${overlay(c)}
  <main class="site" id="main" inert>
    ${hero(c)}
    ${families(c)}
    ${celebrations(c)}
    ${story(c)}
    ${gallery(c)}
    ${details(c)}
    ${venues(c)}
    ${countdown(c)}
    ${footer(c)}
  </main>
  ${musicToggle(c)}`;
}
