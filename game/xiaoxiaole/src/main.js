window.addEventListener('load', () => {
    const canvas = document.getElementById('game-canvas');
    const game = new Game(canvas);
    
    const levelSelect = document.getElementById('level-select');
    const levelsGrid = document.getElementById('levels-grid');
    const levelSelectBtn = document.getElementById('level-select-btn');
    const backToMain = document.getElementById('back-to-main');

    // 生成关卡按钮
    for (let i = 1; i <= 12; i++) {
        const btn = document.createElement('div');
        btn.className = 'level-node';
        btn.innerText = i;
        btn.onclick = () => {
            const mode = i % 2 === 0 ? 'MOVES' : 'TIME';
            levelSelect.classList.add('hidden');
            game.start(mode, i);
        };
        levelsGrid.appendChild(btn);
    }

    levelSelectBtn.onclick = () => {
        document.getElementById('overlay').classList.add('hidden');
        levelSelect.classList.remove('hidden');
    };

    document.getElementById('level-btn').onclick = () => {
        if (game.gameState === 'PLAYING') {
            game.isPaused = true;
            document.getElementById('pause-btn').innerText = '继续';
        }
        levelSelect.classList.remove('hidden');
    };

    backToMain.onclick = () => {
        levelSelect.classList.add('hidden');
        if (game.gameState === 'OVER') {
            document.getElementById('overlay').classList.remove('hidden');
        }
    };

    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) {
        console.log('Start game button found');
        startGameBtn.onclick = (e) => {
            console.log('Start game button clicked');
            e.preventDefault();
            e.stopPropagation();
            const startScreen = document.getElementById('start-screen');
            if (startScreen) startScreen.classList.add('hidden');
            if (levelSelect) levelSelect.classList.remove('hidden');
        };
        // 同时也保留 addEventListener 作为备份
        startGameBtn.addEventListener('click', (e) => {
            console.log('Start game button clicked (listener)');
            const startScreen = document.getElementById('start-screen');
            if (startScreen) startScreen.classList.add('hidden');
            if (levelSelect) levelSelect.classList.remove('hidden');
        });
    }
});
