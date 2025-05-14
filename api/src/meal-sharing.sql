-- Databases week 3 - Homework

-- Creating the restaurant database
CREATE DATABASE mealsharing;

USE mealsharing;

CREATE TABLE meal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    `when` DATETIME,
    max_reservations INT,
    price DECIMAL,
    created_date DATE
);

CREATE TABLE reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number_of_guests INT NOT NULL,
    meal_id INT NOT NULL,
    created_date DATE,
    contact_phone_number VARCHAR(15),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    FOREIGN KEY (meal_id) REFERENCES meal (id)
);

CREATE TABLE review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    meal_id INT,
    stars INT,
    created_date DATE,
    FOREIGN KEY (meal_id) REFERENCES meal (id)
);

-- Add meals
INSERT INTO meal (title, description, location, `when`, max_reservations, price, created_date) VALUES
('Pasta Night', 'Delicious Italian pasta dishes', 'Downtown Restaurant', '2023-10-01 19:00:00', 20, 15.99, '2023-09-20'),
('Sushi Feast', 'Fresh sushi and sashimi', 'Sakura Sushi Bar', '2023-10-02 18:30:00', 15, 25.50, '2023-09-21'),
('BBQ Party', 'Grilled meats and sides', 'Backyard BBQ Spot', '2023-10-03 17:00:00', 30, 20.00, '2023-09-22'),
('Vegan Delight', 'Plant-based gourmet meals', 'Green Earth Cafe', '2023-10-04 18:00:00', 25, 18.75, '2023-09-23'),
('Seafood Extravaganza', 'Fresh seafood platters', 'Ocean Breeze Restaurant', '2023-10-05 19:30:00', 20, 30.00, '2023-09-24');

-- Meal queries

-- Alter some meal dates to fulfill the exercise requirements. 
UPDATE meal
SET `when` = '2025-10-05 18:30:00'
WHERE id = 2;

UPDATE meal
SET `when` = '2025-10-05 19:30:00'
WHERE id = 4;

UPDATE meal
SET `when` = '2025-10-05 19:00:00'
WHERE id = 5;

-- Get all meals
SELECT * FROM meal;

-- Add a new meal
INSERT INTO meal (title, description, location, `when`, max_reservations, price, created_date)
VALUES (
    'Barbecue Quest', 'All the meat you can eat', 'The Meat Factory', '2023-11-10 12:00:00', 30, 25.00, '2023-09-29'
);

-- Get a meal with any id, fx 1
SELECT title
FROM meal
WHERE id = 1;

-- Update a meal with any id, fx 1. Update any attribute fx the title or multiple attributes
UPDATE meal
SET title = 'Barbecue Adventure'
WHERE id = 6;

-- Delete a meal with any id, fx 1
DELETE from meal
WHERE id = 6;

-- Reservation queries

--Get all reservations
SELECT * from reservation;

-- Add reservations
INSERT INTO reservation (number_of_guests, meal_id, created_date, contact_phone_number, contact_name, contact_email)
VALUES 
(4, 1, '2023-09-30', '1234567890', 'John Doe', 'johndoe@example.com'),
(2, 2, '2023-09-30', '9876543210', 'Jane Smith', 'janesmith@example.com'),
(3, 3, '2023-09-30', '5551234567', 'Alice Johnson', 'alicejohnson@example.com'),
(5, 4, '2023-09-30', '4449876543', 'Bob Brown', 'bobbrown@example.com'),
(1, 5, '2023-09-30', '3335557777', 'Charlie White', 'charliewhite@example.com')

-- Get a reservation with any id, fx 1
SELECT * 
FROM reservation
WHERE id = 1;

-- Update a reservation with any id, fx 1. Update any attribute fx the title or multiple attributes
UPDATE reservation
SET number_of_guests = 6
WHERE id = 1;

-- Delete a reservation with any id, fx 1
DELETE FROM reservation
WHERE id = 5;

-- Review queries
SELECT *
FROM review;

-- Add reviews
INSERT INTO review (title, description, meal_id, stars, created_date)
VALUES 
('Amazing Pasta', 'The pasta was cooked to perfection!', 1, 5, '2023-09-25'),
('Sushi Heaven', 'Fresh and delicious sushi.', 2, 4, '2023-09-26'),
('BBQ Bliss', 'The barbecue was smoky and flavorful.', 3, 5, '2023-09-27'),
('Vegan Surprise', 'The vegan dishes were surprisingly tasty.', 4, 4, '2023-09-28'),
('Seafood Delight', 'The seafood was fresh and well-prepared.', 5, 5, '2023-09-29');

-- Get a review with any id, fx 1
SELECT *
FROM review
WHERE id = 1;

-- Update a review with any id, fx 1. Update any attribute fx the title or multiple attributes
UPDATE review
SET title = 'Average Pasta', description = 'The Pasta was acceptable'
WHERE id = 1;

UPDATE review
SET title = 'Vegan Surprise', description = 'There was no meat', stars = 2
WHERE id = 4;

-- Delete a review with any id, fx 1
DELETE FROM review
WHERE id = 5;

-- Additional queries

-- Get meals that has a price smaller than a specific price
SELECT *
FROM meal
WHERE price < 20;

-- Get meals that still has available reservations
SELECT meal.*
FROM meal
LEFT JOIN reservation ON meal.id = reservation.meal_id
GROUP BY meal.id
HAVING meal.max_reservations > SUM(reservation.number_of_guests);

-- Get meals that partially match a title.
SELECT * 
FROM meal
WHERE title like '%Night%'

SELECT * from review;

-- Get meals that has been created between two dates
SELECT *
FROM meal
WHERE created_date BETWEEN '2023-09-21' AND '2023-09-23'; 

-- Get only specific number of meals fx return only 5 meals
SELECT *
FROM meal
LIMIT 3;

-- Get the meals that have good reviews
SELECT *
FROM review
WHERE stars > 3; -- Consider 3+ to be a good review

-- Get reservations for a specific meal sorted by created_date
SELECT * 
FROM reservation
WHERE id = 2
ORDER BY created_date;

-- Sort all meals by average number of stars in the reviews
SELECT meal.*, AVG(review.stars) AS average_stars
FROM meal
JOIN review ON meal.id = review.meal_id
GROUP BY meal.id
ORDER BY average_stars;

