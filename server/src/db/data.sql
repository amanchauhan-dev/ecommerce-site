USE bazzarvibe;

-- Insert Users
INSERT INTO users (role, fname, lname, avatar, email, password, phone_number, is_email_verified, email_verify_token, email_verify_token_exp_date, status)
VALUES 
-- Admin Users
('admin', 'Alice', 'Johnson', 'avatars/admin1.jpg', 'alice.johnson@example.com', '$2b$10$km.ufoMREWooCboMncUeh.xiMVkST7rYTmM8wusZa6niLub9RHngi', '+1234567890', TRUE, NULL, NULL, 'active'),
('admin', 'Bob', 'Smith', 'avatars/admin2.jpg', 'bob.smith@example.com', '$2b$10$km.ufoMREWooCboMncUeh.xiMVkST7rYTmM8wusZa6niLub9RHngi', '+1234567891', TRUE, NULL, NULL, 'active'),

-- Employee Users
('employee', 'Charlie', 'Brown', 'avatars/employee1.jpg', 'charlie.brown@example.com', '$2b$10$km.ufoMREWooCboMncUeh.xiMVkST7rYTmM8wusZa6niLub9RHngi', '+1234567892', TRUE, NULL, NULL, 'active'),
('employee', 'Diana', 'White', 'avatars/employee2.jpg', 'diana.white@example.com', '$2b$10$km.ufoMREWooCboMncUeh.xiMVkST7rYTmM8wusZa6niLub9RHngi', '+1234567893', FALSE, 'verifytoken1', '2024-12-15 10:00:00', 'active'),

-- Customer Users
('customer', 'Evan', 'Taylor', 'avatars/customer1.jpg', 'evan.taylor@example.com', 'hashed$2b$10$km.ufoMREWooCboMncUeh.xiMVkST7rYTmM8wusZa6niLub9RHngipassword5', '+1234567894', TRUE, NULL, NULL, 'active'),
('customer', 'Fiona', 'Lee', 'avatars/customer2.jpg', 'fiona.lee@example.com', '$2b$10$km.ufoMREWooCboMncUeh.xiMVkST7rYTmM8wusZa6niLub9RHngi', '+1234567895', FALSE, 'verifytoken2', '2024-12-20 12:00:00', 'active'),
('customer', 'George', 'Harris', 'avatars/customer3.jpg', 'george.harris@example.com', '$2b$10$km.ufoMREWooCboMncUeh.xiMVkST7rYTmM8wusZa6niLub9RHngi', '+1234567896', TRUE, NULL, NULL, 'inactive'),
('customer', 'Hannah', 'Martinez', 'avatars/customer4.jpg', 'hannah.martinez@example.com', '$2b$10$km.ufoMREWooCboMncUeh.xiMVkST7rYTmM8wusZa6niLub9RHngi', '+1234567897', FALSE, 'verifytoken3', '2024-12-25 15:00:00', 'inactive'),
('customer', 'Ivan', 'Clark', 'avatars/customer5.jpg', 'ivan.clark@example.com', '$2b$10$km.ufoMREWooCboMncUeh.xiMVkST7rYTmM8wusZa6niLub9RHngi', '+1234567898', TRUE, NULL, NULL, 'active'),
('customer', 'Julia', 'Walker', 'avatars/customer6.jpg', 'julia.walker@example.com', '$2b$10$km.ufoMREWooCboMncUeh.xiMVkST7rYTmM8wusZa6niLub9RHngi', '+1234567899', TRUE, NULL, NULL, 'active');






-- Insert Parent Categories
INSERT INTO categories (category_name, isSub, url_slug, parent_cat_id, status)
VALUES 
('Electronics', false, 'electronics', NULL, 'active'),
('Fashion', false, 'fashion', NULL, 'active'),
('Home Appliances', false, 'home-appliances', NULL, 'active'),
('Books', false, 'books', NULL, 'active'),
('Sports', false, 'sports', NULL, 'active'),
('Beauty & Health', false, 'beauty-health', NULL, 'active'),
('Automotive', false, 'automotive', NULL, 'active'),
('Toys & Games', false, 'toys-games', NULL, 'active'),
('Groceries', false, 'groceries', NULL, 'active'),
('Furniture', false, 'furniture', NULL, 'active');

