/* ==========================================================================
   SNAKE.EXE - CLASSIC RETRO NOKIA SNAKE GAME (HTML5 CANVAS)
   Supports Arrow Keys, WASD, Score Tracking, High Score, Sound FX
   ========================================================================== */

import { SoundFX } from '../sound-fx.js';

export class SnakeGame {
  constructor(canvas, scoreEl, highScoreEl, statusEl) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scoreEl = scoreEl;
    this.highScoreEl = highScoreEl;
    this.statusEl = statusEl;

    this.gridSize = 16;
    this.tileCount = 20; // 320x320 canvas standard
    this.snake = [];
    this.food = { x: 10, y: 10 };
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.score = 0;
    this.highScore = 0;
    this.gameLoopId = null;
    this.isRunning = false;
    this.isPaused = false;
    this.speed = 100;

    this.initHighScore();
    this.bindControls();
  }

  initHighScore() {
    try {
      this.highScore = parseInt(localStorage.getItem('retro_snake_high') || '0', 10);
      if (this.highScoreEl) this.highScoreEl.textContent = this.highScore;
    } catch {
      this.highScore = 0;
    }
  }

  bindControls() {
    window.addEventListener('keydown', (e) => {
      // Only control if canvas is visible on screen
      if (!this.canvas.offsetParent) return;

      const key = e.key.toLowerCase();
      if (['arrowup', 'w'].includes(key) && this.dir.y === 0) {
        this.nextDir = { x: 0, y: -1 };
        e.preventDefault();
      } else if (['arrowdown', 's'].includes(key) && this.dir.y === 0) {
        this.nextDir = { x: 0, y: 1 };
        e.preventDefault();
      } else if (['arrowleft', 'a'].includes(key) && this.dir.x === 0) {
        this.nextDir = { x: -1, y: 0 };
        e.preventDefault();
      } else if (['arrowright', 'd'].includes(key) && this.dir.x === 0) {
        this.nextDir = { x: 1, y: 0 };
        e.preventDefault();
      } else if (key === ' ' || key === 'enter') {
        if (!this.isRunning) {
          this.start();
          e.preventDefault();
        } else {
          this.togglePause();
          e.preventDefault();
        }
      }
    });
  }

  start() {
    this.snake = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 }
    ];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.score = 0;
    this.isRunning = true;
    this.isPaused = false;
    this.speed = 100;
    this.spawnFood();

    if (this.scoreEl) this.scoreEl.textContent = '0';
    if (this.statusEl) this.statusEl.textContent = 'JUGANDO';

    if (this.gameLoopId) clearInterval(this.gameLoopId);
    this.gameLoopId = setInterval(() => this.update(), this.speed);
  }

  togglePause() {
    if (!this.isRunning) return;
    this.isPaused = !this.isPaused;
    if (this.statusEl) {
      this.statusEl.textContent = this.isPaused ? 'PAUSA (ESPACIO)' : 'JUGANDO';
    }
  }

  stop() {
    if (this.gameLoopId) {
      clearInterval(this.gameLoopId);
      this.gameLoopId = null;
    }
    this.isRunning = false;
    this.isPaused = false;
    if (this.statusEl) this.statusEl.textContent = 'FIN DE JUEGO (ESPACIO REINICIA)';
    this.draw();
  }

  spawnFood() {
    let valid = false;
    while (!valid) {
      this.food = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount)
      };
      valid = !this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y);
    }
  }

  update() {
    if (!this.isRunning || this.isPaused) return;

    this.dir = { ...this.nextDir };
    const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
      SoundFX.playGameOver();
      this.stop();
      return;
    }

    // Self collision
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      SoundFX.playGameOver();
      this.stop();
      return;
    }

    this.snake.unshift(head);

    // Food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      SoundFX.playScore();
      if (this.scoreEl) this.scoreEl.textContent = this.score;

      if (this.score > this.highScore) {
        this.highScore = this.score;
        if (this.highScoreEl) this.highScoreEl.textContent = this.highScore;
        try {
          localStorage.setItem('retro_snake_high', this.highScore.toString());
        } catch {}
      }

      this.spawnFood();
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  draw() {
    // Vintage Green LCD display
    this.ctx.fillStyle = '#9bbc0f';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Grid pattern
    this.ctx.strokeStyle = '#8bac0f';
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i < this.canvas.width; i += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvas.width, i);
      this.ctx.stroke();
    }

    // Draw Food (Pixel apple)
    this.ctx.fillStyle = '#0f380f';
    this.ctx.fillRect(
      this.food.x * this.gridSize + 2,
      this.food.y * this.gridSize + 2,
      this.gridSize - 4,
      this.gridSize - 4
    );

    // Draw Snake
    this.snake.forEach((seg, idx) => {
      this.ctx.fillStyle = idx === 0 ? '#0f380f' : '#306230';
      this.ctx.fillRect(
        seg.x * this.gridSize + 1,
        seg.y * this.gridSize + 1,
        this.gridSize - 2,
        this.gridSize - 2
      );
    });

    // Start prompt if idle
    if (!this.isRunning) {
      this.ctx.fillStyle = 'rgba(15, 56, 15, 0.85)';
      this.ctx.fillRect(20, 110, this.canvas.width - 40, 90);
      this.ctx.strokeStyle = '#0f380f';
      this.ctx.strokeRect(20, 110, this.canvas.width - 40, 90);

      this.ctx.fillStyle = '#9bbc0f';
      this.ctx.font = '14px "Silkscreen", "Courier New", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('SNAKE.EXE v1.0', this.canvas.width / 2, 140);
      this.ctx.fillText('ESPACIO / ENTER INICIA', this.canvas.width / 2, 165);
      this.ctx.font = '10px "Courier New", monospace';
      this.ctx.fillText('CONTROLES: FLECHAS O WASD', this.canvas.width / 2, 185);
    }
  }
}
