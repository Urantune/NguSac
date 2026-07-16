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
   SEARCH PANEL GIỐNG DIOR - HOME / NL / PL
================================================= */

document.addEventListener('DOMContentLoaded', function () {
  const searchButtons = document.querySelectorAll('.nav-search-btn');

  if (!searchButtons.length) return;

  const isSubPage =
    location.pathname.includes('/nl/') ||
    location.pathname.includes('/pl/');

  const imgPrefix = isSubPage ? '../' : '';
  const productLinkPrefix = isSubPage ? '../pl/pl.html' : 'pl/pl.html';

  const products = [
    {
      id: 'phan-nu',
      name: 'Phấn Phủ Ngự Sắc',
      desc: 'Phấn phủ thiên nhiên - nền mịn nhẹ, cảm hứng Huế',
      image: imgPrefix + 'assets/pl/products/phanphu.png',
      link: productLinkPrefix + '#phan-nu',
      keywords: 'phan phu phấn phủ phan nu phấn nụ powder nen min'
    },
    {
      id: 'phan-ma',
      name: 'Phấn Má Hồng Ngự Sắc',
      desc: 'Má hồng thiên nhiên - sắc hồng nhẹ, dễ tán',
      image: imgPrefix + 'assets/pl/products/phanma.png',
      link: productLinkPrefix + '#phan-ma',
      keywords: 'phan ma phấn má má hồng blush hong tu nhien'
    },
    {
      id: 'son-duong',
      name: 'Son Dưỡng Ngự Sắc',
      desc: 'Son dưỡng từ dầu dừa, sáp ong, vitamin E và vaseline',
      image: imgPrefix + 'assets/pl/products/sonduong.png',
      link: productLinkPrefix + '#son-duong',
      keywords: 'son duong son dưỡng moi dau dua sap ong vitamin e vaseline'
    }
  ];

  function createSearchPanel() {
    if (document.querySelector('.search-panel')) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'search-backdrop';
    backdrop.id = 'searchBackdrop';

    const panel = document.createElement('section');
    panel.className = 'search-panel';
    panel.id = 'searchPanel';
    panel.setAttribute('aria-hidden', 'true');

    panel.innerHTML = `
      <div class="search-panel-top">
        <div class="search-panel-logo">NGỰ SẮC</div>

        <form class="search-form" id="searchForm">
          <input
            class="search-input"
            id="searchInput"
            type="search"
            placeholder="Tìm sản phẩm Ngự Sắc"
            autocomplete="off"
          />

          <button class="search-close" type="button" id="searchClose" aria-label="Đóng tìm kiếm">×</button>

          <button class="search-submit" type="submit" aria-label="Tìm kiếm">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="M16.5 16.5L21 21"></path>
            </svg>
          </button>
        </form>
      </div>

      <div class="search-panel-body">
        <div>
          <p class="search-suggest-title">Có thể bạn sẽ thích</p>
          <div class="search-product-grid" id="searchProductGrid"></div>
          <p class="search-empty" id="searchEmpty">Không tìm thấy sản phẩm phù hợp.</p>
        </div>

        <div class="search-category">
          <p class="search-category-text">
            Tìm kiếm trong <a href="${productLinkPrefix}#phan-nu">Sản phẩm Ngự Sắc</a>
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
  }

  function removeVietnamese(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  }

  function renderProducts(keyword = '') {
    const grid = document.getElementById('searchProductGrid');
    const panel = document.getElementById('searchPanel');

    if (!grid || !panel) return;

    const cleanKeyword = removeVietnamese(keyword.trim());

    const filteredProducts = products.filter(function (product) {
      const searchText = removeVietnamese(
        product.name + ' ' + product.desc + ' ' + product.keywords
      );

      return !cleanKeyword || searchText.includes(cleanKeyword);
    });

    panel.classList.toggle('no-result', filteredProducts.length === 0);

    grid.innerHTML = filteredProducts
      .map(function (product) {
        return `
          <a class="search-product-card" href="${product.link}">
            <img class="search-product-img" src="${product.image}" alt="${product.name}">
            <div>
              <div class="search-product-name">${product.name}</div>
              <div class="search-product-desc">${product.desc}</div>
            </div>
          </a>
        `;
      })
      .join('');

    grid.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeSearch);
    });
  }

  function openSearch() {
    createSearchPanel();

    const panel = document.getElementById('searchPanel');
    const backdrop = document.getElementById('searchBackdrop');
    const input = document.getElementById('searchInput');
    const closeBtn = document.getElementById('searchClose');
    const form = document.getElementById('searchForm');

    if (!panel || !backdrop || !input || !closeBtn || !form) return;

    renderProducts();

    panel.classList.add('open');
    backdrop.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('search-is-open');

    setTimeout(function () {
      input.focus();
    }, 180);

    closeBtn.onclick = closeSearch;
    backdrop.onclick = closeSearch;

    input.oninput = function () {
      renderProducts(input.value);
    };

    form.onsubmit = function (event) {
      event.preventDefault();

      const firstResult = document.querySelector('.search-product-card');
      if (firstResult) {
        window.location.href = firstResult.getAttribute('href');
      }
    };
  }

  function closeSearch() {
    const panel = document.getElementById('searchPanel');
    const backdrop = document.getElementById('searchBackdrop');

    if (!panel || !backdrop) return;

    panel.classList.remove('open');
    backdrop.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('search-is-open');
  }

  searchButtons.forEach(function (button) {
    button.addEventListener('click', openSearch);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeSearch();
    }
  });
});

/* =================================================
   SEARCH GỌN TRÊN NAVBAR + ĐỀ XUẤT DƯỚI NAVBAR
   HOME / NL / PL
================================================= */

document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.nav, .site-nav');

  if (!nav) return;

  if (!document.querySelector('.nav-search-btn')) {
    const btn = document.createElement('button');
    btn.className = 'nav-search-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Tìm kiếm');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7"></circle>
        <path d="M16.5 16.5L21 21"></path>
      </svg>
    `;
    nav.appendChild(btn);
  }

  const cleanPath = location.pathname.replace(/\\/g, '/');
  const isSubPage = cleanPath.includes('/nl/') || cleanPath.includes('/pl/');

  const imgPrefix = isSubPage ? '../' : '';
  const productLinkPrefix = isSubPage ? '../pl/pl.html' : 'pl/pl.html';

  const products = [
    {
      id: 'phan-nu',
      name: 'Phấn Phủ Ngự Sắc',
      desc: 'Phấn phủ thiên nhiên, nền mịn nhẹ và cảm hứng Huế.',
      image: imgPrefix + 'assets/pl/products/phanphu.png',
      link: productLinkPrefix + '#phan-nu',
      keywords: 'phan phu phấn phủ phan nu phấn nụ powder nền mịn kiềm dầu'
    },
    {
      id: 'phan-ma',
      name: 'Phấn Má Hồng Ngự Sắc',
      desc: 'Má hồng thiên nhiên, sắc hồng nhẹ và dễ tán.',
      image: imgPrefix + 'assets/pl/products/phanma.png',
      link: productLinkPrefix + '#phan-ma',
      keywords: 'phan ma phấn má má hồng blush hồng tự nhiên'
    },
    {
      id: 'son-duong',
      name: 'Son Dưỡng Ngự Sắc',
      desc: 'Son dưỡng từ dầu dừa, sáp ong, vitamin E và vaseline.',
      image: imgPrefix + 'assets/pl/products/sonduong.png',
      link: productLinkPrefix + '#son-duong',
      keywords: 'son duong son dưỡng môi dầu dừa sáp ong vitamin e vaseline'
    }
  ];

  function removeVietnamese(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  }

  function removeOldSearchPanel() {
    document
      .querySelectorAll('.search-panel, .search-backdrop')
      .forEach(function (el) {
        el.remove();
      });
  }

  function createSearchUI() {
    removeOldSearchPanel();

    if (!document.querySelector('.ng-nav-search-box')) {
      const searchBox = document.createElement('form');
      searchBox.className = 'ng-nav-search-box';
      searchBox.id = 'ngNavSearchBox';

      searchBox.innerHTML = `
        <input
          class="ng-nav-search-input"
          id="ngNavSearchInput"
          type="search"
          placeholder="Tìm sản phẩm Ngự Sắc"
          autocomplete="off"
        />

        <button class="ng-nav-search-close" type="button" aria-label="Đóng tìm kiếm">×</button>

        <button class="ng-nav-search-submit" type="submit" aria-label="Tìm kiếm">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="M16.5 16.5L21 21"></path>
          </svg>
        </button>
      `;

      document.body.appendChild(searchBox);
    }

    if (!document.querySelector('.ng-search-suggest')) {
      const suggest = document.createElement('section');
      suggest.className = 'ng-search-suggest';
      suggest.id = 'ngSearchSuggest';

      suggest.innerHTML = `
        <div class="ng-search-head">
          <p class="ng-search-title">Có thể bạn sẽ thích</p>
          <p class="ng-search-category">
            Tìm kiếm trong <a href="${productLinkPrefix}#phan-nu">Sản phẩm Ngự Sắc</a>
          </p>
        </div>

        <div class="ng-search-grid" id="ngSearchGrid"></div>

        <p class="ng-search-empty">Không tìm thấy sản phẩm phù hợp.</p>
      `;

      document.body.appendChild(suggest);
    }
  }

  function renderProducts(keyword) {
    const suggest = document.getElementById('ngSearchSuggest');
    const grid = document.getElementById('ngSearchGrid');

    if (!suggest || !grid) return;

    const cleanKeyword = removeVietnamese((keyword || '').trim());

    const filteredProducts = products.filter(function (product) {
      const searchText = removeVietnamese(
        product.name + ' ' + product.desc + ' ' + product.keywords
      );

      return !cleanKeyword || searchText.includes(cleanKeyword);
    });

    suggest.classList.toggle('no-result', filteredProducts.length === 0);

    grid.innerHTML = filteredProducts.map(function (product) {
      return `
        <a class="ng-search-card" href="${product.link}">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <strong class="ng-search-name">${product.name}</strong>
            <span class="ng-search-desc">${product.desc}</span>
          </div>
          <span class="ng-search-arrow">›</span>
        </a>
      `;
    }).join('');
  }

  function openSearch() {
    createSearchUI();

    const input = document.getElementById('ngNavSearchInput');
    const form = document.getElementById('ngNavSearchBox');
    const closeBtn = document.querySelector('.ng-nav-search-close');

    document.body.classList.add('ng-search-open');
    renderProducts('');

    setTimeout(function () {
      input.focus();
    }, 120);

    input.oninput = function () {
      renderProducts(input.value);
    };

    closeBtn.onclick = closeSearch;

    form.onsubmit = function (event) {
      event.preventDefault();

      const firstProduct = document.querySelector('.ng-search-card');

      if (firstProduct) {
        window.location.href = firstProduct.getAttribute('href');
      }
    };
  }

  function closeSearch() {
    document.body.classList.remove('ng-search-open');

    const input = document.getElementById('ngNavSearchInput');
    if (input) input.value = '';
  }

  document.addEventListener('click', function (event) {
    const searchBtn = event.target.closest('.nav-search-btn');
    const searchBox = event.target.closest('.ng-nav-search-box');
    const suggestBox = event.target.closest('.ng-search-suggest');

    if (searchBtn) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openSearch();
      return;
    }

    if (event.target.closest('.ng-search-card')) {
      closeSearch();
      return;
    }

    if (
      document.body.classList.contains('ng-search-open') &&
      !searchBox &&
      !suggestBox &&
      !searchBtn
    ) {
      closeSearch();
    }
  }, true);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeSearch();
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