-- Insert Subcategories
INSERT INTO categories (category_name, isSub, url_slug, parent_cat_id, status)
VALUES 
-- Electronics Subcategories
('Mobile Phones', true, 'mobile-phones', 1, 'active'),
('Laptops', true, 'laptops', 1, 'active'),
('Cameras', true, 'cameras', 1, 'active'),

-- Fashion Subcategories
('Men\'s Clothing', true, 'mens-clothing', 2, 'active'),
('Women\'s Clothing', true, 'womens-clothing', 2, 'active'),

-- Home Appliances Subcategories
('Kitchen Appliances', true, 'kitchen-appliances', 3, 'active'),
('Air Conditioners', true, 'air-conditioners', 3, 'active'),

-- Books Subcategories
('Fiction', true, 'fiction-books', 4, 'active'),
('Non-Fiction', true, 'non-fiction-books', 4, 'active'),

-- Sports Subcategories
('Cricket', true, 'cricket', 5, 'active'),
('Football', true, 'football', 5, 'active'),

-- Beauty & Health Subcategories
('Skincare', true, 'skincare', 6, 'active'),
('Haircare', true, 'haircare', 6, 'active'),

-- Automotive Subcategories
('Car Accessories', true, 'car-accessories', 7, 'active'),
('Bike Accessories', true, 'bike-accessories', 7, 'active'),

-- Toys & Games Subcategories
('Board Games', true, 'board-games', 8, 'active'),
('Action Figures', true, 'action-figures', 8, 'active'),

-- Groceries Subcategories
('Beverages', true, 'beverages', 9, 'active'),
('Snacks', true, 'snacks', 9, 'active'),

-- Furniture Subcategories
('Living Room Furniture', true, 'living-room-furniture', 10, 'active'),
('Bedroom Furniture', true, 'bedroom-furniture', 10, 'active');






-- Insert Products
INSERT INTO products (product_name, product_thumbnail, url_slug, category_id, description, price, stock_quantity, status)
VALUES 
('iPhone 14', 'images/iphone14.jpg', 'iphone-14', 1, 'Latest Apple smartphone with advanced features.', 999.99, 50, 'active'),
('Samsung Galaxy S23', 'images/galaxy-s23.jpg', 'samsung-galaxy-s23', 1, 'Flagship smartphone by Samsung.', 899.99, 40, 'active'),
('MacBook Air M2', 'images/macbook-air.jpg', 'macbook-air-m2', 1, 'Lightweight and powerful laptop by Apple.', 1249.99, 20, 'active'),
('Adidas Running Shoes', 'images/adidas-shoes.jpg', 'adidas-running-shoes', 2, 'Comfortable running shoes for men.', 129.99, 100, 'active'),
('Sony Camera A7', 'images/sony-a7.jpg', 'sony-camera-a7', 1, 'Mirrorless camera for photography enthusiasts.', 1999.99, 15, 'active'),
('Fiction Book - The Alchemist', 'images/the-alchemist.jpg', 'the-alchemist', 4, 'Inspiring story by Paulo Coelho.', 15.99, 200, 'active'),
('Fiction Book - 1984', 'images/1984.jpg', '1984-george-orwell', 4, 'Classic novel by George Orwell.', 9.99, 180, 'active'),
('Electric Kettle', 'images/electric-kettle.jpg', 'electric-kettle', 3, 'Fast boiling electric kettle.', 29.99, 60, 'active'),
('Cricket Bat', 'images/cricket-bat.jpg', 'cricket-bat', 5, 'High-quality cricket bat for professionals.', 59.99, 30, 'active'),
('Living Room Sofa', 'images/sofa.jpg', 'living-room-sofa', 10, 'Modern and comfortable sofa set.', 499.99, 10, 'active'),
('Skincare Kit', 'images/skincare-kit.jpg', 'skincare-kit', 6, 'Complete skincare set for glowing skin.', 39.99, 120, 'active'),
('Hair Dryer', 'images/hair-dryer.jpg', 'hair-dryer', 6, 'Compact and powerful hair dryer.', 19.99, 50, 'active'),
('Football', 'images/football.jpg', 'football', 5, 'Durable football for outdoor games.', 24.99, 80, 'active'),
('Bike Cover', 'images/bike-cover.jpg', 'bike-cover', 7, 'Waterproof bike cover.', 14.99, 50, 'active'),
('Board Game - Monopoly', 'images/monopoly.jpg', 'board-game-monopoly', 8, 'Classic board game for families.', 34.99, 40, 'active');

