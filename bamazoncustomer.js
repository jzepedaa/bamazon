//  NPM mySQL, inquirer, cli-table
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var table = new Table({
    head: ['Item ID', 'Item', 'Price', 'Qnty'],
    colWidths: [20, 40, 15, 15]
});

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected" + connection.threadId);
});

//Start everything
goShopping();

//Displays products in database table
function goShopping() {
    connection.query('SELECT * FROM products', function (err, res) {
        // Display products and price
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price.toFixed(i), res[i].stock_quantity])
        }
        console.log(table.toString());

        // Ask questions for purchase 
        inquirer.prompt([{
            // Ask to choose a product to purchase
            name: "choice",
            type: "list",
            message: "What would you like to buy?",

            choices: function (value) {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].product_name);
                }
                return choiceArray;
            }
        }, {
            // Ask to enter a quantity to purchase
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function (answer) {
            // Grabs the object for the product the user chose
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name == answer.choice) {
                    var chosenItem = res[i];
                }
            }
            //remaining stock if purchase occurs
            var updateStock = parseInt(chosenItem.stock_quantity) - parseInt(answer.quantity);
            var pSales = parseFloat(chosenItem.product_sales).toFixed(2);
            //console.log (`PSale: ${pSales}`);

            if (chosenItem.stock_quantity < parseInt(answer.quantity)) {
                console.log(`Insufficient quantity!`);
                repeat();
            }
            // If the customer wants to purchase an amount that is in stock, the remaining stock quantity will be updated in the database and the price presented to the customer
            else {

                //Get total from new purchase, current sales from table and add together.
                var Total = (parseFloat(answer.quantity) * chosenItem.price).toFixed(2);
                //console.log(`Total: ${Total}`);
                //console.log (parseFloat(Total) + parseFloat(pSales)).toFixed(2);
                var pTotal = (parseFloat(Total) + parseFloat(pSales)).toFixed(2);
                //console.log(chosenItem.product_Sales);
                var query = connection.query("UPDATE products SET ?, ? WHERE ?", [{ stock_quantity: updateStock }, { product_sales: pTotal }, { item_id: chosenItem.item_id }], function (err, res) {
                    if (err) throw err;
                    console.log(`Purchase successful!`);
                    console.log("Your total is $ " + Total);
                    repeat();
                });
            }

        });

    });

}

//exit choice for user.
function repeat() {
    inquirer.prompt({
        // Ask to purchase another item
        name: "repurchase",
        type: "list",
        choices: ["Yes", "No"],
        message: "Would you like to purchase another item?"
    }).then(function (answer) {
        if (answer.repurchase == "Yes") {
            goShopping();
        }
        else {
            console.log(`Thanks for shopping with us. Have a great day!`)
            connection.end();
        }
    });
}