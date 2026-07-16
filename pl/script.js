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

