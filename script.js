// home 

/* ── NAV SCROLL ────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── MOBILE DRAWER ─────────────────────────────────────────── */
function closeDrawer() {
  document.getElementById('navDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}
document.getElementById('hamburgerBtn').addEventListener('click', () => {
  document.getElementById('navDrawer').classList.toggle('open');
  document.getElementById('drawerOverlay').classList.toggle('open');
});
document.getElementById('drawerOverlay').addEventListener('click', closeDrawer);
document.querySelectorAll('#navDrawer a').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

/* ── INGREDIENT MAP IS NOW EMBEDDED ON HOME ───────────────── */

/* ── INGREDIENT PANEL FOCUS ────────────────────────────────── */
const ingredientPanels = [...document.querySelectorAll('.ingredient-panel')];
let panelFocusTicking = false;

function updateIngredientPanelFocus() {
  if (!ingredientPanels.length) return;

  const viewportCenter = window.innerHeight / 2;
  let closestPanel = ingredientPanels[0];
  let closestDistance = Number.POSITIVE_INFINITY;

  ingredientPanels.forEach(panel => {
    const rect = panel.getBoundingClientRect();
    const panelCenter = rect.top + rect.height / 2;
    const distance = Math.abs(panelCenter - viewportCenter);

    if (rect.bottom > 0 && rect.top < window.innerHeight && distance < closestDistance) {
      closestPanel = panel;
      closestDistance = distance;
    }
  });

  ingredientPanels.forEach(panel => {
    panel.classList.toggle('is-current', panel === closestPanel);
  });
}

function requestIngredientPanelFocus() {
  if (panelFocusTicking) return;
  panelFocusTicking = true;
  requestAnimationFrame(() => {
    updateIngredientPanelFocus();
    panelFocusTicking = false;
  });
}

window.addEventListener('scroll', requestIngredientPanelFocus, { passive: true });
window.addEventListener('resize', requestIngredientPanelFocus, { passive: true });


/* ── SCROLL REVEAL ─────────────────────────────────────────── */
function observeReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* ── PAGE TEXT DATA ────────────────────────────────────────── */
function applyIndexText() {
  const text = window.NGU_SAC_INDEX_TEXT;
  if (!text) return;

  document.querySelectorAll('[data-nav-target="home"]').forEach(item => { item.textContent = text.nav.home; });
  document.querySelectorAll('[data-nav-target="ingredients"]').forEach(item => { item.textContent = text.nav.ingredients; });
  document.querySelectorAll('[data-nav-target="products"]').forEach(item => { item.textContent = text.nav.products; });

  document.querySelector('.story-title-row h2').textContent = text.story.title;
  document.querySelector('.ingredient-story-heading h3').textContent = text.story.subtitle;
  const storyDesc = document.querySelector('.story-desc');
  if (storyDesc) {
    storyDesc.innerHTML = text.story.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('');
  }
  const boardCta = document.querySelector('.ingredient-board-cta');
  if (boardCta) boardCta.textContent = text.story.cta;

  const productsHead = document.querySelector('.ingredient-products-head');
  if (productsHead) {
    productsHead.querySelector('.section-eyebrow').textContent = text.products.kicker;
    productsHead.querySelector('h3').textContent = text.products.title;
    productsHead.querySelector('p').textContent = text.products.description;
  }

  document.querySelectorAll('.ingredient-product-card').forEach((card, index) => {
  const product = text.products.items[index];
  if (!product) return;

  const image = card.querySelector('img');
  const title = card.querySelector('h4');
  const link = card.querySelector('a');

  if (image) {
    image.src = product.image;
    image.alt = product.alt || product.name;
  }

  if (title) {
    title.textContent = product.name;
  }

  if (link) {
    link.href = product.link || `pl/pl.html#${product.id}`;
  }
});

  const footer = text.footer;
  const footerTagline = document.querySelector('.footer-tagline');
  if (footerTagline) footerTagline.textContent = footer.tagline;
  const footerBottom = document.querySelector('.footer-bottom > span');
  if (footerBottom) footerBottom.textContent = footer.credit;
}

/* ── INIT ───────────────────────────────────────────────────── */
applyIndexText();
updateIngredientPanelFocus();

if (typeof updatePageSectionFocus === 'function') {
  updatePageSectionFocus();
}


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

/* Product carousel: one product per view on phones. */
(() => {
  const section = document.querySelector('.ingredient-products-secondary');
  if (!section) return;

  const track = section.querySelector('.ingredient-products-track');
  const cards = [...track.querySelectorAll('.ingredient-product-card')];
  const previousButton = section.querySelector('.product-carousel-prev');
  const nextButton = section.querySelector('.product-carousel-next');
  const currentLabel = section.querySelector('.product-carousel-status b');
  const totalLabel = section.querySelector('.product-carousel-status span:last-child');
  let activeIndex = 0;
  let scrollTimer;

  const isPhone = () => window.matchMedia('(max-width: 720px)').matches;

  function updateControls(index = activeIndex) {
    activeIndex = isPhone() ? Math.max(0, Math.min(index, cards.length - 1)) : 0;
    currentLabel.textContent = String(activeIndex + 1);
    totalLabel.textContent = String(isPhone() ? cards.length : 1);
    previousButton.disabled = !isPhone() || activeIndex === 0;
    nextButton.disabled = !isPhone() || activeIndex === cards.length - 1;
  }

  function goTo(index) {
    if (!isPhone()) return;
    const targetIndex = Math.max(0, Math.min(index, cards.length - 1));
    cards[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    updateControls(targetIndex);
  }

  previousButton.addEventListener('click', () => goTo(activeIndex - 1));
  nextButton.addEventListener('click', () => goTo(activeIndex + 1));

  track.addEventListener('scroll', () => {
    if (!isPhone()) return;
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const index = cards.reduce((closest, card, cardIndex) => {
        const currentDistance = Math.abs(card.offsetLeft - track.scrollLeft);
        const closestDistance = Math.abs(cards[closest].offsetLeft - track.scrollLeft);
        return currentDistance < closestDistance ? cardIndex : closest;
      }, 0);
      updateControls(index);
    }, 80);
  }, { passive: true });

  window.addEventListener('resize', () => updateControls(), { passive: true });
  updateControls();
})();

/* =========================================================
   BẢN ĐỒ THÀNH PHẦN TRỰC TIẾP TRÊN HOME
   Dữ liệu lấy từ text/nl/text.js
========================================================= */
(function initHomeIngredientMap() {
  const root = document.getElementById('ingredient-map-home');
  if (!root) return;

  const areas = [...root.querySelectorAll('.jejumap .area')];
  const detailWrapper = root.querySelector('.ng-detail-wrapper');
  const otherHead = root.querySelector('.ng-other-head');
  const otherGrid = root.querySelector('.ng-other-grid');

  const areaTargets = {
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

  function homeAssetPath(src) {
    return String(src || '').replace(/^(\.\.\/)+/, '');
  }

  function getAreaClass(area) {
    return [...area.classList].find(className => /^area\d+$/.test(className));
  }

  function getIngredient(targetId) {
    return window.NGU_SAC_NL_TEXT?.ingredients?.find(item => item.id === targetId);
  }

  function renderDetailPages(text) {
    if (!detailWrapper) return;

    detailWrapper.innerHTML = text.ingredients.map(ingredient => {
      const heroImage = homeAssetPath(ingredient.heroImage);
      const image = homeAssetPath(ingredient.image);

      return `
        <section class="ng-detail-page ng-${ingredient.id}" id="${ingredient.id}">
          <div class="ng-detail-hero">
            <div class="ng-detail-hero-bg" style="background-image: url('${heroImage}');"></div>
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
              <img src="${image}" alt="${ingredient.title}">
            </figure>

            <div class="ng-detail-text">
              <h3>${ingredient.subtitle}</h3>
              ${ingredient.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
              <a class="back-map" href="#ingredient-map-home">Quay về bản đồ</a>
            </div>
          </div>
        </section>
      `;
    }).join('');
  }

  function renderOtherCards(text) {
    if (otherHead && text.otherIngredients) {
      const kicker = otherHead.querySelector('.ng-other-kicker');
      const heading = otherHead.querySelector('h2');
      const description = otherHead.querySelector('p:last-child');

      if (kicker) {
        kicker.textContent = text.otherIngredients.kicker || 'NGỰ SẮC INGREDIENTS';
      }

      if (heading) {
        heading.textContent = text.otherIngredients.title || 'Nguyên liệu khác';
      }

      if (description) {
        description.textContent =
          text.otherIngredients.description ||
          'Chọn nhanh một thành phần khác để tiếp tục khám phá câu chuyện nguyên liệu trong các sản phẩm của Ngự Sắc.';
      }
    }

    if (!otherGrid) return;

    otherGrid.innerHTML = text.ingredients.map((ingredient, index) => {
      const image = homeAssetPath(
        ingredient.cardImage || ingredient.image || ingredient.heroImage || ''
      );
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
    areas.forEach(area => {
      const areaClass = getAreaClass(area);
      area.classList.toggle('active', areaTargets[areaClass] === targetId);
    });

    root.querySelectorAll('.ng-other-card').forEach(card => {
      card.classList.toggle('is-active', card.dataset.target === targetId);
    });
  }

  function showOnlyDetail(targetId, options = {}) {
    const {
      shouldScroll = true,
      shouldUpdateHash = true
    } = options;

    const target = document.getElementById(targetId);
    if (!target || !getIngredient(targetId)) return;

    root.querySelectorAll('.ng-detail-page').forEach(page => {
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
    root.querySelectorAll('.ng-detail-page').forEach(page => {
      page.classList.remove('active-detail', 'targeted');
    });

    document.body.classList.remove('has-active-detail');
    setActiveTarget(null);
    window.history.replaceState(null, '', '#ingredients');

    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function applyIngredientText() {
    const text = window.NGU_SAC_NL_TEXT;

    if (!text?.ingredients?.length) {
      console.warn(
        'Không tìm thấy NGU_SAC_NL_TEXT. Hãy giữ file text/nl/text.js và nạp file này trước script.js.'
      );
      return false;
    }

    areas.forEach(area => {
      const areaClass = getAreaClass(area);
      const label = text.mapLabels?.[areaClass];
      const targetId = areaTargets[areaClass];
      const tspan = area.querySelector('tspan');

      if (label && tspan) tspan.textContent = label;
      area.toggleAttribute('aria-disabled', !targetId);
    });

    renderDetailPages(text);
    renderOtherCards(text);
    return true;
  }

  if (!applyIngredientText()) return;

  areas.forEach(area => {
    area.addEventListener('click', event => {
      event.preventDefault();

      const areaClass = getAreaClass(area);
      const targetId = areaTargets[areaClass];

      if (targetId) showOnlyDetail(targetId);
    });
  });

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
    showOnlyDetail(hashTarget, {
      shouldScroll: false,
      shouldUpdateHash: false
    });
  }
})();
