/* ==========================================================================
   FOOTBALL.EXE - RETRO 8-BIT ARCADE SOCCER (GAME BOY / NES STYLE)
   - Solid Body Collisions: Player vs Player & Player vs Ball (Zero Glitch/Pass-Through)
   - Realistic Vector Ball Physics: Progressive Grass Friction & Boundary Bounces
   - Charged Kick System with Spacebar & Pixel Art Power Meter
   - Balanced Speeds (Player: 2.6, CPU: 2.6)
   - 4-State Finite State Machine AI: DEFEND, CHASE, ATTACK, SHOOT
   - Knockback & Separation on Player-Player Collision
   ========================================================================== */

import { SoundFX } from '../sound-fx.js';

// 8x8 Soccer Ball Pixel Sprite Map
const BALL_SPRITE = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 2, 2, 1, 2, 1, 0],
  [1, 2, 1, 2, 2, 1, 2, 1],
  [1, 2, 2, 1, 1, 2, 3, 1],
  [1, 3, 1, 2, 2, 1, 3, 1],
  [1, 3, 2, 1, 1, 2, 3, 1],
  [0, 1, 3, 3, 1, 3, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0]
];

// 12x14 Retro Player Pixel Sprite Frames
const PLAYER_SPRITE_FRAME_1 = [
  [0, 0, 0, 7, 7, 7, 7, 7, 7, 0, 0, 0],
  [0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 1, 2, 1, 2, 2, 1, 2, 1, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 1, 3, 3, 4, 4, 4, 4, 3, 3, 1, 0],
  [1, 2, 3, 3, 3, 4, 4, 3, 3, 3, 2, 1],
  [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
  [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0],
  [0, 0, 1, 5, 5, 5, 5, 5, 5, 1, 0, 0],
  [0, 0, 1, 5, 5, 1, 1, 5, 5, 1, 0, 0],
  [0, 0, 1, 2, 2, 0, 0, 2, 2, 1, 0, 0],
  [0, 0, 1, 6, 6, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 6, 6, 1, 0, 0, 0, 0, 0, 0]
];

const PLAYER_SPRITE_FRAME_2 = [
  [0, 0, 0, 7, 7, 7, 7, 7, 7, 0, 0, 0],
  [0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 1, 2, 1, 2, 2, 1, 2, 1, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 1, 3, 3, 4, 4, 4, 4, 3, 3, 1, 0],
  [1, 2, 3, 3, 3, 4, 4, 3, 3, 3, 2, 1],
  [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
  [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0],
  [0, 0, 1, 5, 5, 5, 5, 5, 5, 1, 0, 0],
  [0, 0, 1, 5, 5, 1, 1, 5, 5, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 6, 6, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 6, 6, 1, 0, 0]
];

// Palette definitions
const PALETTE_BLUE = {
  1: '#04100c',
  2: '#fbd38d',
  3: '#2563eb',
  4: '#93c5fd',
  5: '#ffffff',
  6: '#1e293b',
  7: '#172554'
};

const PALETTE_RED = {
  1: '#04100c',
  2: '#fbd38d',
  3: '#dc2626',
  4: '#fca5a5',
  5: '#ffffff',
  6: '#1e293b',
  7: '#450a0a'
};

const PALETTE_BALL = {
  1: '#000000',
  2: '#ffffff',
  3: '#94a3b8'
};

export class FootballGame {
  constructor(canvas, scoreEl, timerEl, statusEl) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.scoreEl = scoreEl;
    this.timerEl = timerEl;
    this.statusEl = statusEl;

    this.pixelScale = 2;

    // Pitch Dimensions
    this.pitchLeft = 32;
    this.pitchRight = 368;
    this.pitchTop = 24;
    this.pitchBottom = 256;
    this.goalTop = 105;
    this.goalBottom = 175;

    // Base speed balanced equally for player and AI
    const BASE_SPEED = 2.6;

    this.player = {
      x: 172,
      y: 126,
      w: 24,
      h: 28,
      radius: 11,
      speed: BASE_SPEED,
      vx: 0,
      vy: 0,
      facing: { x: 1, y: 0 },
      isMoving: false,
      animFrame: 0,
      animTick: 0,
      kickCooldown: 0,
      isCharging: false,
      chargePower: 0,
      maxCharge: 40 // ~0.65s at 60fps for full power
    };

    this.ai = {
      x: 290,
      y: 126,
      w: 24,
      h: 28,
      radius: 11,
      speed: BASE_SPEED,
      vx: 0,
      vy: 0,
      facing: { x: -1, y: 0 },
      isMoving: false,
      animFrame: 0,
      animTick: 0,
      kickCooldown: 0,
      state: 'DEFEND', // DEFEND, CHASE, ATTACK, SHOOT
      stateTimer: 0
    };

    this.ball = {
      x: 192,
      y: 132,
      w: 16,
      h: 16,
      radius: 8,
      vx: 0,
      vy: 0,
      friction: 0.965,
      maxSpeed: 8.5
    };

    this.keys = {};
    this.playerScore = 0;
    this.aiScore = 0;
    this.matchTime = 60;
    this.isRunning = false;
    this.isPaused = false;
    this.isGoalPause = false;
    this.possession = 'player';
    this.hasKickedOff = false;
    this.goalBanner = null;
    this.animId = null;
    this.timerInterval = null;
    this.lastHitSoundTime = 0;

    this.bindControls();
    this.bindMobileControls();
  }

  bindControls() {
    const gameKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd', 'k', 'j', 'z', 'p', 'enter'];

    window.addEventListener('keydown', (e) => {
      if (!this.canvas.offsetParent) return;
      const k = e.key.toLowerCase();

      if (gameKeys.includes(k)) {
        e.preventDefault(); // Stop page scrolling
      }

      // Spacebar: Start / Charge Shot
      if (k === ' ' || e.code === 'Space') {
        if (!this.isRunning) {
          this.start();
          return;
        }
        if (this.isPaused) {
          this.togglePause();
          return;
        }
        if (!this.isGoalPause && !this.player.isCharging) {
          this.player.isCharging = true;
          this.player.chargePower = 0;
        }
      } else if (k === 'p') {
        if (this.isRunning) this.togglePause();
      } else if (['k', 'j', 'z', 'enter'].includes(k)) {
        if (this.isRunning && !this.isPaused && !this.isGoalPause) {
          if (!this.hasKickedOff && this.possession === 'player') {
            this.hasKickedOff = true;
          }
          this.executeKick(this.player, 5.5);
        }
      }

      this.keys[k] = true;
    });

    window.addEventListener('keyup', (e) => {
      if (!this.canvas.offsetParent) return;
      const k = e.key.toLowerCase();
      if (gameKeys.includes(k)) {
        e.preventDefault();
      }
      this.keys[k] = false;

      // Spacebar release -> Execute charged shot!
      if (k === ' ' || e.code === 'Space') {
        if (this.isRunning && !this.isPaused && !this.isGoalPause && this.player.isCharging) {
          this.releaseChargedShot();
        }
        this.player.isCharging = false;
        this.player.chargePower = 0;
      }
    });

    // Pointer controls
    this.canvas.addEventListener('pointerdown', () => {
      if (!this.isRunning) {
        this.start();
      } else if (!this.isPaused && !this.isGoalPause) {
        this.player.isCharging = true;
        this.player.chargePower = 0;
      }
    });

    this.canvas.addEventListener('pointerup', () => {
      if (this.isRunning && !this.isPaused && !this.isGoalPause && this.player.isCharging) {
        this.releaseChargedShot();
      }
      this.player.isCharging = false;
      this.player.chargePower = 0;
    });
  }

  /** Mobile D-pad + KICK/SHOOT touch button wiring */
  bindMobileControls() {
    const touchControls = document.getElementById('football-touch-controls');
    if (!touchControls) return;

    // D-pad: simulate keydown/keyup
    const dpadBtns = touchControls.querySelectorAll('.dpad-btn');
    dpadBtns.forEach(btn => {
      const key = btn.dataset.key; // e.g. 'arrowup'

      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        btn.classList.add('pressed');
        this.keys[key] = true;
        // Start game on first touch if not running
        if (!this.isRunning) { this.start(); }
        // Kick off if player has possession and hasn't moved yet
        if (!this.hasKickedOff && this.possession === 'player') {
          this.hasKickedOff = true;
          if (this.statusEl) this.statusEl.textContent = 'PARTIDO EN CURSO';
        }
      });

      const release = () => {
        btn.classList.remove('pressed');
        this.keys[key] = false;
      };
      btn.addEventListener('pointerup',    release);
      btn.addEventListener('pointercancel', release);
      btn.addEventListener('pointerleave', release);
    });

    // KICK button: instant kick
    const kickBtn = document.getElementById('football-kick-btn');
    if (kickBtn) {
      kickBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (!this.isRunning) { this.start(); return; }
        if (!this.isPaused && !this.isGoalPause) {
          if (!this.hasKickedOff && this.possession === 'player') {
            this.hasKickedOff = true;
            if (this.statusEl) this.statusEl.textContent = 'PARTIDO EN CURSO';
          }
          this.executeKick(this.player, 5.5);
        }
      });
    }

    // SHOOT button: charge shot — hold to charge, release to fire
    const shootBtn = document.getElementById('football-shoot-btn');
    if (shootBtn) {
      shootBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (!this.isRunning) { this.start(); return; }
        if (!this.isPaused && !this.isGoalPause && !this.player.isCharging) {
          this.player.isCharging = true;
          this.player.chargePower = 0;
        }
      });
      const shootRelease = () => {
        if (this.isRunning && !this.isPaused && !this.isGoalPause && this.player.isCharging) {
          this.releaseChargedShot();
        }
        this.player.isCharging = false;
        this.player.chargePower = 0;
      };
      shootBtn.addEventListener('pointerup',    shootRelease);
      shootBtn.addEventListener('pointercancel', shootRelease);
      shootBtn.addEventListener('pointerleave', shootRelease);
    }
  }

  releaseChargedShot() {
    if (!this.hasKickedOff && this.possession === 'player') {
      this.hasKickedOff = true;
      if (this.statusEl) this.statusEl.textContent = 'PARTIDO EN CURSO';
    }

    const ratio = Math.min(1, this.player.chargePower / this.player.maxCharge);
    // Base 4.2 + up to 4.3 extra power => 4.2 to 8.5
    const power = 4.2 + ratio * 4.3;
    this.executeKick(this.player, power);
  }

  executeKick(sprite, power) {
    if (sprite.kickCooldown > 0) return;

    const sCenter = { x: sprite.x + sprite.w / 2, y: sprite.y + sprite.h / 2 };
    const bCenter = { x: this.ball.x + this.ball.w / 2, y: this.ball.y + this.ball.h / 2 };

    const dx = bCenter.x - sCenter.x;
    const dy = bCenter.y - sCenter.y;
    const dist = Math.hypot(dx, dy);

    // Kicking reach: player radius + ball radius + 12px reach margin
    if (dist <= sprite.radius + this.ball.radius + 14) {
      let dirX = sprite.facing.x;
      let dirY = sprite.facing.y;

      // If stationary or looking away, shoot along the vector to ball
      if (dist > 1) {
        const toBallX = dx / dist;
        const toBallY = dy / dist;
        // Blend facing direction and vector to ball
        dirX = dirX * 0.4 + toBallX * 0.6;
        dirY = dirY * 0.4 + toBallY * 0.6;
      }

      if (dirX === 0 && dirY === 0) dirX = (sprite === this.player ? 1 : -1);

      const len = Math.hypot(dirX, dirY) || 1;
      this.ball.vx = (dirX / len) * power;
      this.ball.vy = (dirY / len) * power;

      sprite.kickCooldown = 16;
      this.playHitSound();
    }
  }

  start() {
    this.playerScore = 0;
    this.aiScore = 0;
    this.matchTime = 60;
    this.isRunning = true;
    this.isPaused = false;
    this.isGoalPause = false;
    this.goalBanner = null;
    this.resetPositions('player');
    this.updateScoreUI();

    const pauseBtn = document.getElementById('football-pause-btn');
    if (pauseBtn) pauseBtn.textContent = '⏸ Pausar';

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.matchTime > 0 && !this.isGoalPause && !this.isPaused) {
        this.matchTime--;
        if (this.timerEl) this.timerEl.textContent = `${this.matchTime}s`;
      } else if (this.matchTime <= 0) {
        this.endMatch();
      }
    }, 1000);

    if (this.statusEl) this.statusEl.textContent = 'SAQUE DE CENTRO (TU TURNO)';

    if (this.animId) cancelAnimationFrame(this.animId);
    this.loop();
  }

  togglePause() {
    if (!this.isRunning) return;
    this.isPaused = !this.isPaused;
    SoundFX.playClick();

    const pauseBtn = document.getElementById('football-pause-btn');
    if (pauseBtn) {
      pauseBtn.textContent = this.isPaused ? '▶ Reanudar' : '⏸ Pausar';
    }

    if (this.statusEl) {
      this.statusEl.textContent = this.isPaused ? 'PAUSA (ESPACIO O BOTÓN PARA REANUDAR)' : 'PARTIDO EN CURSO';
    }
    this.draw();
  }

  endMatch() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.animId) cancelAnimationFrame(this.animId);

    const pauseBtn = document.getElementById('football-pause-btn');
    if (pauseBtn) pauseBtn.textContent = '⏸ Pausar';

    let result = 'EMPATE';
    if (this.playerScore > this.aiScore) result = '¡VICTORIA JUGADOR AZUL!';
    else if (this.aiScore > this.playerScore) result = 'VICTORIA CPU ROJO';

    if (this.statusEl) this.statusEl.textContent = `FINAL: ${result} (INICIAR PARA REPETIR)`;
    this.draw();
  }

  resetPositions(possession = 'player') {
    this.possession = possession;
    this.hasKickedOff = false;

    this.player.isCharging = false;
    this.player.chargePower = 0;
    this.player.kickCooldown = 0;
    this.ai.kickCooldown = 0;

    if (possession === 'player') {
      this.player.x = 172;
      this.player.y = 126;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.facing = { x: 1, y: 0 };
      this.player.isMoving = false;

      this.ball.x = 192;
      this.ball.y = 132;
      this.ball.vx = 0;
      this.ball.vy = 0;

      this.ai.x = 290;
      this.ai.y = 126;
      this.ai.vx = 0;
      this.ai.vy = 0;
      this.ai.facing = { x: -1, y: 0 };
      this.ai.isMoving = false;
      this.ai.state = 'DEFEND';
    } else {
      this.ai.x = 204;
      this.ai.y = 126;
      this.ai.vx = 0;
      this.ai.vy = 0;
      this.ai.facing = { x: -1, y: 0 };
      this.ai.isMoving = false;
      this.ai.state = 'ATTACK';

      this.ball.x = 192;
      this.ball.y = 132;
      this.ball.vx = 0;
      this.ball.vy = 0;

      this.player.x = 90;
      this.player.y = 126;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.facing = { x: 1, y: 0 };
      this.player.isMoving = false;

      setTimeout(() => {
        if (this.isRunning && !this.hasKickedOff && this.possession === 'ai') {
          this.ball.vx = -3.2;
          this.ball.vy = (Math.random() - 0.5) * 1.6;
          this.hasKickedOff = true;
          this.playHitSound();
        }
      }, 700);
    }
  }

  playHitSound() {
    const now = Date.now();
    if (now - this.lastHitSoundTime > 120) {
      try { SoundFX.playKick(); } catch {}
      this.lastHitSoundTime = now;
    }
  }

  update() {
    if (!this.isRunning || this.isPaused || this.isGoalPause) return;

    if (this.player.kickCooldown > 0) this.player.kickCooldown--;
    if (this.ai.kickCooldown > 0) this.ai.kickCooldown--;

    // 1. Charge Shot Accumulation
    if (this.player.isCharging) {
      if (this.player.chargePower < this.player.maxCharge) {
        this.player.chargePower++;
      }
    }

    // 2. Player Input Movement
    let mx = 0;
    let my = 0;
    if (this.keys['w'] || this.keys['arrowup']) my -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) my += 1;
    if (this.keys['a'] || this.keys['arrowleft']) mx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) mx += 1;

    this.player.isMoving = (mx !== 0 || my !== 0);
    const playerMoveSpeed = this.player.isCharging ? this.player.speed * 0.75 : this.player.speed;

    if (this.player.isMoving) {
      if (!this.hasKickedOff && this.possession === 'player') {
        this.hasKickedOff = true;
        if (this.statusEl) this.statusEl.textContent = 'PARTIDO EN CURSO';
      }

      const len = Math.hypot(mx, my);
      this.player.vx = (mx / len) * playerMoveSpeed;
      this.player.vy = (my / len) * playerMoveSpeed;
      this.player.facing = { x: mx / len, y: my / len };

      this.player.x += this.player.vx;
      this.player.y += this.player.vy;

      this.player.animTick++;
      if (this.player.animTick % 6 === 0) {
        this.player.animFrame = 1 - this.player.animFrame;
      }
    } else {
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.animFrame = 0;
    }

    // Keep Player inside pitch boundaries
    this.player.x = Math.max(this.pitchLeft, Math.min(this.pitchRight - this.player.w, this.player.x));
    this.player.y = Math.max(this.pitchTop, Math.min(this.pitchBottom - this.player.h, this.player.y));

    // 3. AI Opponent FSM (DEFEND, CHASE, ATTACK, SHOOT)
    this.updateAI();

    // 4. Player vs AI Solid Body Collision with Knockback & Separation
    this.handlePlayerPlayerCollision();

    // 5. Multi-Step Ball Physics & Continuous Dynamic Collisions
    const bSpeed = Math.hypot(this.ball.vx, this.ball.vy);
    const subSteps = bSpeed > 2.5 ? 4 : 2;
    const stepVx = this.ball.vx / subSteps;
    const stepVy = this.ball.vy / subSteps;

    for (let step = 0; step < subSteps; step++) {
      this.ball.x += stepVx;
      this.ball.y += stepVy;

      // Solid Player-Ball & AI-Ball interactions
      this.handlePlayerBallCollision(this.player);
      if (this.hasKickedOff || this.possession === 'ai') {
        this.handlePlayerBallCollision(this.ai);
      }

      // Walls & Goalposts
      this.handlePitchAndGoalCollisions();
    }

    // 6. Progressive Friction & Speed Cap
    this.ball.vx *= this.ball.friction;
    this.ball.vy *= this.ball.friction;

    const currentSpeed = Math.hypot(this.ball.vx, this.ball.vy);
    if (currentSpeed > this.ball.maxSpeed) {
      const scale = this.ball.maxSpeed / currentSpeed;
      this.ball.vx *= scale;
      this.ball.vy *= scale;
    }

    if (Math.abs(this.ball.vx) < 0.03) this.ball.vx = 0;
    if (Math.abs(this.ball.vy) < 0.03) this.ball.vy = 0;

    // Corner anti-trap
    this.applyCornerAntiStuck();
  }

  // Dynamic Arcade AI Opponent (Full Pursuit, Active Dribble, Evasion & Shooting)
  updateAI() {
    if (!this.hasKickedOff && this.possession === 'player') {
      this.ai.isMoving = false;
      this.ai.vx = 0;
      this.ai.vy = 0;
      this.ai.animFrame = 0;
      return;
    }

    const bCenter = { x: this.ball.x + this.ball.w / 2, y: this.ball.y + this.ball.h / 2 };
    const aiCenter = { x: this.ai.x + this.ai.w / 2, y: this.ai.y + this.ai.h / 2 };
    const pCenter = { x: this.player.x + this.player.w / 2, y: this.player.y + this.player.h / 2 };

    const distToBall = Math.hypot(bCenter.x - aiCenter.x, bCenter.y - aiCenter.y);
    const blueGoalCenter = { x: this.pitchLeft + 4, y: 140 };

    let targetX = bCenter.x;
    let targetY = bCenter.y;

    // AI is in possession / touching distance of the ball
    if (distToBall <= this.ai.radius + this.ball.radius + 6) {
      // 1. DRIVE DIRECTLY INTO BLUE GOAL ON LEFT
      targetX = blueGoalCenter.x;
      targetY = blueGoalCenter.y;

      // 2. Dribble evasion: If blue player is blocking direct line to goal, veer up or down
      const distToPlayer = Math.hypot(pCenter.x - aiCenter.x, pCenter.y - aiCenter.y);
      if (distToPlayer < 45 && pCenter.x < aiCenter.x) {
        targetY = pCenter.y > aiCenter.y ? Math.max(this.pitchTop + 20, aiCenter.y - 32) : Math.min(this.pitchBottom - 20, aiCenter.y + 32);
      }

      // 3. Shoot when in attacking range and lined up
      if (bCenter.x < 220 && this.ai.kickCooldown === 0) {
        const cornerY = (bCenter.y > 140) ? this.goalTop + 16 : this.goalBottom - 16;
        const angle = Math.atan2(cornerY - bCenter.y, (this.pitchLeft - 8) - bCenter.x);
        const shotPower = 6.2 + Math.random() * 1.2;
        this.ball.vx = Math.cos(angle) * shotPower;
        this.ball.vy = Math.sin(angle) * shotPower;
        this.ai.kickCooldown = 26;
        this.playHitSound();
      }
    } else {
      // AI is pursuing the ball:
      // Predict ball trajectory
      const predX = bCenter.x + this.ball.vx * 3.5;
      const predY = bCenter.y + this.ball.vy * 3.5;

      // If AI is positioned to the left of the ball, flank around to get behind it
      if (aiCenter.x < bCenter.x - 4) {
        targetX = bCenter.x + 16;
        targetY = bCenter.y > 140 ? bCenter.y - 24 : bCenter.y + 24;
      } else {
        // AI is behind ball: charge directly into the predicted ball spot
        targetX = predX;
        targetY = predY;
      }
    }

    // Smooth movement towards calculated target
    const dx = targetX - aiCenter.x;
    const dy = targetY - aiCenter.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 1.5) {
      this.ai.isMoving = true;
      this.ai.vx = (dx / dist) * this.ai.speed;
      this.ai.vy = (dy / dist) * this.ai.speed;
      this.ai.facing = { x: this.ai.vx >= 0 ? 1 : -1, y: this.ai.vy };

      this.ai.x += this.ai.vx;
      this.ai.y += this.ai.vy;

      this.ai.animTick++;
      if (this.ai.animTick % 6 === 0) {
        this.ai.animFrame = 1 - this.ai.animFrame;
      }
    } else {
      this.ai.isMoving = false;
      this.ai.vx = 0;
      this.ai.vy = 0;
      this.ai.animFrame = 0;
    }

    this.ai.x = Math.max(this.pitchLeft, Math.min(this.pitchRight - this.ai.w, this.ai.x));
    this.ai.y = Math.max(this.pitchTop, Math.min(this.pitchBottom - this.ai.h, this.ai.y));
  }

  // Solid Player-Player Collision with Knockback & Elastic Separation
  handlePlayerPlayerCollision() {
    const p1Center = { x: this.player.x + this.player.w / 2, y: this.player.y + this.player.h / 2 };
    const p2Center = { x: this.ai.x + this.ai.w / 2, y: this.ai.y + this.ai.h / 2 };

    const dx = p2Center.x - p1Center.x;
    const dy = p2Center.y - p1Center.y;
    const dist = Math.hypot(dx, dy);
    const minDist = this.player.radius + this.ai.radius + 1; // 23px

    if (dist < minDist && dist > 0) {
      const overlap = minDist - dist;
      const nx = dx / dist;
      const ny = dy / dist;

      // Separate both players equally to prevent overlap
      this.player.x -= nx * overlap * 0.55;
      this.player.y -= ny * overlap * 0.55;
      this.ai.x += nx * overlap * 0.55;
      this.ai.y += ny * overlap * 0.55;

      // Apply subtle knockback impulse
      const knockForce = 1.2;
      this.player.vx -= nx * knockForce;
      this.player.vy -= ny * knockForce;
      this.ai.vx += nx * knockForce;
      this.ai.vy += ny * knockForce;

      // Constrain inside pitch
      this.player.x = Math.max(this.pitchLeft, Math.min(this.pitchRight - this.player.w, this.player.x));
      this.player.y = Math.max(this.pitchTop, Math.min(this.pitchBottom - this.player.h, this.player.y));
      this.ai.x = Math.max(this.pitchLeft, Math.min(this.pitchRight - this.ai.w, this.ai.x));
      this.ai.y = Math.max(this.pitchTop, Math.min(this.pitchBottom - this.ai.h, this.ai.y));
    }
  }

  // Solid Player-Ball Contact & Dynamic Dribble Physics
  handlePlayerBallCollision(sprite) {
    const sCenter = { x: sprite.x + sprite.w / 2, y: sprite.y + sprite.h / 2 };
    const bCenter = { x: this.ball.x + this.ball.w / 2, y: this.ball.y + this.ball.h / 2 };

    const dx = bCenter.x - sCenter.x;
    const dy = bCenter.y - sCenter.y;
    const dist = Math.hypot(dx, dy);
    const minDist = sprite.radius + this.ball.radius; // 19px

    if (dist < minDist) {
      const angle = dist === 0 ? (sprite.facing.x >= 0 ? 0 : Math.PI) : Math.atan2(dy, dx);
      const overlap = minDist - dist;

      if (sprite.isMoving) {
        // Active dribbling: place ball directly ahead in movement direction
        const faceX = sprite.facing.x || (sprite.vx >= 0 ? 1 : -1);
        const faceY = sprite.facing.y || 0;
        const fLen = Math.hypot(faceX, faceY) || 1;
        const nx = faceX / fLen;
        const ny = faceY / fLen;

        this.ball.x = sCenter.x + nx * (minDist + 1) - this.ball.w / 2;
        this.ball.y = sCenter.y + ny * (minDist + 1) - this.ball.h / 2;

        // Propel ball cleanly along with player
        this.ball.vx = sprite.vx * 1.35 + nx * 0.9;
        this.ball.vy = sprite.vy * 1.35 + ny * 0.9;
      } else {
        // Stationary defender bounce
        this.ball.x += Math.cos(angle) * overlap;
        this.ball.y += Math.sin(angle) * overlap;
        this.ball.vx = Math.cos(angle) * 1.6 - this.ball.vx * 0.4;
        this.ball.vy = Math.sin(angle) * 1.6 - this.ball.vy * 0.4;
      }

      this.playHitSound();
    }
  }

  applyCornerAntiStuck() {
    const b = this.ball;
    const margin = 26;
    const midX = (this.pitchLeft + this.pitchRight) / 2;
    const midY = (this.pitchTop + this.pitchBottom) / 2;

    const isNearLeft = b.x < this.pitchLeft + margin;
    const isNearRight = b.x > this.pitchRight - margin - b.w;
    const isNearTop = b.y < this.pitchTop + margin;
    const isNearBottom = b.y > this.pitchBottom - margin - b.h;

    if ((isNearLeft || isNearRight) && (isNearTop || isNearBottom)) {
      const dirX = midX - (b.x + b.w / 2);
      const dirY = midY - (b.y + b.h / 2);
      const len = Math.hypot(dirX, dirY) || 1;
      b.vx += (dirX / len) * 0.4;
      b.vy += (dirY / len) * 0.4;
    }
  }

  handlePitchAndGoalCollisions() {
    const b = this.ball;

    // Left Touchline & Blue Goal
    if (b.x <= this.pitchLeft) {
      const inGoalMouth = (b.y + b.h >= this.goalTop && b.y <= this.goalBottom);

      if (inGoalMouth) {
        if (b.x <= 8) {
          this.triggerGoal('ai');
          return;
        }
      } else {
        b.x = this.pitchLeft + 1;
        b.vx = Math.abs(b.vx) * 0.82 + 0.4;
        this.playHitSound();
      }
    }

    // Right Touchline & Red Goal
    if (b.x + b.w >= this.pitchRight) {
      const inGoalMouth = (b.y + b.h >= this.goalTop && b.y <= this.goalBottom);

      if (inGoalMouth) {
        if (b.x + b.w >= 392) {
          this.triggerGoal('player');
          return;
        }
      } else {
        b.x = this.pitchRight - b.w - 1;
        b.vx = -Math.abs(b.vx) * 0.82 - 0.4;
        this.playHitSound();
      }
    }

    // Top Touchline
    if (b.y <= this.pitchTop) {
      b.y = this.pitchTop + 1;
      b.vy = Math.abs(b.vy) * 0.82 + 0.4;
      this.playHitSound();
    }

    // Bottom Touchline
    if (b.y + b.h >= this.pitchBottom) {
      b.y = this.pitchBottom - b.h - 1;
      b.vy = -Math.abs(b.vy) * 0.82 - 0.4;
      this.playHitSound();
    }

    // 4 Solid Goalposts
    this.checkPostCollision(this.pitchLeft, this.goalTop);
    this.checkPostCollision(this.pitchLeft, this.goalBottom);
    this.checkPostCollision(this.pitchRight, this.goalTop);
    this.checkPostCollision(this.pitchRight, this.goalBottom);
  }

  checkPostCollision(postX, postY) {
    const bCenter = { x: this.ball.x + this.ball.w / 2, y: this.ball.y + this.ball.h / 2 };
    const dx = bCenter.x - postX;
    const dy = bCenter.y - postY;
    const dist = Math.hypot(dx, dy);

    if (dist < this.ball.radius + 3) {
      const angle = Math.atan2(dy, dx);
      this.ball.vx = Math.cos(angle) * 3.8;
      this.ball.vy = Math.sin(angle) * 3.8;
      this.playHitSound();
    }
  }

  triggerGoal(scorer) {
    if (this.isGoalPause) return;
    this.isGoalPause = true;

    this.ball.vx = 0;
    this.ball.vy = 0;
    this.player.isCharging = false;
    this.player.chargePower = 0;

    let nextPossession = 'player';
    if (scorer === 'player') {
      this.playerScore++;
      try { SoundFX.playGoal(); } catch {}
      this.goalBanner = '¡¡¡GOOOOOL DEL JUGADOR AZUL!!!';
      if (this.statusEl) this.statusEl.textContent = '¡¡¡GOOOOOL DEL JUGADOR AZUL!!!';
      nextPossession = 'ai';
    } else {
      this.aiScore++;
      try { SoundFX.playGameOver(); } catch {}
      this.goalBanner = '¡GOL DEL CPU ROJO!';
      if (this.statusEl) this.statusEl.textContent = '¡GOL DEL CPU ROJO!';
      nextPossession = 'player';
    }

    this.updateScoreUI();

    setTimeout(() => {
      if (this.isRunning) {
        this.resetPositions(nextPossession);
        this.isGoalPause = false;
        this.goalBanner = null;
        if (this.statusEl) {
          this.statusEl.textContent = nextPossession === 'player' ? 'SAQUE DE CENTRO (TU TURNO)' : 'SAQUE DE CENTRO (TURNO CPU)';
        }
      }
    }, 1500);
  }

  updateScoreUI() {
    if (this.scoreEl) {
      this.scoreEl.textContent = `${this.playerScore} - ${this.aiScore}`;
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  draw() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Outer Turf
    this.ctx.fillStyle = '#061511';
    this.ctx.fillRect(0, 0, w, h);

    // 2. Striped Grass Field
    const stripeW = 28;
    for (let x = this.pitchLeft; x < this.pitchRight; x += stripeW) {
      this.ctx.fillStyle = (Math.floor(x / stripeW) % 2 === 0) ? '#174817' : '#144014';
      this.ctx.fillRect(x, this.pitchTop, Math.min(stripeW, this.pitchRight - x), this.pitchBottom - this.pitchTop);
    }

    // 3. Crisp Pitch Markings
    this.ctx.strokeStyle = '#8bac0f';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.pitchLeft, this.pitchTop, this.pitchRight - this.pitchLeft, this.pitchBottom - this.pitchTop);

    // Center Halfway Line
    const midX = w / 2;
    const midY = h / 2;
    this.ctx.beginPath();
    this.ctx.moveTo(midX, this.pitchTop);
    this.ctx.lineTo(midX, this.pitchBottom);
    this.ctx.stroke();

    // Center Circle
    this.ctx.beginPath();
    this.ctx.arc(midX, midY, 32, 0, Math.PI * 2);
    this.ctx.stroke();

    // Center Spot
    this.ctx.fillStyle = '#8bac0f';
    this.ctx.fillRect(midX - 2, midY - 2, 4, 4);

    // Penalty Areas
    const pBoxW = 44;
    const pBoxH = 88;
    const pBoxTop = (h - pBoxH) / 2;
    this.ctx.strokeRect(this.pitchLeft, pBoxTop, pBoxW, pBoxH);
    this.ctx.strokeRect(this.pitchRight - pBoxW, pBoxTop, pBoxW, pBoxH);

    // Goal Nets
    this.drawGoalNet(6, this.goalTop, this.pitchLeft - 6, this.goalBottom - this.goalTop);
    this.drawGoalNet(this.pitchRight, this.goalTop, w - this.pitchRight - 6, this.goalBottom - this.goalTop);

    // Goalposts
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(this.pitchLeft - 2, this.goalTop - 2, 4, 4);
    this.ctx.fillRect(this.pitchLeft - 2, this.goalBottom - 2, 4, 4);
    this.ctx.fillRect(this.pitchRight - 2, this.goalTop - 2, 4, 4);
    this.ctx.fillRect(this.pitchRight - 2, this.goalBottom - 2, 4, 4);

    // 4. Sprites
    // Ball
    this.drawPixelSprite(this.ball.x, this.ball.y, BALL_SPRITE, PALETTE_BALL);

    // Player (Blue)
    const playerMatrix = this.player.animFrame === 0 ? PLAYER_SPRITE_FRAME_1 : PLAYER_SPRITE_FRAME_2;
    this.drawPlayerSprite(this.player.x, this.player.y, playerMatrix, PALETTE_BLUE, this.player.facing.x >= 0 ? 1 : -1);

    // AI (Red)
    const aiMatrix = this.ai.animFrame === 0 ? PLAYER_SPRITE_FRAME_1 : PLAYER_SPRITE_FRAME_2;
    this.drawPlayerSprite(this.ai.x, this.ai.y, aiMatrix, PALETTE_RED, this.ai.facing.x >= 0 ? 1 : -1);

    // 5. Pixel Art Power Meter when Charging Kick
    if (this.player.isCharging && this.player.chargePower > 0) {
      this.drawPowerMeter();
    }

    // 6. Goal Banner
    if (this.goalBanner) {
      this.ctx.fillStyle = 'rgba(6, 21, 17, 0.9)';
      this.ctx.fillRect(40, 95, w - 80, 70);
      this.ctx.strokeStyle = '#38ef7d';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(40, 95, w - 80, 70);

      this.ctx.fillStyle = '#fef08a';
      this.ctx.font = '14px "Silkscreen", "Courier New", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.goalBanner, w / 2, 136);
    }

    // 7. Pause Overlay
    if (this.isPaused) {
      this.ctx.fillStyle = 'rgba(6, 21, 17, 0.88)';
      this.ctx.fillRect(60, 95, w - 120, 70);
      this.ctx.strokeStyle = '#fef08a';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(60, 95, w - 120, 70);

      this.ctx.fillStyle = '#fef08a';
      this.ctx.font = '14px "Silkscreen", "Courier New", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSA', w / 2, 124);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '10px "Courier New", monospace';
      this.ctx.fillText('P O BOTON PARA REANUDAR', w / 2, 146);
    }

    // 8. Idle Start Overlay
    if (!this.isRunning) {
      this.ctx.fillStyle = 'rgba(6, 21, 17, 0.94)';
      this.ctx.fillRect(30, 45, w - 60, 190);
      this.ctx.strokeStyle = '#38ef7d';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(30, 45, w - 60, 190);

      this.ctx.fillStyle = '#38ef7d';
      this.ctx.font = '14px "Silkscreen", "Courier New", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('FOOTBALL.EXE 8-BIT', w / 2, 72);

      this.ctx.fillStyle = '#f8fafc';
      this.ctx.font = '11px "Courier New", monospace';
      this.ctx.fillText('INICIAR: Botón / Espacio / Touch', w / 2, 98);
      this.ctx.fillStyle = '#93c5fd';
      this.ctx.fillText('PC: WASD + ESPACIO/K', w / 2, 122);
      this.ctx.fillText('MOVIL: D-PAD + KICK/SHOOT', w / 2, 142);
      this.ctx.fillStyle = '#fef08a';
      this.ctx.fillText('SOLTAR SHOOT = DISPARO POTENTE', w / 2, 164);
      this.ctx.fillStyle = '#8dafa4';
      this.ctx.fillText('AZUL (TÚ) vs ROJO (CPU)', w / 2, 194);
    }
  }

  // Retro 8-bit Segmented Power Meter
  drawPowerMeter() {
    const ratio = Math.min(1, this.player.chargePower / this.player.maxCharge);
    const barW = 28;
    const barH = 6;
    const barX = Math.round(this.player.x + (this.player.w - barW) / 2);
    const barY = Math.round(this.player.y - 12);

    // Meter Background Box
    this.ctx.fillStyle = '#04100c';
    this.ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(barX - 2, barY - 2, barW + 4, barH + 4);

    // Segmented Bars
    const totalSegments = 6;
    const filledSegments = Math.ceil(ratio * totalSegments);
    const segW = 4;

    for (let i = 0; i < filledSegments; i++) {
      let col = '#38ef7d'; // Green
      if (i >= 2 && i < 4) col = '#fef08a'; // Yellow
      if (i >= 4) col = '#ff4b4b'; // Red

      this.ctx.fillStyle = col;
      this.ctx.fillRect(barX + i * segW + 1, barY + 1, segW - 1, barH - 2);
    }
  }

  drawGoalNet(x, y, w, h) {
    this.ctx.fillStyle = '#061a06';
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeStyle = '#8bac0f';
    this.ctx.lineWidth = 1;

    for (let gx = x; gx <= x + w; gx += 4) {
      this.ctx.beginPath();
      this.ctx.moveTo(gx, y);
      this.ctx.lineTo(gx, y + h);
      this.ctx.stroke();
    }
    for (let gy = y; gy <= y + h; gy += 4) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, gy);
      this.ctx.lineTo(x + w, gy);
      this.ctx.stroke();
    }
  }

  drawPixelSprite(startX, startY, matrix, palette) {
    const scale = this.pixelScale;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        const colorKey = matrix[r][c];
        if (colorKey !== 0 && palette[colorKey]) {
          this.ctx.fillStyle = palette[colorKey];
          this.ctx.fillRect(
            Math.round(startX + c * scale),
            Math.round(startY + r * scale),
            scale,
            scale
          );
        }
      }
    }
  }

  drawPlayerSprite(startX, startY, matrix, palette, facing) {
    const scale = this.pixelScale;
    const numCols = matrix[0].length;

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < numCols; c++) {
        const colorKey = matrix[r][c];
        if (colorKey !== 0 && palette[colorKey]) {
          this.ctx.fillStyle = palette[colorKey];
          const drawCol = facing > 0 ? c : (numCols - 1 - c);
          this.ctx.fillRect(
            Math.round(startX + drawCol * scale),
            Math.round(startY + r * scale),
            scale,
            scale
          );
        }
      }
    }
  }
}
