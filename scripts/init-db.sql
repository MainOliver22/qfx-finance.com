-- Database initialization script for PostgreSQL

-- Create a new database
CREATE DATABASE finance;

-- Connect to the finance database
\c finance;

-- Create a new table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a new table for transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed with initial data
INSERT INTO users (username, password) VALUES
('admin', 'hashed_password');

INSERT INTO transactions (user_id, amount) VALUES
(1, 1000.00);
