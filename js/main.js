(() => {
  'use strict';
  const doc = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { doc.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger);

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = $('#header');
  const HEADER = 76;
  // The pinned effects now run on phones too; only a reduced-motion preference turns them off.
  const MOTION = '(prefers-reduced-motion: no-preference)';

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToY = (y) => {
    if (lenis) lenis.scrollTo(y, { duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  };
  const scrollToEl = (el) => {
    if (!el) return;
    scrollToY(el.getBoundingClientRect().top + window.scrollY - HEADER);
  };

  /* ---------- Header ---------- */
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-solid', y > 80);
    if (!document.body.classList.contains('menu-open')) {
      header.classList.toggle('is-hidden', y > 420 && y > lastY + 4);
      if (y < lastY - 4) header.classList.remove('is-hidden');
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu ---------- */
  const menu = $('#menu'), menuBtn = $('#menuBtn'), menuLabel = $('.menu-btn__label');
  let menuOpen = false;
  const main = $('#main'), footer = $('.footer');
  const setInert = (on) => [main, footer].forEach(n => { if (n) n.inert = on; });
  const openMenu = () => {
    menuOpen = true;
    menu.hidden = false;
    document.body.classList.add('menu-open', 'is-locked');
    header.classList.remove('is-hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuLabel.textContent = menuLabel.dataset.close;
    if (lenis) lenis.stop();
    setInert(true);
    gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: reduced ? 0 : 1, ease: 'expo.inOut' });
    gsap.fromTo($$('.menu__nav li', menu), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: reduced ? 0 : 1.1, ease: 'expo.out', stagger: .06, delay: reduced ? 0 : .35 });
    gsap.fromTo($('.menu__meta', menu), { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : .8, delay: reduced ? 0 : .7 });
    setTimeout(() => $('.menu__nav a', menu).focus({ preventScroll: true }), 50);
  };
  const closeMenu = (after) => {
    if (!menuOpen) { after && after(); return; }
    menuOpen = false;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuLabel.textContent = menuLabel.dataset.open;
    gsap.to(menu, { clipPath: 'inset(100% 0 0 0)', duration: reduced ? 0 : .8, ease: 'expo.inOut', onComplete: () => {
      menu.hidden = true;
      document.body.classList.remove('menu-open', 'is-locked');
      setInert(false);
      if (lenis) lenis.start();
      after && after();
    } });
  };
  menuBtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  document.addEventListener('keydown', e => {
    if (!menuOpen) return;
    if (e.key === 'Escape') { closeMenu(); menuBtn.focus(); }
    if (e.key === 'Tab') {
      const f = [...$$('a', menu), menuBtn, $('.header .btn')].filter(el => el.offsetParent !== null);
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- Rate card (tabs component) ---------- */
  const tabsEl = $('#tabs'), panelEl = $('#panel');
  const data = window.RATES || [];
  const op = s => String(s).replace(/\s+op(?=\n|$)/g, '<sup class="op">op</sup>');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  let activeTab = 0;
  const renderPanel = (i, animate = true, refresh = true) => {
    const t = data[i];
    let html = '';
    if (t.type === 'tier') {
      html = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Service</th>${t.tiers.map(x => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>` +
        t.rows.map(r => `<tr><td>${esc(r[0])}</td>${r.slice(1).map(v => `<td>${v === '–' ? '–' : '₹' + op(esc(v))}</td>`).join('')}</tr>`).join('') + '</tbody></table></div>';
    } else {
      html = '<div class="rrows">' + t.rows.map(r => `<div class="rrow"><h4>${esc(r[0])}</h4><p>${esc(r[1])}</p><div class="price">${op(esc(r[2]))}</div></div>`).join('') + '</div>';
    }
    panelEl.innerHTML = `<div class="panel__in">${html}</div>`;
    panelEl.setAttribute('aria-labelledby', 'tab-' + t.id);
    if (animate && !reduced) gsap.from($$('.tbl tbody tr, .rrow', panelEl), { y: 22, opacity: 0, duration: .9, ease: 'expo.out', stagger: .035 });
    // A refresh mid smooth-scroll would cancel it, so link-driven changes refresh once the scroll has landed.
    if (refresh) ScrollTrigger.refresh(); else setTimeout(() => ScrollTrigger.refresh(), 2400);
  };
  const selectTab = (i, focus, fromLink) => {
    activeTab = i;
    $$('.tab', tabsEl).forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
    renderPanel(i, true, !fromLink);
    if (focus) $$('.tab', tabsEl)[i].focus();
  };
  tabsEl.innerHTML = data.map((t, i) => `<button class="tab" role="tab" id="tab-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">${esc(t.label)}</button>`).join('');
  tabsEl.addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) selectTab(+b.dataset.i); });
  tabsEl.addEventListener('keydown', e => {
    const n = data.length;
    if (e.key === 'ArrowRight') { e.preventDefault(); selectTab((activeTab + 1) % n, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); selectTab((activeTab - 1 + n) % n, true); }
    if (e.key === 'Home') { e.preventDefault(); selectTab(0, true); }
    if (e.key === 'End') { e.preventDefault(); selectTab(n - 1, true); }
  });
  renderPanel(0, false);

  /* ---------- Anchors, tab links, service prefill ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    let wait = 0;
    if (a.dataset.tab) {
      const i = data.findIndex(t => t.id === a.dataset.tab);
      // A taller or shorter panel resizes the page and Lenis cancels any running scroll on resize,
      // so let the layout settle first, then scroll.
      if (i > -1 && i !== activeTab) { selectTab(i, false, true); wait = 180; }
    }
    if (a.dataset.service) { const s = $('#f-service'); if (s) s.value = a.dataset.service; }
    closeMenu(() => setTimeout(() => scrollToEl(target), wait));
  });

  /* ---------- Contact form → composed email ---------- */
  const form = $('#form'), err = $('#formErr');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = n => form.elements[n].value.trim();
    const bad = [];
    if (!v('name')) bad.push('name');
    if (v('phone').replace(/\D/g, '').length < 8) bad.push('phone');
    if (!/^\S+@\S+\.\S+$/.test(v('email'))) bad.push('email');
    ['name', 'phone', 'email'].forEach(n => form.elements[n].setAttribute('aria-invalid', bad.includes(n)));
    if (bad.length) {
      err.hidden = false;
      err.textContent = 'Please check your ' + bad.join(', ').replace(/, ([^,]*)$/, ' and $1') + '.';
      form.elements[bad[0]].focus();
      return;
    }
    err.hidden = true;
    const body = `Name: ${v('name')}\nPhone: ${v('phone')}\nEmail: ${v('email')}\nService: ${v('service') || '—'}\n\n${v('message')}`;
    location.href = 'mailto:jaipurdesk@24societysalonandwellness.com?subject=' + encodeURIComponent('Enquiry — ' + (v('service') || 'The house')) + '&body=' + encodeURIComponent(body);
  });

  /* ---------- Hero slider ---------- */
  const slides = $$('.hero__slide');
  const names = ['The house', 'Hair Couture', 'Advanced Skin', 'The Pilates Studio', 'The 24 Society Café'];
  const numEl = $('#slideNum'), nameEl = $('#slideName'), barEl = $('#slideBar');
  $('#slideTotal').textContent = String(slides.length).padStart(2, '0');
  let cur = 0, timer = null, running = false, heroVisible = true;
  const DUR = 6.5;
  const startTimer = () => {
    if (timer) timer.kill();
    timer = gsap.fromTo(barEl, { scaleX: 0 }, { scaleX: 1, duration: DUR, ease: 'none', onComplete: () => go((cur + 1) % slides.length) });
    if (!running) timer.pause();
  };
  const go = (n) => {
    const from = slides[cur], to = slides[n];
    cur = n;
    gsap.set(to, { opacity: 0, scale: 1.14, zIndex: 2 });
    to.classList.add('is-active');
    gsap.to(to, { opacity: 1, duration: 1.6, ease: 'power2.inOut' });
    gsap.to(to, { scale: 1, duration: DUR + 2.5, ease: 'power1.out' });
    gsap.to(from, { opacity: 0, duration: 1.6, ease: 'power2.inOut', onComplete: () => { from.classList.remove('is-active'); gsap.set(from, { zIndex: 1 }); gsap.set(to, { zIndex: 1 }); } });
    gsap.to([numEl, nameEl], { y: -8, opacity: 0, duration: .35, ease: 'power2.in', onComplete: () => {
      numEl.textContent = String(n + 1).padStart(2, '0');
      nameEl.textContent = names[n];
      gsap.fromTo([numEl, nameEl], { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'expo.out' });
    } });
    startTimer();
  };
  const setRunning = (on) => { running = on && !reduced; if (timer) running ? timer.resume() : timer.pause(); };
  document.addEventListener('visibilitychange', () => setRunning(!document.hidden && heroVisible));
  ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onToggle: s => { heroVisible = s.isActive; setRunning(heroVisible && !document.hidden); } });

  /* ---------- Intro: loader → hero ---------- */
  const loader = $('#loader'), num = $('#loaderNum');
  const heroIn = () => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.hero__slide.is-active', { scale: 1.18 }, { scale: 1, duration: 3.2 }, 0)
      .to('.hero__title [data-hero]', { yPercent: 0, y: 0, duration: 1.5, stagger: .14 }, .15)
      .to('.hero__cta, .hero__tag, .hero__meter', { opacity: 1, duration: 1.1, stagger: .12 }, .7)
      .add(() => { setRunning(true); startTimer(); }, 1.0);
  };
  const intro = async () => {
    const ready = Promise.race([
      Promise.all([document.fonts ? document.fonts.ready : 0, slides[0].decode ? slides[0].decode().catch(() => 0) : 0]),
      new Promise(r => setTimeout(r, 3500))
    ]);
    if (reduced) { await ready; loader.remove(); gsap.set('[data-hero]', { opacity: 1, y: 0, yPercent: 0 }); return; }
    const o = { v: 0 };
    const tl = gsap.timeline();
    tl.to('.loader__logo', { opacity: 1, duration: .9, ease: 'power2.out' }, 0)
      .to(o, { v: 24, duration: 1.7, ease: 'power2.inOut', onUpdate: () => {
        num.textContent = String(Math.round(o.v)).padStart(2, '0');
        $('.loader__count i').style.setProperty('--p', o.v / 24);
      } }, 0);
    await ready;
    await tl.then();
    gsap.timeline()
      .to('.loader__inner', { opacity: 0, y: -16, duration: .6, ease: 'power2.in' })
      .to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=.15')
      .add(heroIn, '-=.55')
      .add(() => loader.remove());
  };

  /* ---------- Word-mask headings ---------- */
  const splitWords = (el) => {
    const wrap = (node) => {
      const frag = document.createDocumentFragment();
      node.childNodes.forEach(n => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            const m = document.createElement('span'); m.className = 'm';
            const i = document.createElement('span'); i.textContent = w; m.appendChild(i); frag.appendChild(m);
          });
        } else if (n.nodeName === 'BR') frag.appendChild(n.cloneNode());
        else { const c = n.cloneNode(false); c.appendChild(wrap(n)); frag.appendChild(c); }
      });
      return frag;
    };
    el.replaceChildren(wrap(el));
  };

  /* ---------- Showcase: timeline drives the framed image ---------- */
  const tlItems = $$('.tl__item'), frameImgs = $$('#frame img');
  let activeI = 0, showcaseST = null;
  const setActive = (i) => {
    if (i === activeI) return;
    activeI = i;
    tlItems.forEach((b, k) => b.classList.toggle('is-active', k === i));
    frameImgs.forEach((im, k) => im.classList.toggle('is-active', k === i));
  };
  tlItems.forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.i;
    if (showcaseST) {
      const y = showcaseST.start + (showcaseST.end - showcaseST.start) * ((i + .5) / tlItems.length);
      scrollToY(y);
    } else setActive(i);
  }));

  /* ---------- Cards: the hot card follows hover and focus ---------- */
  const cardEls = $$('.card');
  cardEls.forEach(c => {
    const hot = () => cardEls.forEach(x => x.classList.toggle('is-hot', x === c));
    c.addEventListener('mouseenter', hot);
    c.addEventListener('focusin', hot);
  });

  /* ---------- Scroll choreography ---------- */
  const scrollFX = () => {
    // Statement: words resolve as you read
    $$('[data-words]').forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      el.setAttribute('aria-label', el.textContent.trim());
      el.innerHTML = words.map(w => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
      if (reduced) return;
      gsap.to($$('.w', el), { opacity: 1, stagger: .12, ease: 'none', scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true } });
    });

    if (!reduced) {
      // Headings reveal word by word
      $$('h2.display').forEach(h => {
        h.removeAttribute('data-reveal');
        splitWords(h);
        ScrollTrigger.create({ trigger: h, start: 'top 86%', once: true, onEnter: () => gsap.to($$('.m > span', h), { y: 0, yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .055 }) });
      });
      // Everything else fades up
      ScrollTrigger.batch('[data-reveal]', { start: 'top 90%', once: true,
        onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: .09, overwrite: true }) });
    }

    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      // Hero shrinks into the collage (a little less on a phone, so the title stays readable)
      const small = window.innerWidth < 900;
      gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: true } })
        .to('#stage', { scale: small ? .76 : .7, borderRadius: small ? 22 : 28, ease: 'none' }, 0)
        .fromTo('.collage img', { scale: 1.18 }, { scale: 1, ease: 'none' }, 0);

      // Services: scrolling advances the timeline
      showcaseST = ScrollTrigger.create({ trigger: '#services', start: 'top top', end: 'bottom bottom',
        onUpdate: self => setActive(Math.min(tlItems.length - 1, Math.floor(self.progress * tlItems.length))) });

      // Disciplines: CSS-sticky pin (steadier than a fixed pin on phones); the section is as tall as
      // the screen plus the distance the track has to travel, and scroll progress slides the track.
      const sec = $('#disciplines'), pin = $('.cards__pin'), track = $('#cardsTrack');
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const setH = () => { sec.style.height = (pin.offsetHeight + dist()) + 'px'; };
      setH();
      ScrollTrigger.addEventListener('refreshInit', setH);
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true } });

      return () => {
        showcaseST = null;
        ScrollTrigger.removeEventListener('refreshInit', setH);
        sec.style.height = '';
        gsap.set(track, { clearProps: 'all' });
        gsap.set('#stage', { clearProps: 'all' });
      };
    });
  };

  scrollFX();
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

  if (!reduced) startTimer(); else { const bar = $('.hero__meter i'); if (bar) bar.style.display = 'none'; }
  intro();
})();
