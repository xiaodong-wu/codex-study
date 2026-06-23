/* progress.js —— 顶部阅读进度条 */
(function () {
  'use strict';
  function ensureBar() {
    let bar = document.querySelector('.read-progress');
    if (bar) return bar;
    bar = document.createElement('div');
    bar.className = 'read-progress';
    const header = document.querySelector('.site-header');
    if (header) header.appendChild(bar);
    return bar;
  }
  function update() {
    const bar = ensureBar();
    if (!bar) return;
    const doc = document.documentElement;
    const scrolled = window.scrollY;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, (scrolled / max) * 100) : 0;
    bar.style.width = pct.toFixed(2) + '%';
  }
  // 等 header 注入完成
  function init() {
    setTimeout(() => {
      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
    }, 200);
  }
  document.addEventListener('DOMContentLoaded', init);
})();
