-- Add type column to test_case table if not exists (or create table structure if needed)
-- Note: Check if column exists before adding is database dependent, providing standard ADD COLUMN
ALTER TABLE `test_case` ADD COLUMN `type` VARCHAR(50) COMMENT '用例类型: 功能用例, 性能用例, 兼容性用例, 安全用例';

-- AI Generation Record Table
CREATE TABLE IF NOT EXISTS `ai_generation_record` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `input_content` TEXT COMMENT '用户输入的提示词内容',
    `generated_content` MEDIUMTEXT COMMENT 'AI生成的原始JSON内容',
    `upload_file_name` VARCHAR(500) COMMENT '上传的文件名列表(逗号或分号分隔)',
    `model` VARCHAR(50) COMMENT '使用的AI模型',
    `operator` VARCHAR(100) COMMENT '操作人用户名',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI用例生成历史记录表';
