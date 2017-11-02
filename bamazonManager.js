var mysql = require("mysql");
var inquirer = require("inquirer");
var config = require("./config.js");
var colors = require("colors");
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
    managerInquiry();
});

function managerInquiry() {
    inquirer.prompt([
        {
            message: "What would you like to do Sir?",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory",
                    "Add to Inventory", "Add New Product"],
            name: "pick"
        }
    ]).then(function (input) {
        if (input.pick === "View Products for Sale") {
            viewProductSale();
        } else if (input.pick === "View Low Inventory") {
            viewLowInventory();
        } else if (input.pick === "Add to Inventory") {
            addInventory();
        } else if (input.pick === "Add New Product") {
            addNewProduct();
        }
    })
}

//  Functions called based on selection above
function viewProductSale() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("ID #".red +  "|| Product".blue + "     ||     Department".cyan + "     ||     Price".green + "     ||     Quantity".magenta);
        for (var i = 0; i < res.length; i++) {
            console.log("Id: ".red +res[i].item_id + "  || " + res[i].product_name.blue + " || "
                + res[i].department_name.cyan + " || $".green + res[i].price + " || ".magenta + res[i].stock_quantity);
        }
        recursionEnd();
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("ID #".magenta +  "|| Product".blue + "     ||     Department".cyan + "     ||     Price".green + "     ||     Quantity".red);
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log("Id: ".magenta +res[i].item_id + "  || " + res[i].product_name.blue + " || "
                    + res[i].department_name.cyan + " || $".green + res[i].price + " || ".red + res[i].stock_quantity);
            }
        }
        recursionEnd();
    })
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                message: "Which Product would you like to add inventory too?",
                type: "list",
                name: "addProduct",
                choices: function () {
                    var allProducts = [];
                    for (var i = 0; i < res.length; i++) {
                        allProducts.push(res[i].product_name);
                    }
                    return allProducts;
                }
            },
            {
                message: "How much inventory would you like to add?",
                type: "input",
                name: "amountAdd",
                validate: function (val) {
                    if (isNaN(val) === false && parseInt(val) > 0) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (userInput) {
            var inventory;
            for (var i = 0; i < res.length; i++) {
                if (userInput.addProduct === res[i].product_name) {
                    inventory = res[i].stock_quantity;
                }
            }
            // console.log(parseInt(userInput.amountAdd));
            inventory += parseInt(userInput.amountAdd);
            // console.log(inventory);

            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: inventory
                    },
                    {
                        product_name: userInput.addProduct
                    }
                ],
                function (err, rest) {
                    if (err) throw err;
                    console.log("The Inventory of "+ userInput.addProduct + " is now sitting at " + inventory);
                    recursionEnd();
                });
        });
    })
}

function addNewProduct() {
    inquirer.prompt([
        {
            message: "What is the name/title of the product you want to listt?",
            type: "input",
            name: "productName"
        },
        {
            message: "What department will this item be apart of",
            type: "input",
            name: "departmentName",
        },
        {
            message: "What is the price for the new item?",
            type: "input",
            name: "productPrice",
            validate: function (val) {
                if (isNaN(val) === false && parseInt(val) > 0) {
                    return true;
                }
                return false;
            }
        },
        {
            message: "How many of the new are product are in stock?",
            type: "input",
            name: "productStock",
            validate: function (val) {
                if (isNaN(val) === false && parseInt(val) > 0) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (newItem) {
        connection.query("INSERT INTO products SET ?",
            {
                product_name: newItem.productName,
                department_name: newItem.departmentName,
                price: newItem.productPrice,
                stock_quantity: newItem.productStock
            },
            function (err) {
                if (err) throw err;
                console.log(newItem.productName + " has been inserted into the table.\n");
                recursionEnd();
            })
    })
}

function recursionEnd() {
    inquirer.prompt([
        {
            message: "Would you like to view the manager menu again?",
            type: "list",
            name: "choice",
            choices: ["Yes", "No"]
        }
    ]).then(function (manager) {
        if (manager.choice === "Yes") {
            managerInquiry();
        } else {
            console.log("Have a Great Day!!!");
            connection.end();
        }
    })
}