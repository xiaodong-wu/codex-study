/* toc.js —— 右侧 H2/H3 自动目录 + 滚动跟随高亮 */
(function () {
  'use strict';

  function build() {
    const slot = document.getElementById('toc-list');
    const content = document.querySelector('.prose');
    if (!slot || !content) return;
    const headings = content.querySelectorAll('h2[id], h3[id]');
    if (!headings.length) {
      const toc = document.querySelector('.toc');
      if (toc) toc.style.display = 'none';
      return;
    }
    const frag = document.createDocumentFragment();
    headings.forEach(h => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.replace(/^[▸\s]+/, '').trim();
      if (h.tagName === 'H3') li.classList.add('toc-h3');
      li.appendChild(a);
      frag.appendChild(li);
    });
    slot.appendChild(frag);

    // IntersectionObserver: 高亮当前可视小节
    const links = slot.querySelectorAll('a');
    const map = new Map();
    links.forEach(a => map.set(a.getAttribute('href').slice(1), a));
    const visible = new Set();

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      });
      // 取最靠上的一个
      let pick = null;
      let pickTop = Infinity;
      visible.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top < pickTop && top > -100) { pickTop = top; pick = id; }
      });
      // 退化:若 visible 为空,按 scrollY 找最近上方的
      if (!pick) {
        let best = null;
        let bestDist = -Infinity;
        headings.forEach(h => {
          const top = h.getBoundingClientRect().top;
          if (top <= 80 && top > bestDist) { bestDist = top; best = h.id; }
        });
        pick = best;
      }
      map.forEach((a, id) => a.classList.toggle('is-active', id === pick));
    }, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: [0, 1]
    });
    headings.forEach(h => io.observe(h));
  }

  document.addEventListener('DOMContentLoaded', build);
})();
