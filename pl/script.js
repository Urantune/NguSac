// pl
/* =================================================
   NGỰ SẮC REVEAL ANIMATION FINAL
   Hiệu ứng xuất hiện khi cuộn - Không méo hình
   Dán ĐẦU file JS
================================================= */

(function () {
  if (window.__NGS_REVEAL_ANIMATION_FINAL__) return;
  window.__NGS_REVEAL_ANIMATION_FINAL__ = true;

  function initRevealAnimation() {
    document.body.classList.add('ngs-reveal-only', 'ngs-reveal-ready');

    clearOldMotionInlineStyles();
    prepareRevealElements();
    observeRevealElements();
    initClickEffect();
  }

  function clearOldMotionInlineStyles() {
    const oldMotionTargets = document.querySelectorAll(
      '.hero-ingredient-video, .hero-ingredient-image, .hero-ingredient-content, .ngs-motion-item, .ngs-super-reveal, .ngs-scroll-move'
    );

    oldMotionTargets.forEach(function (el) {
      el.style.removeProperty('transform');
      el.style.removeProperty('filter');
      el.style.removeProperty('--ngs-scroll-y');
      el.style.removeProperty('--ngs-scroll-x');
      el.style.removeProperty('--ngs-scroll-rotate');
      el.style.removeProperty('--ngs-scroll-scale');
    });
  }

  function prepareRevealElements() {
    const groups = [
      {
        selector: [
          '.hero-ingredient-content > *',
          '.ingredient-story-heading',
          '.story-title-row',
          '.ingredient-story-heading h3',
          '.story-desc p',
          '.ingredient-products-head',
          '.footer-grid > div',
          '.footer-bottom',
          '.site-footer-grid > div',
          '.site-footer-bottom'
        ].join(','),
        className: 'nsfx-text'
      },
      {
        selector: [
          '.ingredient-board',
          '.ingredient-product-card',
          '.product-detail',
          '.pl-product-shell',
          '.pl-gallery',
          '.pl-info',
          '.pl-main-image',
          '.pl-detail-card',
          '.pl-extra-gallery',
          '.pl-extra-placeholder',
          '.pl-extra-img',
          '.ng-detail-hero-content',
          '.ng-detail-img',
          '.ng-detail-text',
          '.ng-other-head',
          '.ng-other-card',
          '.map-card',
          '.hero-copy'
        ].join(','),
        className: 'nsfx-reveal'
      },
      {
        selector: [
          '.ingredient-product-card img',
          '.pl-main-image img',
          '.pl-thumb img',
          '.pl-extra-img img',
          '.ng-detail-img img',
          '.ng-other-card img',
          '.ngs-search-card img'
        ].join(','),
        className: 'nsfx-image'
      }
    ];

    let index = 0;

    groups.forEach(function (group) {
      document.querySelectorAll(group.selector).forEach(function (el) {
        if (el.dataset.nsfxReady === 'true') return;

        el.dataset.nsfxReady = 'true';
        el.classList.add(group.className);

        if (group.className === 'nsfx-reveal') {
          if (
            el.matches('.ingredient-board') ||
            el.matches('.pl-gallery') ||
            el.matches('.ng-detail-img') ||
            el.matches('.map-card')
          ) {
            el.classList.add('nsfx-left');
          } else if (
            el.matches('.ingredient-products-head') ||
            el.matches('.pl-info') ||
            el.matches('.ng-detail-text') ||
            el.matches('.ng-other-head') ||
            el.matches('.hero-copy')
          ) {
            el.classList.add('nsfx-right');
          } else {
            el.classList.add('nsfx-zoom');
          }
        }

        el.style.setProperty('--nsfx-delay', `${(index % 8) * 55}ms`);
        index += 1;
      });
    });
  }

  function observeRevealElements() {
    if (!('IntersectionObserver' in window)) {
      document
        .querySelectorAll('.nsfx-reveal, .nsfx-image, .nsfx-text')
        .forEach(function (el) {
          el.classList.add('nsfx-visible');
        });

      return;
    }

    const observed = new WeakSet();

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('nsfx-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: '0px 0px -7% 0px'
    });

    function observeAll() {
      prepareRevealElements();

      document
        .querySelectorAll('.nsfx-reveal, .nsfx-image, .nsfx-text')
        .forEach(function (el) {
          if (observed.has(el)) return;

          observed.add(el);
          observer.observe(el);
        });
    }

    observeAll();

    const mutationObserver = new MutationObserver(function () {
      observeAll();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function initClickEffect() {
    document.addEventListener('click', function (event) {
      const target = event.target.closest(
        'button, a, .ingredient-product-card, .pl-thumb, .ng-other-card, .ngs-search-card'
      );

      if (!target) return;

      target.classList.remove('nsfx-clicked');
      void target.offsetWidth;
      target.classList.add('nsfx-clicked');

      setTimeout(function () {
        target.classList.remove('nsfx-clicked');
      }, 260);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRevealAnimation);
  } else {
    initRevealAnimation();
  }
})();


const productDetails = [...document.querySelectorAll('.product-detail')];

function renderProductSection(section, product) {
  section.innerHTML = `
    <div class="pl-product-shell">
      <div class="pl-gallery">
        <div class="pl-main-image">
          <img src="${product.image}" alt="${product.title}">
        </div>

        <div class="pl-thumb-row">
          ${product.gallery.map((img, index) => img
            ? `
              <button class="pl-thumb ${index === 0 ? 'is-active' : ''}" type="button" data-img="${img}">
                <img src="${img}" alt="${product.title} ${index + 1}">
              </button>
            `
            : `
              <button class="pl-thumb pl-thumb-empty" type="button">
                <span>+</span>
                <small>Thêm hình</small>
              </button>
            `
          ).join('')}
        </div>
      </div>

      <div class="pl-info">
        <div class="pl-actions">
          <button type="button" aria-label="Yêu thích">♡</button>
          <button type="button" aria-label="Chia sẻ">⌯</button>
        </div>

        <span class="product-label">${product.label}</span>

        <h1>${product.title}</h1>

        <p class="pl-subtitle">${product.subtitle}</p>

        <p class="pl-desc">${product.description}</p>

        <div class="pl-tags">
          ${product.tags.map(tag => `<span>${tag}</span>`).join('')}
        </div>

        <div class="pl-slogan">
          “${product.slogan}”
        </div>

        <div class="pl-cta-row">
          <a class="pl-primary-btn" href="../index.html#products">Quay lại sản phẩm</a>
          <a class="pl-secondary-btn" href="../index.html#ingredients">Xem thành phần</a>
        </div>

        <div class="pl-accordion">
          <div class="pl-accordion-item is-open">
            <button type="button" class="pl-accordion-head">
              <span>Công dụng nổi bật</span>
              <b>⌃</b>
            </button>
            <div class="pl-accordion-body">
              ${product.benefits.map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>
          </div>

          <div class="pl-accordion-item">
            <button type="button" class="pl-accordion-head">
              <span>Thành phần chính</span>
              <b>⌄</b>
            </button>
            <div class="pl-accordion-body">
              <ul class="pl-ingredient-list">
                ${product.ingredients.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="pl-accordion-item">
            <button type="button" class="pl-accordion-head">
              <span>Hướng dẫn sử dụng</span>
              <b>⌄</b>
            </button>
            <div class="pl-accordion-body">
              ${product.usage.map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pl-detail-lower">
      <div class="pl-detail-card">
        <h2>Thông tin sản phẩm</h2>

        <div class="pl-info-table">
          ${product.info.map(row => `
            <div class="pl-info-row">
              <strong>${row.label}</strong>
              <span>${row.value}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="pl-detail-card">
        <h2>Lưu ý sử dụng</h2>
        ${product.note.map(paragraph => `<p>${paragraph}</p>`).join('')}

        <div class="pl-qr-box">
          <div class="pl-qr-icon">QR</div>
          <div>
            <h3>Khám phá thêm qua QR Code</h3>
            <p>${product.qr}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="pl-extra-gallery">
      <div class="pl-extra-head">
        <span>Hình ảnh bổ sung</span>
        <h2>Không gian để thêm hình sản phẩm</h2>
        <p>T có thể thay các ô này bằng ảnh feedback, bao bì, texture, nguyên liệu hoặc ảnh lifestyle.</p>
      </div>

      <div class="pl-extra-grid">
        ${product.extraImages.map((img, index) => img
          ? `
            <figure class="pl-extra-img">
              <img src="${img}" alt="${product.title} ảnh bổ sung ${index + 1}">
            </figure>
          `
          : `
            <div class="pl-extra-placeholder">
              <span>+</span>
              <p>Thêm hình ${index + 1}</p>
            </div>
          `
        ).join('')}
      </div>
    </div>
  `;
}

const plShowcaseDetails = {
  'phan-nu': {
    eyebrow: 'Phấn Phủ Thiên Nhiên',
    title: 'Phấn Phủ Ngự Sắc',
    subtitle: 'Phấn phủ làm mịn – Kiềm dầu nhẹ – Cảm hứng từ Phấn Nụ Cung Đình Huế',
    description: 'Chất phấn mỏng nhẹ giúp nền da khô thoáng, mịn màng và tự nhiên.',
    gallery: [
      '../assets/pl/products/phanphu.png',
      '../assets/index/hinhmn/tranhu.png',
      '../assets/nl/detail/nd_caolanhmypham.png',
      '../assets/nl/detail/nd_botgaost25.png',
      '../assets/nl/detail/nd_thaomoc.png'
    ]
  },
  'phan-ma': {
    eyebrow: 'Phấn Má Hồng Thiên Nhiên',
    title: 'Phấn Má Hồng Ngự Sắc',
    subtitle: 'Sắc hồng tự nhiên – Hiệu ứng tươi tắn – Cảm hứng cung đình Huế',
    description: 'Chất phấn nhẹ nhàng giúp gương mặt rạng rỡ, mềm mại và phù hợp với phong cách trang điểm hằng ngày.',
    gallery: [
      '../assets/pl/products/phanma.png',
      '../assets/index/hinhmn/duykhang.png',
      '../assets/nl/detail/nd_botmaukhoang.png',
      '../assets/nl/detail/nd_tinhchathoalai.png',
      '../assets/nl/detail/nd_thaomoc.png'
    ]
  },
  'son-duong': {
    eyebrow: 'Son Dưỡng Từ Dừa',
    title: 'Son Dưỡng Ngự Sắc',
    subtitle: 'Dưỡng ẩm mềm môi – Hạn chế khô ráp – Cảm hứng vẻ đẹp Việt',
    description: 'Công thức từ dầu dừa, sáp ong và vitamin E giúp đôi môi mềm mại, ẩm mượt mỗi ngày.',
    gallery: [
      '../assets/pl/products/sonduong.png',
      '../assets/index/hinhmn/kimanh.png',
      '../assets/nl/detail/nd_daudua.png',
      '../assets/nl/detail/nd_sapong.png',
      '../assets/nl/detail/nd_vitamine.png'
    ]
  }
};

renderProductSection = function (section) {
  const item = plShowcaseDetails[section.id];
  if (!item) return;

  section.innerHTML = `
    <div class="pl-showcase" data-index="0">
      <button class="pl-previous" type="button" aria-label="Xem ảnh trước">
        <img src="${item.gallery[item.gallery.length - 1]}" alt="Ảnh trước của ${item.title}">
      </button>

      <div class="pl-current">
        <div class="pl-current-track">
          ${item.gallery.map((src, index) => `
            <figure class="pl-slide" data-slide="${index}">
              <img src="${src}" alt="${item.title} - ảnh ${index + 1}" draggable="false">
            </figure>
          `).join('')}
        </div>

        <button class="pl-fullscreen" type="button" aria-label="Xem ảnh toàn màn hình">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5M3 8l6-6M21 8l-6-6M3 16l6 6M21 16l-6 6"/>
          </svg>
        </button>

        <div class="pl-dots" aria-label="Chọn ảnh sản phẩm">
          ${item.gallery.map((_, index) => `
            <button class="pl-dot ${index === 0 ? 'is-active' : ''}" type="button" data-go="${index}" aria-label="Xem ảnh ${index + 1}"></button>
          `).join('')}
        </div>
      </div>

      <div class="pl-showcase-info">
        <p class="pl-showcase-eyebrow">${item.eyebrow}</p>
        <h1>${item.title}</h1>
        <p class="pl-showcase-subtitle">${item.subtitle}</p>
        <p class="pl-showcase-description">${item.description}</p>
      </div>
    </div>

    <div class="pl-lightbox" role="dialog" aria-modal="true" aria-label="Ảnh sản phẩm toàn màn hình" hidden>
      <button class="pl-lightbox-close" type="button" aria-label="Đóng">×</button>
      <img src="${item.gallery[0]}" alt="${item.title}">
    </div>
  `;
};

function setShowcaseIndex(showcase, nextIndex) {
  const slides = showcase.querySelectorAll('.pl-slide');
  if (!slides.length) return;

  const index = (nextIndex + slides.length) % slides.length;
  const track = showcase.querySelector('.pl-current-track');
  const previousImage = showcase.querySelector('.pl-previous img');

  showcase.dataset.index = String(index);
  track.style.transform = `translateX(-${index * 100}%)`;
  previousImage.src = slides[(index - 1 + slides.length) % slides.length].querySelector('img').src;

  showcase.querySelectorAll('.pl-dot').forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === index);
  });
}

document.addEventListener('pointerdown', function (event) {
  const current = event.target.closest('.pl-current');
  if (!current || event.target.closest('button')) return;
  current.dataset.dragStart = String(event.clientX);
  current.setPointerCapture?.(event.pointerId);
});

document.addEventListener('pointerup', function (event) {
  const current = event.target.closest('.pl-current');
  if (!current || current.dataset.dragStart === undefined) return;

  const distance = event.clientX - Number(current.dataset.dragStart);
  delete current.dataset.dragStart;
  if (Math.abs(distance) < 45) return;

  const showcase = current.closest('.pl-showcase');
  const index = Number(showcase.dataset.index || 0);
  setShowcaseIndex(showcase, distance < 0 ? index + 1 : index - 1);
});

document.addEventListener('click', function (event) {
  const dot = event.target.closest('.pl-dot');
  if (dot) setShowcaseIndex(dot.closest('.pl-showcase'), Number(dot.dataset.go));

  const previous = event.target.closest('.pl-previous');
  if (previous) {
    const showcase = previous.closest('.pl-showcase');
    setShowcaseIndex(showcase, Number(showcase.dataset.index || 0) - 1);
  }

  const fullscreen = event.target.closest('.pl-fullscreen');
  if (fullscreen) {
    const section = fullscreen.closest('.product-detail');
    const showcase = fullscreen.closest('.pl-showcase');
    const lightbox = section.querySelector('.pl-lightbox');
    const index = Number(showcase.dataset.index || 0);
    lightbox.querySelector('img').src = showcase.querySelectorAll('.pl-slide img')[index].src;
    lightbox.hidden = false;
    document.body.classList.add('pl-lightbox-open');
  }

  if (event.target.closest('.pl-lightbox-close') || event.target.classList.contains('pl-lightbox')) {
    const lightbox = event.target.closest('.pl-lightbox');
    lightbox.hidden = true;
    document.body.classList.remove('pl-lightbox-open');
  }
});

function applyProductText() {
  const text = window.NGU_SAC_PL_TEXT;
  if (!text) return;

  const navLinks = document.querySelectorAll('.site-nav-links a');
  if (navLinks[0]) navLinks[0].textContent = text.nav.home;
  if (navLinks[1]) navLinks[1].textContent = text.nav.ingredients;
  if (navLinks[2]) navLinks[2].textContent = text.nav.products;

  productDetails.forEach(section => {
    const product = text.products[section.id];
    if (!product) return;
    renderProductSection(section, product);
  });

  const footerLogoText = document.querySelector('.site-footer p');
  if (footerLogoText) footerLogoText.textContent = text.footer.tagline;

  const footerBottom = document.querySelector('.site-footer-bottom');
  if (footerBottom) footerBottom.textContent = text.footer.credit;
}

function showSelectedProduct() {
  const requestedId = window.location.hash.replace('#', '');
  const fallbackId = productDetails[0]?.id;
  const activeId = productDetails.some(item => item.id === requestedId) ? requestedId : fallbackId;

  productDetails.forEach(item => {
    item.hidden = item.id !== activeId;
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', event => {
  const thumb = event.target.closest('.pl-thumb[data-img]');
  if (thumb) {
    const section = thumb.closest('.product-detail');
    const mainImg = section.querySelector('.pl-main-image img');

    section.querySelectorAll('.pl-thumb').forEach(item => item.classList.remove('is-active'));
    thumb.classList.add('is-active');

    if (mainImg) {
      mainImg.src = thumb.dataset.img;
    }
  }

  const accordionHead = event.target.closest('.pl-accordion-head');
  if (accordionHead) {
    const item = accordionHead.closest('.pl-accordion-item');
    const isOpen = item.classList.contains('is-open');

    item.classList.toggle('is-open', !isOpen);
    accordionHead.querySelector('b').textContent = isOpen ? '⌄' : '⌃';
  }
});

applyProductText();
showSelectedProduct();

window.addEventListener('hashchange', showSelectedProduct);


/* ===============================
   MENU DRAWER NAVBAR - GIỐNG HOME
================================ */

document.addEventListener('DOMContentLoaded', function () {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navDrawer = document.getElementById('navDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  if (!hamburgerBtn || !navDrawer || !drawerOverlay) return;

  function openDrawer() {
    navDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    hamburgerBtn.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-is-open');
  }

  function closeDrawer() {
    navDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-is-open');
  }

  hamburgerBtn.addEventListener('click', function () {
    if (navDrawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerOverlay.addEventListener('click', closeDrawer);

  navDrawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeDrawer();
    }
  });
});

/* =================================================
   NGỰ SẮC ANIMATION FINAL
   Không ẩn navbar
   Dán CUỐI CÙNG cả 3 file JS
================================================= */

(function () {
  if (window.__NGU_SAC_ANIMATION_FINAL__) return;
  window.__NGU_SAC_ANIMATION_FINAL__ = true;

  function initMotionReady() {
    document.body.classList.add('ngs-motion-ready');
  }

  function initScrollReveal() {
    const revealSelectors = [
      '.ingredient-story-heading',
      '.story-title-row',
      '.story-desc p',
      '.ingredient-board',
      '.ingredient-products-head',
      '.ingredient-product-card',

      '.product-detail',
      '.pl-product-shell',
      '.pl-gallery',
      '.pl-info',
      '.pl-main-image',
      '.pl-detail-card',
      '.pl-extra-gallery',
      '.pl-extra-placeholder',
      '.pl-extra-img',

      '.ng-detail-page',
      '.ng-detail-wrapper',
      '.ng-detail-card',
      '.ng-other-head',
      '.ng-other-card',
      '.ng-other-grid',

      '.site-footer',
      '.footer'
    ];

    const observedElements = new WeakSet();

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px'
    });

    function prepareElement(el, index) {
      if (observedElements.has(el)) return;

      observedElements.add(el);
      el.classList.add('reveal-on-scroll');

      if (
        el.matches('.pl-gallery') ||
        el.matches('.ingredient-board') ||
        el.matches('.ng-detail-card') ||
        el.matches('.ng-detail-wrapper')
      ) {
        el.classList.add('reveal-left');
      }

      if (
        el.matches('.pl-info') ||
        el.matches('.ingredient-products-head') ||
        el.matches('.ng-other-head')
      ) {
        el.classList.add('reveal-right');
      }

      el.style.setProperty('--ngs-delay', `${(index % 7) * 55}ms`);

      observer.observe(el);
    }

    function collectElements() {
      let index = 0;

      revealSelectors.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (el) {
          prepareElement(el, index);
          index += 1;
        });
      });
    }

    collectElements();

    const mutationObserver = new MutationObserver(function () {
      collectElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function initHeroParallax() {
    const hero = document.querySelector('.hero-ingredient');
    const media = document.querySelector('.hero-ingredient-video, .hero-ingredient-image');

    if (!hero || !media) return;

    let rafId = null;

    hero.addEventListener('mousemove', function (event) {
      if (window.innerWidth < 900) return;

      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(function () {
        media.style.transform = `scale(1.035) translate(${x * -14}px, ${y * -10}px)`;
      });
    });

    hero.addEventListener('mouseleave', function () {
      media.style.transform = '';
    });
  }

  function initClickEffects() {
    document.addEventListener('click', function (event) {
      const target = event.target.closest(
        'button, a, .ingredient-product-card, .pl-thumb, .ngs-search-card'
      );

      if (!target) return;

      target.classList.remove('ngs-clicked');
      void target.offsetWidth;
      target.classList.add('ngs-clicked');

      setTimeout(function () {
        target.classList.remove('ngs-clicked');
      }, 280);
    });
  }

  function initImageLazyMotion() {
    const images = document.querySelectorAll('img');

    images.forEach(function (img) {
      if (img.dataset.ngsImageMotion === 'ready') return;

      img.dataset.ngsImageMotion = 'ready';

      if (img.complete) {
        img.classList.add('ngs-img-loaded');
      } else {
        img.addEventListener('load', function () {
          img.classList.add('ngs-img-loaded');
        });
      }
    });
  }

  function initAllAnimations() {
    initMotionReady();
    initScrollReveal();
    initHeroParallax();
    initClickEffects();
    initImageLazyMotion();

    const mutationObserver = new MutationObserver(function () {
      initImageLazyMotion();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
  } else {
    initAllAnimations();
  }
})();
