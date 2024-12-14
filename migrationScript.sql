-- Create the database
CREATE DATABASE restaurant_db;

-- Create the user with proper permissions
CREATE USER restaurant_user WITH PASSWORD '12345';
GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO restaurant_user;

-- Switch to the database
\c restaurant_db;

-- Create the tables
-- Table: Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Restaurants
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    cuisine VARCHAR(255),
    rating FLOAT,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Menus
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price FLOAT NOT NULL,
    restaurant_id INT NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE
);

-- Table: Carts
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price FLOAT NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_cart FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_menu_cart FOREIGN KEY (item_id) REFERENCES menus (id) ON DELETE CASCADE
);

-- Table: Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    amount FLOAT NOT NULL,
    total_amount FLOAT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_order FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Table: Order Items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    price FLOAT NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_item FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_menu_order_item FOREIGN KEY (item_id) REFERENCES menus (id) ON DELETE CASCADE
);

-- Grant Permissions to restaurant_user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO restaurant_user;
