export class Board {
  constructor(el, options) {
    this.el = el;
    this.options = options;
    this.ctx = this.el.getContext('2d');
    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    const el = this.el;
    const { bgColor, cellSize, cellNum, padding } = this.options;
    this.drawBg(ctx, el, bgColor);
    // 棋盘
    ctx.save();
    ctx.translate(padding + 0.5, padding + 0.5);
    const len = cellSize * cellNum;
    // 横线
    for (let i = 0; i <= cellNum; i++) {
      ctx.beginPath();
      const y = cellSize * i;
      ctx.moveTo(0, y);
      ctx.lineTo(len, y);
      ctx.stroke();
    }
    // 竖线
    for (let i = 0; i <= cellNum; i++) {
      ctx.beginPath();
      const x = cellSize * i;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, len);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawBg(ctx, el, bgColor) {
    // 背景
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, el.width, el.height);
    const centerX = Math.floor(el.width / 2);
    const centerY = Math.floor(el.height / 2);
    // 抛光
    const light = ctx.createRadialGradient(
      centerX,
      centerY,
      Math.floor(centerX / 4),
      centerX,
      centerY,
      Math.floor(centerX * Math.sqrt(2))
    );
    light.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    light.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, el.width, el.height);
    ctx.restore();
  }
}
