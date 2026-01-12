-- Create Database
CREATE DATABASE IF NOT EXISTS boke_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE boke_db;

-- Create Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insert Sample Data
INSERT INTO blogs (title, content, author, create_time) VALUES 
('The Art of Simplicity', 'In a world of noise, simplicity is the ultimate sophistication. Design is not just what it looks like and feels like. Design is how it works.', 'John Doe', NOW()),
('Modern Architecture', 'Architecture is the learned game, correct and magnificent, of forms assembled in the light.', 'Jane Smith', NOW()),
('Minimalist Lifestyle', 'Less is more. Minimalism is about intentionality, not just owning fewer things.', 'Alex Chen', NOW());
