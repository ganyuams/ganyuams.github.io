(function () {
  'use strict';

  function setDone(el) {
    el.classList.add('done');
    el.textContent = '已复制 ✓';
    window.clearTimeout(el._timer);
    el._timer = window.setTimeout(function () {
      el.classList.remove('done');
      el.textContent = '复制链接';
    }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '-9999px';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    function handle(event) {
      event.preventDefault();
      event.stopPropagation();
      var text = btn.getAttribute('data-copy');
      copyText(text).then(function () {
        setDone(btn);
      }).catch(function () {
        btn.textContent = '请手动复制';
      });
    }
    btn.addEventListener('click', handle);
    btn.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        handle(event);
      }
    });
  });
})();
