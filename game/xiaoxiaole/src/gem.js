window.Gem = class Gem {
    constructor(row, col, type, special = SPECIAL_TYPES.NONE) {
        this.row = row;
        this.col = col;
        this.type = type; // 0-5 for colors
        this.special = special;
        this.obstacle = OBSTACLE_TYPES.NONE;
        this.iceLayers = 0;
        
        // 动画属性
        this.x = col * CELL_SIZE;
        this.y = row * CELL_SIZE;
        this.targetX = this.x;
        this.targetY = this.y;
        this.scale = 1;
        this.alpha = 1;
        this.isRemoving = false;
    }

    update(dt) {
        // 平滑移动逻辑
        const speed = 0.2;
        if (Math.abs(this.x - this.targetX) > 0.1) {
            this.x += (this.targetX - this.x) * speed;
        } else {
            this.x = this.targetX;
        }

        if (Math.abs(this.y - this.targetY) > 0.1) {
            this.y += (this.targetY - this.y) * speed;
        } else {
            this.y = this.targetY;
        }
    }

    draw(ctx, offsetX, offsetY) {
        if (this.alpha <= 0) return;

        const drawX = offsetX + this.x + CELL_SIZE / 2;
        const drawY = offsetY + this.y + CELL_SIZE / 2;
        const size = (CELL_SIZE * 0.8) * this.scale;

        ctx.save();
        ctx.translate(drawX, drawY);
        ctx.globalAlpha = this.alpha;

        // 绘制宝石主体
        if (this.type !== -1) {
            ctx.fillStyle = GEM_COLORS[this.type];
            this.drawGemShape(ctx, size);
            
            // 特殊效果
            if (this.special === SPECIAL_TYPES.EXPLOSIVE) {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 3;
                ctx.strokeRect(-size/2, -size/2, size, size);
            } else if (this.special === SPECIAL_TYPES.CROSS) {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(-size/2, 0); ctx.lineTo(size/2, 0);
                ctx.moveTo(0, -size/2); ctx.lineTo(0, size/2);
                ctx.stroke();
            } else if (this.special === SPECIAL_TYPES.RAINBOW) {
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
                grad.addColorStop(0, 'red');
                grad.addColorStop(0.2, 'orange');
                grad.addColorStop(0.4, 'yellow');
                grad.addColorStop(0.6, 'green');
                grad.addColorStop(0.8, 'blue');
                grad.addColorStop(1, 'purple');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(0, 0, size/2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 绘制障碍物
        if (this.obstacle === OBSTACLE_TYPES.ICE) {
            ctx.fillStyle = 'rgba(135, 206, 250, 0.6)';
            ctx.fillRect(-CELL_SIZE/2 + 2, -CELL_SIZE/2 + 2, CELL_SIZE - 4, CELL_SIZE - 4);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(-CELL_SIZE/2 + 2, -CELL_SIZE/2 + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        } else if (this.obstacle === OBSTACLE_TYPES.CHAIN) {
            ctx.strokeStyle = '#bdc3c7';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-CELL_SIZE/2, -CELL_SIZE/2); ctx.lineTo(CELL_SIZE/2, CELL_SIZE/2);
            ctx.moveTo(CELL_SIZE/2, -CELL_SIZE/2); ctx.lineTo(-CELL_SIZE/2, CELL_SIZE/2);
            ctx.stroke();
        } else if (this.obstacle === OBSTACLE_TYPES.ROCK) {
            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(-CELL_SIZE/2 + 5, -CELL_SIZE/2 + 5, CELL_SIZE - 10, CELL_SIZE - 10);
        }

        ctx.restore();
    }

    drawGemShape(ctx, size) {
        // 简单的圆形宝石，可以根据 type 绘制不同形状
        ctx.beginPath();
        switch(this.type % 4) {
            case 0: // 圆形
                ctx.arc(0, 0, size/2, 0, Math.PI * 2);
                break;
            case 1: // 正方形
                ctx.rect(-size/2, -size/2, size, size);
                break;
            case 2: // 菱形
                ctx.moveTo(0, -size/2);
                ctx.lineTo(size/2, 0);
                ctx.lineTo(0, size/2);
                ctx.lineTo(-size/2, 0);
                break;
            case 3: // 六边形
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    ctx.lineTo(Math.cos(angle) * size/2, Math.sin(angle) * size/2);
                }
                break;
        }
        ctx.closePath();
        ctx.fill();
        
        // 高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(-size/4, -size/4, size/6, 0, Math.PI * 2);
        ctx.fill();
    }
}
