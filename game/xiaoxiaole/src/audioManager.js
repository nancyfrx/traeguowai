export class AudioManager {
    constructor() {
        this.bgm = null;
        this.sounds = {};
        this.isMuted = false;
        this.bgmVolume = 0.5;
        this.sfxVolume = 0.7;

        this.init();
    }

    init() {
        // 定义音效路径
        const sfxPaths = {
            match: 'https://actions.google.com/sounds/v1/water/slosh.ogg',
            swap: 'https://actions.google.com/sounds/v1/foley/beating_wings.ogg',
            special: 'https://actions.google.com/sounds/v1/science_fiction/low_level_laser.ogg',
            combo: 'https://actions.google.com/sounds/v1/multimedia/beep_short.ogg',
            win: 'https://actions.google.com/sounds/v1/multimedia/success_fanfare_trumpet.ogg'
        };

        // 背景音乐路径 (消消乐风格)
        this.bgmPath = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

        // 预加载音效
        for (const [name, path] of Object.entries(sfxPaths)) {
            const audio = new Audio(path);
            audio.preload = 'auto';
            this.sounds[name] = audio;
        }
    }

    playBGM() {
        if (this.isMuted) return;
        if (!this.bgm) {
            this.bgm = new Audio(this.bgmPath);
            this.bgm.loop = true;
            this.bgm.volume = this.bgmVolume;
        }
        this.bgm.play().catch(e => console.log("BGM play failed, waiting for user interaction."));
    }

    stopBGM() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
        }
    }

    playSFX(name) {
        if (this.isMuted || !this.sounds[name]) return;
        
        // 克隆音效以支持快速重复播放
        const sound = this.sounds[name].cloneNode();
        sound.volume = this.sfxVolume;
        sound.play().catch(e => {});
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            if (this.bgm) this.bgm.pause();
        } else {
            if (this.bgm) this.bgm.play();
        }
        return this.isMuted;
    }
}
