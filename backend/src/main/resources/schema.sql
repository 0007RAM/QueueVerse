-- ===========================================================
-- SMARTQUEUE DATABASE SCHEMA
-- ===========================================================

CREATE DATABASE IF NOT EXISTS smartqueue;
USE smartqueue;

-- -----------------------------------------------------------
-- Table: users
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_phone UNIQUE (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------------
-- Table: queues
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS queues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    queue_type VARCHAR(30) NOT NULL,
    current_token_number INT NOT NULL DEFAULT 0,
    average_service_time INT NOT NULL DEFAULT 5,
    is_paused BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_queue_type CHECK (queue_type IN
        ('TEMPLE','BANK','HOSPITAL','RESTAURANT','GOVERNMENT_OFFICE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_queues_type ON queues(queue_type);

-- -----------------------------------------------------------
-- Table: tokens
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token_number VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING',
    position INT NOT NULL DEFAULT 0,
    joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    called_at DATETIME NULL,
    expires_at DATETIME NULL,
    user_id BIGINT NOT NULL,
    queue_id BIGINT NOT NULL,
    CONSTRAINT fk_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tokens_queue FOREIGN KEY (queue_id) REFERENCES queues(id) ON DELETE CASCADE,
    CONSTRAINT chk_token_status CHECK (status IN
        ('WAITING','CALLED','CONFIRMED','COMPLETED','EXPIRED','SKIPPED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_tokens_queue_status ON tokens(queue_id, status);
CREATE INDEX idx_tokens_user ON tokens(user_id);
CREATE UNIQUE INDEX uq_tokens_queue_number ON tokens(queue_id, token_number);
