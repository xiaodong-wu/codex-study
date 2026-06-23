/* code.js —— 代码块/提示词卡复制按钮 */
(function () {
  'use strict';

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // 兜底
    return new Promise((resolve, reject) => {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error('copy failed'));
      } catch (e) { reject(e); }
    });
  }

  function bind(btn, getText) {
    btn.addEventListener('click', () => {
      const text = getText();
      copyText(text).then(() => {
        const orig = btn.textContent;
        btn.classList.add('is-done');
        btn.textContent = '已复制';
        setTimeout(() => {
          btn.classList.remove('is-done');
          btn.textContent = orig;
        }, 1600);
      }).catch(() => {
        const orig = btn.textContent;
        btn.textContent = '复制失败';
        setTimeout(() => {
          btn.textContent = orig;
        }, 1600);
      });
    });
  }

  function init() {
    document.querySelectorAll('.code').forEach(block => {
      const btn = block.querySelector('.code__copy');
      const pre = block.querySelector('pre');
      if (!btn || !pre) return;
      bind(btn, () => pre.innerText);
    });
    document.querySelectorAll('.prompt-card').forEach(card => {
      const btn = card.querySelector('.prompt-card__copy');
      const body = card.querySelector('.prompt-card__body');
      if (!btn || !body) return;
      bind(btn, () => body.innerText.trim());
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
