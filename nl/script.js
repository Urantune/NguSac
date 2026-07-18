// nl

const jejuAreas = [...document.querySelectorAll('.jejumap .area')];
const detailWrapper = document.querySelector('.ng-detail-wrapper');
const otherHead = document.querySelector('.ng-other-head');
const otherGrid = document.querySelector('.ng-other-grid');

const jejuAreaTargets = {
  area01: 'rice',
  area02: 'herbal',
  area03: 'kaolin',
  area04: 'coconut',
  area05: 'beeswax',
  area06: 'vitamin',
  area07: 'vaseline',
  area08: 'jasmine',
  area09: 'mineral'
};

function getAreaClass(area) {
  return [...area.classList].find(className => /^area\d+$/.test(className));
}

function getIngredient(targetId) {
  return window.NGU_SAC_NL_TEXT?.ingredients.find(item => item.id === targetId);
}

function renderDetailPages(text) {
  if (!detailWrapper) return;

  detailWrapper.innerHTML = text.ingredients.map(ingredient => `
    <section class="ng-detail-page ng-${ingredient.id}" id="${ingredient.id}">
      <div class="ng-detail-hero">
        <div class="ng-detail-hero-bg" style="background-image: url('${ingredient.heroImage}');"></div>
        <div class="ng-detail-hero-overlay"></div>
        <div class="ng-detail-hero-content">
          <h1>${ingredient.title}</h1>
          <h2>${ingredient.subtitle}</h2>
          <p>${ingredient.summary}</p>
        </div>
      </div>

      <div class="ng-detail-body">
        <div class="ng-wave" aria-hidden="true"></div>
        <figure class="ng-detail-img">
          <img src="${ingredient.image}" alt="${ingredient.title}">
        </figure>
        <div class="ng-detail-text">
          <h3>${ingredient.subtitle}</h3>
          ${ingredient.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
          <a class="back-map" href="#top">Quay về bản đồ</a>
        </div>
      </div>
    </section>
  `).join('');
}

function renderOtherCards(text) {
  if (otherHead && text.otherIngredients) {
    const kicker = otherHead.querySelector('.ng-other-kicker');
    const heading = otherHead.querySelector('h2');
    const description = otherHead.querySelector('p:last-child');

    if (kicker) kicker.textContent = text.otherIngredients.kicker || 'NGỰ SẮC INGREDIENTS';
    if (heading) heading.textContent = text.otherIngredients.title || 'Nguyên liệu khác';
    if (description) {
      description.textContent =
        text.otherIngredients.description ||
        'Chọn nhanh một thành phần khác để tiếp tục khám phá câu chuyện nguyên liệu trong các sản phẩm của Ngự Sắc.';
    }
  }

  if (!otherGrid) return;

  otherGrid.innerHTML = text.ingredients.map((ingredient, index) => {
    const image = ingredient.cardImage || ingredient.image || ingredient.heroImage || '';
    const number = String(index + 1).padStart(2, '0');

    return `
      <button type="button" class="ng-other-card ${ingredient.id}" data-target="${ingredient.id}">
        <span class="ng-other-shine" aria-hidden="true"></span>

        <span class="ng-other-media">
          ${
            image
              ? `<img src="${image}" alt="${ingredient.title}">`
              : `<span class="ng-other-placeholder">${number}</span>`
          }
        </span>

        <span class="ng-other-content">
          <span class="ng-other-icon">${number}</span>
          <span class="ng-other-name">${ingredient.title}</span>
          <span class="ng-other-note">${ingredient.subtitle}</span>
          <span class="ng-other-link">Khám phá ngay</span>
        </span>
      </button>
    `;
  }).join('');
}

function setActiveTarget(targetId) {
  jejuAreas.forEach(area => {
    const areaClass = getAreaClass(area);
    area.classList.toggle('active', jejuAreaTargets[areaClass] === targetId);
  });

  document.querySelectorAll('.ng-other-card').forEach(card => {
    card.classList.toggle('is-active', card.dataset.target === targetId);
  });
}

function showOnlyDetail(targetId, options = {}) {
  const { shouldScroll = true, shouldUpdateHash = true } = options;
  const target = document.getElementById(targetId);
  if (!target || !getIngredient(targetId)) return;

  document.querySelectorAll('.ng-detail-page').forEach(page => {
    page.classList.remove('active-detail', 'targeted');
  });

  target.classList.add('active-detail');
  document.body.classList.add('has-active-detail');
  setActiveTarget(targetId);

  if (shouldUpdateHash) {
    window.history.replaceState(null, '', `#${targetId}`);
  }

  window.requestAnimationFrame(() => {
    if (shouldScroll) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.setTimeout(() => {
      target.classList.add('targeted');
    }, 350);
  });
}

function hideAllDetails() {
  document.querySelectorAll('.ng-detail-page').forEach(page => {
    page.classList.remove('active-detail', 'targeted');
  });

  document.body.classList.remove('has-active-detail');
  setActiveTarget(null);

  document.getElementById('top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function applyIngredientText() {
  const text = window.NGU_SAC_NL_TEXT;
  if (!text) return;

  const navLinks = document.querySelectorAll('.site-nav-links a');
  if (navLinks[0]) navLinks[0].textContent = text.nav.home;
  if (navLinks[1]) navLinks[1].textContent = text.nav.ingredients;
  if (navLinks[2]) navLinks[2].textContent = text.nav.products;

  const title = document.querySelector('.story-title-row h2');
  const subtitle = document.querySelector('.story-subtitle');
  if (title) title.textContent = text.intro.title;
  if (subtitle) subtitle.textContent = text.intro.subtitle;

  jejuAreas.forEach(area => {
    const areaClass = getAreaClass(area);
    const label = text.mapLabels[areaClass];
    const targetId = jejuAreaTargets[areaClass];
    const tspan = area.querySelector('tspan');

    if (label && tspan) tspan.textContent = label;
    area.toggleAttribute('aria-disabled', !targetId);
  });

  renderDetailPages(text);
  renderOtherCards(text);

  const footerText = document.querySelector('.site-footer p');
  if (footerText) footerText.textContent = text.footer.tagline;
  const footerBottom = document.querySelector('.site-footer-bottom');
  if (footerBottom) footerBottom.textContent = text.footer.credit;
}

jejuAreas.forEach(area => {
  area.addEventListener('click', event => {
    event.preventDefault();

    const areaClass = getAreaClass(area);
    const targetId = jejuAreaTargets[areaClass];
    if (targetId) showOnlyDetail(targetId);
  });
});

applyIngredientText();

otherGrid?.addEventListener('click', event => {
  const card = event.target.closest('.ng-other-card');
  if (card) showOnlyDetail(card.dataset.target);
});

detailWrapper?.addEventListener('click', event => {
  const backMap = event.target.closest('.back-map');
  if (!backMap) return;

  event.preventDefault();
  hideAllDetails();
});

const hashTarget = window.location.hash.replace('#', '');
if (getIngredient(hashTarget)) {
  showOnlyDetail(hashTarget, { shouldScroll: false, shouldUpdateHash: false });
}

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
