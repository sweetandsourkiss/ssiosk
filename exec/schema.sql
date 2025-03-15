CREATE DATABASE `ssiosk`;

USE `ssiosk`;

CREATE TABLE `categories` (
	`category_id` INT AUTO_INCREMENT,
    `name` VARCHAR(15) NOT NULL UNIQUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY(`category_id`)
);

CREATE TABLE `menus` (
	`menu_id` INT AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL UNIQUE,
    `description` TEXT,
    `price` INT NOT NULL,
    `category_id` INT,
    `image_url` TEXT,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY(`menu_id`),
    FOREIGN KEY(`category_id`) REFERENCES `categories`(`category_id`) ON DELETE SET NULL
);

CREATE TABLE `orders` (
	`order_id` INT AUTO_INCREMENT,
    `table_number` INT NOT NULL,
    `menu_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `ordered_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`completed_at` TIMESTAMP,
    PRIMARY KEY(`order_id`),
    FOREIGN KEY(`menu_id`) REFERENCES `menus`(`menu_id`)
);

INSERT INTO `categories`(`name`) VALUES('카테고리 없음');