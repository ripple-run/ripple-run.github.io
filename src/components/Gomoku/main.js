import { throttle } from '../../utils/helpers';
import log from '../../utils/log';

export class Main {
  constructor(el, options) {
    this.el = el;
    this.options = {
      cursorRatio: 0.5,
      ...options,
    };
    this.ctx = this.el.getContext('2d');
    this.init();
  }

  initData() {
    this.over = false;
    this.cursor = [];
    this.isBlack = true;
    const { cellNum } = this.options;
    const size = cellNum + 1;
    this.data = new Array(size).fill().map(() => {
      return new Array(size).fill();
    });
  }

  init() {
    this.initData();
    this.unbindEvent = this.bindEvent();
  }

  destroy() {
    log.log('underlying main destroy');
    this.unbindEvent();
  }

  bindEvent() {
    const mouseMoveHandler = throttle(this.mouseMove.bind(this), 50);
    const mouseClickHandler = throttle(this.mouseClick.bind(this), 50);
    this.el.addEventListener('mousemove', mouseMoveHandler, false);
    this.el.addEventListener('click', mouseClickHandler, false);
    return () => {
      log.log('remove event listener');
      this.el.removeEventListener('mousemove', mouseMoveHandler, false);
      this.el.removeEventListener('click', mouseClickHandler, false);
    };
  }

  getRelativePosition(e = {}) {
    const { left, top, width, height } = this.el.getBoundingClientRect();
    const { x: eX, y: eY, clientX, clientY } = e;
    let x = eX || clientX;
    let y = eY || clientY;
    x = x - left;
    y = y - top;
    return {
      x: Math.round((x * this.el.width) / width),
      y: Math.round((y * this.el.height) / height),
    };
  }

  calcDataIdx(x, y) {
    const { padding, cellNum, cellSize, cursorRatio } = this.options;
    const cursorPadding = Math.floor(cellSize * cursorRatio);
    const len = cellNum * cellSize;
    let idxX = -1;
    let idxY = -1;
    const min = Math.max(0, padding - cursorPadding);
    const max = Math.min(padding * 2 + len, padding + len + cursorPadding);
    if (x < min || x > max || y < min || y > max) {
      return { idxX, idxY };
    }
    function calc(xy) {
      const tmp = Math.max((xy - padding) / cellSize, 0);
      const ratio = tmp % 1;
      const ret = Math.floor(tmp);
      if (ratio >= 1 - cursorRatio) {
        return ret + 1;
      }
      if (ratio <= cursorRatio) {
        return ret;
      }
      return -1;
    }
    return {
      idxX: calc(x),
      idxY: calc(y),
    };
  }

  mouseMove(e) {
    if (this.over) {
      this.clearLastCursor();
      return;
    }
    const { x, y } = this.getRelativePosition(e);
    const { idxX, idxY } = this.calcDataIdx(x, y);
    log.log('mousemove', x, y, idxX, idxY);
    if (
      idxX === -1 ||
      idxY === -1 ||
      this.existsCursor(idxX, idxY) ||
      this.existsPiece(idxX, idxY)
    ) {
      return;
    }
    this.clearLastCursor();
    this.drawCursor(idxX, idxY);
    this.cursor = [idxX, idxY];
  }

  mouseClick(e) {
    if (this.over) {
      return;
    }
    const { x, y } = this.getRelativePosition(e);
    const { idxX, idxY } = this.calcDataIdx(x, y);
    log.log('mouseclick', x, y, idxX, idxY);
    if (idxX === -1 || idxY === -1 || this.existsPiece(idxX, idxY)) {
      return;
    }
    this.data[idxY][idxX] = this.isBlack;
    this.drawPiece(idxX, idxY);
    this.judge(idxX, idxY);
    this.isBlack = !this.isBlack;
  }

  existsPiece(idxX, idxY) {
    return typeof this.data[idxY][idxX] !== 'undefined';
  }

  existsCursor(idxX, idxY) {
    return (
      this.cursor.length && this.cursor[0] === idxX && this.cursor[1] === idxY
    );
  }

  clearPoint(x, y) {
    const ctx = this.ctx;
    const { cellSize, padding, cursorRatio } = this.options;
    ctx.save();
    ctx.translate(padding + 0.5 + x * cellSize, padding + 0.5 + y * cellSize);
    const cursorPadding = Math.floor(cellSize * cursorRatio);
    ctx.clearRect(
      -cursorPadding,
      -cursorPadding,
      cursorPadding * 2,
      cursorPadding * 2
    );
    ctx.restore();
  }

  clearLastCursor() {
    if (!this.cursor.length || this.existsPiece(...this.cursor)) {
      return;
    }
    this.clearPoint(...this.cursor);
  }

