export function isPro() {
  return process.env && process.env.NODE_ENV === 'production';
}

export function noop() {}

export function getUrlParam(name) {
  const reg = new RegExp('(?:^|&)' + name + '=([^&]*)(?:&|$)');
  const search = window.location.search || '';
  const ret = search.substr(1).match(reg);
  if (!ret) {
    return '';
  }
  return decodeURIComponent(ret[1]);
}

export function isDebug() {
  return getUrlParam('__debug__') || !isPro();
}

export function debounce(fn, time = 500) {
  let timer = null;
  return function debounced(...args) {
    const ctx = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(ctx, args);
    }, time);
  };
}

export function throttle(fn, time = 500) {
  let timer = null;
  let first = true;
  return function throttled(...args) {
    const ctx = this;
    if (first) {
      first = false;
      fn.apply(ctx, args);
      return;
    }
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      fn.apply(ctx, args);
    }, time);
  };
}