-- Insert Variants for Products
INSERT INTO product_variants (product_id, color, size, price, stock_quantity)
VALUES 
-- Variants for iPhone 14
(1, 'Black', NULL, 999.99, 20),
(1, 'White', NULL, 999.99, 15),
(1, 'Blue', NULL, 999.99, 15),

-- Variants for Adidas Running Shoes
(4, 'Black', '8', 129.99, 30),
(4, 'Black', '9', 129.99, 25),
(4, 'White', '8', 129.99, 20),

-- Variants for Sony Camera A7
(5, 'Black', NULL, 1999.99, 10),
(5, 'Silver', NULL, 1999.99, 5),

-- Variants for Living Room Sofa
(10, 'Grey', NULL, 499.99, 5),
(10, 'Blue', NULL, 499.99, 5),

-- Variants for Skincare Kit
(11, 'Standard', NULL, 39.99, 70),
(11, 'Deluxe', NULL, 49.99, 50);

-- Insert Images for Products
INSERT INTO product_images (product_id, image_name)
VALUES 
-- Images for iPhone 14
(1, 'images/iphone14_front.jpg'),
(1, 'images/iphone14_back.jpg'),

-- Images for Samsung Galaxy S23
(2, 'images/galaxy-s23_front.jpg'),
(2, 'images/galaxy-s23_back.jpg'),

-- Images for MacBook Air M2
(3, 'images/macbook-air_front.jpg'),
(3, 'images/macbook-air_side.jpg'),

-- Images for Adidas Running Shoes
(4, 'images/adidas-shoes_black.jpg'),
(4, 'images/adidas-shoes_white.jpg'),

-- Images for Sony Camera A7
(5, 'images/sony-a7_front.jpg'),
(5, 'images/sony-a7_back.jpg'),

-- Images for Fiction Book - The Alchemist
(6, 'images/the-alchemist_cover.jpg'),
(6, 'images/the-alchemist_back.jpg'),

-- Images for Fiction Book - 1984
(7, 'images/1984_cover.jpg'),
(7, 'images/1984_back.jpg'),

-- Images for Electric Kettle
(8, 'images/electric-kettle_front.jpg'),
(8, 'images/electric-kettle_side.jpg'),

-- Images for Cricket Bat
(9, 'images/cricket-bat_front.jpg'),
(9, 'images/cricket-bat_side.jpg'),

-- Images for Living Room Sofa
(10, 'images/sofa_front.jpg'),
(10, 'images/sofa_side.jpg'),

-- Images for Skincare Kit
(11, 'images/skincare-kit_box.jpg'),
(11, 'images/skincare-kit_items.jpg'),

-- Images for Hair Dryer
(12, 'images/hair-dryer_front.jpg'),
(12, 'images/hair-dryer_back.jpg'),

-- Images for Football
(13, 'images/football_front.jpg'),
(13, 'images/football_side.jpg'),

-- Images for Bike Cover
(14, 'images/bike-cover_folded.jpg'),
(14, 'images/bike-cover_inuse.jpg'),

-- Images for Board Game - Monopoly
(15, 'images/monopoly_box.jpg'),
(15, 'images/monopoly_board.jpg');
