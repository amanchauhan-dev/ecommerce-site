DROP DATABASE IF EXISTS bazzarvibe;

CREATE DATABASE bazzarvibe;

USE bazzarvibe;

-- Users Table
CREATE TABLE
    users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role ENUM ('customer', 'employee', 'admin') DEFAULT 'customer',
        fname VARCHAR(100) NOT NULL,
        lname VARCHAR(100),
        avatar VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        password_reset_token VARCHAR(255),
        phone_number VARCHAR(20),
        is_email_verified BOOLEAN DEFAULT FALSE,
        email_verify_token VARCHAR(255),
        email_verify_token_exp_date TIMESTAMP,
        status ENUM ('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

INSERT INTO
    `users` (
        `id`,
        `role`,
        `fname`,
        `lname`,
        `avatar`,
        `email`,
        `password`,
        `phone_number`,
        `is_email_verified`,
        `email_verify_token`,
        `email_verify_token_exp_date`,
        `status`,
        `created_at`,
        `updated_at`
    )
VALUES
    (
        NULL,
        'admin',
        'John',
        'Doe',
        NULL,
        'admin@gmail.com',
        '$2b$10$km.ufoMREWooCboMncUeh.xiMVkST7rYTmM8wusZa6niLub9RHngi', -- admin12
        '9104414688',
        '1', -- TRUE
        NULL,
        current_timestamp(),
        'active',
        current_timestamp(),
        current_timestamp()
    );

-- Categories Table
CREATE TABLE
    categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL,
        isSub BOOLEAN DEFAULT false,
        url_slug VARCHAR(255) UNIQUE,
        parent_cat_id INT DEFAULT NULL,
        status ENUM ('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Products Table
CREATE TABLE
    products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        product_thumbnail VARCHAR(255),
        url_slug VARCHAR(255) UNIQUE,
        category_id INT,
        description VARCHAR(255),
        price DECIMAL(10, 2),
        discount_amount DECIMAL(10, 2) CHECK price > discount_amount,
        stock_quantity INT DEFAULT 0,
        status ENUM ('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON UPDATE CASCADE ON DELETE SET NULL
    );

-- Product Variants Table
CREATE TABLE
    product_variants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        color VARCHAR(50),
        size VARCHAR(50),
        price DECIMAL(10, 2),
        stock_quantity INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

--  images Table
CREATE TABLE
    product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        image_name VARCHAR(255) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

-- Carts Table
CREATE TABLE
    carts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        product_id INT DEFAULT NULL,
        product_variant_id INT DEFAULT NULL,
        quantity INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (product_variant_id) REFERENCES product_variants (id)
    );

-- Shipping Addresses Table
CREATE TABLE
    addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        full_address TEXT,
        state VARCHAR(100),
        city VARCHAR(100),
        zip_code VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

-- Orders Table
CREATE TABLE
    orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(100) UNIQUE,
        user_id INT,
        total_amount DECIMAL(10, 2),
        discount_amount DECIMAL(10, 2),
        gross_amount DECIMAL(10, 2),
        shipping_amount DECIMAL(10, 2),
        net_amount DECIMAL(10, 2),
        status ENUM ('placed', 'processing', 'shipping', 'delivered') DEFAULT 'placed',
        payment_status ENUM ('paid', 'not-paid') DEFAULT 'not-paid',
        payment_type ENUM ('net-banking', 'upi', 'cod'),
        payment_transaction_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
    );

-- Order Items / Order Products Table
CREATE TABLE
    order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id INT,
        product_variant_id INT,
        product_name VARCHAR(255),
        color VARCHAR(50) DEFAULT NULL,
        size VARCHAR(50) DEFAULT NULL,
        price DECIMAL(10, 2),
        quantity INT,
        total_amount DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (product_variant_id) REFERENCES product_variants (id)
    );

-- Order Shipping Addresses Table
CREATE TABLE
    order_shipping_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        full_address VARCHAR(255),
        state VARCHAR(100),
        city VARCHAR(100),
        zip_code VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

-- Wishlist Table
CREATE TABLE
    wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        product_id INT,
        product_variant_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (product_variant_id) REFERENCES product_variants (id)
    );

-- Offers / Discounts Table
CREATE TABLE
    offers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        coupon_code VARCHAR(100) UNIQUE,
        discount_type ENUM ('fixed', 'rate') NOT NULL,
        discount_value DECIMAL(10, 2),
        start_date DATE,
        end_date DATE,
        description VARCHAR(255),
        status ENUM ('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );