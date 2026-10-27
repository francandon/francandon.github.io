// francandon.com

// The old site was a single page with #research, #talks... views.
// Send those links to the new pages.
(function () {
  var map = { '#research': 'research.html', '#talks': 'talks.html', '#outreach': 'outreach.html', '#bio': 'cv.html', '#cv': 'cv.html', '#notes': 'index.html' };
  var onHome = /(^|\/)(index\.html)?$/.test(location.pathname);
  if (onHome && map[location.hash] && map[location.hash] !== 'index.html') location.replace(map[location.hash]);
})();

// Gentle fade-up as content scrolls into view. Anything already on screen
// when the page loads is left alone, so nothing flickers.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var selector = [
    'main h2', 'main section > p', 'main figure', 'main article', 'main ol > li',
    'main ul > li', 'main dl > div', 'main section > div > p', 'footer .wrap > *'
  ].join(',');
  var picked = [];
  var perParent = new Map();
  Array.prototype.forEach.call(document.querySelectorAll(selector), function (el) {
    if (el.closest('.hero')) return;
    for (var i = 0; i < picked.length; i++) { if (picked[i].contains(el)) return; }
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    picked.push(el);
    var n = perParent.get(el.parentElement) || 0;
    perParent.set(el.parentElement, n + 1);
    el.style.setProperty('--reveal-delay', Math.min(n, 3) * 90 + 'ms');
    el.classList.add('reveal');
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px', threshold: 0.12 });
  picked.forEach(function (el) { io.observe(el); });
})();

// Publication filters on the research page.
(function () {
  var list = document.getElementById('pub-list');
  var bar = document.getElementById('pub-filters');
  if (!list || !bar) return;
  var items = Array.prototype.slice.call(list.querySelectorAll('[data-kind]'));
  var chips = Array.prototype.slice.call(bar.querySelectorAll('[data-filter]'));
  var led = document.getElementById('led-toggle');
  var count = document.getElementById('pub-count');
  var kind = 'all';
  var ledOnly = false;
  function matches(el, k) {
    return (k === 'all' || el.getAttribute('data-kind') === k) && (!ledOnly || el.getAttribute('data-led') === 'true');
  }
  function update() {
    var shown = 0;
    items.forEach(function (el) {
      var ok = matches(el, kind);
      el.hidden = !ok;
      if (ok) shown++;
    });
    chips.forEach(function (c) {
      var k = c.getAttribute('data-filter');
      c.setAttribute('aria-pressed', String(k === kind));
      c.querySelector('.n').textContent = items.filter(function (el) { return matches(el, k); }).length;
    });
    led.setAttribute('aria-pressed', String(ledOnly));
    count.textContent = (document.documentElement.lang === 'es' ? 'Mostrando ' + shown + ' de ' : 'Showing ' + shown + ' of ') + items.length;
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () { kind = c.getAttribute('data-filter'); update(); });
  });
  led.addEventListener('click', function () { ledOnly = !ledOnly; update(); });
  bar.hidden = false;
  update();
})();
