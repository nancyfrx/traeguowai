import { BOARD_SIZE, GEM_TYPES, SPECIAL_TYPES, OBSTACLE_TYPES, CELL_SIZE } from './constants.js';
import { Gem } from './gem.js';

export class Board {
    constructor() {
        this.grid = [];
        this.initialize();
    }

    initialize(level = 0) {
        for (let r = 0; r < BOARD_SIZE; r++) {
            this.grid[r] = [];
            for (let c = 0; c < BOARD_SIZE; c++) {
                this.grid[r][c] = this.createRandomGem(r, c);
            }
        }
        
        // 根据等级添加障碍物
        if (level > 1) {
            this.addObstacles(level);
        }
        
        // 初始去重，确保没有初始匹配
        this.resolveInitialMatches();
    }

    addObstacles(level) {
        const obstacleCount = Math.min(10, level * 2);
        for (let i = 0; i < obstacleCount; i++) {
            const r = Math.floor(Math.random() * BOARD_SIZE);
            const c = Math.floor(Math.random() * BOARD_SIZE);
            if (this.grid[r][c].obstacle === OBSTACLE_TYPES.NONE) {
                this.grid[r][c].obstacle = level % 3 === 0 ? OBSTACLE_TYPES.ROCK : OBSTACLE_TYPES.ICE;
            }
        }
    }

    createRandomGem(r, c) {
        const type = Math.floor(Math.random() * GEM_TYPES);
        return new Gem(r, c, type);
    }

    resolveInitialMatches() {
        let hasMatch = true;
        while (hasMatch) {
            hasMatch = false;
            const matches = this.findMatches();
            if (matches.length > 0) {
                hasMatch = true;
                for (const gem of matches) {
                    gem.type = (gem.type + 1) % GEM_TYPES;
                }
            }
        }
    }

    findMatches() {
        const matches = [];
        const matchedGems = new Set();

        // 横向检测
        for (let r = 0; r < BOARD_SIZE; r++) {
            let count = 1;
            for (let c = 1; c <= BOARD_SIZE; c++) {
                if (c < BOARD_SIZE && this.grid[r][c].type === this.grid[r][c-1].type && this.grid[r][c].type !== -1) {
                    count++;
                } else {
                    if (count >= 3) {
                        const matchGroup = [];
                        for (let i = 1; i <= count; i++) {
                            matchGroup.push(this.grid[r][c-i]);
                            matchedGems.add(this.grid[r][c-i]);
                        }
                        matches.push({ gems: matchGroup, orientation: 'horizontal' });
                    }
                    count = 1;
                }
            }
        }

        // 纵向检测
        for (let c = 0; c < BOARD_SIZE; c++) {
            let count = 1;
            for (let r = 1; r <= BOARD_SIZE; r++) {
                if (r < BOARD_SIZE && this.grid[r][c].type === this.grid[r-1][c].type && this.grid[r][c].type !== -1) {
                    count++;
                } else {
                    if (count >= 3) {
                        const matchGroup = [];
                        for (let i = 1; i <= count; i++) {
                            matchGroup.push(this.grid[r-i][c]);
                            matchedGems.add(this.grid[r-i][c]);
                        }
                        matches.push({ gems: matchGroup, orientation: 'vertical' });
                    }
                    count = 1;
                }
            }
        }

        return { matches, matchedGems: Array.from(matchedGems) };
    }

    // 检测特定的交换是否会产生匹配
    checkMatch(r1, c1, r2, c2) {
        // 如果是彩虹球，总是匹配
        if (this.grid[r1][c1].special === SPECIAL_TYPES.RAINBOW || this.grid[r2][c2].special === SPECIAL_TYPES.RAINBOW) {
            return true;
        }

        this.swapGemsData(r1, c1, r2, c2);
        const { matchedGems } = this.findMatches();
        this.swapGemsData(r1, c1, r2, c2); // 换回来

        return matchedGems.length > 0;
    }

    swapGemsData(r1, c1, r2, c2) {
        const temp = this.grid[r1][c1];
        this.grid[r1][c1] = this.grid[r2][c2];
        this.grid[r2][c2] = temp;
        
        // 更新逻辑坐标
        this.grid[r1][c1].row = r1;
        this.grid[r1][c1].col = c1;
        this.grid[r2][c2].row = r2;
        this.grid[r2][c2].col = c2;
        
        // 更新目标位置
        this.grid[r1][c1].targetX = c1 * CELL_SIZE;
        this.grid[r1][c1].targetY = r1 * CELL_SIZE;
        this.grid[r2][c2].targetX = c2 * CELL_SIZE;
        this.grid[r2][c2].targetY = r2 * CELL_SIZE;
    }

    // 核心消除逻辑：掉落和填充
    async applyGravity() {
        const columnsToFill = [];
        for (let c = 0; c < BOARD_SIZE; c++) {
            let emptySpaces = 0;
            for (let r = BOARD_SIZE - 1; r >= 0; r--) {
                if (this.grid[r][c].type === -1) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    // 掉落
                    const gem = this.grid[r][c];
                    this.grid[r + emptySpaces][c] = gem;
                    gem.row = r + emptySpaces;
                    gem.targetY = gem.row * CELL_SIZE;
                    this.grid[r][c] = new Gem(r, c, -1);
                }
            }
            columnsToFill[c] = emptySpaces;
        }

        // 填充顶部
        for (let c = 0; c < BOARD_SIZE; c++) {
            const emptyCount = columnsToFill[c];
            for (let i = 0; i < emptyCount; i++) {
                const r = emptyCount - 1 - i;
                const newGem = this.createRandomGem(r, c);
                // 从屏幕上方掉入
                newGem.y = -(i + 1) * CELL_SIZE;
                this.grid[r][c] = newGem;
            }
        }
    }

    getGemAt(r, c) {
        if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return null;
        return this.grid[r][c];
    }
}
