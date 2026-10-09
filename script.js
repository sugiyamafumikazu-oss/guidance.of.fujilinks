/**
 * フジリンクス協同組合 - ランディングページ スクリプト
 * 主な機能:
 * 1. モバイルナビゲーション開閉制御
 * 2. FAQアコーディオン開閉 & アクセシビリティ (WAI-ARIA)
 * 3. スムーススクロール（ヘッダーオフセット考慮）
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------
  // 1. モバイルナビゲーション制御
  // ----------------------------------------------------
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const headerNav = document.querySelector('.header-nav');
  const navLinks = document.querySelectorAll('.nav-link, .header-cta-group a');

  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      headerNav.classList.toggle('is-open');
    });

    // リンククリック時にメニューを閉じる
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        headerNav.classList.remove('is-open');
      });
    });

    // メニュー外クリック時に閉じる
    document.addEventListener('click', (e) => {
      if (!headerNav.contains(e.target) && !menuToggle.contains(e.target) && headerNav.classList.contains('is-open')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        headerNav.classList.remove('is-open');
      }
    });
  }

  // ----------------------------------------------------
  // 2. FAQ アコーディオン制御 (WAI-ARIA対応)
  // ----------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item, index) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (!trigger || !panel) return;

    // 初期IDとアクセシビリティ属性の付与
    const qId = `faq-q-${index + 1}`;
    const panelId = `faq-panel-${index + 1}`;
    trigger.setAttribute('id', qId);
    trigger.setAttribute('aria-controls', panelId);
    panel.setAttribute('id', panelId);
    panel.setAttribute('aria-labelledby', qId);
    panel.setAttribute('role', 'region');

    // クリック時の開閉処理
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        // 閉じる
        trigger.setAttribute('aria-expanded', 'false');
        item.classList.remove('is-active');
        panel.style.maxHeight = '0px';
      } else {
        // 開く
        trigger.setAttribute('aria-expanded', 'true');
        item.classList.add('is-active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });

    // ウィンドウリサイズ時に開いているパネルの高さを再計算
    window.addEventListener('resize', () => {
      if (trigger.getAttribute('aria-expanded') === 'true') {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // 最初のFAQ項目をデフォルトで開いておく（内容の把握しやすさ向上）
  if (faqItems.length > 0) {
    const firstTrigger = faqItems[0].querySelector('.faq-trigger');
    const firstPanel = faqItems[0].querySelector('.faq-panel');
    if (firstTrigger && firstPanel) {
      firstTrigger.setAttribute('aria-expanded', 'true');
      faqItems[0].classList.add('is-active');
      firstPanel.style.maxHeight = firstPanel.scrollHeight + 'px';
    }
  }

  // ----------------------------------------------------
  // 3. スムーススクロール（固定ヘッダーの高さ考慮）
  // ----------------------------------------------------
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.site-header');

  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // アクセシビリティのためターゲットへフォーカス移動
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
});

