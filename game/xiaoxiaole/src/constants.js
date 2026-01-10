export const BOARD_SIZE = 8;
export const GEM_TYPES = 6;
export const CELL_SIZE = 64;
export const OFFSET_X = 44;
export const OFFSET_Y = 150;

export const GEM_COLORS = [
    '#e74c3c', // 红色
    '#3498db', // 蓝色
    '#2ecc71', // 绿色
    '#f1c40f', // 黄色
    '#9b59b6', // 紫色
    '#e67e22'  // 橙色
];

export const SPECIAL_TYPES = {
    NONE: 0,
    EXPLOSIVE: 1, // 4个连线：炸掉一行一列（实际上按需求是炸掉周围或者行列，这里定义为炸掉一行一列）
    CROSS: 2,     // T/L型：十字炸弹
    RAINBOW: 3    // 5个连线：彩虹球
};

export const OBSTACLE_TYPES = {
    NONE: 0,
    ICE: 1,      // 冰块
    CHAIN: 2,    // 锁链
    ROCK: 3      // 石块
};

export const ANIMATION_SPEED = 200; // 毫秒
export const FALL_SPEED = 0.5;      // 掉落速度
