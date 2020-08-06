import { isDebug, noop } from './helpers';

const CATES = [
  'time',
  'timeEnd',
  'table',
  'log',
  'warn',
  'error',
  'info',
  'debug',
];
const PREFIX = '[ripple.run]';

function transform(cate = 'log', isTurnoff = true) {
  if (isTurnoff) {
    return noop;
  }
  if (!window.console || !window.console[cate]) {
    return noop;
  }
  return (...args) => {
    if (cate !== 'table') {
      if (cate === 'time' || cate === 'timeEnd') {
        args[0] = `${PREFIX} ${args[0]}`;
      } else {
        args.unshift(PREFIX);
      }
    }
    Function.prototype.call.call(console[cate], console, ...args);
  };
}

function init() {
  const isTurnoff = !isDebug();
  return CATES.reduce((ret, cate) => {
    ret[cate] = transform(cate, cate === 'error' ? false : isTurnoff);
    return ret;
  }, {});
}

export default init();
