/* ============================================================
   MISK & GOLD — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');
  const loaderPct = document.getElementById('loaderPct');
  const loaderSparkles = document.getElementById('loaderSparkles');

  // Scatter a handful of gold sparkle particles across the loader
  if (loaderSparkles) {
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.animationDelay = (Math.random() * 2.4) + 's';
      loaderSparkles.appendChild(s);
    }
  }

  let progress = 0;
  const progressTimer = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressTimer);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        triggerHeroReveal();
      }, 260);
    }
    if (loaderProgress) loaderProgress.style.width = progress + '%';
    if (loaderPct) loaderPct.textContent = Math.floor(progress) + '%';
  }, 180);
  document.body.style.overflow = 'hidden';

  // Split the hero title into individually animated letters
  document.querySelectorAll('.split-letters').forEach(line => {
    const text = line.textContent;
    line.textContent = '';
    line.setAttribute('aria-label', text);
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.style.transitionDelay = (i * 45) + 'ms';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.setAttribute('aria-hidden', 'true');
      line.appendChild(span);
    });
  });

  function triggerHeroReveal(){
    document.querySelectorAll('.reveal-up').forEach(el => {
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('in'), delay * 140);
    });
    document.querySelectorAll('.hero-title .letter').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 140 + i * 35);
    });
  }
  // Fallback in case loader hangs
  setTimeout(() => { loader.classList.add('hidden'); document.body.style.overflow=''; triggerHeroReveal(); }, 3200);

  /* ---------- Custom cursor (with magnetic hover) ---------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const mouseGlow = document.getElementById('mouseGlow');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (isFinePointer) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    let magnetTarget = null;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      if (mouseGlow) {
        mouseGlow.classList.add('active');
        mouseGlow.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      }
    });
    window.addEventListener('mouseleave', () => { if (mouseGlow) mouseGlow.classList.remove('active'); });

    (function animateRing(){
      let tx = mx, ty = my;
      // Magnetic pull toward the center of the hovered element
      if (magnetTarget) {
        const r = magnetTarget.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        tx = mx + (cx - mx) * 0.35;
        ty = my + (cy - my) * 0.35;
      }
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .menu-tab, .why-card, .menu-card, .masonry-item, input, select, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => { cursorRing.classList.add('hover'); magnetTarget = el; });
      el.addEventListener('mouseleave', () => { cursorRing.classList.remove('hover'); magnetTarget = null; });
    });

    // Magnetic buttons & nav links — the element itself gently pulls toward the cursor
    document.querySelectorAll('.btn, .nav-link').forEach(el => {
      el.classList.add('magnetic');
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const relX = e.clientX - (r.left + r.width / 2);
        const relY = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${relX * 0.28}px, ${relY * 0.32}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    // Soft gold light trail behind the cursor
    let lastTrail = 0;
    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastTrail < 45) return;
      lastTrail = now;
      const dot = document.createElement('span');
      dot.className = 'cursor-trail';
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 700);
    });
  }

  /* ---------- Scroll progress bar ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress(){
    if (!scrollProgress) return;
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    scrollProgress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ---------- Ambient gold particles ---------- */
  function spawnParticles(container, count){
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
      p.style.animationDuration = (10 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      container.appendChild(p);
    }
  }
  spawnParticles(document.getElementById('heroParticles'), 14);
  document.querySelectorAll('.particles-layer').forEach(layer => {
    spawnParticles(layer, parseInt(layer.dataset.particles, 10) || 5);
  });

  // Sparse ambient dust drifting up the full page height
  const dustLayer = document.getElementById('dustLayer');
  if (dustLayer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 22; i++) {
      const d = document.createElement('span');
      d.className = 'particle';
      d.style.left = Math.random() * 100 + '%';
      d.style.setProperty('--drift', (Math.random() * 40 - 20) + 'px');
      d.style.animationDuration = (18 + Math.random() * 16) + 's';
      d.style.animationDelay = (Math.random() * 18) + 's';
      dustLayer.appendChild(d);
    }
  }

  /* ---------- Gentle parallax on key images ---------- */
  const parallaxEls = [...document.querySelectorAll('.about-media img, .chef-media img')];
  if (parallaxEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      parallaxEls.forEach(img => {
        const rect = img.getBoundingClientRect();
        const offset = (rect.top - window.innerHeight / 2) * 0.04;
        img.style.transform = `translateY(${offset}px) scale(1.04)`;
      });
    }, { passive: true });
  }

  /* ---------- Sticky nav ---------- */
  const nav = document.getElementById('siteNav');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    backToTop.classList.toggle('show', window.scrollY > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
  }));

  /* ---------- Active nav link on scroll ---------- */
  const sections = ['home','about','menu','gallery','reservation','contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-link');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString() + (target === 5 ? '.0' : '+');
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

  /* ---------- Signature menu data + tabs ---------- */
  const MENU_DATA = {
    starters: [
      { name:'Burrata & Heirloom Tomato', desc:'Aged balsamic, basil oil, Maldon salt', price:'AED 85', img:'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&w=700&auto=format&fit=crop' },
      { name:'Seared Foie Gras', desc:'Brioche, fig compote, port reduction', price:'AED 120', img:'https://images.unsplash.com/photo-1541014741259-de529411b96a?q=80&w=700&auto=format&fit=crop' },
      { name:'Tuna Tartare', desc:'Avocado, yuzu, sesame tuile', price:'AED 95', img:'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=700&auto=format&fit=crop' },
    ],
    mains: [
      { name:'Truffle Risotto', desc:'Arborio rice, black truffle, aged parmesan', price:'AED 150', img:'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=700&auto=format&fit=crop' },
      { name:'Slow-Braised Short Rib', desc:'Root vegetables, red wine jus', price:'AED 175', img:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=700&auto=format&fit=crop' },
      { name:'Roasted Duck Breast', desc:'Cherry gastrique, potato gratin', price:'AED 165', img:'https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=700&auto=format&fit=crop' },
    ],
    seafood: [
      { name:'Chilean Sea Bass', desc:'Saffron velouté, fennel confit', price:'AED 195', img:'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=700&auto=format&fit=crop' },
      { name:'Lobster Thermidor', desc:'Cognac cream, gruyère gratin', price:'AED 260', img:'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=700&auto=format&fit=crop' },
      { name:'Grilled Norwegian Salmon', desc:'Citrus beurre blanc, asparagus', price:'AED 145', img:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=700&auto=format&fit=crop' },
    ],
    steaks: [
      { name:'Wagyu Tenderloin A5', desc:'Bone marrow butter, truffle jus', price:'AED 420', img:'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=700&auto=format&fit=crop' },
      { name:'Dry-Aged Ribeye 400g', desc:'45-day aged, peppercorn sauce', price:'AED 280', img:'https://images.unsplash.com/photo-1600891964599-f61f4c9a9d5a?q=80&w=700&auto=format&fit=crop' },
      { name:'Filet Mignon', desc:'Red wine reduction, herb butter', price:'AED 240', img:'https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=700&auto=format&fit=crop' },
    ],
    desserts: [
      { name:'Gold Leaf Chocolate Fondant', desc:'Molten centre, vanilla bean gelato', price:'AED 65', img:'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=700&auto=format&fit=crop' },
      { name:'Saffron Crème Brûlée', desc:'Torched sugar, pistachio dust', price:'AED 58', img:'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=700&auto=format&fit=crop' },
      { name:'Rose & Pistachio Baklava Tart', desc:'Honey glaze, candied rose petals', price:'AED 62', img:'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=700&auto=format&fit=crop' },
    ],
    drinks: [
      { name:'Signature Gold Fizz', desc:'Saffron gin, elderflower, citrus', price:'AED 78', img:'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=700&auto=format&fit=crop' },
      { name:'Vintage Reserve Wine', desc:'By the glass — ask your sommelier', price:'AED 95', img:'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=700&auto=format&fit=crop' },
      { name:'Arabic Rose Mocktail', desc:'Rose water, pomegranate, mint', price:'AED 55', img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=700&auto=format&fit=crop' },
    ],
  };

  const menuGrid = document.getElementById('menuGrid');
  function renderMenu(cat){
    menuGrid.innerHTML = '';
    MENU_DATA[cat].forEach((item, i) => {
      const card = document.createElement('article');
      card.className = 'menu-card';
      card.style.animationDelay = (i * 0.1) + 's';
      card.innerHTML = `
        <div class="menu-card-media">
          <img src="${item.img}" alt="${item.name}" loading="lazy">
          <button class="menu-card-view" aria-label="View ${item.name}" type="button">
            <svg class="icon" width="18" height="18"><use href="#icon-view"></use></svg>
          </button>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-top"><h3>${item.name}</h3><span class="menu-price">${item.price}</span></div>
          <p>${item.desc}</p>
        </div>`;
      if (isFinePointer) {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `translateY(-8px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
      }
      menuGrid.appendChild(card);
    });
  }
  renderMenu('starters');

  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');
      renderMenu(tab.dataset.cat);
    });
  });

  /* ---------- Gallery lightbox (with prev/next + preloading) ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = [...document.querySelectorAll('.masonry-item')];
  let galleryIndex = 0;

  function preload(src){ const i = new Image(); i.src = src; }

  function showGalleryImage(i){
    galleryIndex = (i + galleryItems.length) % galleryItems.length;
    const item = galleryItems[galleryIndex];
    lightboxImg.classList.add('swap');
    setTimeout(() => {
      lightboxImg.src = item.dataset.full;
      lightboxImg.alt = item.querySelector('img').alt;
      lightboxImg.classList.remove('swap');
    }, 160);
    // Preload neighbours for instant swipe-like feel
    preload(galleryItems[(galleryIndex + 1) % galleryItems.length].dataset.full);
    preload(galleryItems[(galleryIndex - 1 + galleryItems.length) % galleryItems.length].dataset.full);
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      showGalleryImage(i);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });
  function closeLightbox(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showGalleryImage(galleryIndex - 1));
  lightboxNext.addEventListener('click', () => showGalleryImage(galleryIndex + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showGalleryImage(galleryIndex - 1);
    if (e.key === 'ArrowRight') showGalleryImage(galleryIndex + 1);
  });

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById('testTrack');
  const dotsWrap = document.getElementById('testDots');
  const cards = track.children.length;
  for (let i = 0; i < cards; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }
  let current = 0;
  function goToSlide(i){
    current = i;
    track.style.transform = `translateX(-${i * 100}%)`;
    [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('active', idx === i));
  }
  let autoSlide = setInterval(() => goToSlide((current + 1) % cards), 5500);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.parentElement.addEventListener('mouseleave', () => { autoSlide = setInterval(() => goToSlide((current + 1) % cards), 5500); });

  /* ---------- Reservation form ---------- */
  const resForm = document.getElementById('reservationForm');
  const resSuccess = document.getElementById('reservationSuccess');
  const resAgain = document.getElementById('resAgain');
  const resWhatsapp = document.getElementById('resWhatsapp');
  const resEmail = document.getElementById('resEmailBtn');
  const WHATSAPP_NUMBER = '9715811972078';

  resForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!resForm.checkValidity()) { resForm.reportValidity(); return; }

    const data = new FormData(resForm);
    const message =
`Hello MISK & GOLD, I would like to reserve a table.

Name: ${data.get('name')}
Phone: ${data.get('phone')}
Guests: ${data.get('guests')}
Date: ${data.get('date')}
Time: ${data.get('time')}
Special Request: ${data.get('note') || '—'}`;

    if (resWhatsapp) {
      resWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    }
    if (resEmail) {
      resEmail.href = `mailto:reservations@miskandgold.com?subject=${encodeURIComponent('Table Reservation Request')}&body=${encodeURIComponent(message)}`;
    }

    resForm.style.display = 'none';
    resSuccess.classList.add('show');
  });
  resAgain.addEventListener('click', () => {
    resForm.reset();
    resForm.style.display = '';
    resSuccess.classList.remove('show');
  });

  /* ---------- Newsletter form ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      input.value = '';
      input.placeholder = 'Thank you for subscribing!';
    });
  }

});
