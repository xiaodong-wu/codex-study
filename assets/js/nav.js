/* nav.js —— sidebar 注入、当前节高亮、完读追踪 */
(function () {
  'use strict';

  const STORAGE_KEY = 'codex-tutorial-read';
  const PARTIAL_VERSION = '20260716-work-agents';
  const PARTIAL_CACHE_PREFIX = 'codex-tutorial-partial:';

  function getReadSet() {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch {
      return new Set();
    }
  }

  function saveReadSet(set) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    } catch {
      /* 忽略,无 localStorage 也无碍 */
    }
  }

  function getCachedPartial(name) {
    try {
      return localStorage.getItem(PARTIAL_CACHE_PREFIX + PARTIAL_VERSION + ':' + name);
    } catch {
      return null;
    }
  }

  function saveCachedPartial(name, html) {
    try {
      localStorage.setItem(PARTIAL_CACHE_PREFIX + PARTIAL_VERSION + ':' + name, html);
    } catch {
      /* 缓存失败不影响页面使用 */
    }
  }

  function getBasePath() {
    const p = location.pathname;
    return /\/(chapters|appendix|app)\//.test(p) ? '../' : './';
  }

  function getPartialPath(name) {
    const isLocal = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(location.hostname);
    return `partials/${name}${isLocal ? '.html' : ''}?v=${PARTIAL_VERSION}`;
  }

  function showSidebarFallback(slot, base) {
    slot.innerHTML = `
      <div class="partial-error" role="status">
        <strong>目录没有加载出来</strong>
        <span>请用本地服务器打开本教程,不要直接双击 HTML 文件。</span>
        <code>python3 -m http.server 8000</code>
      </div>
      <div class="sidebar__title">快速入口</div>
      <div class="sidebar__group">
        <a class="sidebar__item" href="${base}index.html"><span class="sidebar__num">↑</span><span>教程首页</span></a>
        <a class="sidebar__item" href="${base}app/00-overview.html"><span class="sidebar__num">App</span><span>桌面端 App 教程</span></a>
        <a class="sidebar__item" href="${base}chapters/00-intro.html"><span class="sidebar__num">CLI</span><span>CLI 教程</span></a>
      </div>`;
  }

  function showHeaderFallback(slot, base) {
    slot.innerHTML = `
      <div class="site-header__inner">
        <button class="nav-toggle" aria-label="打开目录" aria-expanded="false" aria-controls="sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <a class="brand" href="${base}index.html">
          <span class="brand__mark">
            <img class="brand__logo" src="${base}assets/img/brand/codex-app-logo.png" alt="" width="28" height="28" loading="eager" decoding="async" />
          </span>
          <span class="brand__text">Codex 中文教程（神灯资讯）</span>
        </a>
        <div class="site-header__actions">
          <a class="nav-link nav-link--hide-on-mobile" href="${base}index.html">首页</a>
          <a class="nav-link nav-link--hide-on-mobile" href="${base}app/00-overview.html">桌面端 App</a>
          <a class="nav-link nav-link--hide-on-mobile" href="${base}chapters/00-intro.html">CLI 教程</a>
          <a class="nav-link nav-link--hide-on-mobile" href="${base}appendix/a-prompt-library.html">提示词库</a>
        </div>
      </div>
      <div class="read-progress"></div>`;
  }

  function fetchPartial(name, base) {
    const cached = getCachedPartial(name);
    if (cached) return Promise.resolve(cached);
    return fetch(base + getPartialPath(name), { cache: 'force-cache' })
      .then(r => {
        if (!r.ok) throw new Error(`${name} fetch failed`);
        return r.text();
      })
      .then(html => {
        saveCachedPartial(name, html);
        return html;
      });
  }

  function injectSidebar() {
    const slot = document.getElementById('sidebar');
    if (!slot) return Promise.resolve();
    const base = getBasePath();
    return fetchPartial('sidebar', base)
      .then(html => {
        const adjusted = html.replace(/\{\{base\}\}/g, base);
        slot.innerHTML = adjusted;
        markCurrent(slot);
        applyReadDots(slot);
      })
      .catch(() => { showSidebarFallback(slot, base); });
  }

  function injectFooter() {
    const slot = document.getElementById('site-footer');
    if (!slot) return Promise.resolve();
    const base = getBasePath();
    return fetchPartial('footer', base)
      .then(html => { slot.innerHTML = html.replace(/\{\{base\}\}/g, base); })
      .catch(() => {});
  }

  function injectHeader() {
    const slot = document.getElementById('site-header');
    if (!slot) return Promise.resolve();
    const base = getBasePath();
    showHeaderFallback(slot, base);
    bindMobileToggle();
    return fetchPartial('header', base)
      .then(html => {
        slot.innerHTML = html.replace(/\{\{base\}\}/g, base);
        bindMobileToggle();
      })
      .catch(() => {});
  }

  function markCurrent(root) {
    const current = document.body.dataset.chapter; // e.g. "02-setup"
    if (!current) return;
    const link = root.querySelector(`[data-chapter="${current}"]`);
    if (link) {
      link.classList.add('is-active');
      // 滚到可见
      const rect = link.getBoundingClientRect();
      if (rect.top < 80 || rect.top > window.innerHeight - 80) {
        link.scrollIntoView({ block: 'center' });
      }
    }
  }

  function applyReadDots(root) {
    const read = getReadSet();
    root.querySelectorAll('[data-chapter]').forEach(el => {
      if (read.has(el.dataset.chapter)) el.classList.add('is-read');
    });
  }

  function trackCompletion() {
    const id = document.body.dataset.chapter;
    if (!id) return;
    let triggered = false;
    function check() {
      if (triggered) return;
      const docH = document.documentElement.scrollHeight;
      const viewH = window.innerHeight;
      const scrolled = window.scrollY + viewH;
      // 读到底部 90% 即视为读完
      if (scrolled >= docH - 60 || scrolled / docH > 0.9) {
        const set = getReadSet();
        set.add(id);
        saveReadSet(set);
        triggered = true;
        // 实时点亮
        document
          .querySelectorAll(`#sidebar [data-chapter="${id}"]`)
          .forEach(el => el.classList.add('is-read'));
      }
    }
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    setTimeout(check, 500);
  }

  function bindMobileToggle() {
    const btn = document.querySelector('.nav-toggle');
    const sidebar = document.getElementById('sidebar');
    if (!btn || !sidebar) return;
    if (btn.dataset.bound === 'true') return;
    btn.dataset.bound = 'true';
    let scrim = document.querySelector('.sidebar-scrim');
    if (!scrim) {
      scrim = document.createElement('div');
      scrim.className = 'sidebar-scrim';
      scrim.setAttribute('aria-hidden', 'true');
      document.body.appendChild(scrim);
    }
    function open() {
      const currentBtn = document.querySelector('.nav-toggle');
      sidebar.classList.add('is-open');
      scrim.classList.add('is-open');
      currentBtn?.setAttribute('aria-expanded', 'true');
      currentBtn?.setAttribute('aria-label', '关闭目录');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      const currentBtn = document.querySelector('.nav-toggle');
      sidebar.classList.remove('is-open');
      scrim.classList.remove('is-open');
      currentBtn?.setAttribute('aria-expanded', 'false');
      currentBtn?.setAttribute('aria-label', '打开目录');
      document.body.style.overflow = '';
    }
    btn.addEventListener('click', () => {
      sidebar.classList.contains('is-open') ? close() : open();
    });
    if (scrim.dataset.bound !== 'true') {
      scrim.dataset.bound = 'true';
      scrim.addEventListener('click', close);
    }
    if (sidebar.dataset.bound !== 'true') {
      sidebar.dataset.bound = 'true';
      sidebar.addEventListener('click', e => {
        if (e.target.closest('a')) close();
      });
    }
    if (document.body.dataset.navKeyBound !== 'true') {
      document.body.dataset.navKeyBound = 'true';
      window.addEventListener('keydown', e => {
        if (e.key === 'Escape') close();
      });
    }
  }

  // 启动
  document.addEventListener('DOMContentLoaded', () => {
    Promise.all([injectHeader(), injectSidebar()]).then(() => {
      trackCompletion();
    });
    const runWhenIdle = window.requestIdleCallback || (fn => setTimeout(fn, 160));
    runWhenIdle(() => { injectFooter(); });
  });
})();
