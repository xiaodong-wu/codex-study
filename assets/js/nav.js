/* nav.js —— sidebar 注入、当前节高亮、完读追踪 */
(function () {
  'use strict';

  const STORAGE_KEY = 'codex-tutorial-read';

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

  function getBasePath() {
    const p = location.pathname;
    return /\/(chapters|appendix|app)\//.test(p) ? '../' : './';
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
        <a class="brand" href="${base}index.html">
          <span class="brand__mark">C</span>
          <span class="brand__text">Codex 口语化教程</span>
        </a>
      </div>
      <div class="read-progress"></div>`;
  }

  function injectSidebar() {
    const slot = document.getElementById('sidebar');
    if (!slot) return Promise.resolve();
    const base = getBasePath();
    return fetch(base + 'partials/sidebar.html')
      .then(r => {
        if (!r.ok) throw new Error('sidebar fetch failed');
        return r.text();
      })
      .then(html => {
        // 调整内部链接相对路径
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
    return fetch(base + 'partials/footer.html')
      .then(r => {
        if (!r.ok) throw new Error('footer fetch failed');
        return r.text();
      })
      .then(html => { slot.innerHTML = html.replace(/\{\{base\}\}/g, base); })
      .catch(() => {});
  }

  function injectHeader() {
    const slot = document.getElementById('site-header');
    if (!slot) return Promise.resolve();
    const base = getBasePath();
    return fetch(base + 'partials/header.html?v=20260623')
      .then(r => {
        if (!r.ok) throw new Error('header fetch failed');
        return r.text();
      })
      .then(html => {
        slot.innerHTML = html
          .replace(/\{\{base\}\}/g, base);
        bindMobileToggle();
      })
      .catch(() => {
        showHeaderFallback(slot, base);
        bindMobileToggle();
      });
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
    let scrim = document.querySelector('.sidebar-scrim');
    if (!scrim) {
      scrim = document.createElement('div');
      scrim.className = 'sidebar-scrim';
      scrim.setAttribute('aria-hidden', 'true');
      document.body.appendChild(scrim);
    }
    function open() {
      sidebar.classList.add('is-open');
      scrim.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', '关闭目录');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      sidebar.classList.remove('is-open');
      scrim.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', '打开目录');
      document.body.style.overflow = '';
    }
    btn.addEventListener('click', () => {
      sidebar.classList.contains('is-open') ? close() : open();
    });
    scrim.addEventListener('click', close);
    sidebar.addEventListener('click', e => {
      if (e.target.closest('a')) close();
    });
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
  }

  // 启动
  document.addEventListener('DOMContentLoaded', () => {
    Promise.all([injectHeader(), injectSidebar(), injectFooter()]).then(() => {
      trackCompletion();
    });
  });
})();
