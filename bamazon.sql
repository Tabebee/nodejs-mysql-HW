DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50),
  department_name VARCHAR(50),
  price INTEGER(100),
  stock_quantity INTEGER(50),
  PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
    VALUES  ("Anti-Theft Backpack", "Outdoors", 70, 20),
            ("Harry Potter Mug", "Kitchen", 10, 35),
            ("Head First C++", "Books", 30 ,10),
            ("I am Groot T-Shirt", "Clothing", 15, 25),
            ("CATAN Board Game", "Toys & Games", 60, 5),
            ("Note 5", "Cell Phone", 400, 8),
            ("Chelsea T-Shirt", "Clothing", 11, 4),
            ("Legendary Board Game", "Toys & Games", 50, 9),
            ("The Count Of Monte Cristo", "Books", 15, 20),
            ("27 Speed Mountain Bike", "Outdoors", 200, 4);
