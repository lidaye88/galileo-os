/* ============================================
 * Galileo OS · 全站动效库
 * 入场动画 / hover 增强 / 数字滚动 / 视差 / 涟漪
 *
 * 用法：页面引入 <script src="animate.js"></script>
 *      元素加 data-animate 属性即可自动入场
 * ============================================ */
(function () {
  'use strict';

  // ---------- 1. 滚动入场动画 ----------
  // 元素加 data-animate="fade-up|fade-in|slide-left|slide-right|scale"
  // 可加 data-animate-delay="100|200|300" 控制错落
  // 可加 data-animate-duration="600" 控制时长
  var ANIM_ATTR = 'data-animate';
  var animated = new Set();

  function initScrollAnimations() {
    var elements = document.querySelectorAll('[' + ANIM_ATTR + ']');

    // 先给所有待动画元素加 hidden 类
    elements.forEach(function (el) {
      var type = el.getAttribute(ANIM_ATTR);
      el.classList.add('anim-init', 'anim-' + type);
      var delay = el.getAttribute('data-animate-delay');
      var duration = el.getAttribute('data-animate-duration');
      if (delay) el.style.transitionDelay = delay + 'ms';
      if (duration) el.style.transitionDuration = duration + 'ms';
    });

    function checkInView() {
      var viewportH = window.innerHeight;
      var trigger = viewportH * 0.88; // 提前 12% 触发

      elements.forEach(function (el) {
        if (animated.has(el)) return;
        var rect = el.getBoundingClientRect();
        if (rect.top < trigger && rect.bottom > 0) {
          requestAnimationFrame(function () {
            el.classList.remove('anim-init');
            el.classList.add('anim-play');
            animated.add(el);
          });
        }
      });
    }

    window.addEventListener('scroll', checkInView, { passive: true });
    window.addEventListener('resize', checkInView, { passive: true });
    checkInView();
  }

  // ---------- 2. 列表错落入场（stagger） ----------
  // 容器加 data-stagger，子元素自动按顺序入场
  function initStagger() {
    var containers = document.querySelectorAll('[data-stagger]');
    containers.forEach(function (container) {
      var children = Array.from(container.children);
      var baseDelay = parseInt(container.getAttribute('data-stagger')) || 80;

      children.forEach(function (child, i) {
        child.classList.add('anim-init', 'anim-fade-up');
        child.style.transitionDelay = (i * baseDelay) + 'ms';
      });

      function checkInView() {
        var rect = container.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
          children.forEach(function (child) {
            child.classList.remove('anim-init');
            child.classList.add('anim-play');
          });
          window.removeEventListener('scroll', onScroll);
        }
      }
      function onScroll() { checkInView(); }
      window.addEventListener('scroll', onScroll, { passive: true });
      checkInView();
    });
  }

  // ---------- 3. 数字滚动计数 ----------
  // 元素加 data-count-to="94" data-count-suffix="%"
  function initCounters() {
    var counters = document.querySelectorAll('[data-count-to]');
    var counted = new Set();

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      if (isNaN(target)) return;
      var suffix = el.getAttribute('data-count-suffix') || '';
      var prefix = el.getAttribute('data-count-prefix') || '';
      var decimals = (el.getAttribute('data-count-decimals') || '0') | 0;
      var duration = 1500;
      var start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = target * eased;
        el.textContent = prefix + current.toFixed(decimals) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + target.toFixed(decimals) + suffix;
        }
      }
      requestAnimationFrame(step);
    }

    function checkInView() {
      counters.forEach(function (el) {
        if (counted.has(el)) return;
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
          animateCounter(el);
          counted.add(el);
        }
      });
    }

    window.addEventListener('scroll', checkInView, { passive: true });
    checkInView();
  }

  // ---------- 4. 按钮涟漪（ripple） ----------
  function initRipple() {
    var buttons = document.querySelectorAll('.btn, .arrow-link, .overview-card, .role-card');
    buttons.forEach(function (btn) {
      btn.style.position = btn.style.position || 'relative';
      btn.style.overflow = btn.style.overflow || 'hidden';

      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        var size = Math.max(rect.width, rect.height);
        ripple.className = 'ripple-effect';
        ripple.style.cssText =
          'position:absolute;border-radius:50%;pointer-events:none;' +
          'background:rgba(0,217,163,0.3);' +
          'width:' + size + 'px;height:' + size + 'px;' +
          'left:' + (e.clientX - rect.left - size / 2) + 'px;' +
          'top:' + (e.clientY - rect.top - size / 2) + 'px;' +
          'transform:scale(0);opacity:0.6;' +
          'animation:rippleAnim 0.6s ease-out forwards;';
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 600);
      });
    });
  }

  // ---------- 5. Hero 视差（轻微移动） ----------
  function initParallax() {
    var heroes = document.querySelectorAll('.hero-grid-bg');
    heroes.forEach(function (hero) {
      window.addEventListener('scroll', function () {
        var scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          hero.style.transform = 'translateY(' + scrolled * 0.15 + 'px)';
        }
      }, { passive: true });
    });
  }

  // ---------- 6. 架构图节点脉冲 ----------
  function initNodePulse() {
    var nodes = document.querySelectorAll('.arch-node, .flow-node');
    nodes.forEach(function (node, i) {
      // 鼠标悬停时增强
      node.addEventListener('mouseenter', function () {
        node.style.transform = 'translateY(-2px) scale(1.05)';
      });
      node.addEventListener('mouseleave', function () {
        node.style.transform = '';
      });
    });
  }

  // ---------- 7. 卡片光泽划过（hover 时） ----------
  function initCardShine() {
    var cards = document.querySelectorAll('.card, .overview-card, .card-dark');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--shine-x', x + '%');
        card.style.setProperty('--shine-y', y + '%');
      });
    });
  }

  // ---------- 8. 导航栏滚动收起（移动端） ----------
  function initNavHide() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var lastScroll = 0;
    var threshold = 100;

    window.addEventListener('scroll', function () {
      var current = window.scrollY;
      // 只在小屏生效
      if (window.innerWidth > 768) return;

      if (current > threshold && current > lastScroll) {
        // 向下滚动 - 隐藏
        nav.style.transform = 'translateY(-100%)';
      } else {
        // 向上滚动 - 显示
        nav.style.transform = '';
      }
      lastScroll = current;
    }, { passive: true });
  }

  // ---------- 9. 初始化所有动效 ----------
  function init() {
    // 加载完毕先等一帧
    requestAnimationFrame(function () {
      initScrollAnimations();
      initStagger();
      initCounters();
      initRipple();
      initParallax();
      initNodePulse();
      initCardShine();
      initNavHide();
    });
  }

  // 自动给关键区块加 data-animate（无需手动改 HTML）
  function autoAddAnimations() {
    // section-head 自动 fade-up
    document.querySelectorAll('.section-head').forEach(function (el) {
      if (!el.hasAttribute(ANIM_ATTR)) el.setAttribute(ANIM_ATTR, 'fade-up');
    });
    // 卡片网格容器自动 stagger
    document.querySelectorAll('.grid').forEach(function (grid) {
      if (!grid.hasAttribute('data-stagger') && grid.children.length > 1) {
        grid.setAttribute('data-stagger', '60');
      }
    });
    // steps 自动 fade-up
    document.querySelectorAll('.step, .engine-card, .arch-layer, .metric, .tech-stat').forEach(function (el) {
      if (!el.hasAttribute(ANIM_ATTR)) el.setAttribute(ANIM_ATTR, 'fade-up');
    });
    // hero-stats 数字
    document.querySelectorAll('.hero-stat .num, .stats-light .num, .tech-stat .ts-num').forEach(function (el) {
      el.classList.add('count-glow');
    });
    // case-metric 数字
    document.querySelectorAll('.case-metric .cm-num').forEach(function (el) {
      el.classList.add('count-glow');
    });
    // eyebrow 装饰
    document.querySelectorAll('.eyebrow').forEach(function (el) {
      if (!el.hasAttribute(ANIM_ATTR)) el.setAttribute(ANIM_ATTR, 'fade-in');
    });
  }

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      autoAddAnimations();
      init();
    });
  } else {
    autoAddAnimations();
    init();
  }

  // 暴露 API（供详情页动态渲染后重新初始化）
  window.GalileoAnimate = {
    init: init,
    autoAddAnimations: autoAddAnimations,
    refresh: function () {
      animated.clear();
      autoAddAnimations();
      init();
    }
  };
})();
