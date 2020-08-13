import { Board } from './board';
import { Main } from './main';
import log from '../../../utils/log';

export class Gomoku {
  constructor({ boardEl, mainEl, ...options } = {}) {
    if (!boardEl || !mainEl) {
      throw new Error('options boardEl or mainEl is required');
    }
    this.boardEl = boardEl;
    this.mainEl = mainEl;
    const { cellSize = 50, cellNum = 20, padding = 50, ...other } = options;
    const size = padding * 2 + cellSize * cellNum;
    this.options = {
      cellSize,
      cellNum,
      padding,
      ...other,
    };
    this.boardEl.width = size;
    this.boardEl.height = size;
    this.mainEl.width = size;
    this.mainEl.height = size;
  }

  run() {
    log.log('gomoku run');
    this.board = new Board(this.boardEl, this.options);
    this.main = new Main(this.mainEl, this.options);
  }

  destroy() {
    log.log('gomoku destroy');
    this.main && this.main.destroy();
  }
}
