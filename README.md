# Bamazon

To create an Amazon-like storefront with the MySQL skills learned this week. The app will take in orders from customers and deplete stock from the store's inventory. The application created presents the customer interfaces.



First Objective : Create Data Base

In order to run this application, you should have the MySQL database already set up on your computer. If you don't, visit the MySQL installation page to install the version you need for your operating system. Once you have MySQL isntalled, you will be able to create the Bamazon database and the products table with the SQL code found in Bamazon.sql. Run this code inside your MySQL client like Sequel Pro to populate the database, then you will be ready to proceed with running the Bamazon customer and manager interfaces.


Second Objective: The Set UP Directions

1. Create a MySQL Database called Bamazon.

2. Then create a Table inside of that database called Products.

3. The products table should have each of the following columns:

- ItemID (unique id for each product)

- ProductName (Name of product)

- DepartmentName

- Price (cost to customer)

- StockQuantity (how much of the product is available in stores)

4. Populate this database with "Mock data" to creat different products. 

5.Then create a Node application called BamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

6. The app should then prompt users with two messages.

- The first should ask them the ID of the product they would like to buy.

- The second message should ask how many units of the product they would like to buy.
Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

However, if your store does have enough of the product, you should fulfill the customer's order.

This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, show the customer the total cost of their purchase.