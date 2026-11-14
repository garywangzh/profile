(function () {
  const root = document.documentElement;
  const langToggle = document.getElementById('langToggle');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const header = document.getElementById('siteHeader');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  const titles = {
    en: 'Wang Zihao — Personal Profile',
    zh: '王子豪 — 个人主页'
  };
  const descriptions = {
    en: 'Personal profile of Wang Zihao: high-school student in Shanghai working on multimodal learning, robotics, and human-centered tools.',
    zh: '王子豪的个人主页：上海高中生，关注多模态学习、机器人与以人为中心的工具。'
  };

  function setLang(lang) {
    const isZh = lang === 'zh';
    root.classList.toggle('lang-zh', isZh);
    root.classList.toggle('lang-en', !isZh);
    root.lang = isZh ? 'zh-CN' : 'en';
    if (langToggle) {
      langToggle.textContent = isZh ? 'EN' : '中';
      langToggle.setAttribute('aria-label', isZh ? 'Switch to English' : '切换到中文');
    }
    document.title = isZh ? titles.zh : titles.en;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', isZh ? descriptions.zh : descriptions.en);
    try { localStorage.setItem('zw-lang', lang); } catch (e) {}
  }

  let initial = 'en';
  try {
    const stored = localStorage.getItem('zw-lang');
    if (stored === 'zh' || stored === 'en') initial = stored;
  } catch (e) {}
  setLang(initial);

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      setLang(root.classList.contains('lang-zh') ? 'en' : 'zh');
    });
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Video facade
  document.querySelectorAll('[data-video]').forEach(function (button) {
    button.addEventListener('click', function () {
      const shell = button.closest('.video-shell');
      if (!shell) return;
      const src = button.getAttribute('data-video');
      const posterImg = shell.querySelector('img');
      const poster = posterImg ? posterImg.src : '';
      const video = document.createElement('video');
      video.src = src;
      video.poster = poster;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      shell.innerHTML = '';
      shell.appendChild(video);
      video.play().catch(function () {});
    });
  });

  // Lightbox
  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    lightboxImage.src = src;
    lightboxImage.alt = caption;
    lightboxCaption.textContent = caption;
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else lightbox.setAttribute('open', '');
  }

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      const src = item.getAttribute('data-full');
      const isZh = root.classList.contains('lang-zh');
      const caption = isZh ? item.getAttribute('data-caption-zh') : item.getAttribute('data-caption-en');
      openLightbox(src, caption || '');
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    if (typeof lightbox.close === 'function') lightbox.close();
    else lightbox.removeAttribute('open');
    if (lightboxImage) lightboxImage.src = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeLightbox();
    });
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const staticMode = new URLSearchParams(window.location.search).has('static');
  if (staticMode) {
    root.classList.add('static-mode');
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
