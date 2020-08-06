import { isDebug } from './helpers';

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

function transform(cate = 'log') {
  return (...args) => {
    let isTurnoff = !isDebug();
    isTurnoff = cate === 'error' ? false : isTurnoff;
    if (isTurnoff) {
      return;
    }
    if (!window.console || !window.console[cate]) {
      return;
    }
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
  return CATES.reduce((ret, cate) => {
    ret[cate] = transform(cate);
    return ret;
  }, {});
}

export default init();
