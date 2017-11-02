var mysql = require("mysql");
var inquirer = require("inquirer");
var config = require("./config.js");
var user = config.user;
var password = config.password;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: user,
    password: password,
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    listAllProducts();
    // connection.end();
});

function listAllProducts() {
    console.log("Welcome to the B-Amazon Store\n");
    console.log("Here are all the items available for sale\n");
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log("ID #  || Product     ||     Department     ||     Price");
        console.log("============================================================");
        for (var i = 0; i < results.length; i++) {
            console.log("Id: " +results[i].item_id + "  || " + results[i].product_name+ " || "
                + results[i].department_name + " || " + results[i].price);
        }
    });
    whatToBuy();
}

function whatToBuy() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                message: "Please input the ID of the product you would like to buy",
                name: "choiceid",
                type: "rawlist",
                choices: function() {
                    var productsArray = [];
                    for (var i = 0; i < res.length; i++) {
                        productsArray.push(res[i].product_name);
                    }
                    return productsArray;
                }
            },
            {
                message: "How many units would you like to buy?",
                name: "quantity",
                type: "input",
                validate: function (val) {
                    if (isNaN(val) === false && parseInt(val) > 0) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (userInput) {
            var stockQuantity;
            var stockPrice;
            console.log(userInput.choiceid);
            console.log(userInput.quantity);
            for (var i = 0; i < res.length; i++) {
                if (userInput.choiceid === res[i].product_name) {
                    stockQuantity = res[i].stock_quantity;
                    stockPrice = res[i].price;
                }
            }
            console.log(stockQuantity);
        //    check if stock has enough tp accomodate the order
            if (stockQuantity < userInput.quantity) {
                console.log("Insufficient quantity!");
                // return false;
            } else {
                var newQuantity = stockQuantity - userInput.quantity;
                console.log(newQuantity);
                updateQuantity(newQuantity, userInput.choiceid);
                calculatePrice(userInput.quantity, stockPrice);
            }
        })
    })
}


function updateQuantity(quan, product) {
    console.log("Now updating quantity left for " + product);
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quan
            },
            {
                product_name: product
            }
        ],
        function (err, rest) {
            if (err) throw err;
        }
    );
    connection.end();
}

function calculatePrice(quan, price) {
    var cost = quan * price;
    console.log("You total is $" + cost);
    console.log("Tax will be collected based on state");
}
