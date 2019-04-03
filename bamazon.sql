DROP DATABASE IF EXISTS bamazon2;

CREATE DATABASE bamazon2;

USE bamazon2;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NULL,
    department_name VARCHAR (45) NULL,
    price DECIMAL (10,2) NULL,
    stock_quantity INT NULL,
    product_sales DECIMAL (10,2) NULL,
    PRIMARY KEY (item_id)
);



INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales )
VALUES ("Samsung HD TV", "Electronics",750.00, 6, 13000),
("Iphone X", "Electronics", 500.00, 3, 12500),
("PlayStation 4", "Electronics", 300.00, 7, 14000),
("Mackbook Pro", "Electronics", 1000.00, 3, 12000),
("Nike Airmax", "Shoes",130.00, 3, 4400),
("Huaraches", "Shoes", 100.00, 6, 4500),
("ultra boost", "Shoes", 100.00, 2, 4800),
("Champions League Soccer Ball", "Soccer", 36.00, 3, 8400),
("Nike tiempo cleats", "Soccer", 230.00, 3, 8600),
("Nike shinguard Straps", "Soccer", 10.00, 2, 8400);

SELECT * FROM products;