  drawCursor(x, y) {
    const ctx = this.ctx;
    const { cellSize, padding, cursorRatio } = this.options;
    ctx.save();
    ctx.translate(padding + 0.5 + x * cellSize, padding + 0.5 + y * cellSize);
    const cursorPadding = Math.floor(cellSize * cursorRatio);
    ctx.beginPath();
    const len = Math.floor((cursorPadding / Math.sqrt(2) / Math.sqrt(2)) * 0.8);
    ctx.moveTo(-len, -len);
    ctx.lineTo(len, len);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-len, len);
    ctx.lineTo(len, -len);
    ctx.stroke();
    ctx.restore();
  }

  drawPiece(x, y) {
    const ctx = this.ctx;
    const { cellSize, padding, cursorRatio } = this.options;
    ctx.save();
    ctx.translate(padding + 0.5 + x * cellSize, padding + 0.5 + y * cellSize);
    const cursorPadding = Math.floor(cellSize * cursorRatio);
    const len = Math.floor(cursorPadding / Math.sqrt(2));
    const piece = ctx.createRadialGradient(0, 0, 0, 0, 0, len);
    const isBlack = this.data[y][x];
    if (isBlack) {
      piece.addColorStop(0, '#636766');
      piece.addColorStop(1, '#0A0A0A');
    } else {
      piece.addColorStop(0, '#F9F9F9');
      piece.addColorStop(1, '#D1D1D1');
    }
    ctx.fillStyle = piece;
    ctx.beginPath();
    ctx.arc(0, 0, len, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  judgeX(x, y) {
    const data = this.data;
    const size = data.length;
    const cur = data[y][x];
    const ret = [];
    let pointer = x;
    let seeking = true;
    // 横向
    while (seeking) {
      if (data[y][pointer] === cur) {
        ret.push([pointer, y]);
        if (pointer <= x) {
          pointer = pointer - 1;
          if (pointer < 0) {
            pointer = x + 1;
          }
        } else {
          pointer = pointer + 1;
          if (pointer >= size) {
            seeking = false;
          }
        }
      } else {
        if (pointer < x) {
          pointer = x + 1;
        } else {
          seeking = false;
        }
      }
    }
    return ret;
  }

  judgeY(x, y) {
    const data = this.data;
    const size = data.length;
    const cur = data[y][x];
    const ret = [];
    let pointer = y;
    let seeking = true;
    // 纵向
    while (seeking) {
      if (data[pointer] && data[pointer][x] === cur) {
        ret.push([x, pointer]);
        if (pointer <= y) {
          pointer = pointer - 1;
          if (pointer < 0) {
            pointer = y + 1;
          }
        } else {
          pointer = pointer + 1;
          if (pointer >= size) {
            seeking = false;
          }
        }
      } else {
        if (pointer < y) {
          pointer = y + 1;
        } else {
          seeking = false;
        }
      }
    }
    return ret;
  }

  judgeXY(x, y) {
    const data = this.data;
    const size = data.length;
    const cur = data[y][x];
    const ret = [];
    let pointer = [x, y];
    let seeking = true;
    // 左上-右下
    while (seeking) {
      if (data[pointer[1]] && data[pointer[1]][pointer[0]] === cur) {
        ret.push(pointer);
        if (pointer[1] <= y) {
          pointer = [pointer[0] - 1, pointer[1] - 1];
          if (pointer[0] < 0 || pointer[1] < 0) {
            pointer = [x + 1, y + 1];
          }
        } else {
          pointer = [pointer[0] + 1, pointer[1] + 1];
          if (pointer[0] >= size || pointer[1] >= size) {
            seeking = false;
          }
        }
      } else {
        if (pointer[1] < y) {
          pointer = [x + 1, y + 1];
        } else {
          seeking = false;
        }
      }
    }
    return ret;
  }

  judgeYX(x, y) {
    const data = this.data;
    const size = data.length;
    const cur = data[y][x];
    const ret = [];
    let pointer = [x, y];
    let seeking = true;
    // 右上-左下
    while (seeking) {
      if (data[pointer[1]] && data[pointer[1]][pointer[0]] === cur) {
        ret.push(pointer);
        if (pointer[1] <= y) {
          pointer = [pointer[0] + 1, pointer[1] - 1];
          if (pointer[0] >= size || pointer[1] < 0) {
            pointer = [x - 1, y + 1];
          }
        } else {
          pointer = [pointer[0] - 1, pointer[1] + 1];
          if (pointer[0] < 0 || pointer[1] >= size) {
            seeking = false;
          }
        }
      } else {
        if (pointer[1] < y) {
          pointer = [x - 1, y + 1];
        } else {
          seeking = false;
        }
      }
    }
    return ret;
  }

  judge(x, y) {
    const steps = ['judgeX', 'judgeY', 'judgeXY', 'judgeYX'];
    let ret = [];
    for (let i = 0; i < steps.length; i++) {
      ret = this[steps[i]].call(this, x, y);
      if (ret.length >= 5) {
        this.over = true;
        this.highlightResult(ret);
        this.alert();
        break;
      }
    }
  }

  highlightResult(ret) {
    let start = null;
    let clear = false;
    const blink = (timestamp) => {
      start = start || timestamp;
      if (timestamp - start > 200) {
        clear = !clear;
        ret.forEach((args) => {
          this[clear ? 'clearPoint' : 'drawPiece'](...args);
        });
        start = timestamp;
      }
      this.frameId = requestAnimationFrame(blink);
    };
    blink();
  }

  alert() {
    const msg = `${this.isBlack ? 'black' : 'white'} win`;
    setTimeout(() => {
      cancelAnimationFrame(this.frameId);
      alert(msg);
      this.restart();
    }, 200 * 6 + 100);
  }

  restart() {
    this.initData();
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
  }
}
