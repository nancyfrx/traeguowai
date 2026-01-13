const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// 设置画布大小
canvas.width = 400;
canvas.height = 600;

let score = 0;
let gameActive = true;
let player;
let bullets = [];
let enemies = [];
let enemySpawnTimer = 0;
let keys = {};

// 玩家坦克类
class Player {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - 60;
        this.speed = 5;
    }

    draw() {
        // 坦克主体 (绿色)
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(this.x, this.y + 10, this.width, this.height - 10);
        
        // 履带
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - 5, this.y + 15, 8, 20);
        ctx.fillRect(this.x + this.width - 3, this.y + 15, 8, 20);

        // 炮塔
        ctx.fillStyle = '#388E3C';
        ctx.fillRect(this.x + 10, this.y + 5, 20, 20);
        
        // 炮管
        ctx.fillStyle = '#2E7D32';
        ctx.fillRect(this.x + 18, this.y - 5, 4, 15);
    }

    update() {
        if (keys['ArrowLeft'] && this.x > 5) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < canvas.width - this.width - 5) {
            this.x += this.speed;
        }
    }
}

// 子弹类
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 3;
        this.speed = 7;
    }

    draw() {
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.y -= this.speed;
    }
}

// 飞机敌人类
class Enemy {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.speed = 2 + Math.random() * 2;
    }

    draw() {
        ctx.fillStyle = '#F44336'; // 红色飞机
        
        // 机身
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2 - 5, this.y);
        ctx.lineTo(this.x + this.width / 2 + 5, this.y);
        ctx.closePath();
        ctx.fill();

        // 主机翼
        ctx.fillRect(this.x, this.y + 15, this.width, 5);
        
        // 尾翼
        ctx.fillRect(this.x + 10, this.y + 2, 20, 3);
        
        // 机头 (深色)
        ctx.fillStyle = '#B71C1C';
        ctx.fillRect(this.x + this.width / 2 - 3, this.y + this.height - 5, 6, 5);
    }

    update() {
        this.y += this.speed;
    }
}

function init() {
    player = new Player();
    bullets = [];
    enemies = [];
    score = 0;
    scoreElement.textContent = score;
    gameActive = true;
    gameOverScreen.classList.add('hidden');
    animate();
}

function spawnEnemy() {
    enemySpawnTimer++;
    if (enemySpawnTimer > 60) {
        enemies.push(new Enemy());
        enemySpawnTimer = 0;
    }
}

function handleCollisions() {
    // 子弹击中飞机
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (bullet.x > enemy.x && bullet.x < enemy.x + enemy.width &&
                bullet.y > enemy.y && bullet.y < enemy.y + enemy.height) {
                setTimeout(() => {
                    bullets.splice(bIndex, 1);
                    enemies.splice(eIndex, 1);
                    score += 10;
                    scoreElement.textContent = score;
                }, 0);
            }
        });
    });

    // 飞机撞击坦克
    enemies.forEach((enemy) => {
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            endGame();
        }
    });
}

function endGame() {
    gameActive = false;
    gameOverScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
}

function animate() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.draw();

    bullets.forEach((bullet, index) => {
        bullet.update();
        bullet.draw();
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    spawnEnemy();
    enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw();
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });

    handleCollisions();

    requestAnimationFrame(animate);
}

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && gameActive) {
        bullets.push(new Bullet(player.x + player.width / 2, player.y));
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

restartBtn.addEventListener('click', init);

init();
