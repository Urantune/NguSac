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

const plSharedPanels = {
  heritage: {
    title: 'Dấu ấn Ngự Sắc',
    heading: 'Một món quà mang vẻ đẹp Huế',
    paragraphs: [
      'Mỗi sản phẩm Ngự Sắc được phát triển với thiết kế lấy cảm hứng từ vẻ đẹp cung đình và những hình ảnh đặc trưng của Huế.',
      'Sự kết hợp giữa phong cách truyền thống và thẩm mỹ hiện đại giúp sản phẩm không chỉ phù hợp để sử dụng hằng ngày mà còn có thể trở thành một món quà văn hóa dành cho những người yêu thích mỹ phẩm Việt và vẻ đẹp Huế.'
    ]
  },
  qr: {
    title: 'Khám phá qua QR Code',
    heading: 'Minh bạch thông tin – kết nối văn hóa',
    paragraphs: [
      'Website Ngự Sắc hiện đóng vai trò là không gian giới thiệu và cung cấp thông tin sản phẩm, không trực tiếp thực hiện hoạt động bán hàng.',
      'Thông qua QR Code trên bao bì, người dùng có thể khám phá thành phần, nguồn gốc nguyên liệu, hướng dẫn sử dụng, cách bảo quản, quy trình tạo sản phẩm và câu chuyện lấy cảm hứng từ Phấn Nụ Cung Đình Huế.',
      'QR Code giúp sản phẩm truyền thống trở nên hiện đại, minh bạch và gần gũi hơn với người dùng trẻ.'
    ]
  },
  connect: {
    title: 'Kết nối cùng Ngự Sắc',
    heading: 'Trải nghiệm và chia sẻ cảm nhận',
    paragraphs: [
      'Ngự Sắc đang được phát triển và hoàn thiện thông qua các sản phẩm prototype, hoạt động khảo sát và phản hồi thực tế từ người dùng.',
      'Thông tin về booth trải nghiệm, chương trình dùng thử, hoạt động giới thiệu sản phẩm và các nền tảng phân phối trong tương lai sẽ được cập nhật trên website và kênh truyền thông chính thức của Ngự Sắc.'
    ]
  }
};

