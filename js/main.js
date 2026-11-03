(() => {
  'use strict';
  const doc = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { doc.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger);

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hoverFine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const header = $('#header');
  const HEADER = 76;

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToEl = (el) => {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -HEADER, duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  /* ---------- Header: solid after hero start, hides on scroll down ---------- */
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
      const f = [...$$('a', menu), menuBtn, $('.header__reserve')].filter(el => el.offsetParent !== null);
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
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
      html = '<div class="rows">' + t.rows.map(r => `<div class="rrow"><h4>${esc(r[0])}</h4><p>${esc(r[1])}</p><div class="price">${op(esc(r[2]))}</div></div>`).join('') + '</div>';
    }
    panelEl.innerHTML = `<div class="panel__in">${html}</div>`;
    panelEl.setAttribute('aria-labelledby', 'tab-' + t.id);
    if (animate && !reduced) {
      gsap.from($$('.tbl tbody tr, .rrow', panelEl), { y: 22, opacity: 0, duration: .9, ease: 'expo.out', stagger: .035 });
    }
    // Refreshing mid smooth-scroll would cancel it, so link-driven changes refresh once the scroll has landed.
    if (refresh) ScrollTrigger.refresh();
    else setTimeout(() => ScrollTrigger.refresh(), 2400);
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
      // A taller/shorter panel resizes the page, and Lenis cancels any running scroll on resize,
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
    location.href = 'mailto:jaipurdesk@24societysalonandwellness.com?subject=' + encodeURIComponent('Enquiry — ' + (v('service') || 'The House')) + '&body=' + encodeURIComponent(body);
  });

  /* ---------- Services index preview ---------- */
  const rows = $$('.index__row'), previews = $$('#preview img');
  const setRow = (row) => {
    rows.forEach(r => r.classList.toggle('is-active', r === row));
    previews.forEach(p => p.classList.toggle('is-active', p.dataset.key === row.dataset.img));
  };
  rows.forEach(r => {
    r.addEventListener('mouseenter', () => setRow(r));
    r.addEventListener('focusin', () => setRow(r));
  });

  /* ---------- Magnetic buttons ---------- */
  if (hoverFine && !reduced) {
    $$('[data-magnetic]').forEach(el => {
      const xTo = gsap.quickTo(el, 'x', { duration: .6, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: .6, ease: 'power3' });
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .22);
        yTo((e.clientY - r.top - r.height / 2) * .32);
      });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- Hero slider ---------- */
  const slides = $$('.hero__slide');
  const names = ['The House', 'Hair Couture', 'Advanced Skin', 'The Pilates Studio', 'The 24 Society Café'];
  const numEl = $('#slideNum'), nameEl = $('#slideName'), barEl = $('#slideBar');
  $('#slideTotal').textContent = String(slides.length).padStart(2, '0');
  let cur = 0, timer = null, running = false;
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
    gsap.to([numEl, nameEl], { y: -10, opacity: 0, duration: .35, ease: 'power2.in', onComplete: () => {
      numEl.textContent = String(n + 1).padStart(2, '0');
      nameEl.textContent = names[n];
      gsap.fromTo([numEl, nameEl], { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'expo.out' });
    } });
    startTimer();
  };
  const setRunning = (on) => { running = on && !reduced; if (timer) running ? timer.resume() : timer.pause(); };
  document.addEventListener('visibilitychange', () => setRunning(!document.hidden && heroVisible));
  let heroVisible = true;
  ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onToggle: s => { heroVisible = s.isActive; setRunning(heroVisible && !document.hidden); } });

  /* ---------- Intro: loader → hero ---------- */
  const loader = $('#loader'), num = $('#loaderNum');
  const heroIn = () => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.hero__slide.is-active', { scale: 1.18 }, { scale: 1, duration: 3.2 }, 0)
      .to('.hero__eyebrow', { opacity: 1, duration: 1 }, .1)
      .to('.hero__title [data-hero]', { yPercent: 0, y: 0, duration: 1.5, stagger: .14 }, .15)
      .to('.hero__lede, .hero__meter', { opacity: 1, duration: 1.1, stagger: .12 }, .7)
      .add(() => { setRunning(true); startTimer(); }, 1.0);
  };
  const revealAll = () => { gsap.set('[data-hero]', { opacity: 1, y: 0, yPercent: 0 }); };
  const intro = async () => {
    const ready = Promise.race([
      Promise.all([document.fonts ? document.fonts.ready : 0, slides[0].decode ? slides[0].decode().catch(() => 0) : 0]),
      new Promise(r => setTimeout(r, 3500))
    ]);
    if (reduced) { await ready; loader.remove(); revealAll(); return; }
    const o = { v: 0 };
    const tl = gsap.timeline();
    tl.to('.loader__logo', { opacity: 1, duration: .9, ease: 'power2.out' }, 0)
      .to(o, { v: 24, duration: 1.7, ease: 'power2.inOut', onUpdate: () => {
        num.textContent = String(Math.round(o.v)).padStart(2, '0');
        loader.style.setProperty('--p', o.v / 24);
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

  /* ---------- Scroll choreography ---------- */
  /* ---------- Rolling text + word-mask headings (Solenne grammar) ---------- */
  const rollify = () => {
    if (!hoverFine || reduced) return;
    $$('.link, .btn, .header__reserve, .footer__cols a').forEach(el => {
      const t = Array.from(el.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
      if (!t) return;
      const txt = t.textContent.trim();
      const r = document.createElement('span'); r.className = 'roll';
      const a1 = document.createElement('span'); a1.textContent = txt;
      const a2 = document.createElement('span'); a2.textContent = txt; a2.setAttribute('aria-hidden', 'true');
      r.append(a1, a2);
      t.replaceWith(r);
    });
  };
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
  const maskHeadings = () => {
    if (reduced) return;
    $$('h2.display').forEach(h => {
      h.removeAttribute('data-reveal');
      splitWords(h);
      ScrollTrigger.create({ trigger: h, start: 'top 86%', once: true, onEnter: () => gsap.to($$('.m > span', h), { y: 0, yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .055 }) });
    });
  };

  const scrollFX = () => {
    maskHeadings();
    rollify();
    // Scroll-scrubbed statement: words resolve as you read
    $$('[data-words]').forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      el.setAttribute('aria-label', el.textContent.trim());
      el.innerHTML = words.map(w => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
      if (reduced) return;
      gsap.to($$('.w', el), { opacity: 1, stagger: .12, ease: 'none', scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true } });
    });

    // Reveals
    if (!reduced) {
      ScrollTrigger.batch('[data-reveal]', { start: 'top 90%', once: true,
        onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: .09, overwrite: true }) });

      // Image parallax
      $$('[data-parallax-wrap]').forEach(w => {
        const img = $('[data-parallax]', w);
        gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: w, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    }

    // Counter
    $$('[data-count]').forEach(el => {
      const end = +el.dataset.count;
      if (reduced) return;
      const o = { v: 0 }; el.textContent = '0';
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => el.textContent = Math.round(o.v) }) });
    });

    // Ritual: line draws, steps light up
    const list = $('#ritualList');
    if (list && !reduced) {
      gsap.to(list, { '--p': 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 62%', end: 'bottom 62%', scrub: true } });
      $$('li', list).forEach(li => ScrollTrigger.create({ trigger: li, start: 'top 68%', onEnter: () => li.classList.add('is-on'), onLeaveBack: () => li.classList.remove('is-on') }));
    } else if (list) { $$('li', list).forEach(li => li.classList.add('is-on')); }

    // Floors: pinned horizontal travel on large screens
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const sec = $('#floors'), track = $('#floorsTrack');
      sec.classList.add('is-h');
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 0);
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
      return () => { sec.classList.remove('is-h'); gsap.set(track, { clearProps: 'all' }); };
    });
  };

  scrollFX();
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

  // Start slider state (paused until intro completes)
  if (!reduced) { startTimer(); } else { $('.hero__bar').style.display = 'none'; }
  intro();
})();
