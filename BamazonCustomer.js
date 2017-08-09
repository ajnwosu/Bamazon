

//node modules
var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer');

//sql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: '',
    database: "Bamazon"
});

//global variables
var shoppingCart = [];
var totalCost = 0;

//connect to mysql and then run the main function
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    printItems(function(){
      validateInput();
    });
});

//function to print all items to the console, uses npm module cli-table
function printItems(cb){
  //new cli-table
  var table = new Table({
    head: ['ID Number', 'Product', 'Department', 'Price', 'Quantity Available']
  });
  //get all rows from the Products table
  connection.query('SELECT * FROM Products', function(err, res){
    if (err) throw err;
    //add all of the rows to the cli-table
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].ItemID, res[i].ProductName, res[i].DepartmentName, '$' + res[i].Price.toFixed(2), res[i].StockQuantity]);
    }
    //log the table to the console
    console.log(table.toString());
    //callback the userSelectsItems function to prompt the user to add items to cart
    cb();
    });
  }

function validateInput(value) {
  var integer = Number.isInteger(parseFloat(value));
  var sign = Math.sign(value);

  if (integer && (sign === 1)) {
    return true;
  } else {
    return 'Please enter a whole non-zero number.';
  }
}

// promptUserPurchase will prompt the user for the item/quantity they would like to purchase
function promptUserPurchase() {
  // console.log('___ENTER promptUserPurchase___');

  // Prompt the user to select an item
  inquirer.prompt([
    {
      type: 'input',
      name: 'ItemID',
      message: 'Please enter the Item ID which you would like to purchase.',
      validate: validateInput,
      filter: Number
    },
    {
      type: 'input',
      name: 'quantity',
      message: 'How many do you need?',
      validate: validateInput,
      filter: Number
    }
  ]).then(function(input) {
    // console.log('Customer has selected: \n    item_id = '  + input.item_id + '\n    quantity = ' + input.quantity);

    var item = input.ItemID;
    var quantity = input.quantity;

    // Query db to confirm that the given item ID exists in the desired quantity
    var queryStr = 'SELECT * FROM products WHERE ?';

    connection.query(queryStr, {itemID: item}, function(err, res) {
      if (err) throw err;

      // If the user has selected an invalid item ID, data attay will be empty
      // console.log('data = ' + JSON.stringify(data));

      if (res.length === 0) {
        console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
        displayInventory();

      } else {
        var productData = res[0];

        // console.log('productData = ' + JSON.stringify(productData));
        // console.log('productData.StockQuantity = ' + productData.StockQuantityy);

        // If the quantity requested by the user is in stock
        if (quantity <= productData.StockQuantity) {
          console.log('Congratulations, the product you requested is in stock! Placing order!');

          // Construct the updating query string
          var updateQueryStr = 'UPDATE products SET Stock Quantity = ' + (productData.StockQuantity - quantity) + ' WHERE ItemID = ' + item;
          // console.log('updateQueryStr = ' + updateQueryStr);

          // Update the inventory
          connection.query(updateQueryStr, function(err, res) {
            if (err) throw err;

            console.log('Your oder has been placed! Your total is $' + productData.price * quantity);
            console.log('Thank you for shopping with us!');
            console.log("\n---------------------------------------------------------------------\n");

            // End the database connection
            connection.end();
          })
        } else {
          console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
          console.log('Please modify your order.');
          console.log("\n---------------------------------------------------------------------\n");

          displayInventory();
        }
      }
    })
  })
}

// displayInventory will retrieve the current inventory from the database and output it to the console
function displayInventory() {
  // console.log('___ENTER displayInventory___');

  // Construct the db query string
  queryStr = 'SELECT * FROM products';

  // Make the db query
  connection.query(queryStr, function(err, data) {
    if (err) throw err;

    console.log('Existing Inventory: ');
    console.log('...................\n');

    var strOut = '';
    for (var i = 0; i < data.length; i++) {
      strOut = '';
      strOut += 'Item ID: ' + data[i].ItemID + '  //  ';
      strOut += 'Product Name: ' + data[i].ProductName + '  //  ';
      strOut += 'Department: ' + data[i].DepartmentName + '  //  ';
      strOut += 'Price: $' + data[i].Price + '\n';

      console.log(strOut);
    }

      console.log("---------------------------------------------------------------------\n");

      //Prompt the user for item/quantity they would like to purchase
      promptUserPurchase();
  })
}

// runBamazon will execute the main application logic
function runBamazon() {
  // console.log('___ENTER runBamazon___');

  // Display the available inventory
  displayInventory();
}

// Run the application logic
runBamazon();