const plShowcaseDetails = {
  'phan-nu': {
    eyebrow: 'Phấn Phủ Thiên Nhiên',
    title: 'Phấn Phủ Ngự Sắc',
    subtitle: 'Phấn phủ làm mịn – Kiềm dầu nhẹ – Cảm hứng từ Phấn Nụ Cung Đình Huế',
    summary: 'Mềm mại và nhẹ nhàng, Phấn Má Hồng Ngự Sắc mang đến sắc hồng tự nhiên, giúp gương mặt trở nên tươi tắn nhưng vẫn giữ được vẻ thanh lịch và tinh tế. Chất phấn mịn, dễ tán và có thể điều chỉnh độ đậm nhạt tùy theo phong cách trang điểm. Một lớp phấn nhẹ tạo hiệu ứng ửng hồng trong trẻo, trong khi...',
    innovation: {
      image: '../assets/pl/products/PhanPhu/nd_phanphu1.png',
      title: 'Phấn phủ thiên nhiên mang tinh thần cung đình Huế',
      paragraphs: [
        'Phấn Phủ Ngự Sắc hiện đại hóa cảm hứng từ Phấn Nụ Cung Đình Huế bằng cách kết hợp nguyên liệu thiên nhiên, thiết kế trẻ trung và công nghệ QR Code.',
        'Sản phẩm không chỉ hướng đến hiệu quả trang điểm nhẹ nhàng mà còn góp phần kể lại câu chuyện về nét đẹp truyền thống Việt Nam theo một cách mới mẻ và dễ tiếp cận hơn.'
      ]
    },
    finish: {
      image: '../assets/pl/products/PhanPhu/nd_phanphu2.png',
      kicker: 'Hiệu ứng trang điểm',
      title: 'Lớp phủ mịn nhẹ, không cần chỉnh sửa cầu kỳ',
      caption: 'Phấn Phủ Ngự Sắc giúp da khô thoáng, mịn nhẹ, hài hòa.'
    },
    process: {
      video: '../assets/pl/products/VideoQT/QT2_Phan_web.mp4',
      title: 'Quy trình làm Phấn Phủ Ngự Sắc'
    },
    details: {
      paragraphs: [
        'Mỏng nhẹ và tự nhiên, Phấn Phủ Ngự Sắc tạo một lớp phủ mềm mịn trên bề mặt da, giúp hấp thụ bã nhờn, hỗ trợ kiểm soát dầu và mang lại cảm giác khô thoáng trong quá trình sử dụng.',
        'Sản phẩm kết hợp cao lanh, bột gạo cùng các nguyên liệu thảo mộc truyền thống như bạch linh, bạch chỉ, hoài sơn, cam thảo, bạch cúc và chiết xuất hoa lài. Chất phấn nhẹ nhàng giúp bề mặt da trông mịn màng hơn mà không tạo cảm giác nặng nề.',
        'Lấy cảm hứng từ Phấn Nụ Cung Đình Huế, Phấn Phủ Ngự Sắc kết nối bí quyết làm đẹp truyền thống với phong cách trang điểm tự nhiên của người trẻ hiện đại.'
      ],
      facts: [
        ['HIỆU ỨNG', 'Mịn nhẹ, tự nhiên và khô thoáng'],
        ['CÔNG DỤNG', 'Hỗ trợ hấp thụ bã nhờn và kiểm soát dầu'],
        ['THÀNH PHẦN NỔI BẬT', 'Cao lanh, bột gạo và các nguyên liệu thảo mộc'],
        ['TRẢI NGHIỆM', 'Giúp bề mặt da trông mịn màng và lớp nền hài hòa hơn'],
        ['PHÙ HỢP', 'Trang điểm nhẹ nhàng và sử dụng hằng ngày']
      ],
      usage: 'Có thể sử dụng sau bước dưỡng da, sau lớp nền hoặc dặm lại tại những vùng dễ tiết dầu như trán, mũi và cằm.',
      weight: '25 g'
    },
    gallery: [
      '../assets/pl/products/PhanPhu/hero_phanphu1.png',
      '../assets/pl/products/PhanPhu/hero_phanphu2.png',
      '../assets/pl/products/PhanPhu/hero_phanphu3.png',
      '../assets/pl/products/PhanPhu/hero_phanphu4.png',
      '../assets/pl/products/PhanPhu/hero_phanphu5.png'
    ]
  },
  'phan-ma': {
    eyebrow: 'Phấn Má Hồng Thiên Nhiên',
    title: 'Phấn Má Hồng Ngự Sắc',
    subtitle: 'Sắc hồng tự nhiên – Hiệu ứng tươi tắn – Cảm hứng cung đình Huế',
    summary: 'Mềm mại và nhẹ nhàng, Phấn Má Hồng Ngự Sắc mang đến sắc hồng tự nhiên, giúp gương mặt trở nên tươi tắn nhưng vẫn giữ được vẻ thanh lịch và tinh tế. Chất phấn mịn, dễ tán và có thể điều chỉnh độ đậm nhạt tùy theo phong cách trang điểm. Một lớp phấn nhẹ tạo hiệu ứng ửng hồng trong trẻo, trong khi...',
    innovation: {
      image: '../assets/pl/products/PhanMa/nd_phanma1.png',
      title: 'Sắc hồng truyền thống trong phong cách hiện đại',
      paragraphs: [
        'Phấn Má Hồng Ngự Sắc chuyển tải nét duyên nhẹ nhàng của người phụ nữ Huế thông qua một sản phẩm trang điểm gần gũi với thế hệ trẻ.',
        'Từ sắc phấn mềm mại đến thiết kế bao bì mang yếu tố văn hóa, sản phẩm hướng đến sự cân bằng giữa nét đẹp truyền thống, tính thẩm mỹ và trải nghiệm sử dụng hiện đại.'
      ]
    },
    finish: {
      image: '../assets/pl/products/PhanMa/nd_phanma2.png',
      kicker: 'Hiệu ứng trang điểm',
      title: 'Sắc hồng tự nhiên cho gương mặt tươi tắn',
      caption: 'Phấn Má Hồng Ngự Sắc giúp gương mặt tươi tắn, tự nhiên hơn.'
    },
    process: {
      video: '../assets/pl/products/VideoQT/QT2_Phan_web.mp4',
      title: 'Quy trình làm Phấn Má Hồng Ngự Sắc'
    },
    details: {
      paragraphs: [
        'Mềm mại và nhẹ nhàng, Phấn Má Hồng Ngự Sắc mang đến sắc hồng tự nhiên, giúp gương mặt trở nên tươi tắn nhưng vẫn giữ được vẻ thanh lịch và tinh tế.',
        'Chất phấn mịn, dễ tán và có thể điều chỉnh độ đậm nhạt tùy theo phong cách trang điểm. Một lớp phấn nhẹ tạo hiệu ứng ửng hồng trong trẻo, trong khi nhiều lớp giúp màu má trở nên rõ nét hơn mà không làm mất đi vẻ tự nhiên.',
        'Lấy cảm hứng từ nét duyên của người phụ nữ Huế, sản phẩm kết hợp giữa vẻ đẹp truyền thống và phong cách trang điểm hiện đại, phù hợp sử dụng hằng ngày hoặc trong những dịp cần vẻ ngoài chỉn chu hơn.'
      ],
      facts: [
        ['HIỆU ỨNG', 'Sắc hồng nhẹ nhàng và tự nhiên'],
        ['CHẤT PHẤN', 'Mịn nhẹ, dễ tán và dễ điều chỉnh'],
        ['ĐỘ LÊN MÀU', 'Có thể tăng dần theo nhiều lớp'],
        ['TRẢI NGHIỆM', 'Giúp gương mặt trông tươi tắn và có sức sống hơn'],
        ['PHÙ HỢP', 'Trang điểm hằng ngày và phong cách makeup nhẹ nhàng']
      ],
      usage: 'Dùng cọ lấy một lượng phấn vừa đủ, tán nhẹ lên vùng gò má và điều chỉnh độ đậm nhạt theo sở thích.',
      weight: '25 g'
    },
    gallery: [
      '../assets/pl/products/PhanMa/hero_phanma1.png',
      '../assets/pl/products/PhanMa/hero_phanma2.png',
      '../assets/pl/products/PhanMa/hero_phanma3.png',
      '../assets/pl/products/PhanMa/hero_phanma4.png',
      '../assets/pl/products/PhanMa/hero_phanma5.png'
    ]
  },
  'son-duong': {
    eyebrow: 'Son Dưỡng Từ Dừa',
    title: 'Son Dưỡng Ngự Sắc',
    subtitle: 'Dưỡng ẩm mềm môi – Hạn chế khô ráp – Cảm hứng vẻ đẹp Việt',
    summary: 'Mềm mại và dễ sử dụng, Son Dưỡng Ngự Sắc tạo một lớp dưỡng mỏng nhẹ trên môi, giúp đôi môi có cảm giác ẩm mượt và hạn chế tình trạng khô ráp. Công thức được phát triển từ dầu dừa, sáp ong, vitamin E và vaseline. Dầu dừa góp phần cung cấp độ ẩm, sáp ong giúp tạo kết cấu ổn định, trong khi vaseline giúp tăng...',
    innovation: {
      image: '../assets/pl/products/SonDuong/nd_sonduong1.png',
      title: 'Son dưỡng thiên nhiên mang cảm hứng vẻ đẹp Việt',
      paragraphs: [
        'Son Dưỡng Ngự Sắc kết hợp những nguyên liệu chăm sóc môi quen thuộc với thiết kế mang nét văn hóa Huế.',
        'Sản phẩm hướng đến trải nghiệm dưỡng môi đơn giản, gần gũi nhưng vẫn có dấu ấn riêng, giúp một vật dụng chăm sóc cá nhân hằng ngày trở thành phương tiện kết nối người dùng với câu chuyện văn hóa Việt Nam.'
      ]
    },
    finish: {
      image: '../assets/pl/products/SonDuong/nd_sonduong2.png',
      kicker: 'Hiệu ứng chăm sóc môi',
      title: 'Đôi môi mềm mại và ẩm mượt tự nhiên',
      caption: 'Son Dưỡng Ngự Sắc giúp môi mềm mại, mịn màng, giảm khô ráp.'
    },
    process: {
      video: '../assets/pl/products/VideoQT/QT1_Son_web.mp4',
      title: 'Quy trình làm Son Dưỡng Ngự Sắc'
    },
    details: {
      paragraphs: [
        'Mềm mại và dễ sử dụng, Son Dưỡng Ngự Sắc tạo một lớp dưỡng mỏng nhẹ trên môi, giúp đôi môi có cảm giác ẩm mượt và hạn chế tình trạng khô ráp.',
        'Công thức được phát triển từ dầu dừa, sáp ong, vitamin E và vaseline. Dầu dừa góp phần cung cấp độ ẩm, sáp ong giúp tạo kết cấu ổn định, trong khi vaseline giúp tăng độ mềm và tạo một lớp phủ nhẹ trên bề mặt môi.',
        'Với thiết kế nhỏ gọn và cảm hứng từ vẻ đẹp Việt, Son Dưỡng Ngự Sắc phù hợp sử dụng hằng ngày, trước khi trang điểm môi hoặc bất cứ khi nào đôi môi cần được bổ sung độ ẩm.'
      ],
      facts: [
        ['HIỆU ỨNG', 'Môi mềm mại và có độ bóng nhẹ'],
        ['CÔNG DỤNG', 'Hỗ trợ dưỡng ẩm và hạn chế cảm giác khô ráp'],
        ['THÀNH PHẦN NỔI BẬT', 'Dầu dừa, sáp ong, vitamin E và vaseline'],
        ['KẾT CẤU', 'Mềm, mỏng nhẹ và dễ thoa'],
        ['PHÙ HỢP', 'Chăm sóc môi hằng ngày và sử dụng trước son màu']
      ],
      usage: 'Thoa trực tiếp một lớp vừa đủ lên môi. Có thể sử dụng nhiều lần trong ngày khi cảm thấy môi khô.',
      weight: '10 g'
    },
    gallery: [
      '../assets/pl/products/SonDuong/hero_sonduong1.png',
      '../assets/pl/products/SonDuong/hero_sonduong2.png',
      '../assets/pl/products/SonDuong/hero_sonduong3.png',
      '../assets/pl/products/SonDuong/hero_sonduong4.png',
      '../assets/pl/products/SonDuong/hero_sonduong5.png'
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
            <path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"/>
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
      </div>
    </div>

    <div class="pl-product-content">
      <article class="pl-product-summary">
        <p class="pl-product-summary-text">${item.summary}</p>
        <button class="pl-info-trigger pl-see-more" type="button" data-panel="description">
          Xem thêm
        </button>
      </article>

      <nav class="pl-product-links" aria-label="Thông tin thêm về Ngự Sắc">
        ${Object.entries(plSharedPanels).map(([key, panel]) => `
          <button class="pl-info-trigger" type="button" data-panel="${key}">
            <span>${panel.title}</span>
          </button>
        `).join('')}
      </nav>
    </div>

    <section class="pl-innovation" aria-label="Sự đổi mới của ${item.title}">
      <figure class="pl-innovation-media">
        <img src="${item.innovation.image}" alt="${item.title} – Sự đổi mới">
      </figure>
      <div class="pl-innovation-copy">
        <p class="pl-innovation-kicker">Sự đổi mới</p>
        <h2>${item.innovation.title}</h2>
        <p>${item.innovation.paragraphs.join(' ')}</p>
      </div>
    </section>

    <section class="pl-finish" aria-label="${item.finish.kicker} của ${item.title}">
      <p class="pl-finish-kicker">${item.finish.kicker}</p>
      <h2>${item.finish.title}</h2>
      <figure class="pl-finish-media">
        <img src="${item.finish.image}" alt="${item.finish.caption}">
      </figure>
      <p class="pl-finish-caption">${item.finish.caption}</p>
    </section>

    <section class="pl-process" aria-label="${item.process.title}">
      <div class="pl-process-video">
        <video muted loop playsinline data-custom-controls preload="metadata">
          <source src="${item.process.video}" type="video/mp4">
          Trình duyệt của bạn không hỗ trợ phát video.
        </video>
        <div class="video-controls" aria-label="Điều khiển video">
          <button class="video-control video-control-mute is-muted" type="button" aria-label="Bật âm thanh" aria-pressed="true">
            <svg class="icon-sound-on" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4Z"></path>
              <path d="M16 9.2c1.5 1.5 1.5 4.1 0 5.6M18.5 6.8c2.9 2.9 2.9 7.5 0 10.4"></path>
            </svg>
            <svg class="icon-sound-off" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4Z"></path>
              <path d="m17 10 4 4m0-4-4 4"></path>
            </svg>
          </button>
          <button class="video-control video-control-play" type="button" aria-label="Dừng video" aria-pressed="false">
            <svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"></path></svg>
            <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"></path></svg>
          </button>
        </div>
      </div>
      <h2>${item.process.title}</h2>
    </section>

    <div class="pl-lightbox" role="dialog" aria-modal="true" aria-label="Ảnh sản phẩm toàn màn hình" hidden>
      <button class="pl-lightbox-close" type="button" aria-label="Đóng">×</button>
      <div class="pl-lightbox-zoom" role="group" aria-label="Mức phóng to">
        ${[0, 20, 40, 60, 80, 100].map(level => `
          <button class="pl-lightbox-zoom-step ${level === 0 ? 'is-active' : ''}" type="button" data-zoom="${level}" aria-label="Phóng to ${level}%" aria-pressed="${level === 0}">
            <span>${level}%</span>
          </button>
        `).join('')}
      </div>

      <div class="pl-lightbox-stage">
        <img class="pl-lightbox-main" src="${item.gallery[0]}" alt="${item.title}">
      </div>

      <div class="pl-lightbox-thumbs" aria-label="Chọn ảnh sản phẩm">
        ${item.gallery.map((src, index) => `
          <button class="pl-lightbox-thumb ${index === 0 ? 'is-active' : ''}" type="button" data-lightbox-index="${index}" aria-label="Xem ảnh ${index + 1}" aria-current="${index === 0 ? 'true' : 'false'}">
            <img src="${src}" alt="" aria-hidden="true">
          </button>
        `).join('')}
      </div>
    </div>
  `;
};

function setShowcaseIndex(showcase, nextIndex) {
  const slides = showcase.querySelectorAll('.pl-slide');
  if (!slides.length) return;

  const requestedIndex = Number(nextIndex);
  const index = ((requestedIndex % slides.length) + slides.length) % slides.length;
  const track = showcase.querySelector('.pl-current-track');
  const previousImage = showcase.querySelector('.pl-previous img');

  showcase.dataset.index = String(index);
  track.style.transform = `translateX(-${index * 100}%)`;
  previousImage.src = slides[(index - 1 + slides.length) % slides.length].querySelector('img').src;

  showcase.querySelectorAll('.pl-dot').forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === index);
    dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
  });
}

function setLightboxZoom(lightbox, nextZoom) {
  if (!lightbox) return;

  const zoom = Math.max(0, Math.min(100, Number(nextZoom) || 0));
  lightbox.dataset.zoom = String(zoom);
  lightbox.style.setProperty('--pl-lightbox-scale', String(1 + zoom / 100));

  lightbox.querySelectorAll('.pl-lightbox-zoom-step').forEach(button => {
    const isActive = Number(button.dataset.zoom) === zoom;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function setLightboxIndex(lightbox, nextIndex) {
  const thumbs = [...lightbox.querySelectorAll('.pl-lightbox-thumb')];
  if (!thumbs.length) return;

  const requestedIndex = Number(nextIndex) || 0;
  const index = ((requestedIndex % thumbs.length) + thumbs.length) % thumbs.length;
  const selectedImage = thumbs[index].querySelector('img');
  const mainImage = lightbox.querySelector('.pl-lightbox-main');

  lightbox.dataset.index = String(index);
  mainImage.src = selectedImage.src;
  thumbs.forEach((thumb, thumbIndex) => {
    const isActive = thumbIndex === index;
    thumb.classList.toggle('is-active', isActive);
    thumb.setAttribute('aria-current', String(isActive));
  });
}

function closeLightbox(lightbox) {
  if (!lightbox) return;
  lightbox.hidden = true;
  setLightboxZoom(lightbox, 0);
  document.body.classList.remove('pl-lightbox-open');
}

const plInfoDrawer = document.querySelector('.pl-info-drawer');
const plInfoDrawerOverlay = document.querySelector('.pl-info-drawer-overlay');
const plInfoDrawerTitle = document.getElementById('plInfoDrawerTitle');
const plInfoDrawerContent = document.querySelector('.pl-info-drawer-content');
let plInfoDrawerTrigger = null;

function renderProductDescription(item) {
  return `
    <h3>${item.title}</h3>
    ${item.details.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
    <dl class="pl-info-facts">
      ${item.details.facts.map(([label, value]) => `
        <div>
          <dt>${label}:</dt>
          <dd>${value}</dd>
        </div>
      `).join('')}
    </dl>
    <p>${item.details.usage}</p>
    <p class="pl-info-weight"><strong>Khối lượng tịnh:</strong> ${item.details.weight}</p>
  `;
}

function renderSharedPanel(panel) {
  return `
    <h3>${panel.heading}</h3>
    ${panel.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
  `;
}

function openPlInfoDrawer(trigger) {
  if (!plInfoDrawer || !plInfoDrawerOverlay || !plInfoDrawerTitle || !plInfoDrawerContent) return;

  const panelKey = trigger.dataset.panel;
  const productId = trigger.closest('.product-detail')?.id;
  const item = plShowcaseDetails[productId];

  if (panelKey === 'description' && item) {
    plInfoDrawerTitle.textContent = 'Mô tả sản phẩm';
    plInfoDrawerContent.innerHTML = renderProductDescription(item);
  } else {
    const panel = plSharedPanels[panelKey];
    if (!panel) return;
    plInfoDrawerTitle.textContent = panel.title;
    plInfoDrawerContent.innerHTML = renderSharedPanel(panel);
  }

  plInfoDrawerTrigger = trigger;
  plInfoDrawer.classList.add('is-open');
  plInfoDrawerOverlay.classList.add('is-open');
  plInfoDrawer.setAttribute('aria-hidden', 'false');
  plInfoDrawerOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('pl-info-drawer-open');
  plInfoDrawer.querySelector('.pl-info-drawer-close')?.focus();
}

function closePlInfoDrawer() {
  if (!plInfoDrawer || !plInfoDrawerOverlay) return;
  plInfoDrawer.classList.remove('is-open');
  plInfoDrawerOverlay.classList.remove('is-open');
  plInfoDrawer.setAttribute('aria-hidden', 'true');
  plInfoDrawerOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('pl-info-drawer-open');
  plInfoDrawerTrigger?.focus();
  plInfoDrawerTrigger = null;
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
  const infoTrigger = event.target.closest('.pl-info-trigger');
  if (infoTrigger) {
    event.preventDefault();
    openPlInfoDrawer(infoTrigger);
    return;
  }

  if (event.target.closest('.pl-info-drawer-close') || event.target.classList.contains('pl-info-drawer-overlay')) {
    closePlInfoDrawer();
    return;
  }

  const dot = event.target.closest('.pl-dot');
  if (dot) {
    event.preventDefault();
    setShowcaseIndex(dot.closest('.pl-showcase'), dot.dataset.go);
    return;
  }

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
    setLightboxIndex(lightbox, index);
    setLightboxZoom(lightbox, 0);
    lightbox.hidden = false;
    document.body.classList.add('pl-lightbox-open');
    lightbox.querySelector('.pl-lightbox-close')?.focus();
    return;
  }

  if (event.target.closest('.pl-lightbox-close') || event.target.classList.contains('pl-lightbox')) {
    const lightbox = event.target.closest('.pl-lightbox');
    closeLightbox(lightbox);
    return;
  }

  const zoomStep = event.target.closest('.pl-lightbox-zoom-step');
  if (zoomStep) {
    setLightboxZoom(zoomStep.closest('.pl-lightbox'), zoomStep.dataset.zoom);
    return;
  }

  const lightboxThumb = event.target.closest('.pl-lightbox-thumb');
  if (lightboxThumb) {
    setLightboxIndex(lightboxThumb.closest('.pl-lightbox'), lightboxThumb.dataset.lightboxIndex);
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && document.body.classList.contains('pl-info-drawer-open')) {
    closePlInfoDrawer();
  }

  const lightbox = document.querySelector('.pl-lightbox:not([hidden])');
  if (!lightbox) return;

  if (event.key === 'Escape') {
    closeLightbox(lightbox);
  } else if (event.key === 'ArrowRight') {
    setLightboxIndex(lightbox, Number(lightbox.dataset.index || 0) + 1);
  } else if (event.key === 'ArrowLeft') {
    setLightboxIndex(lightbox, Number(lightbox.dataset.index || 0) - 1);
  }
});

function initProductVideoControls() {
  const videos = [...document.querySelectorAll('.pl-process-video video[data-custom-controls]')];

  videos.forEach(video => {
    if (video.dataset.controlsReady === 'true') return;

    const controls = video.parentElement.querySelector('.video-controls');
    const muteButton = controls?.querySelector('.video-control-mute');
    const playButton = controls?.querySelector('.video-control-play');
    if (!controls || !muteButton || !playButton) return;

    video.muted = true;
    video.defaultMuted = true;
    video.controls = false;
    video.dataset.controlsReady = 'true';
    video.dataset.userPaused = 'false';
    video.dataset.inViewport = 'false';

    const updateMuteButton = () => {
      muteButton.classList.toggle('is-muted', video.muted);
      muteButton.setAttribute('aria-pressed', String(video.muted));
      muteButton.setAttribute('aria-label', video.muted ? 'Bật âm thanh' : 'Tắt âm thanh');
    };

    const updatePlayButton = () => {
      playButton.classList.toggle('is-paused', video.paused);
      playButton.setAttribute('aria-pressed', String(video.paused));
      playButton.setAttribute('aria-label', video.paused ? 'Phát video' : 'Dừng video');
    };

    muteButton.addEventListener('click', () => { video.muted = !video.muted; });
    playButton.addEventListener('click', () => {
      if (video.paused) {
        video.dataset.userPaused = 'false';
        video.play().catch(updatePlayButton);
      } else {
        video.dataset.userPaused = 'true';
        video.pause();
      }
    });
    video.addEventListener('volumechange', updateMuteButton);
    video.addEventListener('play', updatePlayButton);
    video.addEventListener('pause', updatePlayButton);
    updateMuteButton();
    updatePlayButton();
  });

  if (!('IntersectionObserver' in window)) {
    videos.forEach(video => video.play().catch(() => {}));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      const isVisible = entry.isIntersecting && entry.intersectionRatio >= .25;
      video.dataset.inViewport = String(isVisible);

      if (isVisible && video.dataset.userPaused !== 'true' && !document.hidden) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: [0, .25, .6] });

  videos.forEach(video => {
    video.pause();
    observer.observe(video);
  });

  document.addEventListener('visibilitychange', () => {
    videos.forEach(video => {
      if (document.hidden) {
        video.pause();
      } else if (video.dataset.inViewport === 'true' && video.dataset.userPaused !== 'true') {
        video.play().catch(() => {});
      }
    });
  });
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

  initProductVideoControls();

  const footerLogoText = document.querySelector('.footer-tagline');
  if (footerLogoText) footerLogoText.textContent = text.footer.tagline;

  const footerBottom = document.querySelector('.footer-bottom > span');
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

/* Navbar: fade and hide while scrolling down, reveal while scrolling up. */
(function initAutoHideNavbar() {
  const navbar = document.querySelector('.site-nav');
  if (!navbar) return;

  let lastScrollY = Math.max(window.scrollY, 0);
  let ticking = false;

  function updateNavbar() {
    const currentScrollY = Math.max(window.scrollY, 0);
    const delta = currentScrollY - lastScrollY;
    const menuIsOpen = document.body.classList.contains('drawer-is-open');
    const searchIsOpen = document.body.classList.contains('ngs-search-open');

    if (currentScrollY <= 24 || delta < -2 || menuIsOpen || searchIsOpen) {
      navbar.classList.remove('is-hidden');
    } else if (delta > 2 && currentScrollY > navbar.offsetHeight) {
      navbar.classList.add('is-hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateNavbar);
  }, { passive: true });
})();

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
