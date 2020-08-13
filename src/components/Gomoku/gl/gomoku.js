import log from '../../../utils/log';
import { Board } from './board';

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
    log.log('gomoku gl run', this.boardEl);
    this.board = new Board(this.boardEl, this.options);
  }

  destroy() {
    log.log('gomoku gl destroy');
  }
}
