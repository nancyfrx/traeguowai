-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS test_platform_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE test_platform_db;

-- 1. 企业信息表
CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '企业名称',
    address VARCHAR(255) COMMENT '办公地址',
    website VARCHAR(100) COMMENT '公司官网',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 企业部门表
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL COMMENT '所属企业ID',
    name VARCHAR(50) NOT NULL COMMENT '部门名称',
    parent_id BIGINT COMMENT '上级部门ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 用户表更新：增加企业ID字段
-- 如果 users 表不存在则创建，如果存在则添加字段
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    company_id BIGINT COMMENT '企业ID',
    failed_attempts INT DEFAULT 0,
    lock_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 为已存在的 users 表添加字段的脚本（以防万一）
SET @dbname = DATABASE();
SET @tablename = 'users';
SET @columnname = 'company_id';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  'ALTER TABLE users ADD COLUMN company_id BIGINT COMMENT "企业ID" AFTER password, ADD FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

