window.Game = class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = 600;
        this.canvas.height = 800;

        this.board = new Board();
        this.audioManager = new AudioManager();
        this.score = 0;
        this.combo = 0;
        this.selectedGem = null;
        this.isProcessing = false;
        this.isPaused = false;
        this.effects = [];
        
        // 游戏模式和状态
        this.mode = 'TIME'; // 'TIME' or 'MOVES'
        this.timeLeft = 60;
        this.movesLeft = 20;
        this.targetScore = 1000;
        this.gameState = 'START'; 

        this.initEvents();
        this.lastTime = performance.now();
        this.timerInterval = null;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    initEvents() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) restartBtn.addEventListener('click', () => this.restart());
        
        const quitBtn = document.getElementById('quit-btn');
        if (quitBtn) quitBtn.addEventListener('click', () => this.endGame('游戏手动结束'));
        
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) pauseBtn.addEventListener('click', (e) => this.togglePause(e.target));
        
        const soundBtn = document.getElementById('sound-toggle-btn');
        if (soundBtn) soundBtn.addEventListener('click', (e) => this.toggleSound(e.target));
    }

    togglePause(btn) {
        if (this.gameState !== 'PLAYING') return;
        this.isPaused = !this.isPaused;
        btn.innerText = this.isPaused ? '继续' : '暂停';
    }

    toggleSound(btn) {
        const isMuted = this.audioManager.toggleMute();
        btn.innerText = `音乐: ${isMuted ? '关' : '开'}`;
    }

    handleMouseDown(e) {
        if (this.isProcessing || this.isPaused || this.gameState !== 'PLAYING') return;

        const pos = getCanvasMousePos(this.canvas, e);
        const col = Math.floor((pos.x - OFFSET_X) / CELL_SIZE);
        const row = Math.floor((pos.y - OFFSET_Y) / CELL_SIZE);

        if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
            this.selectGem(row, col);
        }
    }

    async selectGem(row, col) {
        const gem = this.board.getGemAt(row, col);
        if (!gem || gem.obstacle === OBSTACLE_TYPES.ROCK) return;

        if (!this.selectedGem) {
            this.selectedGem = gem;
            gem.scale = 1.1;
        } else {
            const dRow = Math.abs(this.selectedGem.row - row);
            const dCol = Math.abs(this.selectedGem.col - col);

            if ((dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1)) {
                // 尝试交换
                await this.trySwap(this.selectedGem, gem);
            }
            
            this.selectedGem.scale = 1;
            this.selectedGem = null;
        }
    }

    async trySwap(gem1, gem2) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        try {
            this.audioManager.playSFX('swap');
            
            // 如果是步数模式，扣除步数
            if (this.mode === 'MOVES') {
                this.movesLeft--;
                this.updateUI();
            }

            // 执行动画交换
            this.board.swapGemsData(gem1.row, gem1.col, gem2.row, gem2.col);
            await wait(250);

            const { matchedGems } = this.board.findMatches();
            
            // 特殊逻辑：彩虹球交换
            if (gem1.special === SPECIAL_TYPES.RAINBOW || gem2.special === SPECIAL_TYPES.RAINBOW) {
                await this.handleRainbowSwap(gem1, gem2);
                await this.processMatches();
            } else if (matchedGems.length > 0) {
                await this.processMatches(gem1, gem2);
            } else {
                // 没有匹配，换回来
                this.board.swapGemsData(gem1.row, gem1.col, gem2.row, gem2.col);
                if (this.mode === 'MOVES') this.movesLeft++; // 交换失败返还步数
                await wait(250);
            }

            // 检查死局
            if (!this.board.hasPossibleMoves()) {
                this.effects.push(new FloatingText("无路可走，重置棋盘", this.canvas.width/2, this.canvas.height/2, '#e74c3c', 40));
                await wait(1000);
                this.board.initialize(this.currentLevel);
            }

            this.checkWinCondition();
        } catch (error) {
            console.error("Swap Error:", error);
        } finally {
            this.isProcessing = false;
        }
    }

    checkWinCondition() {
        if (this.score >= this.targetScore && this.gameState === 'PLAYING') {
            this.endGame('关卡达成！');
            return;
        }
        
        if (this.mode === 'MOVES' && this.movesLeft <= 0 && !this.isProcessing) {
            this.endGame('步数用尽');
        }
    }

    endGame(message) {
        this.gameState = 'OVER';
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.audioManager.stopBGM();
        if (message.includes('达成')) {
            this.audioManager.playSFX('win');
        }
        
        const overlay = document.getElementById('overlay');
        const title = document.getElementById('modal-title');
        const msg = document.getElementById('modal-message');
        
        overlay.classList.remove('hidden');
        title.innerText = message;
        msg.innerText = `最终分数: ${this.score}`;
    }

    restart() {
        this.start(this.mode);
    }

    async handleRainbowSwap(gem1, gem2) {
        const rainbow = gem1.special === SPECIAL_TYPES.RAINBOW ? gem1 : gem2;
        const other = rainbow === gem1 ? gem2 : gem1;
        
        const targetType = other.type;
        const allTargetGems = [];
        
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const gem = this.board.grid[r][c];
                if (gem.type === targetType || gem === rainbow) {
                    allTargetGems.push(gem);
                }
            }
        }
        
        rainbow.type = -1;
        for (const gem of allTargetGems) {
            gem.isRemoving = true;
            gem.type = -1;
        }
        await wait(300);
    }

    async processMatches(swapGem1, swapGem2) {
        let hasMatches = true;
        this.combo = 0;
        let safetyCounter = 0;

        while (hasMatches && safetyCounter < 50) {
            safetyCounter++;
            const { matches, matchedGems } = this.board.findMatches();
            if (matchedGems.length === 0) {
                hasMatches = false;
                break;
            }

            this.combo++;
            this.calculateScore(matchedGems);
            this.audioManager.playSFX(this.combo > 1 ? 'combo' : 'match');

            // 添加飘字特效
            if (this.combo > 1) {
                const centerGem = matchedGems[Math.floor(matchedGems.length / 2)];
                this.effects.push(new FloatingText(
                    `COMBO ${this.combo}!`, 
                    OFFSET_X + centerGem.x + CELL_SIZE / 2, 
                    OFFSET_Y + centerGem.y,
                    '#f1c40f',
                    32
                ));
            }
            
            // 检测是否生成特殊宝石
            const newSpecialGems = this.handleSpecialGemCreation(matches, swapGem1, swapGem2);
            
            // 处理特殊宝石的爆炸效果
            const gemsToRemove = new Set(matchedGems);
            for (const gem of matchedGems) {
                if (gem.special !== SPECIAL_TYPES.NONE && !newSpecialGems.has(gem)) {
                    this.triggerSpecialEffect(gem, gemsToRemove);
                }
            }

            // 从待消除列表中移除新生成的特殊宝石
            for (const specialGem of newSpecialGems) {
                gemsToRemove.delete(specialGem);
            }

            // 标记并删除
            for (const gem of gemsToRemove) {
                // 添加粒子效果
                if (gem.type !== -1) {
                    for (let i = 0; i < 10; i++) {
                        this.effects.push(new Particle(
                            OFFSET_X + gem.x + CELL_SIZE / 2,
                            OFFSET_Y + gem.y + CELL_SIZE / 2,
                            GEM_COLORS[gem.type]
                        ));
                    }
                }
                
                gem.isRemoving = true;
                gem.type = -1; // 标记为空
                
                // 处理障碍物
                this.handleObstacleClearing(gem);
            }
            
            await wait(250);

            // 掉落
            await this.board.applyGravity();
            await wait(250);
            
            // 每次掉落后清除 swapGem1/swapGem2
            swapGem1 = null;
            swapGem2 = null;
        }
        
        this.combo = 0;
        this.updateUI();
    }

    handleSpecialGemCreation(matches, swapGem1, swapGem2) {
        const newSpecialGems = new Set();
        const gemMatchCount = new Map();

        for (const match of matches) {
            for (const gem of match.gems) {
                gemMatchCount.set(gem, (gemMatchCount.get(gem) || 0) + 1);
            }
        }

        for (const match of matches) {
            const gems = match.gems;
            let specialType = SPECIAL_TYPES.NONE;
            
            if (gems.length >= 5) {
                specialType = SPECIAL_TYPES.RAINBOW;
            } else if (gems.length === 4) {
                specialType = SPECIAL_TYPES.EXPLOSIVE;
            } else {
                // 检查是否有共享宝石 (T/L 型)
                for (const gem of gems) {
                    if (gemMatchCount.get(gem) > 1) {
                        specialType = SPECIAL_TYPES.CROSS;
                        break;
                    }
                }
            }
            
            if (specialType !== SPECIAL_TYPES.NONE) {
                let targetGem = gems[Math.floor(gems.length / 2)];
                // 优先在共享点生成十字炸弹
                if (specialType === SPECIAL_TYPES.CROSS) {
                    targetGem = gems.find(g => gemMatchCount.get(g) > 1) || targetGem;
                } else if (swapGem1 && gems.includes(swapGem1)) {
                    targetGem = swapGem1;
                } else if (swapGem2 && gems.includes(swapGem2)) {
                    targetGem = swapGem2;
                }
                
                targetGem.special = specialType;
                newSpecialGems.add(targetGem);
            }
        }
        return newSpecialGems;
    }

    triggerSpecialEffect(gem, gemsToRemove) {
        this.audioManager.playSFX('special');
        if (gem.special === SPECIAL_TYPES.EXPLOSIVE) {
            // 炸掉一行一列 (按需求是消除一行一列，或者是周围)
            // 这里实现为消除周围 3x3
            for (let r = gem.row - 1; r <= gem.row + 1; r++) {
                for (let c = gem.col - 1; c <= gem.col + 1; c++) {
                    const g = this.board.getGemAt(r, c);
                    if (g) gemsToRemove.add(g);
                }
            }
        } else if (gem.special === SPECIAL_TYPES.CROSS) {
            // 十字炸弹：整行整列
            for (let i = 0; i < BOARD_SIZE; i++) {
                gemsToRemove.add(this.board.grid[gem.row][i]);
                gemsToRemove.add(this.board.grid[i][gem.col]);
            }
        }
    }

    handleObstacleClearing(gem) {
        // 检查相邻格子的障碍物
        const neighbors = [
            [gem.row-1, gem.col], [gem.row+1, gem.col],
            [gem.row, gem.col-1], [gem.row, gem.col+1]
        ];
        
        for (const [r, c] of neighbors) {
            const neighbor = this.board.getGemAt(r, c);
            if (neighbor) {
                if (neighbor.obstacle === OBSTACLE_TYPES.ICE) {
                    neighbor.obstacle = OBSTACLE_TYPES.NONE;
                }
            }
        }
    }

    calculateScore(matches) {
        const baseScore = matches.length * 10;
        const comboBonus = this.combo * 5;
        this.score += baseScore + comboBonus;
    }

    updateUI() {
        document.getElementById('score').innerText = this.score;
        document.getElementById('combo').innerText = this.combo;
        document.getElementById('timer').innerText = this.timeLeft;
        document.getElementById('moves').innerText = this.movesLeft;
    }

    gameLoop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(dt) {
        if (this.isPaused) return;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                this.board.grid[r][c].update(dt);
            }
        }

        // 更新特效
        for (let i = this.effects.length - 1; i >= 0; i--) {
            this.effects[i].update(dt);
            if (this.effects[i].life <= 0) {
                this.effects.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景格
        this.ctx.fillStyle = '#2c3e50';
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                this.ctx.strokeStyle = '#34495e';
                this.ctx.strokeRect(OFFSET_X + c * CELL_SIZE, OFFSET_Y + r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }

        // 绘制宝石
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                this.board.grid[r][c].draw(this.ctx, OFFSET_X, OFFSET_Y);
            }
        }

        // 绘制特效
        for (const effect of this.effects) {
            effect.draw(this.ctx);
        }
    }

    start(mode = 'TIME', level = 1) {
        this.mode = mode;
        this.currentLevel = level;
        this.score = 0;
        this.combo = 0;
        this.gameState = 'PLAYING';
        this.isProcessing = false;
        this.isPaused = false;
        this.effects = [];
        this.board.initialize(level);
        this.audioManager.playBGM();
        
        const timerCont = document.getElementById('timer-container');
        const movesCont = document.getElementById('moves-container');

        if (mode === 'TIME') {
            this.timeLeft = 60;
            timerCont.style.display = 'block';
            movesCont.style.display = 'none';
            this.startTimer();
        } else {
            this.movesLeft = 25;
            timerCont.style.display = 'none';
            movesCont.style.display = 'block';
            if (this.timerInterval) clearInterval(this.timerInterval);
        }

        document.getElementById('overlay').classList.add('hidden');
        document.getElementById('target-desc').innerText = `获得 ${this.targetScore} 分`;
        this.updateUI();
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.gameState === 'PLAYING') {
                this.timeLeft--;
                this.updateUI();
                if (this.timeLeft <= 0) {
                    this.endGame('时间到！');
                }
            }
        }, 1000);
    }
}
